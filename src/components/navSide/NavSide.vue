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
        :class="{ active: activeIndex === item.path }"
        @click="clickItem(item)"
      >
        <div class="mb-2">
          <component :is="item.icon" class="text-xl" />
        </div>
        <div
          class="text-[#636d7e] text-sm"
          :class="{ active: activeIndex === item.path }"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div
      class="w-[200px] py-8 flex flex-col items-center relative"
      style="border-right: 1px solid #eee"
    >
      <HomeSide v-if="activeIndex === '/' || activeIndex === '/recycle'" />
      <div
        v-if="activeIndex === '/shareList'"
        class="text-[#06a7ff] bg-[#eef9fe] w-[176px] ml-2 h-10 font-bold flex justify-center items-center rounded-xl"
      >
        分享记录
      </div>
      <div
        class="absolute left-1/2 bottom-[20%] w-full px-5"
        style="transform: translateX(-50%)"
      >
        <a-progress :percent="50" :show-info="false" />
        <div class="mt-5 flex justify-center">
          {{ useFormatFileSize(Number(user?.remainingMemory)) }} /
          {{ useFormatFileSize(Number(user?.memory)) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useFormatFileSize } from '../../hooks/useFormatFileSize/index'
import HomeSide from './HomeSide.vue'

interface MenuItem {
  name: string
  icon: string
  path: string
}

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const user = computed(() => userStore.user)
const activeIndex = ref(route.path)

const menuList: MenuItem[] = [
  {
    name: '首页',
    icon: 'home-outlined',
    path: '/',
  },
  {
    name: '分享',
    icon: 'file-outlined',
    path: '/shareList',
  },
  {
    name: '回收站',
    icon: 'delete-outlined',
    path: '/recycle',
  },
  {
    name: '设置',
    icon: 'setting-outlined',
    path: '/setting',
  },
]

const clickItem = (item: MenuItem) => {
  activeIndex.value = item.path
  router.push(item.path)
}
</script>

<style scoped lang="scss">
.active {
  color: #06a7ff;
}
</style>
