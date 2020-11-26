<template>
  <section id="index_section">
    <div class="card col-sm-12 mt-1" style="min-height: 550px;">
      <div class="card-body" style="width: 60%; margin: 0 auto;">
        <label for="주소">주소</label>
        <br />
        <b-select id="sido" @change="setGugun($event)" v-model="selSido">
          <option value="" selected disabled hidden>시/도를 선택하세요</option>
          <option
            v-for="(sido, idx) in sidos"
            :key="idx"
            :value="sido['sido_code']"
          >
            {{ sido['sido_name'] }}
          </option>
        </b-select>
        <b-select id="gugun" @change="setDong($event)" v-model="selGugun">
          <option value="" selected disabled hidden>구/군을 선택하세요</option>
          <option
            v-for="(gugun, idx) in guguns"
            :key="idx"
            :value="gugun['sido_code']"
          >
            {{ gugun['sido_name'] }}
          </option>
        </b-select>
        <b-select id="dong" v-model="pp.dong">
          <option value="" selected disabled hidden>동을 선택하세요</option>
          <option v-for="(dong, idx) in dongs" :key="idx" :value="dong.dong">
            {{ dong.dong }}
          </option>
        </b-select>
        <br />
        <br />
        <label for="아파트명">아파트명</label>
        <input
          type="text"
          placeholder="아파트명을 입력하세요"
          class="form-control"
          v-model="pp.aptName"
        />
        <br />
        <label for="지역코드">지역코드</label>
        <input
          type="text"
          placeholder="지역코드를 입력하세요"
          class="form-control"
          v-model="pp.code"
        />
        <br />
        <label for="거래가격">거래가격</label>
        <input
          type="text"
          placeholder="거래가격을 입력하세요"
          class="form-control"
          v-model="pp.dealAmount"
        />
        <br />
        <label for="건설년도">건설년도</label>
        <input
          type="text"
          placeholder="아파트명을 입력하세요"
          class="form-control"
          v-model="pp.buildYear"
        />
        <br />
        <label for="면적">면적</label>
        <input
          type="text"
          placeholder="면적을 입력하세요"
          class="form-control"
          v-model="pp.area"
        />
        <br />
        <label for="층">층</label>
        <input
          type="text"
          placeholder="층을 입력하세요"
          class="form-control"
          v-model="pp.floor"
        />
        <br />
        <label for="지번">지번</label>
        <input
          type="text"
          placeholder="지번을 입력하세요"
          class="form-control"
          v-model="pp.jibun"
        />
        <div class="text-right" style="margin-top: 30px;">
          <button
            v-if="pp.no === 0"
            v-on:click="register"
            class="btn btn--primary"
            style="margin-right: 10px"
          >
            등록
          </button>
          <button
            v-else
            v-on:click="update"
            class="btn btn--primary"
            style="margin-right: 10px"
          >
            수정
          </button>
          <router-link to="/map" class="btn btn--primary">목록</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import http from '../map-common';
export default {
  name: 'PropertyPost',
  data() {
    return {
      selSido: '',
      selGugun: '',
      sidos: [],
      guguns: [],
      dongs: [],
      apts: [],
      pp: {
        no: 0,
        dong: '',
        aptName: '',
        code: 0,
        dealAmount: '',
        buildYear: 0,
        dealYear: 0,
        dealMonth: 0,
        dealDay: 0,
        area: 0.0,
        floor: 0,
        jibun: '',
        type: 0,
      },
    };
  },
  methods: {
    setGugun() {
      http.get(`/gugun/${this.selSido}`).then(res => (this.guguns = res.data));
    },
    setDong() {
      http.get(`/dong/${this.selGugun}`).then(res => (this.dongs = res.data));
    },
    setApt() {},
    register() {
      axios
        .post('http://localhost:8000/enroll', {
          dong: this.pp.dong,
          aptName: this.pp.aptName,
          code: this.pp.code,
          dealAmount: this.pp.dealAmount,
          buildYear: this.pp.buildYear,
          area: this.pp.area,
          floor: this.pp.floor,
          jibun: this.pp.jibun,
        })
        .then(() => {
          alert('등록이 완료되었습니다!');
          this.initialize();
        })
        .catch(err => console.log(err));
    },
    initialize() {
      this.pp = {
        no: 0,
        dong: '',
        aptName: '',
        code: 0,
        dealAmount: '',
        buildYear: 0,
        dealYear: 0,
        dealMonth: 0,
        dealDay: 0,
        area: 0.0,
        floor: 0,
        jibun: '',
        type: 0,
      };
    },
    update() {
      http
        .put('../addproperty', {
          dong: this.pp.dong,
          aptName: this.pp.aptName,
          code: this.pp.code,
          dealAmount: this.pp.dealAmount,
          buildYear: this.pp.buildYear,
          area: this.pp.area,
          floor: this.pp.floor,
          jibun: this.pp.jibun,
        })
        .then(() => {
          alert('완료되었습니다!');
          this.$router.push('/map');
        })
        .catch(err => console.log(err));
    },
  },
  created() {
    http.get('/sido').then(res => (this.sidos = res.data));
  },
};
</script>

<style></style>
