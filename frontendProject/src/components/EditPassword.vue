<template>
  <v-layout row wrap class="text-xs-center">
    <v-flex>
      <v-card flat class="mx-auto" max-width="800">
        <v-card-title primary-title>
          <h4>{{ this.$t("textEditPassword") }}</h4>
        </v-card-title>
        <v-form>
          <v-text-field
            prepend-icon="lock"
            name="Password"
            :label="$t('textFieldLabelPreviousPw')"
            type="password"
            v-model="oldPassword"
          ></v-text-field>
          <v-text-field
            prepend-icon="lock"
            name="Password"
            :label="$t('textFieldLabelChangePw')"
            type="password"
            v-model="newPassword"
          ></v-text-field>
          <v-text-field
            prepend-icon="lock"
            name="Password"
            :label="$t('textFieldLabelChangePwCompare')"
            type="password"
            v-model="newPasswordCompare"
          ></v-text-field>
          <v-card-actions>
            <v-row>
              <v-col class="text-right">
                <v-btn @click="changeBackPage">{{
                  this.$t("btnCancel")
                }}</v-btn>
                <v-btn @click="editUserPassword" color="primary">{{
                  this.$t("textEditPassword")
                }}</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
import { refreshToken } from "@/refreshToken.js";
import { eventBus } from "../main";

const HOST = "http://149.28.141.163:8080";

export default {
  data() {
    return {
      oldPassword: null,
      newPassword: null,
      newPasswordCompare: null,
    };
  },
  methods: {
    changeBackPage() {
      eventBus.$emit("pushEditUserPasswordStatus", false);
    },
    async editUserPassword() {
      let changeUserData = {};
      let errorStatus = null;

      // 현재 비밀번호에 아무것도 입력하지 않고 확인을 누를시
      if (this.oldPassword === null) {
        this.$notify({
          group: "notifyApp",
          type: "warn",
          duration: 5000,
          title: this.$i18n.t("alertNoInputOldPassword"),
          ignoreDuplicates: true,
        });
        return;
      } // 현재 비밀번호와 새 비밀번호가 같을 시
      else if (this.oldPassword === this.newPassword) {
        this.$notify({
          group: "notifyApp",
          type: "warn",
          duration: 5000,
          title: this.$i18n.t("alertSamePreviousPassword"),
          ignoreDuplicates: true,
        });
        return;
      } // 새 비밀번호에 아무것도 입력하지 않고 확인을 누를시
      else if (this.newPassword === null) {
        this.$notify({
          group: "notifyApp",
          type: "warn",
          duration: 5000,
          title: this.$i18n.t("alertNoInputNewPassword"),
          ignoreDuplicates: true,
        });
        return;
      }

      changeUserData.employeeId = this.$store.state.userStore.employeeId;
      changeUserData.oldPw = this.oldPassword;
      changeUserData.newPw = this.newPassword;

      try {
        this.$axios
          .post(HOST + "/v1/signup", JSON.stringify(changeUserData), {
            headers: {
              "Content-Type": `application/json`,
            },
          })
          .catch((error) => {
            errorStatus = error.response.status;
          })
          .then((res) => {
            if (errorStatus === 500) {
              this.$notify({
                group: "notifyApp",
                type: "warn",
                duration: 5000,
                title: this.$i18n.t("errorChangePassword"),
                ignoreDuplicates: true,
              });
              this.oldPassword = null
              this.newPassword = null
              this.newPasswordCompare = null
            }
            if (res) {
              if (res.status === 200) {
                eventBus.$emit("pushEditUserPasswordStatus", true);
              }
            }
          });
        if (errorStatus === 401) {
          await refreshToken();
          response = await axios.get(
            HOST + "/api/employee/" + this.$store.state.userStore.employeeId,
            {
              headers: { "X-AUTH-TOKEN": this.$store.state.userStore.token },
            }
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>