<template>
  <div v-cloak>
    <table
      class="table table-bordered"
      style="width: 60%; margin: 0 auto; margin-bottom: 30px;"
    >
      <colgroup>
        <col width="15%" />
        <col width="56%" />
      </colgroup>
      <tr>
        <th>번호</th>
        <td>{{ attention.no }}</td>
      </tr>
      <tr>
        <th>제목</th>
        <td>{{ attention.title }}</td>
      </tr>
      <tr>
        <th>작성자</th>
        <td>{{ attention.writer }}</td>
      </tr>
      <tr>
        <th>날짜</th>
        <td>{{ convertToDate(attention.date) }}</td>
      </tr>
      <tr>
        <td colspan="2">{{ attention.content }}</td>
      </tr>
    </table>

    <div class="text-center">
      <router-link class="btn btn-primary" to="/attention">목록</router-link>
      <router-link
        class="btn btn-primary"
        :to="{
          name: 'updateAttention',
          params: { no: attention.no ? attention.no : 0 },
        }"
        >수정</router-link
      >
      <button class="btn btn-primary" @click="deleteBoardByNo">삭제</button>
    </div>
  </div>
</template>

<script>
import http from '../attention-common';
import moment from 'moment';
export default {
  name: 'AttentionDetail',
  data() {
    return {
      attention: {},
    };
  },
  methods: {
    convertToDate(date) {
      return moment(date).format('YY년 MM월 DD일 HH:mm');
    },
    deleteBoardByNo() {
      if (confirm('정말로 삭제하시겠습니까?')) {
        http.delete(`/${this.$route.params.no}`).then(() => {
          alert('삭제가 완료되었습니다.');
          this.$router.push('/attention');
        });
      }
    },
  },
  created() {
    http
      .get(`/${this.$route.params.no}`)
      .then(res => {
        this.attention = res.data;
      })
      .catch(err => console.log(err));
  },
};
</script>

<style>
.btn {
  margin-left: 5px;
}
[v-cloak] {
  display: none;
}
</style>
