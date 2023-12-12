<template>
    <div>
        <div class="container-fluid">
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container">
                    <router-link to="/home" class="navbar-brand">მთავარი</router-link>

                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <router-link to="/add" class="nav-link">საწარმოს დამატება</router-link>
                        </li>
                    </ul>

                    <ul class="navbar-nav ms-auto">
                        <button type="button" @click="signout" class="btn btn-danger ms-auto">გასვლა</button>
                    </ul>
                </div>
            </nav>

            <div class="row justify-content-center mt-5">
                <div class="col-4">
                    <form method="POST" @submit.prevent="editEnterprise()">
                        <div class="row mb-3">
                            <div class="col-6">
                                <div class="form-group">
                                    <input type="text" placeholder="გრძედი" class="form-control" v-model="this.longitude">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <input type="text" placeholder="განედი" class="form-control" v-model="this.latitude">
                                </div>
                            </div>
                        </div>
                        <div class="form-group mb-3">
                            <input type="text" placeholder="საწარმოს დასახელება" class="form-control" v-model="this.enterprise_name">
                        </div>
                        <div class="form-group mb-3">
                            <input type="text" placeholder="ლოკაციის დასახელება" class="form-control" v-model="this.location_name">
                        </div>
                        <div class="form-group mb-3">
                            <input type="text" placeholder="დარგი" class="form-control" v-model="this.enterprise_field">
                        </div>
                        <div class="form-group mb-3">
                            <input type="file" class="form-control" id="files" @change="handleFileUpload" multiple />
                        </div>
                        <div class="form-group d-grid">
                            <input type="submit" class="btn btn-success" value="დარედაქტირება">
                        </div>

                        <div class="alert alert-success mt-3" v-if="message == '1'">
                            <strong>საწარმო დარედაქტირდა</strong>
                        </div>

                        <div class="alert alert-danger mt-3" v-if="message == '0'">
                            <strong>საწარმო ვერ დარედაქტირდა</strong>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name : "EditEnterprise",

        data() {
            return {
                enterprise_name : "",
                enterprise_field : "",
                location_name : "",
                longitude : "",
                latitude : "",
                selectedFiles: [],

                message : ""
            }
        },

        methods : {
            handleFileUpload(event) {
                this.selectedFiles = event.target.files;
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

            editEnterprise() {
                const formData = new FormData();

                formData.append("enterprise_name", this.enterprise_name);
                formData.append("enterprise_field", this.enterprise_field);
                formData.append("location_name", this.location_name);
                formData.append("longitude", this.longitude);
                formData.append("latitude", this.latitude);
                
                for (let i = 0; i < this.selectedFiles.length; i++) {
                    formData.append('files[' + i + ']', this.selectedFiles[i]);
                }

                const token = JSON.parse(window.localStorage.getItem("user")).token;

                const this_ = this;

                axios.put("/enterprise/edit/" + this.$route.params.id, formData, {
                    headers : {
                        "Authorization" : "Bearer " + token
                    }
                }).then(function() {
                    this_.message = '1';

                    setTimeout(() => {
                        this_.message = "";
                    }, 3000);
                }).catch(function(err) {
                    console.log(err);
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

            const token = JSON.parse(window.localStorage.getItem("user")).token;
            
            if(JSON.parse(data)) {
                thi_s.$router.push({ path: "/edit/" + thi_s.$route.params.id});
            }else {
                thi_s.$router.push({ path : "/signin"});
            }

            axios.get("/enterprise/get/" + thi_s.$route.params.id, {
                headers : {
                    "Authorization" : "Bearer " + token
                }
            }).then(function(res) {
                thi_s.enterprise_name = res.data.enterprise_name;
                thi_s.enterprise_field = res.data.enterprise_field;
                thi_s.location_name = res.data.location_name;
                thi_s.longitude = res.data.longitude;
                thi_s.latitude = res.data.latitude;
            }).catch(function(err) {
                console.log(err);
            });
        }
    }
</script>