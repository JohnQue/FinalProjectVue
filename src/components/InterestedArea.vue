<template>
  <div>
    <!-- VISUAL -->
    <section class="section section--visual">
      <div class="inner">
        <div class="summary">
          <h2 class="summary__title">
            INTERESTED
          </h2>
          <p class="summary__description">
            관심 지역 정보 제공
          </p>
        </div>
        <ul>
          <li>
            <select id="sido" @change="setGugun($event)" v-model="selSido">
              <option value="" disabled>시/도</option>
              <option
                v-for="(sido, idx) in sidos"
                :key="idx"
                :value="{ code: sido['sido_code'], name: sido['sido_name'] }"
              >
                {{ sido['sido_name'] }}
              </option>
            </select>
          </li>
          <li>
            <select id="gugun" @change="setDong($event)" v-model="selGugun">
              <option value="" disabled>구/군</option>
              <option
                v-for="(gugun, idx) in guguns"
                :key="idx"
                :value="{ code: gugun['sido_code'], name: gugun['sido_name'] }"
              >
                {{ gugun['sido_name'] }}
              </option>
            </select>
          </li>
          <li>
            <select id="dong" v-model="selDong">
              <option value="0" selected disabled>동</option>
              <option
                v-for="(dong, idx) in dongs"
                :key="idx"
                :value="dong.dong"
              >
                {{ dong.dong }}
              </option>
            </select>
          </li>
          <li>
            <button @click="setInterested" id="chc" class="btn btn--primary">
              관심 지역 등록하기
            </button>
          </li>
        </ul>
      </div>
    </section>
    <section id="index_section">
      <div class="card col-sm-12 mt-1" style="min-height: 550px;">
        <div class="card-body">
          <table
            class="table mt-2 text-center"
            style="width: 70%; margin: 0 auto;"
          >
            <thead>
              <tr>
                <th>관심지역</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody id="searchResult" v-if="interestedAreas.length > 0">
              <tr
                v-for="(int, idx) in interestedAreas"
                :key="idx"
                @click="setMapCenter(int)"
              >
                <td>{{ int.sidoName }} {{ int.gugunName }} {{ int.dong }}</td>
                <td>
                  <b-button variant="danger">삭제하기</b-button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="6" class="text-center">
                  등록한 관심 지역 정보가 없습니다!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="map" style="width: 70%; height: 500px; margin: auto;"></div>
      </div>
    </section>
    <Modal v-if="modal" v-on:close="closeModal" :data="pollution" />
    <script
      type="application/javascript"
      defer
      src="https://unpkg.com/@google/markerclustererplus@4.0.1/dist/markerclustererplus.min.js"
    ></script>
    <script
      type="application/javascript"
      defer
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCTQIlxBn5AfKGvsfJiormAE1esN3fcCkg"
    ></script>
  </div>
</template>
<script>
import http from '../map-common';
import inted from '../interested-common';
import axios from 'axios';
import Modal from '@/components/Modal.vue';

export default {
  data() {
    return {
      sidos: [],
      guguns: [],
      dongs: [],
      selSido: {
        code: '',
        name: '시/도',
      },
      selGugun: '',
      selDong: '',
      interestedAreas: [],
      interestedArea: {
        번호: '',
        법정동: '',
        지역코드: '',
        거래액: '',
        준공년도: '',
        거래날짜: '',
        평수: '',
        층: '',
        지번: '',
        건물명: '',
      },
      map: null,
      modal: false,
    };
  },
  components: {
    Modal,
  },
  methods: {
    setGugun() {
      http
        .get(`/gugun/${this.selSido.code}`)
        .then(res => (this.guguns = res.data));
    },
    setDong() {
      http
        .get(`/dong/${this.selGugun.code}`)
        .then(res => (this.dongs = res.data));
    },
    setInterested() {
      const temp = {
        sido: this.selSido.code,
        sidoName: this.selSido.name,
        gugun: this.selGugun.code,
        gugunName: this.selGugun.name,
        dong: this.selDong,
      };
      inted.post('/', temp).then(() => {
        alert('등록되었습니다!');
        this.interestedAreas = [...this.interestedAreas, temp];
      });
      inted.get('/').then(res => (this.interestedAreas = res.data));
    },
    initMap() {
      let multi = { lat: 37.5665734, lng: 126.978179 };
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        center: multi,
        zoom: 15,
      });
    },
    addMarker(tmpLat, tmpLng, interestedArea) {
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          parseFloat(tmpLat),
          parseFloat(tmpLng),
        ),
        title: '',
      });
      let that = this;
      marker.addListener('click', function() {
        this.map.setZoom(17);
        this.map.setCenter(marker.getPosition());
        that.showModal(interestedArea);
      });
      marker.setMap(this.map);
    },
    addGeoMarker(i, idx) {
      axios
        .get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            key: 'AIzaSyCTQIlxBn5AfKGvsfJiormAE1esN3fcCkg',
            address: '',
          },
        })
        .then(res => {
          let tempLat = res.data.results[0].geometry.location.lat;
          let tempLng = res.data.results[0].geometry.location.lng;
          i.lat = tempLat;
          i.lng = tempLng;
          this.addMarker(tempLat, tempLng, i);
          if (this.interestedAreas.length - 1 == idx)
            this.map.setCenter({ lat: tempLat, lng: tempLng });
        });
    },
    showModal(interestedArea) {
      http.get(`/apt/${interestedArea}`).then(res => {
        this.interestedAreas = res.data;
      });
      this.interestedArea = {
        번호: '',
        법정동: '',
        지역코드: '',
        거래액: '',
        준공년도: '',
        거래날짜: '',
        평수: '',
        층: '',
        지번: '',
        건물명: '',
      };
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    },
    setMapCenter(center) {
      this.map.setCenter({ lat: center.lat, lng: center.lng });
    },
  },
  created() {
    http.get('/sido').then(res => (this.sidos = res.data));
    setTimeout(() => {
      this.initMap();
    }, 100);
    inted.get('/').then(res => (this.interestedAreas = res.data));
  },
};
</script>

<style scoped>
tbody tr td:first-child {
  vertical-align: middle;
}
tbody tr td:first-child:hover {
  background: #99e9f2;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.5s ease-out;
  vertical-align: middle;
}
</style>
