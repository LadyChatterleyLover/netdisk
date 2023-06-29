<template>
  <div class="w-full px-4">
    <div
      class="w-full h-10 flex justify-around items-center cursor-pointer"
      :class="{ active: activeIndex === 0 }"
      @click="clickItem('all', 0)"
    >
      <div class="flex">
        <div>
          <caret-right-outlined />
        </div>
        <div class="mx-3">我的文件</div>
      </div>
      <div>
        <more-outlined />
      </div>
    </div>
    <div class="flex flex-col items-center w-full">
      <div
        v-for="(item, index) in menuList"
        :key="index"
        class="w-full h-10 flex pl-[50px] items-center mt-5 cursor-pointer"
        :class="{ active: activeIndex === index + 1 }"
        @click="clickItem(item.type, index + 1)"
      >
        <div>
          <component :is="item.icon" class="text-xs" />
        </div>
        <div class="ml-3 text-xs">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface MenuItem {
  name: string
  icon: string
  type: string
}

const menuList: MenuItem[] = [
  {
    name: '图片',
    icon: 'file-image-outlined',
    type: 'image',
  },
  {
    name: '文档',
    icon: 'file-outlined',
    type: 'file',
  },
  {
    name: '视频',
    icon: 'video-camera-outlined',
    type: 'video',
  },
  {
    name: '音频',
    icon: 'play-square-outlined',
    type: 'audio',
  },
  {
    name: '其他',
    icon: 'ellipsis-outlined',
    type: 'other',
  },
]

const activeIndex = ref(0)
const category = ref('all')

const clickItem = (type: string, index: number) => {
  category.value = type
  activeIndex.value = index
}
</script>

<style scoped lang="scss">
.active {
  color: #06a7ff;
  background-color: #eef9fe;
  border-radius: 10px;
}
</style>
