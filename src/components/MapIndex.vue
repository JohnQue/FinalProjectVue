<template>
  <div>
    <!-- VISUAL -->
    <section class="section section--visual">
      <div class="inner">
        <div class="summary">
          <h2 class="summary__title">
            HAPPY&nbsp;HOUSE
          </h2>
          <p class="summary__description">
            행복한 우리집은 도대체 어디에..
          </p>
        </div>
        <form id="sign-form" method="GET" action="search.html">
          <ul>
            <li>
              <select id="sido" @change="setGugun($event)">
                <option value="0" selected disabled>시/도</option>
                <option
                  v-for="(sido, idx) in sidos"
                  :key="idx"
                  :value="sido['sido_code']"
                >
                  {{ sido['sido_name'] }}
                </option>
              </select>
            </li>
            <li>
              <select id="gugun" @change="setDong($event)">
                <option value="0" selected disabled>구/군</option>
                <option
                  v-for="(gugun, idx) in guguns"
                  :key="idx"
                  :value="gugun['sido_code']"
                >
                  {{ gugun['sido_name'] }}
                </option>
              </select>
            </li>
            <li>
              <select id="dong" @change="setApt($event)">
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
          </ul>
        </form>
      </div>
    </section>
    <section id="index_section">
      <div class="card col-sm-12 mt-1" style="min-height: 550px;">
        <div class="card-body">
          <table class="table mt-2" style="width: 70%; margin: 0 auto;">
            <thead>
              <tr>
                <th>번호</th>
                <th>법정동</th>
                <th>아파트이름</th>
                <th>지번</th>
                <th>지역코드</th>
              </tr>
            </thead>
            <tbody id="searchResult">
              <tr
                v-for="(apt, idx) in apts"
                :key="idx"
                @click="setMapCenter(apt)"
              >
                <td>{{ apt.no }}</td>
                <td>{{ apt.dong }}</td>
                <td>{{ apt.aptName }}</td>
                <td>{{ apt.jibun }}</td>
                <td>{{ apt.code }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="map" style="width: 70%; height: 500px; margin: auto;"></div>
      </div>
    </section>
    <Modal v-if="modal" v-on:close="closeModal" :data="apt" />
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
      dongs: [],
      apts: [],
      apt: {
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
      modal: false,
      map: null,
    };
  },
  components: {
    Modal,
  },
  methods: {
    setGugun() {
      http
        .get(`/gugun/${event.target.value}`)
        .then(res => (this.guguns = res.data));
    },
    setDong() {
      http
        .get(`/dong/${event.target.value}`)
        .then(res => (this.dongs = res.data));
    },
    setApt() {
      this.initMap();
      http.get(`/apt/${event.target.value}`).then(res => {
        this.apts = res.data;
        if (this.centers.length > 0) {
          this.apts.forEach((apt, idx) => {
            this.addGeoMarker(apt, idx);
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
    addMarker(tmpLat, tmpLng, apt) {
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          parseFloat(tmpLat),
          parseFloat(tmpLng),
        ),
        title: apt.aptName,
      });
      let that = this;
      marker.addListener('click', function() {
        this.map.setZoom(17);
        this.map.setCenter(marker.getPosition());
        that.showModal(apt);
      });
      marker.setMap(this.map);
    },
    addGeoMarker(apt, idx) {
      axios
        .get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            key: 'AIzaSyCTQIlxBn5AfKGvsfJiormAE1esN3fcCkg',
            address: apt.dong + '+' + apt.aptName + '+' + apt.jibun,
          },
        })
        .then(res => {
          let tempLat = res.data.results[0].geometry.location.lat;
          let tempLng = res.data.results[0].geometry.location.lng;
          apt.lat = tempLat;
          apt.lng = tempLng;
          this.addMarker(tempLat, tempLng, apt);
          if (this.apts.length - 1 == idx)
            this.map.setCenter({ lat: tempLat, lng: tempLng });
        });
    },
    showModal(apt) {
      http.get(`/deal/${apt.aptName}`).then(res => {
        let temp = res.data;
        this.apt = {
          번호: temp.no,
          법정동: temp.dong,
          지역코드: temp.code,
          거래액: temp.dealAmount,
          준공년도: temp.buildYear,
          거래날짜: temp.dealYear + '-' + temp.dealMonth + '-' + temp.dealDay,
          평수: temp.area,
          층: temp.floor,
          지번: temp.jibun,
          건물명: temp.aptName,
        };
        this.modal = true;
      });
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
  transition: 0.5s ease-out;
}
</style>
