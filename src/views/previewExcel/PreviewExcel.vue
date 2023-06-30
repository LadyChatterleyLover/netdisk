<template>
  <vue-office-excel :src="url" style="height: 100vh" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
import { useRoute } from 'vue-router'

const route = useRoute()
const url = computed(() => route.query.excelUrl as string)
</script>

<style scoped></style>
