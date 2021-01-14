<template>
  <v-data-table
    :headers="headers"
    :items="floorInformationlist"
    :items-per-page="15"
    height="400px"
    item-key="name"
    class="elevation-1"
    :footer-props="{
      showFirstLastPage: true,
      firstIcon: 'mdi-arrow-collapse-left',
      lastIcon: 'mdi-arrow-collapse-right',
      prevIcon: 'mdi-minus',
      nextIcon: 'mdi-plus',
      'items-per-page-text': $t('dataTabelPerPageTextSeat'),
    }"
  ></v-data-table>
</template>

<script>
import { eventBus } from "../main.js";

export default {
  name: "FlowInformationTable",
  data() {
    return {
      allFloorList: null,
      allSeatMap: null,

      currentSelectedFloorId: null,
      allFloorIdList: [],

      latestFloorSeatList: this.$store.state.getStore.latestFloorSeatList,
      otherFloorSeatMap: this.$store.state.getStore.otherFloorsSeatMap,

      floorInformationlist: [],

      headers: [
        { text: this.$i18n.t("headersDivision"), value: "name" },
        { text: this.$i18n.t("headersNumberOfSeat"), value: "number" },
      ],

      floorSeatsNumber: 0,
      floorVacantSeatsNumber: 0,
    };
  },
  created() {
    this.allSeatMap = new Map();

    //층 변할때 그 층에 맞는 현황표 보여주기 위함
    eventBus.$on("pushSelectedFloorObject", (floorObject) => {
      if (floorObject) {
        this.currentSelectedFloorId = floorObject.floorId;
        this.getFloorInformation();
      } else {
        this.currentSelectedFloorId = null;
      }
    });

    //현황표 변경되었을때
    eventBus.$on("pushAllSeatMap", (allSeatMap) => {
      //console.log(allSeatMap);
      this.allSeatMap = allSeatMap;
      if (this.allSeatMap.size === 0) {
        this.initFloorInformation();
      } else {
        this.getFloorInformation();
      }
    });

    if (
      this.$store.state.getStore.allFloor &&
      this.$store.state.getStore.allFloor.length
    ) {
      let currentFloorObject = this.$store.state.getStore.allFloor[
        this.$store.state.getStore.allFloor.length - 1
      ];
      this.currentSelectedFloorId = currentFloorObject.floorId;

      this.allFloorList = this.$store.state.getStore.allFloor;

      for (let i = 0; i < this.allFloorList.length; i++) {
        this.allFloorIdList.push(this.allFloorList[i].floorId);
      }
    }

    if (this.latestFloorSeatList && this.latestFloorSeatList.length) {
      let newSeatsList = this.latestFloorSeatList;
      let floorId = this.currentSelectedFloorId;
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
  },
  beforeDestroy() {
    eventBus.$off("pushSelectedFloorObject");
    eventBus.$off("pushAllSeatMap");
  },
  mounted() {
    this.getFloorInformation();
  },
  methods: {
    initFloorInformation() {
      this.floorInformationlist = [];

      let floordata = {};
      floordata.name = this.$i18n.t("textAllSeat");
      floordata.number = 0;
      this.floorInformationlist.push(floordata);

      floordata = {};
      floordata.name = this.$i18n.t("textEmptySeat");
      floordata.number = 0;
      this.floorInformationlist.push(floordata);
    },
    getFloorInformation() {
      this.floorInformationlist = [];
      let departmentList = [];

      if (this.allSeatMap && this.currentSelectedFloorId) {
        if (this.allSeatMap.get(this.currentSelectedFloorId)) {
          this.floorSeatsNumber = 0;
          this.floorVacantSeatsNumber = 0;
          if (this.allSeatMap.get(this.currentSelectedFloorId).length > 0) {
            let floorSeatList = this.allSeatMap.get(this.currentSelectedFloorId);
            let floorSeatsLength = floorSeatList.length;
            let floorVacantSeatsLength = 0;

            let department = [];
            let employeeDepartmentMap = new Map();

            if (floorSeatsLength > 0) {
              for (let i = 0; i < floorSeatList.length; i++) {
                if (floorSeatList[i].employeeId == null) {
                  //공석 자리
                  floorVacantSeatsLength++;
                } else {
                  //매핑된 자리
                  if (
                    !employeeDepartmentMap.get(
                      floorSeatList[i].employeeDepartment
                    )
                  ) {
                    let employees = [];
                    employeeDepartmentMap.set(
                      floorSeatList[i].employeeDepartment,
                      employees
                    );
                  }
                  employeeDepartmentMap
                    .get(floorSeatList[i].employeeDepartment)
                    .push(floorSeatList[i].employeeId);
                }
              }

              let keys = [];
              keys = Array.from(employeeDepartmentMap.keys());

              for (let i = 0; i < keys.length; i++) {
                let floordata = {};
                floordata.name = keys[i];
                floordata.number = employeeDepartmentMap.get(keys[i]).length;
                departmentList.push(floordata);
              }
            }
            this.floorSeatsNumber = floorSeatsLength;
            this.floorVacantSeatsNumber = floorVacantSeatsLength;
          }
        }
      }
      let floordata = {};
      floordata.name = this.$i18n.t("textAllSeat");
      floordata.number = this.floorSeatsNumber;
      this.floorInformationlist.push(floordata);

      floordata = {};
      floordata.name = this.$i18n.t("textEmptySeat");
      floordata.number = this.floorVacantSeatsNumber;
      this.floorInformationlist.push(floordata);

      if (departmentList.length > 0) {
        for (let i = 0; i < departmentList.length; i++) {
          this.floorInformationlist.push(departmentList[i]);
        }
      }
    },
  },
};
</script>
