<template>
  <section id="index_section">
    <div class="card col-sm-12 mt-1" style="min-height: 550px;">
      <div class="card-body" style="width: 60%; margin: 0 auto;">
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
          <tr
            class="text-center"
            v-for="(attention, idx) in attentions"
            :key="idx"
          >
            <td>{{ attention.no }}</td>
            <td>
              <router-link
                :to="{ name: 'AttentionDetail', params: { no: attention.no } }"
                >{{ attention.title }}</router-link
              >
            </td>
            <td>{{ attention.writer }}</td>
            <td>{{ convertToDate(attention.date) }}</td>
          </tr>
        </table>

        <div class="text-right">
          <router-link class="btn btn--primary" to="/attentionRegist"
            >등록</router-link
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import http from '../attention-common';
import moment from 'moment';
export default {
  name: 'AttentionList',
  data() {
    return {
      attentions: [],
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
      .then(res => (this.attentions = res.data))
      .catch(err => console.log(err));
  },
};
</script>

<style>
td {
  height: 30px;
}
</style>
