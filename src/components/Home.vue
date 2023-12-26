<template>
    <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container">
                <router-link to="/home" class="navbar-brand"><img src="../assets/img/rda-logo-t.88318a3d.png" width="120px" /></router-link>

                <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="nav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <router-link to="/add" class="ms-1 btn btn-success rounded-pill">საწარმოს დამატება</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/add/project" class="ms-1 btn btn-success rounded-pill">პროექტის დამატება</router-link>
                        </li>
                    </ul>

                    <ul class="navbar-nav ms-auto">
                        <button type="button" @click="signout()" class="btn btn-danger">გასვლა</button>
                    </ul>
                </div>
            </div>
        </nav>
        
        <div class="container mt-5">
            <div class="d-flex justify-content-center">
                <div class="w-25 btn-group">
                    <button type="button" :class="this.switch === 1 ? 'btn btn-success' : 'btn btn-outline-success'" v-on:click="chooseEnterprise">საწარმოები</button>
                    <button type="button" :class="this.switch === 2 ? 'btn btn-success' : 'btn btn-outline-success'" v-on:click="chooseProject">პროექტები</button>
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <span class="spinner spinner-border mt-5" v-show="loading"></span>
            </div>
        </div>

        <div id="app" class="container mt-5 table-responsive" v-show="!loading">
            <table class="table" v-if="this.switch === 1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>საწარმოს დასახელება</th>
                        <th>დარგი</th>
                        <th>ლოკაციის დასახელება</th>
                        <th>გრძედი</th>
                        <th>განედი</th>
                        <th class="text-center">ქმედება</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in data" :key="index">
                        <th>{{ item.id }}</th>
                        <td>{{ item.enterprise_name }}</td>
                        <td>{{ item.enterprise_field }}</td>
                        <td>{{ item.location_name }}</td>
                        <td>{{ item.longitude }}</td>
                        <td>{{ item.latitude }}</td>
                        <td class="text-center">
                            <div class="btn-group">
                                <router-link :to="'/edit/' + item.id" class="btn btn-primary">რედაქტირება</router-link>
                                <button type="button" class="btn btn-danger" :data-id="item.id" @click="deleteEnterprise($event)">წაშლა</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table class="table" v-if="this.switch === 2">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>პროექტის დასახელება</th>
                        <th class="text-center">ქმედება</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in project_data" :key="index">
                        <th>{{ item.id }}</th>
                        <td>{{ item.project_name }}</td>
                        <td class="text-center">
                            <div class="btn-group">
                                <router-link :to="'/edit/project/' + item.id" class="btn btn-primary">რედაქტირება</router-link>
                                <button type="button" class="btn btn-danger" :data-id="item.id" @click="deleteProject($event)">წაშლა</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name : "HomePage",

        data() {
            return {
                data : [],

                project_data : [],

                switch : 1,

                loading : 1
            }
        },

        methods : {
            signout() {
                const thi_s = this;
                axios.post("/signout").then(function() {
                    window.localStorage.clear();

                    thi_s.$router.push({ path : "/signin"});
                }).catch(function(err) {
                    console.log(err);
                });
            },

            chooseEnterprise() {
                this.switch = 1;
            },

            chooseProject() {
                this.switch = 2;
            },

            deleteEnterprise(event) {
                const token = JSON.parse(window.localStorage.getItem("user")).token;

                const id = event.target.getAttribute("data-id");

                const thi_s = this;

                axios.get("/enterprise/delete/" + id, {
                    headers : {
                        "Authorization" : "Bearer " + token
                    }
                }).then(function(response) {
                    thi_s.data = response.data.data;
                }).catch(err => {
                    console.log(err);
                });
            },

            deleteProject(event) {
                const token = JSON.parse(window.localStorage.getItem("user")).token;

                const id = event.target.getAttribute("data-id");

                const thi_s = this;

                axios.get("/project/delete/" + id, {
                    headers : {
                        "Authorization" : "Bearer " + token
                    }
                }).then(function(response) {
                    thi_s.project_data = response.data.projects;
                }).catch(err => {
                    console.log(err);
                });
            },
        },

        mounted() {
            const data = window.localStorage.getItem("user");
            const thi_s = this;
            
            if(JSON.parse(data)) {
                thi_s.$router.push({ path: "/home"});
            }else {
                thi_s.$router.push({ path : "/signin"});
            }

            axios.get("/enterprise/list").then(function(res) {
                thi_s.data = res.data;
                thi_s.loading = 0;

                console.log(res.data)
            }).catch(function(Err) {
                console.log(Err);
            });

            axios.get("/project/list").then(function(res) {
                thi_s.project_data = res.data;

                console.log(res.data)
            }).catch(function(Err) {
                console.log(Err);
            });
        }
    }
</script>