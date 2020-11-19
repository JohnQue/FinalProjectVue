<template>
  <div class="">
    <table class="table table-bordered">
      <colgroup>
        <col width="7%" />
        <col width="50%" />
        <col width="15%" />
        <col width="28%" />
      </colgroup>
      <tr class="text-center">
        <th>번호</th>
        <th>제목</th>
        <th>작성자</th>
        <th>날짜</th>
      </tr>
      <tr class="text-center" v-for="(qna, idx) in qnas" :key="idx">
        <td>{{ qna.no }}</td>
        <td>
          <router-link :to="{ name: 'QnADetail', params: { no: qna.no } }">{{
            qna.title
          }}</router-link>
        </td>
        <td>{{ qna.writer }}</td>
        <td>{{ convertToDate(qna.date) }}</td>
      </tr>
    </table>

    <div class="text-right">
      <router-link class="btn btn-primary" to="/qnaRegist">등록</router-link>
    </div>
  </div>
</template>

<script>
import http from '../qna-common';
import moment from 'moment';
export default {
  name: 'QnAList',
  data() {
    return {
      qnas: [],
    };
  },
  methods: {
    convertToDate(date) {
      return moment(date).format('YY년 MM월 DD일 HH:mm');
    },
  },
  created() {
    http
      .get('')
      .then(res => (this.qnas = res.data))
      .catch(err => console.log(err));
  },
};
</script>

<style></style>
