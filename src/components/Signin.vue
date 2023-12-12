<template>
    <div class="container" style="margin-top: 10%">
        <div class="row justify-content-center">
            <div class="col-6">
                <form method="POST" @submit.prevent="signin()">
                    <div class="form-group mb-3">
                        <label class="form-label">ელ.ფოსტა</label>
                        <input type="email" name="email" id="email" v-model="email" class="form-control" placeholder="ელ.ფოსტა">
                    </div>
                    <div class="form-group mb-3">
                        <label class="form-label">პაროლი</label>
                        <input type="password" name="password" id="password" v-model="password" class="form-control" placeholder="პაროლი">
                    </div>
                    <div class="form-group d-grid">
                        <input type="submit" class="btn btn-success" value="შესვლა">
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name : "Sign_in",

        data() {
            return {
                email : "",
                password : ""
            }
        },

        methods : {
            signin() {
                const thi_s = this;

                axios.post("/signin", {
                    email : this.email,
                    password : this.password
                }).then(function(response) {
                    window.localStorage.setItem("user", JSON.stringify(response.data));

                    thi_s.$router.push("/home");
                }).catch(function(err) {
                    console.log(err);
                });
            }
        },

        mounted() {
            document.title = "სისტემაში შესვლა";

            const thi_s = this;

            const data = window.localStorage.getItem("user");

            if(JSON.parse(data)) {
                thi_s.$router.push("/home");
            }else {
                thi_s.$router.push("/signin");
            }
        }
    }
</script>