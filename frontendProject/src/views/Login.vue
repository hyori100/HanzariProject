<template>
  <v-app id="app">
    <v-app-bar app dark>
      <v-toolbar color="black" dark>
        <v-toolbar-title>{{ $t("projectLogin") }}</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
    </v-app-bar>
    <v-main>
      <v-container style="position: relative; top: 20%" class="text-xs-center">
        <v-layout row wrap class="text-xs-center">
          <v-flex>
            <v-card flat class="mx-auto" max-width="800">
              <v-card-title primary-title>
                <h4>{{ $t("login") }}</h4>
              </v-card-title>
              <v-form>
                <v-text-field
                  prepend-icon="person"
                  name="Employee ID"
                  :label="$t('employeeId')"
                  v-model="employeeId"
                ></v-text-field>
                <v-text-field
                  prepend-icon="lock"
                  name="Password"
                  :label="$t('password')"
                  type="password"
                  v-model="password"
                ></v-text-field>
                <v-card-actions>
                  <v-btn primary large block @click="loginSubmit">{{
                    $t("login")
                  }}</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
const HOST = "http://149.28.141.163:8080";

export default {
  data() {
    return {
      employeeId: null,
      password: null,
    };
  },
  methods: {
    loginSubmit() {
      let saveData = {};
      saveData.employeeId = this.employeeId;
      saveData.employeePw = this.password;
      console.log(saveData);
      try {
        this.$axios
          .post(HOST + "/v1/signin", JSON.stringify(saveData), {
            headers: {
              "Content-Type": `application/json`,
            },
          })
          .then((res) => {
            console.log(res.data.access_token);
            this.$store.commit("login", res.data);
            this.$store.commit("saveEmployeeId", this.employeeId);

            if (this.$store.state.userStore.token != "") {
              if (
                this.$store.state.userStore.authority === "admin" ||
                this.$store.state.userStore.authority === "viewer" ||
                this.$store.state.userStore.authority === "manager"
              ) {
                this.$router.push("/myPage");
              } else if (this.$store.state.userStore.authority === "super") {
                this.$router.push("/SuperHanzari");
              }
            }
          });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
