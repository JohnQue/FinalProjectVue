<template>
  <section id="index_section">
    <div class="card col-sm-12 mt-1" style="min-height: 550px;">
      <div v-cloak class="card-body" style="width: 100%; margin: 0 auto;">
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
          <router-link class="btn btn--primary" to="/attention"
            >목록</router-link
          >
          <span v-if="getUserId === attention.writer">
            <router-link
              class="btn btn--primary"
              :to="{
                name: 'updateAttention',
                params: { no: attention.no ? attention.no : 0 },
              }"
              >수정</router-link
            >
            <button class="btn btn--primary" @click="deleteBoardByNo">
              삭제
            </button>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
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
  computed: {
    ...mapGetters(['getUserId']),
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
