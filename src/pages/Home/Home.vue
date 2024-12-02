<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
   <div v-if="!route.params.uri">
      <h2 class="tw-text-purple-500">This is Home View</h2>
   </div>
   <router-view v-else />
</template>

<style scoped></style>
