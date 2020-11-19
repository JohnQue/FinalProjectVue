import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/map',
    name: 'MapIndex',
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/MapIndex.vue'),
  },
  {
    path: '/qna',
    name: 'QnA',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/QnAList.vue'),
  },
  {
    path: '/qnaDetail/:no',
    name: 'QnADetail',
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/QnADetail.vue'),
  },
  {
    path: '/qnaRegist',
    name: 'QnARegist',
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/QnARegist.vue'),
  },
  {
    path: '/qnaRegist/:no',
    name: 'update',
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/QnARegist.vue'),
  },
  {
    path: '/healthcenter',
    name: 'healthcenter',
    component: () =>
      import(
        /* webpackChunkName: "about" */ '../components/MapHealthCenter.vue'
      ),
  },
  {
    path: '/safehospital',
    name: 'safehospital',
    component: () =>
      import(
        /* webpackChunkName: "about" */ '../components/MapSafeHospital.vue'
      ),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
