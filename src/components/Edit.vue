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
                                <router-link to="/add" class="nav-link">საწარმოს დამატება</router-link>
                            </li>
                        </ul>

                        <ul class="navbar-nav ms-auto">
                            <button type="button" @click="signout()" class="btn btn-danger">გასვლა</button>
                        </ul>
                    </div>
                </div>
            </nav>

            <div class="container mb-5">
                <div class="row justify-content-center mt-5">
                    <div class="col-md-6 col-12">
                        <form method="POST" @submit.prevent="editEnterprise()">
                            <div class="row">
                                <div class="col-md-6 col-12">
                                    <div class="form-group">
                                        <input type="text" placeholder="გრძედი" class="form-control" v-model="this.longitude">
                                    </div>
                                </div>
                                <div class="col-md-6 col-12">
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

                            <ul class="list-group mb-2 overflow-auto">
                                <li class="list-group-item d-flex justify-content-between overflow-auto" v-for="data in this.photos" :key="data.id">
                                    <div>
                                        <img :src="'http://localhost:8000/images/' + data.name" data-bs-toggle="modal" data-bs-target="#mymodal" :data-path="data.name" v-on:click="expandImage($event)" class="img-thumbnail" style="width:50px;height:50px;cursor:pointer">
                                        <span class="ms-1">{{ data.name }}</span>
                                    </div>

                                    <button type="button" :data-id="data.id" class="btn btn-danger" @click="deletePhoto($event)">წაშლა</button>
                                </li>
                            </ul>

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

            <div class="modal fade" id="mymodal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            <img :src="'http://localhost:8000/images/' + this.zoomed_path" class="w-100" />
                        </div>
                    </div>
                </div>
            </div>
        <!-- </div> -->
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name : "EditEnterprise",

        data() {
            return {
                enterprise_name : "", // მოცემულ ცვლადში შეინახება საწარმოს დასახელება
                enterprise_field : "", // მოცემულ ცვლადში შეინახება საწარმოს საქმიანობის სფერო/დარგი
                location_name : "", // მოცემულ ცვლადში შეინახება თუ სად მდებარეობს საწარმო
                longitude : "", // მოცემულ ცვლადში შეინახება საწარმოს კოორდინატი - განედი
                latitude : "", // მოცემულ ცვლადში შეინახება საწარმოს კოორდინატი - გრძედი
                selectedFiles: [], // მოცემულ ცვლადში შეინახება საწარმოზე მიმაგრებული სურათების ობიექტები

                photos : [],

                message : "", // მოცემულ ცვლადში შეინახება მნიშვნელობა, როლის მიხედვითაც მოხდება შეტყობინების გამოტანა
                // დარედაქტირდა თუ ვერა საწარმოს მონაცემები

                zoomed_path : "" // მოცემულ ცვლადში შეინახება იმ სურათის დასახელება, რომელზეც მოხდება ხდომილება
            }
        },

        methods : {
            // მოცემული მეთოდის დახმარებით ხდება ატვირთული ფაილების ობიექტების შენახვა selectedFiles ცვლადში
            handleFileUpload(event) {
                this.selectedFiles = Array.from(event.target.files);
            },

            // მოცემული მეთოდის დახმარებით ხდება სისტემიდან გამოსვლა
            signout() {
                const thi_s = this;
                
                // კონკრეტულ მისამართზე გაიგზავნე ა მოთხოვნა და API მოახდენს მომხმარებლის სისტემიდან გამოსვლას
                axios.post("/signout").then(function() {
                    window.localStorage.clear(); // localstorage საცავის გასუფთავება შენახული მონაცემებისგან

                    thi_s.$router.push({ path : "/signin"}); // გადამისამართება ავტორიცაზიის გვერდზე
                }).catch(function(err) {
                    /**
                     * თუ სისტემიდან გამოსვლა ვერ მოხერხდა და დაფიქსირდა შეცდომა, მაშინ
                     * კონსოლში დაიბეჭდება შესაბამისი შეტყობინება
                     */
                    console.log(err);
                });
            },

            // მოცემული მეთოდის დახმარებით ხდება ფოტოს წაშლა, რომლის მოთხოვნაც გაიგზავნება API-ზე
            deletePhoto(event) {
                const token = JSON.parse(window.localStorage.getItem("user")).token // ავტორიზირებული მომხმარებლის ტოკენი

                // ამ ცვლადში შეინახება იმ ფოტოს აიდი, რომლის წაშლის ღილაკზეც მოხდება დაკლიკება
                const id = event.target.getAttribute("data-id");

                const thi_s = this;

                // API-ზე მოხდება მოთხოვნის გაგზავნა, რომელიც მოახდენს ფოტოს წაშლას ბაზიდან
                axios.delete("/enterprise/delete/photo/" + id + "/" + this.$route.params.id, {
                    headers : {
                        "Authorization" : "Bearer " + token
                    }
                }).then(function(response) {
                    /**
                     * თუ ფოტო წაიშალა დააბრუნებს განახლებულ რაოდენობას ფოტოებისას
                     * კონკრეტული საწარმოსთვის და შეინახება მონაცემები photos ცვლადში
                     */
                    thi_s.photos = response.data.data.photos;
                }).catch(err => {
                    /**
                     * თუ ფოტოს წაშლა ვერ მოხერხდა და დაფიქსირდა შეცდომა, მაშინ
                     * კონსოლში დაიბეჭდება შესაბამისი შეტყობინება
                     */
                    console.log(err);
                });
            },

            // ფოტოს გადიდებისათვის საჭირო მეთოდი
            expandImage(event) {
                // მოცემულ ცვლადში შეინახება იმ ფოტოს დასახელება, რომელზეც მოხდება დაკლიკება
                const path = event.target.getAttribute("data-path");

                this.zoomed_path = path; // zoomed_path ცვლადში კი მოხდება სახელის შენახვა
            },

            // მოცემული მეთოდის საშუალებით მოხდება საწარმოს დარედაქტირება
            editEnterprise() {
                const token = JSON.parse(window.localStorage.getItem("user")).token; // ავტორიზირებული მომხმარებლის ტოკენი

                const this_ = this;

                const formData = new FormData(); // ფორმის ობიექტი, რომელშიც შეინახება ველებში შეყვანილი ინფორმაციები

                formData.append("enterprise_name", this.enterprise_name); // ფორმის ობიექტში ხდება საწარმოს სახელის შენახვა
                formData.append("enterprise_field", this.enterprise_field); // ფორმის ობიექტში ხდება საწარმოს დარგის შენახვა
                formData.append("location_name", this.location_name); // ფორმის ობიექტში ხდება საწარმოს ადგილმდებარეობის
                formData.append("longitude", this.longitude); // ფორმის ობიექტში ხდება საწარმოს კოორდინატი - გრძედის შენახვა
                formData.append("latitude", this.latitude); // ფორმის ობიექტში ხდება საწარმოს კოორდინატი - განედის შენახვა
                
                // ფორბის ობიექტში ხდება ცვლადში შენახული ფაილების შენახვა
                for (let i = 0; i < this.selectedFiles.length; i++) {
                    formData.append('files[' + i + ']', this.selectedFiles[i]);
                }

                // API-ზე მოხდება მოთხოვნის გაგზავნა, რათა მოხდეს მონაცემთა დადასტურება და შეცვლა ბაზაში
                axios.post("/enterprise/edit/" + this.$route.params.id, formData, {
                    headers : {
                        "Authorization" : "Bearer " + token
                    }
                }).then(function() {
                    this_.message = '1'; // თუ 1 შეინახება ცვლადში გამოჩნდება დადებითი შეტყობინება

                    // 3 წამის შემდეგ კი ცვლადი გასუფთავდება, რათა შეტყობინება გაითიშოს
                    setTimeout(() => {
                        this_.message = "";
                    }, 3000);
                }).catch(function(err) {
                    console.log(err);
                    this_.message = '0'; // თუ  შეინახება ცვლადში გამოჩნდება უარყოფითი შეტყობინება
                    
                    // 3 წამის შემდეგ კი ცვლადი გასუფთავდება, რათა შეტყობინება გაითიშოს
                    setTimeout(() => {
                        this_.message = "";
                    }, 3000);
                });
            }
        },

        mounted() {
            const data = window.localStorage.getItem("user"); // ავტორიზირებული მომხმარებლის მონაცემების წამოღება localstorage-დან
            const thi_s = this;

            const token = JSON.parse(window.localStorage.getItem("user")).token; // ავტორიზირებული მომხმარებლის ტოკენი
            
            // თუ ნამდვილად აქვს გავლილი ავტორიზაცია მომხმარებელს და მონაცემების შენახულია
            if(JSON.parse(data)) {
                thi_s.$router.push({ path: "/edit/" + thi_s.$route.params.id}); // დარჩება ამავე გვერდზე
            }else {
                thi_s.$router.push({ path : "/signin"}); // თუ არადა გადამისამართდება ავტორიზაციის გვერდზე
            }

            // საწარმოს მონაცემების წამოღება API-დან რათა მათი ველებში ჩაწერა მოხდეს დასარედაქტირებლად
            axios.get("/enterprise/get/" + thi_s.$route.params.id, {
                headers : {
                    "Authorization" : "Bearer " + token
                }
            }).then(function(res) {
                thi_s.enterprise_name = res.data.enterprise_name; // ფორმის ობიექტში ხდება საწარმოს დასახელების სენახვა
                thi_s.enterprise_field = res.data.enterprise_field; // ფორმის ობიექტში ხდება საწარმოს საქმიანობის სფეროს შენახვა
                thi_s.location_name = res.data.location_name; // ფორმის ობიექტში ხდება საწარმოს ადგილმდებარეობის შენახვა
                thi_s.longitude = res.data.longitude; // ფორმის ობიექტში ხდება საწარმოს კოორდინატი - გრძედის შენახვა 
                thi_s.latitude = res.data.latitude; // ფორმის ობიექტში ხდება საწარმოს კოორდინატი - განედის შენახვა  
                thi_s.photos = res.data.photos; // ფორმის ობიექტში ხდება საწარმოს ფოტოების შენახვა
            }).catch(function(err) {
                /**
                 * თუ საწარმოს დარედაქტირება ვერ მოხერხდა და დაფიქსირდა შეცდომა, მაშინ
                 * კონსოლში დაიბეჭდება შესაბამისი შეტყობინება
                 */
                console.log(err);
            });
        }
    }
</script>