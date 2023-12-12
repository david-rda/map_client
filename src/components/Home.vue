<template>
    <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container">
                <router-link to="/home" class="navbar-brand">მთავარი</router-link>

                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link to="/add" class="nav-link">საწარმოს დამატება</router-link>
                    </li>
                </ul>

                <ul class="navbar-nav ms-auto">
                    <button type="button" @click="signout()" class="btn btn-danger ms-auto">გასვლა</button>
                </ul>
            </div>
        </nav>

        <div id="app" class="container mt-5">
            <table class="table">
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
                            <router-link :to="'/edit/' + item.id" class="btn btn-primary">რედაქტირება</router-link>
                            <button type="button" class="btn btn-danger ms-1" :data-id="item.id" @click="deleteEnterprise($event)">წაშლა</button>
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
                data : []
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

            deleteEnterprise(event) {
                const token = JSON.parse(window.localStorage.getItem("user")).token

                const id = event.target.getAttribute("data-id");

                const thi_s = this;

                axios.delete("/enterprise/delete/" + id, {
                    headers : {
                        "Authorization" : "Bearer " + token
                    }
                }).then(function(response) {
                    thi_s.data = response.data.data;
                }).catch(err => {
                    console.log(err);
                });
            },
        },

        mounted() {
            const data = window.localStorage.getItem("user");
            const thi_s = this;

            const token = JSON.parse(window.localStorage.getItem("user")).token;
            
            if(JSON.parse(data)) {
                thi_s.$router.push({ path: "/home"});
            }else {
                thi_s.$router.push({ path : "/signin"});
            }

            axios.get("/enterprise/list", {
                headers : {
                    "Authorization" : "Bearer " + token
                }
            }).then(function(res) {
                thi_s.data = res.data;

                console.log(res.data)
            }).catch(function(Err) {
                console.log(Err);
            });
        }
    }
</script>