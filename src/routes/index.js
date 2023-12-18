import { createRouter, createWebHistory } from 'vue-router';

import Sign_in from "../components/Signin";
import Add from "../components/Add";
import Home from "../components/Home";
import Edit from "../components/Edit";
import Map from "../components/Map";
import ProjectAdd from "../components/ProjectAdd";

const routes = [
  { path: '/signin', component: Sign_in },
  { path: '/add', component: Add },
  { path: '/home', component: Home },
  { path: '/edit/:id', component: Edit },
  { path: '/', component: Map },
  { path: '/add/project', component: ProjectAdd },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

export default router;
