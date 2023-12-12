<template>
  <div>
    <div ref="map" style="height: 100vh;"></div>

    <div class="bottom-panel bg-success position-absolute p-2 bottom-0 z-2 vw-100">
        <div class="container">
            <div class="d-flex float-start">
                <a href="https://mepa.gov.ge" class="text-white nav-link d-inline-block" style="font-size: 12px">MEPA.GOV.GE</a>
                <a href="https://www.facebook.com/MEPAGeorgia" class="text-white ms-3 nav-link d-inline-block" style="font-size: 12px">MEPA - facebook</a>
                <a href="https://www.facebook.com/rda.gov.ge" class="text-white ms-3 nav-link d-inline-block" style="font-size: 12px">RDA - facebook</a>
            </div>

            <div class="d-flex float-end">
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
                locations: []
            };
        },

        mounted() {
            this.fetchLocations();
        },
        
        methods: {
            async fetchLocations() {
                const token = JSON.parse(window.localStorage.getItem("user")).token;

                try {
                    const response = await axios.get('/enterprise/list', {
                        headers : {
                            "Authorization" : "Bearer " + token
                        }
                    });

                    this.locations = response.data;

                    console.log(this.locations);

                    this.initializeMap();

                } catch (error) {
                    console.error(error);
                }
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
                                    <img src="http://localhost:8000/images/${photo.name}" class="d-block " style="max-height:200px"/>
                                </div>`;
                    }).join('');

                    const indicators = location.photos.map((photo, index) => {
                        const isActive = index === 0 ? 'active' : ''; // Set the first indicator as active
                        return `<button type="button" data-bs-target="#carouselExample" data-bs-slide-to="${index}" class="${isActive}" aria-current="${isActive ? 'true' : 'false'}" aria-label="Slide ${index + 1}"></button>`;
                    }).join('');

                    const contentString = `
                        <div style='padding:6px;max-width:300px' id='bl'>
                            <div id="carouselExample" class="carousel slide">
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