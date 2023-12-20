<template>
  <div>
    <div ref="map" style="height: 96vh;"></div>

    <button type="button" class="btn btn-light position-absolute top-0 start-0 m-2" data-bs-toggle="offcanvas" data-bs-target="#offcanvas">
        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 18L20 18" stroke="#000" stroke-width="2" stroke-linecap="round"/>
            <path d="M4 12L20 12" stroke="#000" stroke-width="2" stroke-linecap="round"/>
            <path d="M4 6L20 6" stroke="#000" stroke-width="2" stroke-linecap="round"/>
        </svg>
    </button>

    <div class="offcanvas offcanvas-start" id="offcanvas">
        <div class="offcanvas-header">
            <h4 class="offcanvas-title">პროექტები</h4>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>

        <div class="offcanvas-body">
            <ul class="list-unstyled d-grid">
                <li class="btn btn-light text-align-start m-2" v-for="data in projects" :data-id="data.id" :key="data.id" @click="getCoordsByProjects($event)">
                    {{ data.project_name }}
                </li>
                <div class="row justify-content-center">
                    <span class="spinner spinner-border text-muted" v-if="this.show_spinner"></span>
                </div>
            </ul>
        </div>
    </div>

    <div class="position-fixed z-2 top-0 end-0" style="margin-right:70px;margin-top:10px">
        <input type="search" placeholder="საწარმოს ძებნა..." class="form-control search" style="width:300px" @keyup="searchEnterprise($event)">

        <div class="bg-white p-2 mt-1" v-if="this.showsearch == 1" id="search_block" style="width:300px;cursor:pointer">
            <div class="border rounded p-1 mb-1 overflow-auto" style="max-height:300px" v-for="data in this.search_data" :data-longitude="data.longitude" :data-latitude="data.latitude" :key="data.id" @click="getCoords($event)">
                <p class="text-success m-0" style="font-size: 13px;pointer-events:none">{{ data.enterprise_name }}</p>
                <p class="text-muted m-0" style="font-size: 13px;pointer-events:none">{{ data.location_name }}</p>
            </div>
        </div>
    </div>

    <div class="bg-success vw-100" style="height:4vh" id="bottom">
        <div class="container">
            <div class="d-flex float-start">
                <a href="https://mepa.gov.ge" class="text-white nav-link d-inline-block" style="font-size: 12px">MEPA.GOV.GE</a>
                <a href="https://www.facebook.com/MEPAGeorgia" class="text-white ms-3 nav-link d-inline-block" style="font-size: 12px">MEPA - facebook</a>
                <a href="https://www.facebook.com/rda.gov.ge" class="text-white ms-3 nav-link d-inline-block" style="font-size: 12px">RDA - facebook</a>
            </div>

            <div class="d-flex float-end" id="texts">
                <span class="nav-link d-inline-block" style="font-size: 12px">
                    <a href="tel:1501" class="text-white text-decoration-none">ცხელი ხაზი - 1501</a>
                </span>
                <span class="nav-link d-inline-block ms-3" style="font-size: 12px">
                    <a href="mailto:info@rda.gov.ge" class="text-white text-decoration-none">info@rda.gov.ge</a>
                </span>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name : "MyMap",

        data() {
            return {
                locations: [],
                search_data : [],
                showsearch : 0,
                show_spinner : false,

                projects : []
            };
        },

        mounted() {
            this.fetchLocations();

            const thi_s = this;

            axios.get("/project/list", {
                headers : {
                    "Authorization" : "Bearer " + JSON.parse(window.localStorage.getItem("user")).token
                }
            }).then(function(response) {
                thi_s.projects = response.data;
            }).catch(function(err) {
                console.log(err);
            });
        },
        
        methods: {
            async fetchLocations() {
                try {
                    const response = await axios.get('/enterprise/list');

                    this.locations = response.data;

                    console.log(this.locations);

                    this.initializeMap();

                } catch (error) {
                    console.error(error);
                }
            },

            async searchEnterprise(event) {
                const thi_s = this;

                if(event.target.value == 0) {
                    this.showsearch = 0;

                    try {
                        const response = await axios.get('/enterprise/list');

                        this.locations = response.data;

                        console.log(this.locations);

                        this.initializeMap();

                    } catch (error) {
                        console.error(error);
                    }
                }

                axios.post("/enterprise/search", { value : event.target.value }).then(function(response) {
                    thi_s.search_data = response.data;
                    thi_s.showsearch = 1;
                }).catch(function(err) {
                    console.log(err);
                    thi_s.showsearch = 0;
                })
            },

            getCoordsByProjects(event) {
                const thi_s = this;

                this.show_spinner = true;

                axios.get("/enterprise/get/by/project/" + event.target.getAttribute("data-id"), {
                    headers : {
                        "Authorization" : "Bearer " + JSON.parse(window.localStorage.getItem("user")).token
                    }
                }).then(function(response) {
                    thi_s.locations = response.data;
                }).catch(function(err) {
                    console.log(err);
                });

                window.setTimeout(() => {
                    this.initializeMap();
                    thi_s.show_spinner = false;
                }, 2000);
            },

            getCoords(event) {
                const latitude = parseFloat(event.target.getAttribute("data-latitude"));
                const longitude = parseFloat(event.target.getAttribute("data-longitude"));

                const infoWindow = new window.google.maps.InfoWindow();

                const map = new window.google.maps.Map(this.$refs.map, {
                    center: { lat: latitude, lng: longitude },
                    zoom: 15
                });

                const marker = new window.google.maps.Marker({
                    position: { lat: latitude, lng: longitude },
                    map: map,
                    title: this.search_data.enterprise_name,
                    icon : {
                        url : (this.search_data[0].projects.length > 1) ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    },
                });

                const images = this.search_data[0].photos.map((photo, index) => {
                        const isActive = index === 0 ? 'active' : '';
                        return `<div class="carousel-item ${isActive}">
                                    <img src="http://localhost:8000/images/${photo.name}" class="d-block " style="height:200px"/>
                                </div>`;
                    }).join('');

                const indicators = this.search_data[0].photos.map((photo, index) => {
                    const isActive = index === 0 ? 'active' : '';
                    return `<button type="button" data-bs-target="#carouselExample" data-bs-slide-to="${index}" class="${isActive}" aria-current="${isActive ? 'true' : 'false'}" aria-label="Slide ${index + 1}"></button>`;
                }).join('');

                const projects = this.search_data[0].projects.map((item) => {
                        return `<span>${'-- ' + item.project_name}</span><br>`;
                    }).join('');

                const contentString = `
                    <div style='padding:6px;max-width:300px' id='bl'>
                        <div id="carouselExample" class="carousel slide mb-1">
                            <div class="carousel-indicators">
                                ${indicators}
                            </div>
                            <div class="carousel-inner">
                                ${images}
                            </div>

                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon"></span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                                <span class="carousel-control-next-icon"></span>
                            </button>
                        </div>
                        <p class='text-success'>${this.search_data[0].enterprise_name}</p>
                        <p><span style='font-weight:bold'>დარგი:&nbsp;</span> ${this.search_data[0].enterprise_field}</p>
                        <p>${this.search_data[0].location_name}</p>
                        <p><span style='font-weight:bold'>პროგრამები/პროექტები:</span><br>${projects}</p>
                    </div>
                `;

                marker.addListener('click', () => {
                    infoWindow.setContent(contentString);
                    infoWindow.open(map, marker);
                });
            },

            initializeMap() {
                const map = new window.google.maps.Map(this.$refs.map, {
                    center: {
                        lat: 42, lng: 43
                    },

                    zoom: 8
                });

                const infoWindow = new window.google.maps.InfoWindow();
                
                this.locations.forEach(location => {
                    const marker = new window.google.maps.Marker({
                        position: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
                        map,
                        title: location.enterprise_name,
                        icon : {
                            url : (location.projects.length > 1) ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        },
                    });

                    const images = location.photos.map((photo, index) => {
                        const isActive = index === 0 ? 'active' : '';
                        return `<div class="carousel-item ${isActive}">
                                    <img src="http://localhost:8000/images/${photo.name}" class="d-block " style="height:200px"/>
                                </div>`;
                    }).join('');

                    const projects = location.projects.map((item) => {
                        return `<span>${'-- ' + item.project_name}</span><br>`;
                    }).join('');

                    const indicators = location.photos.map((photo, index) => {
                        const isActive = index === 0 ? 'active' : '';
                        return `<button type="button" data-bs-target="#carouselExample" data-bs-slide-to="${index}" class="${isActive}" aria-current="${isActive ? 'true' : 'false'}" aria-label="Slide ${index + 1}"></button>`;
                    }).join('');

                    const contentString = `
                        <div style='padding:6px;max-width:300px' id='bl'>
                            <div id="carouselExample" class="carousel slide mb-1">
                                <div class="carousel-indicators">
                                    ${indicators}
                                </div>
                                <div class="carousel-inner">
                                    ${images}
                                </div>

                                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon"></span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                                    <span class="carousel-control-next-icon"></span>
                                </button>
                            </div>
                            <p class='text-success'>${location.enterprise_name}</p>
                            <p><span style='font-weight:bold'>დარგი:&nbsp;</span> ${location.enterprise_field}</p>
                            <p>${location.location_name}</p>
                            <p><span style='font-weight:bold'>პროგრამები/პროექტები:</span><br>${projects}</p>
                        </div>
                    `;

                    marker.addListener('click', () => {
                        infoWindow.setContent(contentString);
                        infoWindow.open(map, marker);
                    });
                });
            }
        }
    };
</script>

<style scoped>
    @media screen and (max-width: 768px) {
        #texts {
            float: left !important;
        }
    }

    @media screen and (min-width: 768px) {
        #bottom {
            padding: 6px;
        }
    }

    .custom-link {
        cursor: pointer;
    }

    .custom-link:hover {
        background: gray !important;
    }
</style>