<script setup>
import { onMounted } from 'vue';

const props = defineProps({
   uri: String
})

onMounted(()=>{
   console.log(props.uri);
})

</script>

<template>
   <h2>This is Home Content {{ props.uri }}</h2>
</template>

<style scoped></style>