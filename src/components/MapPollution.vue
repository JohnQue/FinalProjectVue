<template>
  <div>
    <!-- VISUAL -->
    <section class="section section--visual pollution">
      <div class="inner">
        <div class="summary">
          <h2 class="summary__title">
            POLLUTIONS
          </h2>
          <p class="summary__description">
            환경 점검 정보 제공
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
            <button @click="setPollutions" id="chc" class="btn btn--primary">
              환경 점검 정보 검색하기
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
                <th>업체(시설)명</th>
                <th>소재지주소</th>
              </tr>
            </thead>
            <tbody id="searchResult" v-if="pollutions.length > 0">
              <tr
                v-for="(pol, idx) in pollutions"
                :key="idx"
                @click="setMapCenter(pol)"
              >
                <td>{{ pol['WRKP_NM'] }}</td>
                <td>{{ pol['WRKP_ADDR'] }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="6" class="text-center">
                  해당 지역에는 환경 정보가 없습니다!
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
    <Modal v-if="modal" v-on:close="closeModal" :data="pollution" />
  </div>
</template>
<script>
import http from '../map-common';
import axios from 'axios';
import Modal from '@/components/Modal.vue';

let englishgungu = {
  서대문구: ['sdm', 'Seodaemun'],
  강서구: ['gangseo', 'Gangseo'],
  금천구: ['geumcheon', 'Geumcheon'],
  성북구: ['sb', 'Sb'],
  성동구: ['sd', 'Sd'],
  중랑구: ['jungnang', 'Jungnang'],
  노원구: ['nowon', 'Nw'],
  동대문구: ['ddm', 'Dongdeamoon'],
  양천구: ['yangcheon', 'Yc'],
  강동구: ['gd', 'Gd'],
  종로구: ['jongno', 'Jongno'],
  송파구: ['songpa', 'Sp'],
  중구: ['junggu', 'Junggu'],
  마포구: ['mapo', 'Mp'],
  동작구: ['dongjak', 'Dj'],
  강남구: ['gangnam', 'Gn'],
  영등포구: ['ydp', 'Ydp'],
  도봉구: ['dobong', 'Dobong'],
  구로구: ['guro', 'Guro'],
  용산구: ['yongsan', 'Ys'],
  서초구: ['seocho', 'Sc'],
  광진구: ['gwangjin', 'Gwangjin'],
  관악구: ['gwanak', 'Ga'],
  은평구: ['ep', 'Ep'],
};

export default {
  data() {
    return {
      markers: [],
      places: [],
      sidos: [],
      guguns: [],
      selSido: '',
      selGugun: '',
      pollutions: [],
      pollution: {
        '업체(시설)명': '',
        인허가번호: '',
        업종코드: '',
        업종명: '',
        지도점검일자: '',
        점검기관: '',
        점검기관명: '',
        지도점검구분: '',
        처분대상여부: '',
        점검사항: '',
        점검결과: '',
        소재지도로명주소: '',
        소재지주소: '',
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
    setPollutions() {
      this.initMap();
      if (this.selGugun === '강북구') {
        alert('죄송합니다. 강북구는 등록된 환경 정보가 없습니다.');
      } else {
        let go =
          this.selGugun === '강서구' ||
          this.selGugun === '서초구' ||
          this.selGugun === '송파구'
            ? '.seoul'
            : '.go';
        let eng = englishgungu[this.selGugun];
        axios
          .get(
            `http://openAPI.${eng[0]}${go}.kr:8088/6c6162565665787539396a72686b4b/json/${eng[1]}ListEnvGuideCheck/1/12`,
          )
          .then(res => {
            this.pollutions = res.data[`${eng[1]}ListEnvGuideCheck`].row;
            if (this.pollutions.length > 0) {
              this.pollutions.forEach((p, idx) => {
                this.addGeoMarker(p, idx);
              });
            }
          });
      }
    },
    initMap() {
      this.currentPlace = null;
      this.markers = [];
      this.places = [];
      this.center = { lat: 37.5665734, lng: 126.978179 };
    },
    addMarker(tmpLat, tmpLng, pollution) {
      const marker = {
        lat: parseFloat(tmpLat),
        lng: parseFloat(tmpLng),
      };
      this.markers.push({ position: marker });
      this.places.push(pollution);
      this.center = marker;
    },
    addGeoMarker(p, idx) {
      axios
        .get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            key: 'AIzaSyCTQIlxBn5AfKGvsfJiormAE1esN3fcCkg',
            address: p['WRKP_ADDR'],
          },
        })
        .then(res => {
          let tempLat = res.data.results[0].geometry.location.lat;
          let tempLng = res.data.results[0].geometry.location.lng;
          p.lat = tempLat;
          p.lng = tempLng;
          this.addMarker(tempLat, tempLng, p);
          if (this.pollutions.length - 1 == idx)
            this.center = { lat: tempLat, lng: tempLng };
        });
    },
    showModal(pollution) {
      this.pollution = {
        '업체(시설)명': pollution['WRKP_NM'],
        인허가번호: pollution['APV_PERM_MGT_NO'],
        업종코드: pollution['UPCH_COB_CODE'],
        업종명: pollution['UPCH_COB_NM'],
        지도점검일자: pollution['DRT_INSP_YMD'],
        점검기관: pollution['ORG_AND_TEAM_CODE'],
        점검기관명: pollution['SF_TEAM_NM'],
        지도점검구분: pollution['DRT_INSP_SE_NM'],
        처분대상여부: pollution['DISPO_TGT_YN'],
        점검사항: pollution['DRT_INSP_ITEM'],
        점검결과: pollution['DRT_INSP_RT_DTL'],
        소재지도로명주소: pollution['WRKP_NADDR'],
        소재지주소: pollution['WRKP_ADDR'],
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
      this.showModal(this.pollutions[index]);
    },
  },
  mounted() {
    this.geolocate();
  },
  created() {
    http.get('/sido').then(res => (this.sidos = res.data));
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
