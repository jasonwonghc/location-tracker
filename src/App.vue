<template>
  <div id="app">
    <LocationTracker v-model="items" :fields="fields"></LocationTracker>
  </div>
</template>

<script>
import LocationTracker from './components/LocationTracker.vue'

export default {
  name: 'App',
  components: {
    LocationTracker
  },
  data() {
    return {
      fields: [
        { key: "selectRow", label: "" },
        { key: "location", label: "Location", type: "text" },
        { key: "latitude", label: "Latitude", type: "number"},
        { key: "longitude", label: "Longitude", type: "number" },
        { key: "utc_offset_minutes", label: "Time Zone", type: "number" },
      ],
       items: []
    };
  }
}
</script>

<style>
#app {
  margin: 20px;
}
</style>
