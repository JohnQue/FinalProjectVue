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
            <select id="gugun" v-model="selGugun">
              <option value="" disabled>구/군</option>
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
                <th>주소</th>
                <th>A:외래진료만/B:외래진료+입원</th>
                <th>전화번호</th>
              </tr>
            </thead>
            <tbody id="searchResult" v-if="hospitals.length > 0">
              <tr v-for="(hos, idx) in hospitals" :key="idx">
                <td>{{ hos.sido }}</td>
                <td>{{ hos.gugun }}</td>
                <td>{{ hos.hospitalname }}</td>
                <td>{{ hos.address }}</td>
                <td>{{ hos.diagnosistype }}</td>
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
        <div id="map" style="width: 70%; height: 500px; margin: auto;"></div>
      </div>
    </section>
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

export default {
  data() {
    return {
      sidos: [],
      guguns: [],
      selSido: {
        code: '',
        name: '시/도',
      },
      selGugun: '',
      hospitals: [],
      map: null,
    };
  },
  methods: {
    setGugun() {
      http
        .get(`/gugun?sido=${this.selSido.code}`)
        .then(res => (this.guguns = res.data));
    },
    setSafeHospitals() {
      console.log(this.selSido.name);
      http
        .get(`/safehospital/${this.selSido.name}/${this.selGugun}`)
        .then(res => {
          this.hospitals = res.data;
          console.log(res.data);
          if (this.hospitals.length > 0) {
            this.hospitals.forEach((h, idx) => {
              this.addGeoMarker(h, idx);
            });
          } else this.initMap();
        });
    },
    initMap() {
      let multi = { lat: 37.5665734, lng: 126.978179 };
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        center: multi,
        zoom: 15,
      });
    },
    addMarker(tmpLat, tmpLng, aptName) {
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          parseFloat(tmpLat),
          parseFloat(tmpLng),
        ),
        label: aptName,
        title: aptName,
      });
      marker.addListener('click', function() {
        this.map.setZoom(17);
        this.map.setCenter(marker.getPosition());
        // callHouseDealInfo(thismap, marker, aptName);
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
          this.addMarker(tempLat, tempLng, c.aptName);
          if (this.hospitals.length - 1 == idx)
            this.map.setCenter({ lat: tempLat, lng: tempLng });
        });
    },
    showModal(apt) {
      http.get(`/deal?aptName=${apt.aptName}`).then(res => {
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
  },
  created() {
    http.get('/sido').then(res => (this.sidos = res.data));
    setTimeout(() => {
      this.initMap();
    }, 100);
  },
};
</script>

<style scoped></style>
