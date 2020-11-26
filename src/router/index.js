import Vue from 'vue';
import Login from '../views/Login.vue';
import Join from '../views/Join.vue';
import Me from '../views/Me.vue';
import store from '../store';

import VueRouter from 'vue-router';

Vue.use(VueRouter);

// https://router.vuejs.org/kr/guide/advanced/navigation-guards.html
const requireAuth = () => (to, from, next) => {
  const nextRoute = to.path;

  if (store.getters.getAccessToken) {
    return next();
  } else next('/login' + nextRoute);
};

const routes = [
  {
    path: '/',
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
  },
  {
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
      import(
        /* webpackChunkName: "about" */ '../components/AttentionDetail.vue'
      ),
  },
  {
    path: '/attentionRegist',
    name: 'AttentionRegist',
    component: () =>
      import(
        /* webpackChunkName: "about" */ '../components/AttentionRegist.vue'
      ),
  },
  {
    path: '/attentionRegist/:no',
    name: 'updateAttention',
    component: () =>
      import(
        /* webpackChunkName: "about" */ '../components/AttentionRegist.vue'
      ),
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
      import(/* webpackChunkName: "about" */ '../components/MapPollution.vue'),
  },
  {
    path: '/interested',
    name: 'interested',
    component: () =>
      import(
        /* webpackChunkName: "about" */ '../components/InterestedArea.vue'
      ),
  },
  {
    path: '/propertypost',
    name: 'propertypost',
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/PropertyPost.vue'),
  },
  {
    path: '/realestate',
    name: 'realestate',
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/RealEstate.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/join',
    name: 'Join',
    component: Join,
  },
  {
    path: '/login/:nextRoute',
    name: 'LoginNextRoute',
    component: Login,
  },
  {
    path: '/me',
    name: 'Me',
    component: Me,
    beforeEnter: requireAuth(),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/Admin.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
