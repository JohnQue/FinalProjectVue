<template>
  <div id="app">
    <div class="container">
      <router-link to="/attention">공지사항</router-link>&nbsp;
      <router-link to="/map">부동산</router-link>&nbsp;
      <router-link to="/qna">QnA</router-link>&nbsp;
      <router-link to="/healthcenter">선별진료소</router-link>&nbsp;
      <router-link to="/safehospital">안심병원</router-link>&nbsp;
      <router-link to="/pollution">환경 정보</router-link>&nbsp;
      <router-link to="/interested">관심구역</router-link>&nbsp;
      <h2 class="text-center" style="margin-bottom: 30px">
        Vue를 이용한 게시판
      </h2>
      <router-view />
    </div>
  </div>
</template>

<style>
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
