<template>
  <div class="map" ref="mapDivRef">
      <iframe width="100%" height="800" src="https://api.maptiler.com/maps/streets/?key=IPNOrN33WdSIcUWzPDpY#5.1/15.78552/-76.27484"></iframe>
  </div>
</template>

<script>
// import { ref, onBeforeMount} from 'vue'
export default {
    // setup(){
    //     const map = ref(null)
    //     console.log(map)

    //     const mapDivRef = ref(null)

    //     onBeforeMount(() => {
    //         const key = process.env.VUE_APP_GOOGLEMAPS_KEY;

    //         const googleMapScript = document.createElement("SCRIPT");

    //         googleMapScript.setAttribute(
    //             "src",
    //             `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`
    //         );
    //         googleMapScript.setAttribute("defer", "")
    //         googleMapScript.setAttribute("async", "")
    //         document.head.appendChild(googleMapScript);
    //     })

    //     window.initMap = () => {
    //         map.value = new window.goo
    //                } 

    //     return {
    //         mapDivRef
    //     }
    // }

}
</script>

<style>
.map{
    width: 100%;
    height: 300px !important;
    background: azure;
}
</style>