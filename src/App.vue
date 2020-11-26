<template>
  <div id="app">
    <div class="body__container">
      <header class="section">
        <div class="inner clearfix">
          <div class="menu-group float-left">
            <router-link to="/"
              ><img src="../img/logo_happy_house.jpg" />
            </router-link>
            <ul class="main-menu toggle" style="margin-bottom: 0">
              <li><router-link to="/attention">공지사항</router-link></li>
              <li><router-link to="/healthcenter">선별진료소</router-link></li>
              <li><router-link to="/safehospital">안심병원</router-link></li>
              <li><router-link to="/pollution">환경 정보</router-link></li>
              <li><router-link to="/interested">관심구역</router-link></li>
              <li><router-link to="/qna">QnA</router-link></li>
            </ul>
          </div>
          <div class="sign-group float-right toggle" v-if="getAccessToken">
            {{ getUserName }}({{ getUserId }})
            <div class="btn-group">
              <router-link
                class="btn sign-in"
                id="admin"
                to="/admin"
                v-if="getUserType === 2"
                >회원관리</router-link
              >
              <router-link
                class="btn sign-in"
                id="admin"
                to="/propertypost"
                v-else-if="getUserType === 1"
                >매물등록</router-link
              >
              <span v-else>
                <form id="search-form" method="POST" action="">
                  <input
                    type="text"
                    id="search"
                    class="input--text"
                    placeholder="검색하기"
                  />
                  <input type="submit" value="Submit" />
                </form>
              </span>
              <a class="btn sign-in" id="logout" @click="onClickLogout"
                >로그아웃</a
              >
              <router-link class="btn mypage" id="mypage" to="/me"
                >정보수정</router-link
              >
            </div>
          </div>
          <div class="sign-group float-right toggle" v-else>
            <div class="btn-group">
              <router-link class="btn sign-in" id="login" to="/login"
                >로그인</router-link
              >
              <router-link class="btn btn--primary sign-up" to="/join"
                >회원가입</router-link
              >
            </div>
            <form id="search-form" method="POST" action="">
              <input
                type="text"
                id="search"
                class="input--text"
                placeholder="검색하기"
              />
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      </header>
      <router-view />
      <footer class="section">
        <div class="inner">
          <div class="image">
            <img src="../img/ssafy.png" alt="" />
          </div>
          <div class="about">
            <h3>Find Us</h3>
            <div class="separator"></div>
            <p>
              <i class="fas fa-map-marker-alt"></i> (SSAFY) 서울시 강남구
              테헤란로 멀티스퀘어
            </p>
            <p><i class="fas fa-phone"></i> 1544-9001</p>
            <p>
              <i class="far fa-envelope"></i>
              <a href="#">
                admin@ssafy.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
//mapGetters 등록
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      isLogin: false,
    };
  },
  computed: {
    ...mapGetters([
      'getAccessToken',
      'getUserId',
      'getUserName',
      'getUserType',
    ]),
  },
  methods: {
    onClickLogout() {
      this.$store
        .dispatch('LOGOUT')
        .then(() => this.$router.replace('/').catch(() => {}));
    },
  },
};
</script>
<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.css');
/* @import './css/main_medium.css'; */
/* @import './css/main_small.css'; */
@import './css/main.css';
@import './css/login.css';
@import './css/signup.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
