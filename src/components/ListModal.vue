<template id="modal-template">
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div
          class="modal-container"
          style="max-height: 700px; overflow-y: auto"
        >
          <div class="modal-header">
            <slot name="header">
              <h2>상세정보</h2>
            </slot>
          </div>
          <div v-for="(row, index) in data" :key="index">
            <div class="modal-body" @click="showRealEstate(row)">
              <slot name="body">
                <div v-for="(value, key, idx) in row" :key="idx">
                  <strong>{{ key }}</strong> : {{ value }}
                </div>
              </slot>
            </div>
            <hr />
          </div>
          <slot name="footer">
            <button
              class="modal-default-button btn btn--primary"
              @click="$emit('close')"
            >
              OK
            </button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import axios from 'axios';
export default {
  props: {
    data: Array,
    realestates: [],
    realestate: {
      시스템등록번호: '',
      시군구코드: '',
      법정동코드: '',
      자치구명: '',
      법정도명: '',
      지번구분: '',
      본번: '',
      부번: '',
      주소: '',
      중개업등록번호: '',
      중개업자명: '',
      사업자상호: '',
      전화번호: '',
      상태구분: '',
      도로명코드: '',
      건물: '',
      건물본번: '',
      건물부번: '',
    },
  },
  data() {
    return {};
  },
  methods: {
    showRealEstate(row) {
      axios
        .get(
          `http://openapi.seoul.go.kr:8088/774f4b6e5076616c3130357974536b4e/json/landBizInfo/1/200/`,
        )
        .then(res => {
          let count = 0;
          for (var i = 0; i < res.data['landBizInfo']['row'].length; i++) {
            var cur = res.data['landBizInfo']['row'][i];
            if (row.법정동 == cur['BJDONG_NM']) {
              count++;
              alert(
                '부동산명 : ' +
                  cur['CMP_NM'] +
                  '\n' +
                  '공인중개사 : ' +
                  cur['RDEALER_NM'] +
                  '\n' +
                  '주소 : ' +
                  cur['ADDRESS'] +
                  '\n' +
                  '전화번호 : 02-' +
                  cur['TELNO'] +
                  '\n',
              );
              if (confirm('부동산에 연결할까요?')) {
                axios
                  .get('https://maps.googleapis.com/maps/api/geocode/json', {
                    params: {
                      key: 'AIzaSyCTQIlxBn5AfKGvsfJiormAE1esN3fcCkg',
                      address: cur['ADDRESS'],
                    },
                  })
                  .then(res => {
                    let tempLat = res.data.results[0].geometry.location.lat;
                    let tempLng = res.data.results[0].geometry.location.lng;
                    var win = window.open(
                      `http://maps.google.com/maps?q=${cur['BJDONG_NM']}+${cur['CMP_NM']}&ll=${tempLat},${tempLng}`,
                      '_blank',
                    );
                    win.focus();
                  });
              }
              break;
            }
          }
          if (count === 0) alert('근처에 연결된 공인중개사가 없습니다!');
        });
    },
  },
};
</script>
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.modal-body:hover {
  background: #4263eb;
  cursor: pointer;
  color: white;
  transition: all 0.5s ease-out;
}
</style>
