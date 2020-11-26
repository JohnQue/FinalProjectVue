<template>
  <div>
    <!-- VISUAL -->
    <section class="section section--visual">
      <div class="inner">
        <div class="summary">
          <h2 class="summary__title">
            REAL ESTATE
          </h2>
          <p class="summary__description">
            부동산 정보 제공
          </p>
        </div>
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
              <select id="dong" v-model="dong">
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
            <button @click="setRealEstates" id="chc" class="btn btn--primary">
              부동산 정보 검색하기
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
                <th>부동산명</th>
                <th>주소</th>
              </tr>
            </thead>
            <tbody id="searchResult" v-if="realestates.length > 0">
              <tr
                v-for="(rs, idx) in realestates"
                :key="idx"
                @click="setMapCenter(rs)"
              >
                <td>{{ rs['CMP_NM'] }}</td>
                <td>{{ rs['ADDRESS'] }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="6" class="text-center">
                  해당 지역에는 부동산 정보가 없습니다!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="map" style="width: 70%; height: 500px; margin: auto;"></div>
      </div>
    </section>
    <Modal v-if="modal" v-on:close="closeModal" :data="realestate" />
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
      selSido: {
        code: '',
        name: '시/도',
      },
      dong:'',
      selGugun: '',
      realestates: [],
      realestate: {
        시스템등록번호: '',
        시군구코드: '',
        법정동코드: '',
        자치구명: '',
        법정도명: '',
        지번구분: '',
        본번: '',
        부번: '',
        주소: '',
        중개업등록번호: '',
        중개업자명: '',
        사업자상호: '',
        전화번호: '',
        상태구분: '',
        도로명코드: '',
        건물: '',
        건물본번: '',
        건물부번: '',
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
        .get(`/gugun/${event.target.value}`)
        .then(res => (this.guguns = res.data));
    },
    setDong() {
      http
        .get(`/dong/${event.target.value}`)
        .then(res => (this.dongs = res.data));
    },
    setRealEstates() {
        this.initMap();
        axios
            .get(
            `http://openapi.seoul.go.kr:8088/774f4b6e5076616c3130357974536b4e/json/landBizInfo/1/5/`,
            )
            .then(res => {
                res.data['landBizInfo']['row'].forEach((rs) => {
                    if(this.dong==rs['BJDONG_NM']){
                        this.realestates.push(rs);
                    }
              });

              //TEST (끝나면 지우기)
            console.log("dassada");
            this.realestates.forEach((rs)=>{
                console.log(rs);
            })
              //TEST (끝나면 지우기)

            if (this.realestates.length > 0) {
                this.realestates.forEach((p, idx) => {
                this.addGeoMarker(p, idx);
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
    addMarker(tmpLat, tmpLng, realestate) {
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          parseFloat(tmpLat),
          parseFloat(tmpLng),
        ),
        title: realestate['CMP_NM'],
      });
      let that = this;
      marker.addListener('click', function() {
        this.map.setZoom(17);
        this.map.setCenter(marker.getPosition());
        console.log(realestate);
        that.showModal(realestate);
      });
      marker.setMap(this.map);
    },
    addGeoMarker(p, idx) {
      axios
        .get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            key: 'AIzaSyCTQIlxBn5AfKGvsfJiormAE1esN3fcCkg',
            address: p['ADDRESS'],
          },
        })
        .then(res => {
          let tempLat = res.data.results[0].geometry.location.lat;
          let tempLng = res.data.results[0].geometry.location.lng;
          p.lat = tempLat;
          p.lng = tempLng;
          this.addMarker(tempLat, tempLng, p);
          if (this.realestates.length - 1 == idx)
            this.map.setCenter({ lat: tempLat, lng: tempLng });
        });
    },
    showModal(realestate) {
      this.realestate = {
        시스템등록번호: realestate['SYS_REGNO'],
        시군구코드: realestate['SGG_CD'],
        법정동코드: realestate['BJDONG_CD'],
        자치구명: realestate['SGG_NM'],
        법정도명: realestate['BJDONG_NM'],
        지번구분: realestate['LAND_GBN'],
        본번: realestate['BOBN'],
        부번: realestate['BUBN'],
        주소: realestate['ADDRESS'],
        중개업등록번호: realestate['RA_REGNO'],
        중개업자명: realestate['RDEALER_NM'],
        사업자상호: realestate['CMP_NM'],
        전화번호: realestate['TELNO'],
        상태구분: realestate['STS_GBN'],
        도로명코드: realestate['ROAD_CD'],
        건물: realestate['BLDG_LOC'],
        건물본번: realestate['BLDG_BOBN'],
        건물부번: realestate['BLDG_BUBN'],
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
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.5s ease-out;
}
</style>
