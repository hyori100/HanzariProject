<template>
  <div>
    <v-toolbar color="black" dark> </v-toolbar>
    <v-tabs
      v-model="tab"
      background-color="black"
      dark
      height="65"
      horizontal
      grow
    >
      <v-tabs-slider color="blue"></v-tabs-slider>
      <v-tab v-for="item in items" :key="item.index">
        <v-icon large dark>{{ item.icon }}</v-icon></v-tab
      >
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item.index">
        <v-card flat>
          <v-card-text>
            <component
              v-bind:is="item.content"
              :eachEmployeeSeatMapToManageSearch="
                eachEmployeeSeatMapToManageSearch
              "
              :allFloorListToManageSeats="allFloorListToManageSeats"
              :selectedFloorObjectToManageSeats="
                selectedFloorObjectToManageSeats
              "
            ></component>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { eventBus } from "../main";
import ManageSeats from "@/components/ManageSeats.vue";
import ManageFloors from "@/components/ManageFloors.vue";
import ManageSearch from "@/components/ManageSearch.vue";

export default {
  components: {
    ManageSeats,
    ManageFloors,
    ManageSearch,
  },
  data() {
    return {
      tab: null,

      eachEmployeeSeatMapToManageSearch: null,
      allFloorListToManageSeats: null,
      selectedFloorObjectToManageSeats: null,

      items: [
        {
          icon: "stairs",
          title: this.$i18n.t("settingFloor"),
          index: 0,
          content: "ManageFloors",
        },
        {
          icon: "event_seat",
          title: this.$i18n.t("settingSeat"),
          index: 1,
          content: "ManageSeats",
        },
        {
          icon: "search",
          index: 2,
          title: this.$i18n.t("search"),
          content: "ManageSearch",
        },
      ],
    };
  },
  created() {
    //매핑된 사원 추가시 검색 탭으로 사원 맵 받기 위한 event
    eventBus.$on("pushEachEmployeeSeatMap", (eachEmployeeSeatMap) => {
      this.eachEmployeeSeatMapToManageSearch = eachEmployeeSeatMap;
    });
    //모든 층 객체를 가지고 있는 리스트를 받기 위한 event
    eventBus.$on("pushAllFloorList", (allFloorList) => {
      console.log(this.allFloorListToManageSeats);
      console.log(allFloorList);
      this.allFloorListToManageSeats = allFloorList;
    });
    //선택한 층에 대한 값 받아와서 층 전환하기 위한 event
    eventBus.$on("pushSelectedFloorObject", (floorObject) => {
      this.selectedFloorObjectToManageSeats = floorObject;
    });
  },
  beforeDestroy() {
    eventBus.$off("pushEachEmployeeSeatMap");
    eventBus.$off("pushAllFloorList");
    eventBus.$off("pushSelectedFloorObject");
  },
};
</script>
