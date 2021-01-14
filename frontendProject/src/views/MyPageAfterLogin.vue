<template>
  <v-app id="app">
    <v-app-bar app dark>
      <v-toolbar color="black" dark>
        <v-toolbar-title>{{ $t("projectMypage") }}</v-toolbar-title>
        <v-spacer />
        <v-btn text @click="logout">{{ $t("logout") }}</v-btn>
      </v-toolbar>
    </v-app-bar>
    <v-main>
      <v-container class="text-xs-center">
        <v-layout
          v-if="this.$store.state.getStore.loginEmployeeObject"
          row
          wrap
          class="text-xs-center"
        >
          <v-flex>
            <v-card flat class="mx-auto" height="200">
              <v-card-title class="justify-center">
                <v-avatar size="60" style="margin-right: 15px">
                  <v-icon large>person</v-icon>
                </v-avatar>
                <h1>
                  {{
                    this.$store.state.getStore.loginEmployeeObject.employeeName
                  }}
                </h1>
              </v-card-title>

              <v-card-title class="justify-center">
                <h3>
                  {{
                    this.$store.state.getStore.loginEmployeeObject
                      .departmentName
                  }}
                  {{
                    this.$store.state.getStore.loginEmployeeObject
                      .extensionNumber
                  }}
                </h3>
              </v-card-title>
              <v-divider />
            </v-card>
          </v-flex>
        </v-layout>

        <div
          v-if="
            !authorizeStatus &&
            this.$store.state.getStore.loginEmployeeObject &&
            !editUserPasswordStatus
          "
          class="text-xs-center"
        >
          <v-layout>
            <v-flex>
              <v-card flat class="mx-auto">
                <v-card-title class="justify-center">
                  <v-spacer />
                  <v-btn x-large color="primary" @click="getEditUserPassword">{{
                    $t("changeMemberInformation")
                  }}</v-btn>
                  <v-btn
                    x-large
                    color="error"
                    @click="getAuthorize"
                    v-if="$store.state.userStore.authority === 'admin'"
                    >{{ $t("grantAuthority") }}</v-btn
                  ></v-card-title
                >
                <v-divider />
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-row>
                <v-col
                  v-for="buildingObj of this.$store.state.getStore.allBuildings"
                  :key="buildingObj.buildingId"
                  class="d-flex child-flex"
                  cols="4"
                >
                  <v-card
                    style="height: 300px"
                    @click="selectBuilding(buildingObj)"
                  >
                    <v-card-title class="justify-center">{{
                      buildingObj.buildingName
                    }}</v-card-title>
                    <v-divider />
                  </v-card>
                </v-col>
              </v-row>
            </v-flex>
          </v-layout>
        </div>

        <ProgressDialog
          v-else-if="!this.$store.state.getStore.loginEmployeeObject"
          :dialogStatus="true"
        />
        <AuthorizeEmployee v-else-if="authorizeStatus" />
        <EditPassword v-else-if="editUserPasswordStatus" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";
import ProgressDialog from "@/components/ProgressDialog.vue";
import EditPassword from "@/components/EditPassword.vue";
import AuthorizeEmployee from "@/components/AuthorizeEmployee.vue";
import { refreshToken } from "../refreshToken.js";

const HOST = "http://149.28.141.163:8080";

export default {
  components: {
    ProgressDialog,
    EditPassword,
    AuthorizeEmployee,
  },
  data() {
    return {
      authorizeStatus: false,
      editUserPasswordStatus: false,
    };
  },
  async created() {
    if (this.$store.state.getStore.allBuildings === null) {
      await this.getBuilding();
    }
    if (this.$store.state.getStore.loginEmployeeObject === null) {
      await this.getLoginEmployeeObject();
    }
    console.log(this.$store.state.getStore);
    console.log(this.$store.state.deleteStore);
    console.log(this.$store.state.postStore);
    console.log(this.$store.state.buildingStore);

    eventBus.$on("pushAuthorizeStatus", (value) => {
      if (value === true) {
        this.$notify({
          group: "notifyApp",
          type: "default",
          duration: 5000,
          title: this.$i18n.t("alertSuccessChangeAuthroity"),
          ignoreDuplicates: true,
        });
      }
      this.authorizeStatus = false;
    });

    eventBus.$on("pushEditUserPasswordStatus", (value) => {
      if (value === true) {
        this.$notify({
          group: "notifyApp",
          type: "default",
          duration: 5000,
          title: this.$i18n.t("alertSuccessEditPassword"),
          ignoreDuplicates: true,
        });
      }
      this.editUserPasswordStatus = false;
    });
  },
  beforeDestroy() {
    eventBus.$off("pushAuthorizeStatus");
    eventBus.$off("pushEditUserPasswordStatus");
  },
  methods: {
    async getLoginEmployeeObject() {
      await this.$store.dispatch("getLoginEmployeeObject");
    },
    async getBuilding() {
      await this.$store.dispatch("getBuildingList");
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
          this.$store.commit("logout");
          this.$router.replace("/");
        })
        .catch(() => {
          return;
        });
    },
    selectBuilding(building) {
      this.$store.commit("buildingSelect", building);
      if (this.$store.state.userStore.authority === "admin") {
        this.$router.push("/Hanzari");
      } else if (this.$store.state.userStore.authority === "manager") {
        this.$router.push("/ManagerHanzari");
      } else if (this.$store.state.userStore.authority === "viewer") {
        this.$router.push("/ViewerHanzari");
      }
    },
    getAuthorize() {
      this.authorizeStatus = true;
    },
    getEditUserPassword() {
      this.editUserPasswordStatus = true;
    },
  },
};
</script>
