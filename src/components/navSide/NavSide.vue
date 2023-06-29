<template>
  <div class="flex h-full">
    <div
      class="w-[80px] py-10 bg-white relative h-full"
      style="box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.06)"
    >
      <div
        v-for="(item, index) in menuList"
        :key="index"
        class="flex flex-col items-center w-full h-[60px] mb-4 cursor-pointer"
        :class="{ active: activeIndex === index }"
        @click="activeIndex = index"
      >
        <div class="mb-2">
          <component :is="item.icon" class="text-xl" />
        </div>
        <div
          class="text-[#636d7e] text-sm"
          :class="{ active: activeIndex === index }"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div
      class="w-[200px] py-8 flex flex-col items-center"
      style="border-right: 1px solid #eee"
    >
      <HomeSide v-if="activeIndex === 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeSide from './HomeSide.vue'

interface MenuItem {
  name: string
  icon: string
}

const activeIndex = ref(0)

const menuList: MenuItem[] = [
  {
    name: '首页',
    icon: 'home-outlined',
  },
  {
    name: '分享',
    icon: 'file-outlined',
  },
  {
    name: '回收站',
    icon: 'delete-outlined',
  },
  {
    name: '设置',
    icon: 'setting-outlined',
  },
]
</script>

<style scoped lang="scss">
.active {
  color: #06a7ff;
}
</style>
