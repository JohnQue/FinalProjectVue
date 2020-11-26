<template>
  <div>
    <!-- VISUAL -->
    <section class="section section--visual healthcenter">
      <div class="inner">
        <div class="summary">
          <h2 class="summary__title">
            HEALTH&nbsp;CENTER
          </h2>
          <p class="summary__description">
            코로나 선별진료소 정보
          </p>
        </div>
        <ul id="sign-form">
          <li>
            <select id="sido" @change="setGugun" v-model="selSido">
              <option value="" selected disabled hidden
                >시/도를 선택하세요</option
              >
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
              <option value="" selected disabled hidden
                >구/군을 선택하세요</option
              >
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
                v-for="(c, idx) in healthCenters"
                :key="idx"
                @click="setMapCenter(c)"
              >
                <td>{{ c.no }}</td>
                <td>{{ c.institute }}</td>
                <td>{{ c.address }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <gmap-map
          id="map"
          :center="center"
          :zoom="zoom"
          style="width:70%;  height: 500px;"
        >
          <gmap-marker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            @click="markerClicked(m, index)"
          ></gmap-marker>
        </gmap-map>
      </div>
    </section>
    <Modal v-if="modal" v-on:close="closeModal" :data="healthCenter" />
  </div>
</template>
<script>
import http from '../map-common';
import axios from 'axios';
import Modal from '@/components/Modal.vue';

export default {
  data() {
    return {
      markers: [],
      places: [],
      sidos: [],
      guguns: [],
      selSido: '',
      selGugun: '',
      healthCenters: [],
      healthCenter: {
        번호: '',
        기관명: '',
        주소: '',
        '평일 진료시간': '',
        '토요일 진료시간': '',
        '일요일/공휴일 진료시간': '',
        전화번호: '',
      },
      center: { lat: 37.5665734, lng: 126.978179 },
      zoom: 15,
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
          this.healthCenters = res.data;
          if (this.healthCenters.length > 0) {
            this.healthCenters.forEach((c, idx) => {
              this.addGeoMarker(c, idx);
            });
          }
        });
    },
    initMap() {
      this.currentPlace = null;
      this.markers = [];
      this.places = [];
      this.center = { lat: 37.5665734, lng: 126.978179 };
    },
    addMarker(tmpLat, tmpLng, center) {
      const marker = {
        lat: parseFloat(tmpLat),
        lng: parseFloat(tmpLng),
      };
      this.markers.push({ position: marker });
      this.places.push(center);
      this.center = marker;
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
          if (this.healthCenters.length - 1 == idx)
            this.center = { lat: tempLat, lng: tempLng };
        });
    },
    showModal(healthCenter) {
      this.healthCenter = {
        번호: healthCenter.no,
        기관명: healthCenter.institute,
        주소: healthCenter.address,
        '평일 진료시간': healthCenter.oponweek,
        '토요일 진료시간': healthCenter.oponweekend,
        '일요일/공휴일 진료시간': healthCenter.oponholiday,
        전화번호: healthCenter.tel,
      };
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    },
    setMapCenter(center) {
      this.center = { lat: center.lat, lng: center.lng };
      this.zoom = 17;
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
    markerClicked(marker, index) {
      this.center = marker.position;
      this.showModal(this.healthCenters[index]);
    },
  },
  created() {
    http.get('/sido').then(res => (this.sidos = res.data));
  },
  mounted() {
    this.geolocate();
  },
};
</script>

<style scoped>
tbody tr:hover {
  background: #99e9f2;
  cursor: pointer;
  color: white;
  transition: all 0.5s ease-out;
}
</style>
