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
                <option value="" selected disabled hidden
                  >시/도를 선택하세요</option
                >
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
                <option value="" selected disabled hidden
                  >구/군을 선택하세요</option
                >
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
                <option value="" selected disabled hidden
                  >동을 선택하세요</option
                >
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
    <section class="section section--feature">
      <div class="tiles">
        <div class="inner">
          <ul class="clearfix">
            <li>
              <img src="../../img/sideAD.jpg" alt="build" style="width: 100%" />
            </li>
            <li>
              <h3>주택 관련 기사</h3>
              <div class="separator"></div>
              <p>&lt;인사&gt; 신동아건설</p>
              <p>12.16 대책 후 '매수·매도자 모두 일단 관망세'</p>
              <p>구미시, 낙동강 변 국가3산단에 민간공원 조성</p>
              <p>'은행'과 '보험사'의 주택담보대출 조건, 어떻게 다를까?</p>
              <div class="separator"></div>
            </li>
            <li>
              <h3>오늘의 뉴스</h3>
              <div class="separator"></div>
              <ul>
                <li v-for="(n, idx) in news" :key="idx">
                  <a :href="n.link" v-html="n.title" target="_blank"> </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <ListModal v-if="modal" v-on:close="closeModal" :data="list" />
  </div>
</template>
<script>
import http from '../map-common';
import axios from 'axios';
import ListModal from '@/components/ListModal.vue';

export default {
  data() {
    return {
      sidos: [],
      guguns: [],
      dongs: [],
      apts: [],
      list: [],
      news: [],
      markers: [],
      places: [],
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
        if (this.apts.length > 0) {
          this.apts.forEach((apt, idx) => {
            this.addGeoMarker(apt, idx);
          });
        }
      });
    },
    showModal(apt) {
      http.get(`/deal/${apt.dong}/${apt.aptName}`).then(res => {
        this.list = [];
        let data = res.data;
        data.forEach(temp => {
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
          this.list.push(this.apt);
        });

        this.modal = true;
      });
    },
    closeModal() {
      this.modal = false;
    },
    setMapCenter(center) {
      this.center = { lat: center.lat, lng: center.lng };
      this.zoom = 17;
    },
    initMap() {
      this.currentPlace = null;
      this.markers = [];
      this.places = [];
      this.center = { lat: 37.5665734, lng: 126.978179 };
    },
    addMarker(tmpLat, tmpLng, apt) {
      const marker = {
        lat: parseFloat(tmpLat),
        lng: parseFloat(tmpLng),
      };
      this.markers.push({ position: marker });
      this.places.push(apt);
      this.center = marker;
    },
    addGeoMarker(apt, idx) {
      axios
        .get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            key: 'AIzaSyCTQIlxBn5AfKGvsfJiormAE1esN3fcCkg',
            address: apt.dong + '+' + apt.jibun,
          },
        })
        .then(res => {
          let tempLat = res.data.results[0].geometry.location.lat;
          let tempLng = res.data.results[0].geometry.location.lng;
          apt.lat = tempLat;
          apt.lng = tempLng;
          this.addMarker(tempLat, tempLng, apt);
          if (this.apts.length - 1 == idx)
            this.center = { lat: tempLat, lng: tempLng };
        });
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
      this.showModal(this.apts[index]);
    },
  },
  created() {
    http.get('/sido').then(res => (this.sidos = res.data));
    http.get('/news').then(res => (this.news = res.data));
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
