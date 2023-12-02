// plugins/aos.client.ts
// @ts-ignore
import AOS from 'aos';
import 'aos/dist/aos.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.AOS = new AOS.init({});
});