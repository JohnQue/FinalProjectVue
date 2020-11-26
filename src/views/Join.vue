<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col></b-col>
      <b-col cols="8">
        <b-card
          class="mt-3"
          header="회원가입"
          style="max-width: 40rem;"
          align="left"
        >
          <b-form>
            <b-form-group label="아이디:" label-for="userid">
              <b-form-input
                id="userid"
                v-model="user.userid"
                required
                placeholder="아이디 입력...."
              ></b-form-input>
            </b-form-group>
            <b-form-group label="비밀번호:" label-for="userpwd">
              <b-form-input
                type="password"
                id="userpwd"
                v-model="user.password"
                required
                placeholder="비밀번호 입력...."
              ></b-form-input>
            </b-form-group>
            <b-form-group label="비밀번호 확인:" label-for="usercheckpwd">
              <b-form-input
                type="password"
                id="userpwd"
                v-model="user.checkPassword"
                required
                placeholder="비밀번호 입력...."
              ></b-form-input>
            </b-form-group>
            <b-form-group label="이름:" label-for="username">
              <b-form-input
                type="text"
                id="username"
                v-model="user.name"
                required
                placeholder="이름 입력...."
              ></b-form-input>
            </b-form-group>
            <b-form-group label="핸드폰:" label-for="userphone">
              <b-form-input
                type="text"
                id="userphone"
                v-model="user.phone"
                required
                placeholder="핸드폰 번호 입력...."
              ></b-form-input>
            </b-form-group>
            <b-form-group label="이메일:" label-for="useremail">
              <b-form-input
                type="text"
                id="useremail"
                v-model="user.email"
                required
                placeholder="이메일 주소 입력...."
              ></b-form-input>
            </b-form-group>
            <b-button
              type="button"
              variant="primary"
              class="m-1 btn btn--primary"
              @click="join"
              >회원가입</b-button
            >
            <router-link class="btn btn--danger" to="/">취소</router-link>
          </b-form>
        </b-card>
      </b-col>
      <b-col></b-col>
    </b-row>
  </b-container>
</template>

<script>
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default {
  name: 'Join',
  data: function() {
    return {
      user: {
        userid: '',
        password: '',
        checkPassword: '',
        name: '',
        phone: '',
        email: '',
      },
      message: '',
    };
  },
  methods: {
    join: function() {
      // LOGIN 액션 실행
      // 서버와 통신(axios)을 해 토큰값을 얻어야 하므로 Actions를 호출.
      console.log(this.user);
      this.$store
        .dispatch('JOIN', this.user)
        .then(() => this.$router.replace('/'))
        .catch(({ message }) => (this.msg = message));
    },
  },
};
</script>

<style scope>
#login-div {
  text-align: center;
}
</style>
