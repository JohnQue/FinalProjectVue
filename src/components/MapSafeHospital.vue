<template>
  <div>
    <!-- VISUAL -->
    <section class="section section--visual safehospital">
      <div class="inner">
        <div class="summary">
          <h2 class="summary__title">
            SAFE&nbsp;HOSPITALS
          </h2>
          <p class="summary__description">
            안심 병원 정보 제공
          </p>
        </div>
        <ul id="sign-form">
          <li>
            <select id="sido" @change="setGugun($event)" v-model="selSido">
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
            <button @click="setSafeHospitals" id="chc" class="btn btn--primary">
              안심병원 검색하기
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
                <th>시</th>
                <th>군/구</th>
                <th>의료기관명</th>
                <th>전화번호</th>
              </tr>
            </thead>
            <tbody id="searchResult" v-if="hospitals.length > 0">
              <tr
                v-for="(hos, idx) in hospitals"
                :key="idx"
                @click="setMapCenter(hos)"
              >
                <td>{{ hos.sido }}</td>
                <td>{{ hos.gugun }}</td>
                <td>{{ hos.hospitalname }}</td>
                <td>{{ hos.tel }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="6" class="text-center">
                  해당 지역에는 안심병원이 없습니다!
                </td>
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
    <Modal v-if="modal" v-on:close="closeModal" :data="hospital" />
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
      hospitals: [],
      hospital: {
        시: '',
        '군/구': '',
        주소: '',
        의료기관명: '',
        'A:외래만/B:외래+입원': '',
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
    setSafeHospitals() {
      this.initMap();
      http
        .get(`/safehospital/${this.selSido.name}/${this.selGugun}`)
        .then(res => {
          this.hospitals = res.data;
          if (this.hospitals.length > 0) {
            this.hospitals.forEach((h, idx) => {
              this.addGeoMarker(h, idx);
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
    addMarker(tmpLat, tmpLng, hospital) {
      const marker = {
        lat: parseFloat(tmpLat),
        lng: parseFloat(tmpLng),
      };
      this.markers.push({ position: marker });
      this.places.push(hospital);
      this.center = marker;
    },
    addGeoMarker(h, idx) {
      axios
        .get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            key: 'AIzaSyCTQIlxBn5AfKGvsfJiormAE1esN3fcCkg',
            address: h.address,
          },
        })
        .then(res => {
          let tempLat = res.data.results[0].geometry.location.lat;
          let tempLng = res.data.results[0].geometry.location.lng;
          h.lat = tempLat;
          h.lng = tempLng;
          this.addMarker(tempLat, tempLng, h);
          if (this.hospitals.length - 1 == idx)
            this.map.setCenter({ lat: tempLat, lng: tempLng });
        });
    },
    showModal(hospital) {
      this.hospital = {
        시: hospital.sido,
        '군/구': hospital.gugun,
        의료기관명: hospital.hospitalname,
        'A:외래만/B:외래+입원': hospital.diagnosistype,
        전화번호: hospital.tel,
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
      this.showModal(this.hospitals[index]);
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
  color: white;
  cursor: pointer;
  transition: 0.5s ease-out;
}
</style>
