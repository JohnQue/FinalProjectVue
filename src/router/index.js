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
    name: 'updateQnA',
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/QnARegist.vue'),
  },  {
    path: '/attention',
    name: 'Attention',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/AttentionList.vue'),
  },
  {
    path: '/attentionDetail/:no',
    name: 'AttentionDetail',
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/AttentionDetail.vue'),
  },
  {
    path: '/attentionRegist',
    name: 'AttentionRegist',
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/AttentionRegist.vue'),
  },
  {
    path: '/attentionRegist/:no',
    name: 'updateAttention',
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/AttentionRegist.vue'),
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
  {
    path: '/pollution',
    name: 'pollution',
    component: () =>
      import(
        /* webpackChunkName: "about" */ '../components/MapPollution.vue'
      ),
  },
  {
    path: '/interested',
    name: 'interested',
    component: () =>
      import(
        /* webpackChunkName: "about" */ '../components/InterestedArea.vue'
      ),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
