import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);
const SERVER_URL = process.env.VUE_APP_SERVER_URL;

export default new Vuex.Store({
  state: {
    accessToken: null,
    userId: '',
    userName: '',
    userType: '',
  },
  getters: {
    getAccessToken(state) {
      return state.accessToken;
    },
    getUserId(state) {
      return state.userId;
    },
    getUserName(state) {
      return state.userName;
    },
    getUserType(state) {
      return state.userType;
    },
  },
  mutations: {
    LOGIN(state, payload) {
      state.accessToken = payload['auth-token'];
      state.userId = payload['user-id'];
      state.userName = payload['user-name'];
      state.userType = payload['user-type'];
    },
    LOGOUT(state) {
      state.accessToken = null;
      state.userId = '';
      state.userName = '';
      state.userType = '';
    },
  },
  actions: {
    LOGIN(context, user) {
      return axios
        .post(`${SERVER_URL}/member/confirm/login`, user)
        .then(res => {
          alert(`${res.data['user-name']}님 환영합니다!`);
          context.commit('LOGIN', res.data);
          axios.defaults.headers.common[
            'auth-token'
          ] = `${res.data['auth-token']}`;
        });
    },
    JOIN(context, user) {
      return axios
        .post(`${SERVER_URL}/member/confirm/join`, user)
        .then(() => alert('회원가입이 완료되었습니다!'));
    },
    LOGOUT(context) {
      alert('로그아웃 되었습니다!');
      context.commit('LOGOUT');
      axios.defaults.headers.common['auth-token'] = undefined;
    },
  },
  modules: {},
});
