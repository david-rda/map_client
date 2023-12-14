<template>
  <div>
    <div ref="map" style="height: 96vh;"></div>

    <div class="position-fixed z-2 top-0 end-0" style="margin-right:70px;margin-top:10px">
        <input type="search" placeholder="საწარმოს ძებნა..." class="form-control" style="width:300px" @keyup="searchEnterprise($event)">

        <div class="bg-white p-2 mt-1" v-if="this.showsearch == 1" id="search_block" style="width:300px;cursor:pointer">
            <div class="border rounded p-1" v-for="data in this.search_data" :data-longitude="data.longitude" :data-latitude="data.latitude" :key="data.id" @click="getCoords($event)">
                <p class="text-success m-0" style="font-size: 13px;pointer-events:none">{{ data.enterprise_name }}</p>
                <p class="text-muted m-0" style="font-size: 13px;pointer-events:none">{{ data.location_name }}</p>
            </div>
        </div>
    </div>

    <div class="bg-success p-2 vw-100" style="height: 4vh;">
        <div class="container" style="height: 100%;">
            <div class="d-flex float-start">
                <a href="https://mepa.gov.ge" class="text-white nav-link d-inline-block" style="font-size: 12px">MEPA.GOV.GE</a>
                <a href="https://www.facebook.com/MEPAGeorgia" class="text-white ms-3 nav-link d-inline-block" style="font-size: 12px">MEPA - facebook</a>
                <a href="https://www.facebook.com/rda.gov.ge" class="text-white ms-3 nav-link d-inline-block" style="font-size: 12px">RDA - facebook</a>
            </div>

            <div class="d-flex float-end" id="texts">
                <span class="text-white nav-link d-inline-block" style="font-size: 12px">ცხელი ხაზი - 1501</span>
                <span class="text-white nav-link d-inline-block ms-3" style="font-size: 12px">info@rda.gov.ge</span>
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
                showsearch : 0
            };
        },

        mounted() {
            this.fetchLocations();
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
                }

                axios.post("/enterprise/search", { value : event.target.value }).then(function(response) {
                    thi_s.search_data = response.data;
                    thi_s.showsearch = 1;
                }).catch(function(err) {
                    console.log(err);
                    thi_s.showsearch = 0;
                })
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
                    title: this.search_data.enterprise_name
                });

                const images = this.search_data[0].photos.map((photo, index) => {
                        const isActive = index === 0 ? 'active' : '';
                        return `<div class="carousel-item ${isActive}">
                                    <img src="http://localhost:8000/images/${photo.name}" class="d-block " style="height:200px"/>
                                </div>`;
                    }).join('');

                const indicators = this.search_data[0].photos.map((photo, index) => {
                    const isActive = index === 0 ? 'active' : ''; // Set the first indicator as active
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
                        <p class='text-success'>${this.search_data[0].enterprise_name}</p>
                        <p><span style='font-weight:bold'>დარგი:&nbsp;</span> ${this.search_data[0].enterprise_field}</p>
                        <p>${this.search_data[0].location_name}</p>
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
                        title: location.enterprise_name
                    });

                    const images = location.photos.map((photo, index) => {
                        const isActive = index === 0 ? 'active' : '';
                        return `<div class="carousel-item ${isActive}">
                                    <img src="http://localhost:8000/images/${photo.name}" class="d-block " style="height:200px"/>
                                </div>`;
                    }).join('');

                    const indicators = location.photos.map((photo, index) => {
                        const isActive = index === 0 ? 'active' : ''; // Set the first indicator as active
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
</style>