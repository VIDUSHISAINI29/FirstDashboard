<script setup>
import ProgressSpinner from "primevue/progressspinner";
</script>

<template>
   <div class="card tw-flex tw-justify-center tw-h-[300px]">
      <ProgressSpinner
         style="width: 40px; height: 40px"
         strokeWidth="8"
         fill="transparent"
         animationDuration=".5s"
         aria-label="Custom ProgressSpinner" />
   </div>
</template>
