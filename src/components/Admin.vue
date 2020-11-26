<template>
  <section id="index_section">
    <div class="card col-sm-12 mt-1" style="min-height: 550px;">
      <div class="card-body" style="width: 60%; margin: 0 auto;">
        <table class="table table-bordered">
          <colgroup>
            <col width="17%" />
            <col width="10%" />
            <col width="15%" />
            <col width="33%" />
            <col width="10%" />
            <col width="10%" />
          </colgroup>
          <tr class="text-center">
            <th>아이디</th>
            <th>이름</th>
            <th>전화</th>
            <th>이메일</th>
            <th>타입</th>
            <th>삭제</th>
          </tr>
          <tr class="text-center" v-for="(user, idx) in users" :key="idx">
            <td>{{ user.userid }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.userType }}</td>
            <td>
              <b-button class="btn btn--danger" @click="deleteUser(user.userid)"
                >삭제</b-button
              >
            </td>
          </tr>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Admin',
  data() {
    return {
      users: [],
    };
  },
  methods: {
    deleteUser(id) {
      if (confirm('정말 유저를 삭제하시겠습니까?')) {
        axios.delete(`http://localhost:8000/member/admin/${id}`).then(() => {
          alert('삭제가 완료되었습니다!');
          this.users = this.users.filter(user => user.userid !== id);
        });
      }
    },
  },
  created() {
    axios
      .get('http://localhost:8000/member/admin')
      .then(res => {
        this.users = res.data;
        console.log(res.data);
      })
      .catch(err => console.log(err));
  },
};
</script>

<style>
td {
  height: 30px;
}
</style>
