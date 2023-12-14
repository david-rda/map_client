import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import VueSweetalert2 from "vue-sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

axios.defaults.baseURL = "http://localhost:8000/api";

import router from './routes'

const app = createApp(App);
app.use(router);
app.use(VueSweetalert2);
app.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyBbHGTnPUR-q_fGTh2WjmapbMUwoefFPDE',
    },
});

app.mount('#app')