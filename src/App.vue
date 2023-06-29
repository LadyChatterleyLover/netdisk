<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

const locale = ref(zhCN)
</script>

<style scoped></style>
