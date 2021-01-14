<template>
  <v-app id="app">
    <div class="hanzari" id="hanzari">
      <v-app-bar app dark>
        <v-toolbar color="black" dark>
          <v-toolbar-items>
            <v-icon large dark @click="leftDrawer = !leftDrawer">menu</v-icon>
          </v-toolbar-items>
          <v-toolbar-title>{{ $t("projectName") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            text
            v-if="saveStatus"
            v-confirm="{
              ok: backToMyPage,
              message: message,
              html: true,
              okText: okText,
              cancelText: cancelText,
            }"
          >
            {{ $t("backToMyPage") }}
          </v-btn>
          <v-btn text @click="backToMyPage" v-if="!saveStatus">
            {{ $t("backToMyPage") }}
          </v-btn>
          <v-btn text @click="logout">{{ $t("logout") }}</v-btn
          ><v-toolbar-items>
            <v-icon
              large
              dark
              @click="rightDrawer = !rightDrawer"
              v-if="rightDrawer"
              >keyboard_arrow_right</v-icon
            >
            <v-icon
              large
              dark
              @click="rightDrawer = !rightDrawer"
              v-if="!rightDrawer"
              >keyboard_arrow_left</v-icon
            >
          </v-toolbar-items></v-toolbar
        >
      </v-app-bar>

      <div v-if="this.$store.state.getStore.otherFloorsSeatMap">
        <v-navigation-drawer v-model="leftDrawer" app :width="500">
          <ViewerTabs />
        </v-navigation-drawer>
        <v-main>
          <ViewerAssignSeats />
          <v-navigation-drawer
            v-model="rightDrawer"
            app
            :width="250"
            :right="true"
          >
            <v-toolbar color="black" height="128" dark> </v-toolbar>
            <FlowInformationTable />
            <DepartmentColorChips />
          </v-navigation-drawer>
        </v-main>
      </div>
      <ProgressDialog v-else :dialogStatus="true" />
    </div>
  </v-app>
</template>

<script>
import ViewerTabs from "@/components/ViewerTabs.vue";
import ViewerAssignSeats from "@/components/ViewerAssignSeats.vue";
import FlowInformationTable from "@/components/FlowInformationTable.vue";
import ProgressDialog from "@/components/ProgressDialog.vue";
import DepartmentColorChips from "@/components/DepartmentColorChips.vue";

const HOST = "http://149.28.141.163:8080";

export default {
  name: "ManagerHanzari",
  components: {
    ViewerTabs,
    ViewerAssignSeats,
    ProgressDialog,
    DepartmentColorChips,
    FlowInformationTable,
  },
  data() {
    return {
      leftDrawer: null,
      rightDrawer: null,
      saveStatus: null,
    };
  },
  async created() {
    if (this.$store.state.getStore.allEmployee == null) {
      await this.getEmployeeList();
    }

    if (this.$store.state.getStore.allDepartment == null) {
      await this.getDepartmentList();
    }

    await this.getFloorList();

    await this.getLatestFloorImage();
    await this.getLatestFloorSeatList();

    await this.getOtherFloorImageList();
    await this.getOtherFloorsSeatMap();
  },
  methods: {
    async getEmployeeList() {
      await this.$store.dispatch("getAllEmployees");
    },
    async getDepartmentList() {
      await this.$store.dispatch("getDepartmentList");
    },
    async getFloorList() {
      await this.$store.dispatch("getAllFloors");
    },
    async getLatestFloor() {
      await this.$store.dispatch("getLatestFloor");
    },
    async getLatestFloorImage() {
      await this.$store.dispatch("getLatestFloorImage");
    },
    async getLatestFloorSeatList() {
      await this.$store.dispatch("getLatestFloorSeatList");
    },
    async getOtherFloorImageList() {
      await this.$store.dispatch("getOtherFloorImageList");
    },
    async getOtherFloorsSeatMap() {
      await this.$store.dispatch("getOtherFloorsSeatMap");
      console.log(this.$store.state.getStore);
    },
    logout() {
      let message = {
        title: this.$i18n.t("titleConfirmLogout"),
        body: this.$i18n.t("confirmLogout"),
      };
      let options = {
        html: true,
        okText: this.$i18n.t("btnConfirm"),
        cancelText: this.$i18n.t("btnCancel"),
      };
      this.$dialog
        .confirm(message, options)
        .then((dialog) => {
          console.log("ok");
          this.$store.commit("logout");
          this.$router.replace("/");
        })
        .catch(() => {
          console.log("cancel");
          return;
        });
    },
    backToMyPage() {
      this.$store.commit("backToMyPage");
    },
  },
};
</script>
