<template>
  <div>
    <!-- VISUAL -->
    <section class="section section--visual">
      <div class="inner">
        <div class="summary">
          <h2 class="summary__title">
            HEALTH&nbsp;CENTERS
          </h2>
          <p class="summary__description">
            코로나 선별진료소 정보
          </p>
        </div>
        <ul>
          <li>
            <select id="sido" @change="setGugun" v-model="selSido">
              <option value="0" selected disabled>시/도</option>
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
            <select id="gugun" v-model="selGugun">
              <option value="0" selected disabled>구/군</option>
              <option
                v-for="(gugun, idx) in guguns"
                :key="idx"
                :value="gugun['sido_name']"
              >
                {{ gugun['sido_name'] }}
              </option>
            </select>
          </li>
          <li>
            <button @click="setHealthCenters" id="chc" class="btn btn--primary">
              선별진료소 검색하기
            </button>
          </li>
        </ul>
      </div>
    </section>
    <section id="index_section">
      <div class="card col-sm-12 mt-1" style="min-height: 550px;">
        <div class="card-body">
          <table class="table mt-2" style="width: 70%; margin: 0 auto;">
            <thead>
              <tr>
                <th>번호</th>
                <th>기관</th>
                <th>주소</th>
              </tr>
            </thead>
            <tbody id="searchResult">
              <tr
                v-for="(center, idx) in centers"
                :key="idx"
                @click="setMapCenter(center)"
              >
                <td>{{ center.no }}</td>
                <td>{{ center.institute }}</td>
                <td>{{ center.address }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="map" style="width: 70%; height: 500px; margin: auto;"></div>
      </div>
    </section>
    <Modal v-if="modal" v-on:close="closeModal" :data="center" />
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
import axios from 'axios';
import Modal from '@/components/Modal.vue';

export default {
  data() {
    return {
      sidos: [],
      guguns: [],
      selSido: '도/시',
      selGugun: '구/군',
      centers: [],
      center: {
        번호: '',
        기관명: '',
        주소: '',
        '평일 진료시간': '',
        '토요일 진료시간': '',
        '일요일/공휴일 진료시간': '',
        전화번호: '',
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
    setHealthCenters() {
      this.initMap();
      http
        .get(`/healthcenter/${this.selSido.name}/${this.selGugun}`)
        .then(res => {
          this.centers = res.data;
          if (this.centers.length > 0) {
            this.centers.forEach((c, idx) => {
              this.addGeoMarker(c, idx);
            });
          }
        });
    },
    initMap() {
      let multi = { lat: 37.5665734, lng: 126.978179 };
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        center: multi,
        zoom: 15,
      });
    },
    addMarker(tmpLat, tmpLng, center) {
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          parseFloat(tmpLat),
          parseFloat(tmpLng),
        ),
        title: center.institute,
      });
      let that = this;
      marker.addListener('click', function() {
        this.map.setZoom(17);
        this.map.setCenter(marker.getPosition());
        console.log(center);
        that.showModal(center);
      });
      marker.setMap(this.map);
    },
    addGeoMarker(c, idx) {
      axios
        .get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            key: 'AIzaSyCTQIlxBn5AfKGvsfJiormAE1esN3fcCkg',
            address: c.address,
          },
        })
        .then(res => {
          let tempLat = res.data.results[0].geometry.location.lat;
          let tempLng = res.data.results[0].geometry.location.lng;
          c.lat = tempLat;
          c.lng = tempLng;
          this.addMarker(tempLat, tempLng, c);
          if (this.centers.length - 1 == idx)
            this.map.setCenter({ lat: tempLat, lng: tempLng });
        });
    },
    showModal(center) {
      this.center = {
        번호: center.no,
        기관명: center.institute,
        주소: center.address,
        '평일 진료시간': center.oponweek,
        '토요일 진료시간': center.oponweekend,
        '일요일/공휴일 진료시간': center.oponholiday,
        전화번호: center.tel,
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
  },
};
</script>

<style scoped>
tbody tr:hover {
  background: #99e9f2;
  cursor: pointer;
  font-weight: bold;
  color: white;
  transition: all 0.5s ease-out;
}
</style>
