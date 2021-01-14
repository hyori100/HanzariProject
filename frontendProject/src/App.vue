<template>
  <div>
    <router-view />
    <notifications group="notifyApp" width = "25%" position="bottom center" />
  </div>
</template>

<script>
import { eventBus } from "./main.js";
import axios from "axios";

export default {
  name: "App"
};
</script>
