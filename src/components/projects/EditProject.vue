<template>
    <div>
        <!-- <div class="container-fluid"> -->
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container">
                    <router-link to="/home" class="navbar-brand"><img src="../../assets/img/rda-logo-t.88318a3d.png" width="120px" /></router-link>

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
                        <form method="POST" @submit.prevent="editProject()">
                            <div class="row">
                                <div class="col-md-12 col-12">
                                    <div class="form-group mb-3">
                                        <label><b>პროექტის დასახელება</b></label>
                                        <input type="text" placeholder="პროექტის დასახელება" class="form-control" v-model="project_name">
                                    </div>
                                    <div class="form-group mb-3">
                                        <input type="file" class="form-control" id="files" @change="handleFileUpload" />
                                    </div>
                                    <ul class="list-group mb-2 overflow-auto" v-if="img">
                                        <li class="list-group-item d-flex justify-content-between overflow-auto">
                                            <div>
                                                <img :src="'data:image/png;base64,' + img" width="80px" height="80px" class="img-thumbnail">
                                            </div>
                                            <button type="button" class="btn btn-danger" :data-id="this.$route.params.id" v-on:click="deleteIcon($event)">წაშლა</button>
                                        </li>
                                    </ul>
                                    <div class="form-group d-grid">
                                        <input type="submit" value="დარედაქტირება">
                                    </div>
                                </div>
                            </div>

                            <div class="alert alert-success mt-3" v-if="message == '1'">
                                <strong>პროექტი დარედაქტირდა</strong>
                            </div>

                            <div class="alert alert-danger mt-3" v-if="message == '0'">
                                <strong>პროექტი ვერ დარედაქტირდა</strong>
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
        name : "ProjectEdit",

        data() {
            return {
                project_name : "",
                message : "",
                selectedFile : "",
                img : ""
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

            handleFileUpload(event) {
                this.selectedFile = event.target.files[0];
            },

            deleteIcon(event) {
                const id = event.target.getAttribute("data-id");
                const thi_s = this;

                axios.get("/project/delete/icon/" + id, {
                    headers : {
                        "Authorization" : "Bearer " + JSON.parse(window.localStorage.getItem("user")).token
                    }
                }).then(function(res) {
                    thi_s.img = res.data.image;
                }).catch(function(err) {
                    console.log(err);
                });
            },

            editProject() {
                const token = JSON.parse(window.localStorage.getItem("user")).token;
                const thi_s = this;

                const formData = new FormData();

                formData.append("project_name", thi_s.project_name);
                formData.append("file", thi_s.selectedFile);

                axios.post("/project/edit/" + this.$route.params.id, formData, {
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
            document.title = "პროექტის რედაქტირება";

            const data = window.localStorage.getItem("user");
            const thi_s = this;
            
            if(JSON.parse(data)) {
                thi_s.$router.push({ path: "/edit/project/" + this.$route.params.id});
            }else {
                thi_s.$router.push({ path : "/signin"});
            }

            // პროექტის მონაცემების წამოღება API-დან რათა მათი ველებში ჩაწერა მოხდეს დასარედაქტირებლად
            axios.get("/project/get/" + thi_s.$route.params.id, {
                headers : {
                    "Authorization" : "Bearer " + JSON.parse(data).token
                }
            }).then(function(res) {
                thi_s.project_name = res.data.project_name; // ფორმის ობიექტში ხდება პროექტის დასახელების შენახვა
                thi_s.img = res.data.image; // ფორმის ობიექტში ხდება პროექტის აიკონის შენახვა
            }).catch(function(err) {
                /**
                 * თუ პროექტის დარედაქტირება ვერ მოხერხდა და დაფიქსირდა შეცდომა, მაშინ
                 * კონსოლში დაიბეჭდება შესაბამისი შეტყობინება
                 */
                console.log(err);
            });
        }
    }
</script>