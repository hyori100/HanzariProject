<template>
  <div>
    <v-card flat color="transparent">
      <v-row>
        <v-col cols="12" sm="6">
          <v-card-title
            ><v-icon large>domain</v-icon>
            <h3>{{ this.$t("textBuildingName") }}</h3></v-card-title
          ></v-col
        ><v-col cols="12" sm="6">
          <v-card-text>{{
            $store.state.buildingStore.building.buildingName
          }}</v-card-text></v-col
        ></v-row
      >
      <v-divider class="mx-4"></v-divider>
      <v-row>
        <v-col cols="12" sm="8">
          <v-card-title
            ><v-icon large>stairs</v-icon>
            <h3>{{ $t("selectFloor") }}</h3></v-card-title
          ></v-col
        ></v-row
      >
      <v-row style="overflow-y: scroll; height: 180px">
        <v-col
          v-for="floorObject of this.allFloorList"
          :key="floorObject.floorId"
          class="d-flex child-flex"
          cols="4"
        >
          <v-btn
            large
            @click="clickFloor(floorObject)"
            :style="{
              border: clickFloorIndexes.includes(floorObject.floorId)
                ? 'thick solid black'
                : '',
            }"
            ><h3>{{ floorObject.floorName }}</h3></v-btn
          >
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { eventBus } from "../main.js";
import "material-design-icons-iconfont/dist/material-design-icons.css";

export default {
  name: "ViewerManageFloors",
  data() {
    return {
      length: null,

      allFloorList: [],

      currentSelectedFloorObject: null,

      clickFloorIndexes: null,

      allSeatMap: null,

      latestFloorSeatList: this.$store.state.getStore.latestFloorSeatList,
      otherFloorSeatMap: this.$store.state.getStore.otherFloorsSeatMap,
    };
  },
  created() {
    this.allSeatMap = new Map();

    if (
      this.$store.state.getStore.allFloor &&
      this.$store.state.getStore.allFloor.length
    ) {
      this.currentSelectedFloorObject = this.$store.state.getStore.allFloor[
        this.$store.state.getStore.allFloor.length - 1
      ];
      this.allFloorList = this.$store.state.getStore.allFloor;
      this.length = this.$store.state.getStore.allFloor.length;
      this.clickFloorIndexes = this.currentSelectedFloorObject.floorId;
    }

    if (this.latestFloorSeatList && this.latestFloorSeatList.length) {
      let newSeatsList = this.latestFloorSeatList;
      let floorId = this.currentSelectedFloorObject.floorId;
      this.allSeatMap.set(floorId, newSeatsList);
    }

    if (this.otherFloorSeatMap && this.otherFloorSeatMap.size) {
      let keys = [];
      keys = Array.from(this.otherFloorSeatMap.keys());

      for (let i = 0; i < keys.length; i++) {
        let newSeatsList = this.otherFloorSeatMap.get(keys[i]);
        let floorId = keys[i];
        this.allSeatMap.set(floorId, newSeatsList);
      }
    }

    eventBus.$on("pushAllSeatMap", (allSeatMap) => {
      this.allSeatMap = allSeatMap;
    });

    eventBus.$on("pushFloorOfSeat", (floorId) => {
      for (let i = 0; i < this.allFloorList.length; i++) {
        if (floorId === this.allFloorList[i].floorId) {
          this.clickFloor(this.allFloorList[i]);
        }
      }
    });
  },
  beforeDestroy() {
    eventBus.$off("pushAllSeatMap");
    eventBus.$off("pushFloorOfSeat");
  },
  methods: {
    clickFloor(floorObject) {
      this.clickFloorIndexes = [];
      this.clickFloorIndexes.push(floorObject.floorId);

      this.currentSelectedFloorObject = floorObject;
      eventBus.$emit("pushSelectedFloorObject", floorObject);
      eventBus.$emit("sendFlowInformationTable", floorObject);
    },
  },
};
</script>
