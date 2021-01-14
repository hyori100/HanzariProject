<template>
  <div>
    <v-card flat color="transparent" v-if="!mappingEmployeeComponentStatus">
      <v-row>
        <v-col cols="12" sm="6">
          <v-card-title
            ><v-icon large>event_seat</v-icon>
            <h3>{{ this.$t("textMakeSeat") }}</h3></v-card-title
          ></v-col
        >
        <v-col cols="12" sm="3">
          <v-select
            :items="numberOfAddSeatItems"
            v-model="selectedNumberOfAddSeat"
            :label="$t('selectLabelNumberSeat')"
            single-line
            outlined
            @change="changeSelectedNumberOfAddSeat"
          ></v-select
        ></v-col>
        <v-col cols="12" sm="3">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-switch
                  v-model="addVacantSwitchStatus"
                  inset
                  @change="changeAddVacantSwitchStatus"
                ></v-switch>
              </div>
            </template>
            <span>{{ this.$t("tooltipAddSeatSwitch") }}</span>
          </v-tooltip></v-col
        >
      </v-row>

      <v-row>
        <v-col cols="10" sm="6">
          <v-card-text>
            <v-btn color="blue lighten-3" @click="getMappingEmployeeComponent"
              ><h4>
                <v-icon large>perm_identity</v-icon>{{ this.$t("btnMappingEmployee") }}
              </h4></v-btn
            ></v-card-text
          >
        </v-col>
        <v-col cols="10" sm="4">
          <v-card-text>
            <v-btn color="pink lighten-3" @click="clickChangeSeatToVacant"
              ><h4>
                <v-icon large>person_add_disabled</v-icon
                >{{ this.$t("btnChangeToVacant") }}
              </h4></v-btn
            ></v-card-text
          >
        </v-col>
      </v-row>
      <v-divider class="mx-4"></v-divider>

      <v-card-title
        ><v-icon large>stairs</v-icon>
        <h3>{{ this.$t("textChangeFloorSeat") }}</h3></v-card-title
      >
      <v-row>
        <v-col cols="9">
          <v-select
            :items="floorItems"
            :label="$t('selectLabelFloor')"
            :no-data-text="$t('selectNoDataFloor')"
            item-value="floorId"
            item-text="floorName"
            v-model="selectedFloorItemsId"
            chips
            deletable-chips
            single-line
            outlined
            dense
          ></v-select>
        </v-col>
        <v-col cols="12" sm="3">
          <v-icon large @click="changeFloorSeat">edit</v-icon></v-col
        >
      </v-row>
      <v-divider class="mx-4"></v-divider>

      <v-card-title
        ><v-icon large>corporate_fare</v-icon>
        <h3>{{ this.$t("textChangeBuildingSeat") }}</h3></v-card-title
      >
      <v-row>
        <v-col cols="9">
          <v-select
            :items="buildingItems"
            :label="$t('selectLabelBuilding')"
            :no-data-text="$t('selectNoDataBuilding')"
            v-model="selectedBuildingFloorItems"
            item-value="floorId"
            item-text="floorName"
            chips
            deletable-chips
            single-line
            outlined
            dense
          ></v-select>
        </v-col>
        <v-col cols="12" sm="3">
          <v-icon large @click="changeBuildingSeat">edit</v-icon></v-col
        >
      </v-row>
      <v-card-title>
        <v-icon large>event_seat</v-icon>
        {{ this.$t("contextMenuSeatSize") }}
      </v-card-title>
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field v-model="seatWidth" label="width"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model="seatHeight" label="height"></v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-icon large @click="clickSeatSizeBtn">edit</v-icon></v-col
        >
      </v-row>
    </v-card>

    <MappingEmployee v-if="mappingEmployeeComponentStatus" />
  </div>
</template>

<script>
import MappingEmployee from "@/components/MappingEmployee.vue";
import { eventBus } from "../main";
import axios from "axios";
import { refreshToken } from "@/refreshToken.js";

const HOST = "http://149.28.141.163:8080";

export default {
  name: "ManageSeats",
  components: {
    MappingEmployee,
  },
  props: ["allFloorListToManageSeats", "selectedFloorObjectToManageSeats"],
  data() {
    return {
      mappingEmployeeComponentStatus: false,

      floorItems: [],
      selectedFloorItemsId: null,

      buildingItems: [],
      buildingFloorItems: new Map(),
      selectedBuildingFloorItems: null,

      addVacantSwitchStatus: false,

      allFloorList: this.$store.state.getStore.allFloor,
      currentSelectedFloorObject: null,

      numberOfAddSeatItems: [],
      selectedNumberOfAddSeat: null,

      //자리 사이즈
      seatWidth: null,
      seatHeight: null,
    };
  },
  watch: {
    allFloorListToManageSeats: {
      // This will let Vue know to look inside the array
      deep: true,

      handler() {
        console.log("allFloorListToManageSeats changed!");
        this.allFloorList = this.allFloorListToManageSeats;
        if (!this.currentSelectedFloorObject) {
          this.currentSelectedFloorObject = this.allFloorList[
            this.allFloorList.length - 1
          ];
        }
        this.initFloorItems();
      },
    },
    selectedFloorObjectToManageSeats: {
      // This will let Vue know to look inside the array
      deep: true,

      handler() {
        console.log("selectedFloorObjectToManageSeats changed!");
        this.currentSelectedFloorObject = this.selectedFloorObjectToManageSeats;
        this.initFloorItems();
      },
    },
  },
  created() {
    // DB에 이미 있을 때 + 층 데이터 건들지 않음
    if (this.allFloorList && this.allFloorList.length) {
      this.currentSelectedFloorObject = this.allFloorList[this.allFloorList.length - 1];
    }

    // ManageSeats.vue 들어오기 전에 변화가 있을때(층 편집 관련)
    if (this.allFloorListToManageSeats) {
      this.allFloorList = this.allFloorListToManageSeats;
    }

    // ManageSeats.vue 들어오기 전에 현재층이 바뀌었을때(단순 층 이동)
    if (this.selectedFloorObjectToManageSeats) {
      this.currentSelectedFloorObject = this.selectedFloorObjectToManageSeats;
    }

    this.initNumberOfAddSeatItems();
    this.initFloorItems();
    this.initBuildingItems();

    eventBus.$on(
      "pushMappingEmployeeComponentStatus",
      (mappingEmployeeComponentStatus) => {
        this.mappingEmployeeComponentStatus = mappingEmployeeComponentStatus;
      }
    );
  },
  beforeDestroy() {
    eventBus.$off("pushMappingEmployeeComponentStatus");
  },
  methods: {
    initNumberOfAddSeatItems() {
      for (let i = 2; i < 100; i *= 2) {
        this.numberOfAddSeatItems.push(i);
      }

      //v-select에 초기값을 설정해주는 과정으로 v-select 선택하지않아도 초기값으로 AssignSeats 에게 이벤트를 보낸다.
      this.selectedNumberOfAddSeat = this.numberOfAddSeatItems[0];
      this.changeSelectedNumberOfAddSeat();
    },
    initFloorItems() {
      if (this.allFloorList) {
        this.floorItems = [];
        for (let i = 0; i < this.allFloorList.length; i++) {
          if (
            this.currentSelectedFloorObject.floorId === this.allFloorList[i].floorId //String
          ) {
            continue;
          }

          this.floorItems.push(this.allFloorList[i]);
        }
      }
    },
    //각 건물의 층을 get request 후 현재 건물을 제외하고 리스트를 초기화 시켜주는 함수
    async initBuildingItems() {
      let buildingList = this.$store.state.getStore.allBuildings;
      let response = null;
      let errorStatus = null;

      for (let i = 0; i < buildingList.length; i++) {
        if (
          buildingList[i].buildingId ===
          this.$store.state.buildingStore.building.buildingId
        ) {
          continue;
        }

        let allFloor = [];
        try {
          response = await axios
            .get(HOST + "/api/buildings/" + buildingList[i].buildingId + "/floors", {
              headers: { "X-AUTH-TOKEN": this.$store.state.userStore.token },
            })
            .catch((error) => {
              errorStatus = error.response.status;
              console.log("에러 상태 : " + errorStatus);
            });
        } catch (error) {
          console.log(error);
        }
        if (errorStatus === 401) {
          await refreshToken();
          response = await axios.get(
            HOST + "/api/buildings/" + buildingList[i].buildingId + "/floors",
            { headers: { "X-AUTH-TOKEN": this.$store.state.userStore.token } }
          );
        }
        for (let i = 0; i < response.data.length; i++) {
          let newFloorObject = {};
          newFloorObject.floorId = response.data[i].floor_id;
          newFloorObject.floorName = response.data[i].floor_name;
          newFloorObject.buildingId = response.data[i].building_id;
          newFloorObject.floorOrder = response.data[i].floor_order;
          newFloorObject.isObjFromDB = true;
          newFloorObject.httpRequestPostStatus = false;

          allFloor.push(newFloorObject);
        }

        allFloor.sort(function (a, b) {
          return a.floorOrder < b.floorOrder ? -1 : a.floorOrder > b.floorOrder ? 1 : 0;
        });

        let buildingObject = {};
        buildingObject.buildingName = buildingList[i].buildingName;
        buildingObject.allFloorList = allFloor;

        this.buildingFloorItems.set(buildingList[i].buildingId, buildingObject);
      }

      let keys = [];
      keys = Array.from(this.buildingFloorItems.keys());

      for (let i = 0; i < this.buildingFloorItems.size; i++) {
        this.buildingItems.push({
          header: this.buildingFloorItems.get(keys[i]).buildingName,
        });
        this.buildingFloorItems.get(keys[i]).allFloorList.forEach((floor) => {
          this.buildingItems.push(floor);
        });
        this.buildingItems.push({ divider: true });
      }
    },
    changeFloorSeat() {
      console.log(this.selectedFloorItemsId);
      if (this.selectedFloorItemsId) {
        eventBus.$emit("moveSeatToAnotherFloor", this.selectedFloorItemsId);
      } else {
        this.$notify({
          group: "notifyApp",
          type: "warn",
          duration: 5000,
          title: this.$i18n.t("alertNoSelectFloor"),
          ignoreDuplicates: true,
        });
        return;
      }
    },
    async isImage(buildingId, floorId) {
      let response = null;
      let errorStatus = null;
      let imgPath = null;
      try {
        response = await axios
          .get(HOST + "/api/buildings/" + buildingId + "/floors/" + floorId + "/images", {
            headers: {
              "X-AUTH-TOKEN": this.$store.state.userStore.token,
            },
            responseType: "arraybuffer",
          })
          .catch((error) => {
            errorStatus = error.response.status;
            console.log("에러 상태 : " + errorStatus);
          });
        if (errorStatus === 401) {
          await refreshToken();
          console.log("!!!새로 발급 받은 토큰 입니다!!!");
          response = await axios.get(
            HOST + "/api/buildings/" + buildingId + "/floors/" + floorId + "/images",
            {
              headers: {
                "X-AUTH-TOKEN": this.$store.state.userStore.token,
              },
              responseType: "arraybuffer",
            }
          );
        }
        imgPath = new Buffer(response.data, "binary").toString("base64");
      } catch (error) {
        console.log(error);
      }
      return imgPath;
    },
    async changeBuildingSeat() {
      if (this.selectedBuildingFloorItems) {
        let keys = [];
        keys = Array.from(this.buildingFloorItems.keys());

        let moveBuildingId = null;
        let moveBuildingName = null;
        let moveFloorName = null;

        for (let i = 0; i < this.buildingFloorItems.size; i++) {
          this.buildingFloorItems.get(keys[i]).allFloorList.forEach((floor) => {
            if (floor.floorId === this.selectedBuildingFloorItems) {
              moveBuildingId = keys[i];
              moveBuildingName = this.buildingFloorItems.get(keys[i]).buildingName;
              moveFloorName = floor.floorName;
            }
          });
        }

        let image = await this.isImage(moveBuildingId, this.selectedBuildingFloorItems);

        if (image === "") {
          this.$notify({
            group: "notifyApp",
            type: "warn",
            duration: 5000,
            title: this.$i18n.t("alertNoImage"),
            ignoreDuplicates: true,
          });
          return;
        } else if (moveFloorName === "") {
          this.$notify({
            group: "notifyApp",
            type: "warn",
            duration: 5000,
            title: this.$i18n.t("alertNoFloorNameOfTryToChangeFloor"),
            ignoreDuplicates: true,
          });
          return;
        } else {
          eventBus.$emit(
            "moveSeatToAnotherBuilding",
            moveBuildingId,
            moveBuildingName,
            this.selectedBuildingFloorItems,
            moveFloorName
          );
        }
      } else {
        this.$notify({
          group: "notifyApp",
          type: "warn",
          duration: 5000,
          title: this.$i18n.t("alertNoSelectBuildingFloor"),
          ignoreDuplicates: true,
        });
        return;
      }
    },
    getMappingEmployeeComponent() {
      this.mappingEmployeeComponentStatus = true;
    },
    changeAddVacantSwitchStatus() {
      eventBus.$emit("pushAddVacantSwitchStatus", this.addVacantSwitchStatus);
    },
    changeSelectedNumberOfAddSeat() {
      eventBus.$emit("pushSelectedNumberOfAddSeat", this.selectedNumberOfAddSeat);
    },
    clickChangeSeatToVacant() {
      eventBus.$emit("changeSeatToVacant");
    },
    clickSeatSizeBtn() {
      console.log(this.seatWidth);
      console.log(this.seatHeight);
      eventBus.$emit("sendSeatSize", this.seatWidth, this.seatHeight);
    },
  },
};
</script>
