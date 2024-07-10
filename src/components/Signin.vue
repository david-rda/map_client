<template>
    <div class="container" style="margin-top: 5%">
        <div class="row justify-content-center">
            <div class="col-lg-6 col-md-6 col-xs-12 col-sm-12">
                <div class="header-logo">
                    <img src="../assets/img/rda-logo-t.88318a3d.png" />
                </div>

                <form method="POST" @submit.prevent="signin()">
                    <div class="form-group mb-3">
                        <label class="mb-0" for="email"><strong>ელ.ფოსტა</strong></label>
                        <input type="email" name="email" id="email" v-model="email" class="form-control" placeholder="ელ.ფოსტა">
                    </div>
                    <div class="form-group mb-3">
                        <label class="mb-0" for="password"><strong>პაროლი</strong></label>
                        <input type="password" name="password" id="password" v-model="password" class="form-control" placeholder="პაროლი">
                    </div>
                    <div class="form-group d-grid">
                        <input type="submit" class="btn btn-success" value="შესვლა">
                    </div>
                </form>
            </div>
        </div>

        <p class="disabled text-center text-muted mt-3" style="user-select:none">©&nbsp;2023&nbsp; - <span ref="year"></span>&nbsp;Created&nbsp;by&nbsp;<strong>RDA</strong>&nbsp;IT&nbsp;team</p>
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

                if(this.email.length == 0 || this.email == "") {
                    this.$swal({
                        title : "ელ. ფოსტა აუცილებელია",
                        icon : "warning",
                        timerProgressBar: true,
                        timer : 3000,
                        toast : true,
                        position : "top-end"
                    });

                }else if(this.password.length == 0 || this.password == "") {
                    this.$swal({
                        title : "პაროლი აუცილებელია",
                        icon : "warning",
                        timerProgressBar: true,
                        timer : 3000,
                        toast : true,
                        position : "top-end"
                    });
                }else {
                    axios.post("/signin", {
                        email : this.email,
                        password : this.password
                    }).then(function(response) {
                        window.localStorage.setItem("user", JSON.stringify(response.data));

                        thi_s.$router.push("/home");
                    }).catch(function() {
                        thi_s.$swal({
                            title : "პაროლი ან ელ.ფოსტა არასწორია",
                            icon : "warning",
                            timerProgressBar: true,
                            timer : 3000,
                            toast : true,
                            position : "top-end"
                        });
                    });
                }
            }
        },

        mounted() {
            document.title = "სისტემაში შესვლა";

            const thi_s = this;

            this.$refs.year.innerHTML = new Date().getFullYear();

            const data = window.localStorage.getItem("user");

            if(JSON.parse(data)) {
                thi_s.$router.push("/home");
            }else {
                thi_s.$router.push("/signin");
            }
        }
    }
</script>