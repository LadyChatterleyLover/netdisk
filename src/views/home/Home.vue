<template>
  <div class="flex">
    <a-button type="primary" style="border-radius: 24px">
      <template #icon>
        <upload-outlined />
      </template>
      上传
    </a-button>
    <div
      class="flex items-center px-4 ml-5 h-8 bg-[#f0faff] text-[#06a7ff] rounded-3xl cursor-pointer"
    >
      <div class="flex h-full items-center">
        <folder-add-outlined class="text-sm" />
        <div class="ml-2 font-bold">新建文件夹</div>
      </div>
      <a-divider type="vertical" />
      <div class="flex h-full items-center">
        <file-add-outlined class="text-sm" />
        <div class="ml-2 font-bold">新建在线文档</div>
      </div>
      <a-divider type="vertical" />
      <div class="flex h-full items-center">
        <download-outlined class="text-sm" />
        <div class="ml-2 font-bold">下载文件</div>
      </div>
    </div>
  </div>
  <div class="font-bold text-sm my-5">全部文件</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const category = ref('')

watch(
  () => route.query,
  (val) => {
    if (val) {
      category.value = val.category as string
    } else {
      category.value = 'all'
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped></style>
