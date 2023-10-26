<template>
  <div class="container">
    <b-row class="justify-content-md-center">
      <b-col cols="4"><b-button variant="success" id="getLocationBtn" @click="geolocate">Get Current Location</b-button></b-col>
      <b-col cols="6">
        <GmapAutocomplete class="auto-complete-input" placeholder="Enter location" 
          v-on:keyup.enter="onEnter" @place_changed='setPlace' :value="search"/>
      </b-col>

      <b-col><b-button variant="outline-primary" id="searchBtn" @click="addRowHandler">Search</b-button></b-col>
    </b-row>

    <div id="map">
      <GmapMap :center='center' :zoom='12' class="google-map">
        <GmapMarker :key="index" v-for="(m, index) in markers" :position="m.position" @click="center = m.position" />
      </GmapMap>
    </div>

    <div id="results">
      <div class="location-info">
        <b-row class="justify-content-md-center">
          <b-col>Time Zone: <span></span>{{searchInfo.timeZone}}</b-col>
          <b-col cols="8">Local Time: {{searchInfo.localTime}}</b-col>
        </b-row>
      </div>
      <div class="location-table">
        <div class="overflow-auto">
          <div class="action-container">
            <b-button variant="danger" @click="removeRowsHandler">Remove Selected</b-button>
          </div>
          <b-table id="location-tracker-table" class="b-table" 
            :current-page="currentPage" :items="tableItems" :fields="fields" :per-page="perPage"
            fixed>
            <template v-for="(field, index) in fields" #[`cell(${field.key})`]="data">
              <b-checkbox v-if="field.key === 'selectRow'" :checked="tableItems[data.index].isSelected" :key="index"
                @change="selectRowHandler(data)"></b-checkbox>
              <span :key="index" v-else-if="field.key === 'utc_offset_minutes'">{{ displayTimeZone(data.value) }}</span>
              <span :key="index" v-else>{{ data.value }}</span>
            </template>
          </b-table>

          <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" first-number last-number
            aria-controls="location-tracker-table"></b-pagination>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone';

export default {
  name: "LocationTracker",
  components: {},
  props: {
    value: Array,
    fields: Array
  },
  data() {
    return {
      //table data
      perPage: 10,
      currentPage: 1,
      tableItems: this.value.map(item => ({ ...item, isSelected: false })),

      //map data
      center: { lat: 45.508, lng: -73.587 },
      search: null,
      currentPlace: null,
      markers: [],
      places: [],
      searchInfo: {timeZone: '', localTime: ''}
    }
  },
  computed: {
    rows() {
      return this.tableItems.length
    }
  },
  methods: {
    //helper function
    displayTimeZone(data) {
      if(!data) return ''
      let result = 'UTC'

      if (data > 0) {
        result += '+' + Math.abs(data) / 60
      }
      else if (data < 0) {
        result += '-' + Math.abs(data) / 60
      }
      return result
    },
    displayLocalTIme(data){

      if(!data) return ''
      // Get current UTC time
      const currentUtcTime = moment.utc();

      // Calculate local time based on the given offset in minutes
      const localTime = currentUtcTime.clone().add(data, 'minutes');
      return localTime.format('YYYY-MM-DD HH:mm:ss');
    },
    //button handler
    onEnter() {
      this.addRowHandler()
    },
    addRowHandler() {
      if (!this.currentPlace) return
      const newRow = this.fields.reduce((a, c) => ({ ...a, [c.key]: null }), {})
      newRow.isSelected = false
      newRow.place_id = this.currentPlace.place_id
      newRow.location = this.currentPlace.formatted_address
      newRow.latitude = this.currentPlace.geometry.location.lat()
      newRow.longitude = this.currentPlace.geometry.location.lng()
      newRow.utc_offset_minutes = this.currentPlace.utc_offset_minutes
      this.tableItems.unshift(newRow);
      this.$emit('input', this.tableItems);

      this.addMarker();
    },
    removeRowsHandler() {
      const removed = this.tableItems.filter(item => !item.isSelected).map(x => x.place_id);
      this.markers = this.markers.filter(item => !removed.includes(item.place_id))
      this.tableItems = this.tableItems.filter(item => !item.isSelected);
      this.$emit('input', this.tableItems);
    },
    selectRowHandler(data) {
      this.tableItems[data.index].isSelected = !this.tableItems[data.index].isSelected;
    },
    //map control
    setPlace(place) {
      this.currentPlace = place;
    },
    addMarker() {
      if (this.currentPlace) {
        console.log(this.currentPlace)
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.markers.push({ place_id: this.currentPlace.place_id, position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;

        this.searchInfo.timeZone = this.displayTimeZone(this.currentPlace?.utc_offset_minutes)
        this.searchInfo.localTime = this.displayLocalTIme(this.currentPlace?.utc_offset_minutes)
        this.currentPlace = null;
        this.search = null;
      }
    },
    geolocate: function () {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
  },
  mounted() {
    this.geolocate();
  }
}
</script>

<style scoped>
/* Component-specific styles go here */
@import './LocationTracker.css';
</style>