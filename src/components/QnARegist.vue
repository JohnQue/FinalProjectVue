<template>
  <div>
    <label for="작성자">작성자</label>
    <input
      type="text"
      placeholder="작성자를 입력하세요"
      class="form-control"
      v-model="qna.writer"
    />
    <label for="제목">제목</label>
    <input
      type="text"
      placeholder="제목을 입력하세요"
      class="form-control"
      v-model="qna.title"
    />
    <label for="내용">내용</label>
    <textarea
      placeholder="내용을 입력하세요"
      class="form-control"
      v-model="qna.content"
    ></textarea>
    <div class="text-right" style="margin-top: 30px;">
      <button
        v-if="qna.no === 0"
        v-on:click="register"
        class="btn btn-primary"
        style="margin-right: 10px"
      >
        등록
      </button>
      <button
        v-else
        v-on:click="update"
        class="btn btn-primary"
        style="margin-right: 10px"
      >
        수정
      </button>
      <router-link to="/board" class="btn btn-primary">목록</router-link>
    </div>
  </div>
</template>

<script>
import http from '../qna-common';
export default {
  name: 'QnARegist',
  data() {
    return {
      qna: {
        no: 0,
        writer: '',
        title: '',
        content: '',
        date: '',
      },
    };
  },
  methods: {
    register() {
      http
        .post('/addQnA', {
          writer: this.qna.writer,
          title: this.qna.title,
          content: this.qna.content,
        })
        .then(() => {
          alert('등록이 완료되었습니다!');
          this.$router.push('/qna');
        })
        .catch(err => console.log(err));
    },
    update() {
      http
        .put('/updateQnA', {
          no: this.qna.no,
          writer: this.qna.writer,
          title: this.qna.title,
          content: this.qna.content,
        })
        .then(() => {
          alert('완료되었습니다!');
          this.$router.push('/qna');
        })
        .catch(err => console.log(err));
    },
  },
  created() {
    if (this.$route.params.no) {
      http
        .get('/findQnAByNo/'+this.$route.params.no)
        .then(res => {
          this.qna = res.data;
        })
        .catch(err => console.log(err));
    }
  },
};
</script>

<style></style>
