<template>
  <div>
    <!-- VISUAL -->
    <section class="section section--visual store">
      <div class="inner">
        <div class="summary">
          <h2 class="summary__title">
            INTERESTED
          </h2>
          <p class="summary__description">
            관심 지역 정보 제공
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
            <select id="gugun" @change="setDong($event)" v-model="selGugun">
              <option value="" selected disabled hidden
                >구/군을 선택하세요</option
              >
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
              <option value="" selected disabled hidden>동을 선택하세요</option>
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
            <tbody
              id="searchResult"
              class="areas"
              v-if="interestedAreas.length > 0"
            >
              <tr
                v-for="(int, idx) in interestedAreas"
                :key="idx"
                @click="setInfo(int)"
              >
                <td>{{ int.sidoName }} {{ int.gugunName }} {{ int.dong }}</td>
                <td>
                  <button class="btn btn--danger" @click="deleteArea(int.no)">
                    삭제하기
                  </button>
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
        <div class="card-body">
          <table
            class="table mt-2 text-center"
            style="width: 70%; margin: 0 auto;"
          >
            <thead>
              <tr>
                <th>번호</th>
                <th>법정동</th>
                <th>아파트이름</th>
                <th>지번</th>
                <th>지역코드</th>
              </tr>
            </thead>
            <tbody id="searchResult" v-if="areas.length > 0">
              <tr
                v-for="(area, idx) in areas"
                :key="idx"
                @click="setMapCenter(area)"
              >
                <td>{{ area.no }}</td>
                <td>{{ area.dong }}</td>
                <td>{{ area.aptName }}</td>
                <td>{{ area.jibun }}</td>
                <td>{{ area.code }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="6" class="text-center">
                  등록된 건물 정보가 없습니다!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-body">
          <table
            class="table mt-2 text-center"
            style="width: 70%; margin: 0 auto;"
          >
            <thead>
              <tr>
                <th>법정동</th>
                <th>도로명</th>
                <th>가게명</th>
              </tr>
            </thead>
            <tbody id="searchResult2" v-if="stores.length > 0">
              <tr v-for="(store, idx) in stores" :key="idx">
                <td>{{ store.dong }}</td>
                <td>{{ store.roadname }}</td>
                <td>{{ store.storename }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="6" class="text-center">
                  등록된 상권 정보가 없습니다!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <ListModal v-if="modal" v-on:close="closeModal" :data="details" />
  </div>
</template>
<script>
import http from '../map-common';
import inted from '../interested-common';
import axios from 'axios';
import ListModal from '@/components/ListModal.vue';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      markers: [],
      places: [],
      sidos: [],
      guguns: [],
      dongs: [],
      selSido: '',
      selGugun: '',
      selDong: '',
      interestedAreas: [],
      detail: '',
      details: [],
      areas: [],
      stores: [],
      center: { lat: 37.5665734, lng: 126.978179 },
      zoom: 15,
      modal: false,
    };
  },
  components: {
    ListModal,
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
    setInfo(int) {
      this.initMap();
      this.setAreas(int);
      this.setStores(int);
    },
    setAreas(int) {
      http.get(`/apt/${int.dong}`).then(res => {
        this.areas = res.data;
        if (this.areas.length > 0) {
          this.areas.forEach((place, idx) => {
            this.addGeoMarker(place, idx);
          });
        }
      });
    },
    setStores(int) {
      http.get(`/store/${int.dong}`).then(res => {
        this.stores = res.data;
      });
    },
    deleteArea(no) {
      inted.delete(`/${no}`).then(() => {
        alert('삭제가 완료되었습니다!');
        this.interestedAreas = this.interestedAreas.filter(
          inted => inted.no !== no,
        );
      });
    },
    setInterested() {
      const temp = {
        sido: this.selSido.code,
        sidoName: this.selSido.name,
        gugun: this.selGugun.code,
        gugunName: this.selGugun.name,
        dong: this.selDong,
        userid: this.getUserId,
      };
      inted.post('/', temp).then(() => {
        alert('등록되었습니다!');
        this.interestedAreas = [...this.interestedAreas, temp];
      });
      inted.get('/').then(res => (this.interestedAreas = res.data));
    },
    initMap() {
      this.currentPlace = null;
      this.markers = [];
      this.places = [];
      this.center = { lat: 37.5665734, lng: 126.978179 };
    },
    addMarker(tmpLat, tmpLng, interestedArea) {
      const marker = {
        lat: parseFloat(tmpLat),
        lng: parseFloat(tmpLng),
      };
      this.markers.push({ position: marker });
      this.places.push(interestedArea);
      this.center = marker;
    },
    addGeoMarker(i, idx) {
      axios
        .get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            key: 'AIzaSyCTQIlxBn5AfKGvsfJiormAE1esN3fcCkg',
            address: i.dong + '+' + i.jibun,
          },
        })
        .then(res => {
          let tempLat = res.data.results[0].geometry.location.lat;
          let tempLng = res.data.results[0].geometry.location.lng;
          i.lat = tempLat;
          i.lng = tempLng;
          this.addMarker(tempLat, tempLng, i);
          if (this.interestedAreas.length - 1 == idx)
            this.center = { lat: tempLat, lng: tempLng };
        });
    },
    showModal(interestedArea) {
      http
        .get(`/deal/${interestedArea.dong}/${interestedArea.aptName}`)
        .then(res => {
          this.details = [];
          let data = res.data;
          data.forEach(temp => {
            console.log(temp);
            this.detail = {
              번호: temp.no,
              법정동: temp.dong,
              지역코드: temp.code,
              거래액: temp.dealAmount,
              준공년도: temp.buildYear,
              거래날짜:
                temp.dealYear + '-' + temp.dealMonth + '-' + temp.dealDay,
              평수: temp.area,
              층: temp.floor,
              지번: temp.jibun,
              건물명: temp.aptName,
            };
            this.details.push(this.detail);
          });
        });
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    },
    setMapCenter(center) {
      this.center = { lat: center.lat, lng: center.lng };
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
      this.showModal(this.areas[index]);
    },
  },
  created() {
    http.get('/sido').then(res => (this.sidos = res.data));
    inted
      .get(`/${this.getUserId}`)
      .then(res => (this.interestedAreas = res.data));
  },
  computed: {
    ...mapGetters(['getUserId']),
  },
};
</script>

<style scoped>
tbody tr td:first-child {
  vertical-align: middle;
}
tbody.areas tr td:first-child:hover {
  background: #99e9f2;
  color: white;
  cursor: pointer;
  transition: all 0.5s ease-out;
  vertical-align: middle;
}

tbody#searchResult tr:hover {
  background: #99e9f2;
  cursor: pointer;
  color: white;
  transition: all 0.5s ease-out;
}
</style>
