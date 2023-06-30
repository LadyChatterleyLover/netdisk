<template>
  <vue-office-docx :src="url" style="height: 100vh" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
import { useRoute } from 'vue-router'

const route = useRoute()
const url = computed(() => route.query.excelUrl as string)
</script>

<style scoped></style>
