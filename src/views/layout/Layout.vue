<template>
  <a-layout>
    <a-layout-header style="background: #fff; padding: 0">
      <NavHeader />
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="280" style="background: #fff">
        <NavSide />
      </a-layout-sider>
      <a-layout-content style="padding: 20px; background: #fff">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import NavHeader from '@/components/navHeader/NavHeader.vue'
import NavSide from '@/components/navSide/NavSide.vue'
</script>

<style scoped></style>
