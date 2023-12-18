<template>
    <div>
        <!-- <div class="container-fluid"> -->
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container">
                    <router-link to="/home" class="navbar-brand"><img src="../assets/images/rda-logo-t.88318a3d.png" width="120px" /></router-link>

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
                        <form method="POST" @submit.prevent="addEnterprise()">
                            <div class="row">
                                <div class="col-md-6 col-12">
                                    <div class="form-group">
                                        <input type="text" placeholder="გრძედი" class="form-control" v-model="longitude">
                                    </div>
                                </div>
                                <div class="col-md-6 col-12">
                                    <div class="form-group">
                                        <input type="text" placeholder="განედი" class="form-control" v-model="latitude">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group mb-3">
                                <input type="text" placeholder="საწარმოს დასახელება" class="form-control" v-model="enterprise_name">
                            </div>
                            <div class="form-group mb-3">
                                <input type="text" placeholder="ლოკაციის დასახელება" class="form-control" v-model="location_name">
                            </div>

                            <div class="form-group mb-3">
                                <input type="text" placeholder="დარგი" class="form-control" v-model="enterprise_field">
                            </div>

                            <div class="form-group mb-3">
                                <input type="file" class="form-control" id="files" @change="handleFileUpload" multiple />
                            </div>

                            <div class="form-group d-grid">
                                <input type="submit" class="btn btn-success" value="საწარმოს დამატება">
                            </div>

                            <div class="alert alert-success mt-3" v-if="message == '1'">
                                <strong>საწარმო დაემატა</strong>
                            </div>

                            <div class="alert alert-danger mt-3" v-if="message == '0'">
                                <strong>საწარმო ვერ დაემატა</strong>
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
        name : "AddEnterprise",

        data() {
            return {
                enterprise_name : "",
                enterprise_field : "",
                location_name : "",
                longitude : "",
                latitude : "",
                message : "",

                selectedFiles: [],
            }
        },

        methods : {
            handleFileUpload(event) {
                this.selectedFiles = Array.from(event.target.files);
            },

            signout() {
                const thi_s = this;
                axios.post("/signout").then(function() {
                    window.localStorage.clear();

                    thi_s.$router.push({ path : "/signin"});
                }).catch(function(err) {
                    console.log(err);
                });
            },

            addEnterprise() {
                const token = JSON.parse(window.localStorage.getItem("user")).token;

                const this_ = this;

                const formData = new FormData();

                formData.append("enterprise_name", this.enterprise_name);
                formData.append("enterprise_field", this.enterprise_field);
                formData.append("location_name", this.location_name);
                formData.append("longitude", this.longitude);
                formData.append("latitude", this.latitude);

                for (let i = 0; i < this.selectedFiles.length; i++) {
                    formData.append('files[' + i + ']', this.selectedFiles[i]);
                }

                axios.post("/enterprise/add", formData, {
                    headers : {
                        "Authorization" : "Bearer " + token
                    }
                }).then(function() {
                    this_.enterprise_name = "";
                    this_.enterprise_field = "";
                    this_.location_name = "";
                    this_.longitude = "";
                    this_.latitude = "";

                    this_.selectedFiles = null;

                    this_.message = '1';

                    setTimeout(() => {
                        this_.message = "";
                    }, 3000);
                }).catch(function() {
                    this_.message = '0';

                    setTimeout(() => {
                        this_.message = "";
                    }, 3000);
                });
            }
        },

        mounted() {
            const data = window.localStorage.getItem("user");
            const thi_s = this;
            
            if(JSON.parse(data)) {
                thi_s.$router.push({ path: "/add"});
            }else {
                thi_s.$router.push({ path : "/signin"});
            }
        }
    }
</script>