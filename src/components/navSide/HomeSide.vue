<template>
  <div class="w-full px-4 relative">
    <div
      class="w-full h-10 flex justify-around items-center cursor-pointer"
      :class="{ active: activeIndex === 0 }"
      @click="clickItem('', 0)"
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
        class="w-full h-[30px] flex pl-[50px] items-center mt-5 cursor-pointer"
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
import { useRoute } from 'vue-router'
import api from '@/api'
import { useFileStore } from '@/stores/file'

interface MenuItem {
  name: string
  icon: string
  type: string
}

const route = useRoute()
const fileStore = useFileStore()

const menuList: MenuItem[] = [
  {
    name: '图片',
    icon: 'file-image-outlined',
    type: 'image',
  },
  {
    name: '文档',
    icon: 'file-outlined',
    type: 'text',
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
const category = ref('')

const clickItem = (type: string, index: number) => {
  category.value = type
  activeIndex.value = index
  let isRecovery = false
  if (route.path === '/') {
    isRecovery = false
  } else {
    isRecovery = true
  }
  api.file
    .getFileList({
      type,
      isRecovery,
    })
    .then((res) => {
      fileStore.setFileList(res.data)
    })
}
</script>

<style scoped lang="scss">
.active {
  color: #06a7ff;
  background-color: #eef9fe;
  border-radius: 10px;
}
</style>
