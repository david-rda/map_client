import { createRouter, createWebHistory } from 'vue-router';

import Sign_in from "../components/Signin";
import Home from "../components/Home";

const routes = [
  { path: '/signin', component: Sign_in },
  { path: '/home', component: Home },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

export default router;
