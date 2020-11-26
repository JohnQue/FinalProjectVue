<template>
  <section id="index_section">
    <div class="card col-sm-12 mt-1" style="min-height: 550px;">
      <div class="card-body" style="width: 60%; margin: 0 auto;">
        <div>
          <label for="제목">제목</label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            class="form-control"
            v-model="attention.title"
          />
          <label for="내용">내용</label>
          <textarea
            placeholder="내용을 입력하세요"
            class="form-control"
            v-model="attention.content"
          ></textarea>
          <div class="text-right" style="margin-top: 30px;">
            <button
              v-if="attention.no === 0"
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
            <router-link to="/attention" class="btn btn--primary"
              >목록</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import http from '../attention-common';
export default {
  name: 'AttentionRegist',
  data() {
    return {
      attention: {
        no: 0,
        writer: '',
        title: '',
        content: '',
        date: '',
      },
    };
  },
  computed: {
    ...mapGetters(['getAccessToken', 'getUserId', 'getUserName']),
  },
  methods: {
    register() {
      http
        .post('/', {
          writer: this.getUserId,
          title: this.attention.title,
          content: this.attention.content,
        })
        .then(() => {
          alert('등록이 완료되었습니다!');
          this.$router.push('/attention');
        })
        .catch(err => console.log(err));
    },
    update() {
      http
        .put('/', {
          no: this.attention.no,
          writer: this.attention.writer,
          title: this.attention.title,
          content: this.attention.content,
        })
        .then(() => {
          alert('완료되었습니다!');
          this.$router.push('/attention');
        })
        .catch(err => console.log(err));
    },
  },
  created() {
    if (this.$route.params.no) {
      http
        .get(`/${this.$route.params.no}`)
        .then(res => {
          this.attention = res.data;
        })
        .catch(err => console.log(err));
    }
  },
};
</script>

<style></style>
