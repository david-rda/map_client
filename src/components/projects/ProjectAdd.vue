<template>
    <div>
        <!-- <div class="container-fluid"> -->
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container">
                    <router-link to="/home" class="navbar-brand"><img src="../../assets/images/rda-logo-t.88318a3d.png" width="120px" /></router-link>

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

            <div class="container">
                <div class="row justify-content-center mt-5">
                    <div class="col-md-6 col-12">
                        <form method="POST" @submit.prevent="addProject()">
                            <div class="row">
                                <div class="col-md-12 col-12">
                                    <div class="form-group mb-3">
                                        <input type="text" placeholder="პროექტის დასახელება" class="form-control" v-model="project_name">
                                    </div>
                                    <div class="form-group d-grid">
                                        <input type="submit" value="დამატება">
                                    </div>
                                </div>
                            </div>

                            <div class="alert alert-success mt-3" v-if="message == '1'">
                                <strong>პროექტი დაემატა</strong>
                            </div>

                            <div class="alert alert-danger mt-3" v-if="message == '0'">
                                <strong>პროექტი ვერ დაემატა</strong>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        <!-- </div> -->
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name : "ProjectAdd",

        data() {
            return {
                project_name : "",
                message : ""
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

            addProject() {
                const token = JSON.parse(window.localStorage.getItem("user")).token;
                const thi_s = this;

                axios.post("/project/add", {
                    project_name : thi_s.project_name
                }, {
                    headers : {
                        "Authorization" : "Bearer " + token
                    }
                }).then(function() {
                    thi_s.message = '1';
                    thi_s.project_name = "";

                    setTimeout(() => {
                        thi_s.message = "";
                    }, 3000);
                }).catch(function() {
                    thi_s.message = '0';

                    setTimeout(() => {
                        thi_s.message = "";
                    }, 3000);
                });
            }
        },

        mounted() {
            const data = window.localStorage.getItem("user");
            const thi_s = this;
            
            if(JSON.parse(data)) {
                thi_s.$router.push({ path: "/add/project"});
            }else {
                thi_s.$router.push({ path : "/signin"});
            }
        }
    }
</script>