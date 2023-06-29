<template>
  <div class="mt-8 file-list-table">
    <vxe-table :data="fileList">
      <vxe-column title="文件名">
        <template #header="{ column }">
          <div class="flex">
            <div class="ml-2">
              <a-checkbox v-model:checked="checkAll" />
            </div>
            <div class="ml-5">{{ column.title }}</div>
          </div>
        </template>
        <template #default="{ row }">
          <div class="flex items-center file-item cursor-pointer">
            <div class="mx-2 invisible check-item">
              <a-checkbox v-model:checked="row.checked" />
            </div>
            <div class="w-8 flex">
              <div
                v-if="imgType.includes(row.ext.toLowerCase())"
                class="h-8 w-8 rounded-md"
              >
                <img class="w-full h-full" :src="row.url" />
              </div>
            </div>
            <div class="flex-1 flex ml-[16px]">
              {{ row.name }}
            </div>
            <div class="hidden action">
              <share-alt-outlined class="mr-3 text-sm" style="color: #06a7ff" />
              <download-outlined class="mr-3 text-sm" style="color: #06a7ff" />
              <delete-outlined class="mr-3 text-sm" style="color: #06a7ff" />
              <column-height-outlined
                class="mr-3 text-sm"
                style="color: #06a7ff"
              />
              <ellipsis-outlined class="mr-3 text-sm" style="color: #06a7ff" />
            </div>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="修改时间" sortable align="center">
        <template #default="{ row }">
          {{ dayjs(row.updateAt).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </vxe-column>
      <vxe-column title="大小" field="size" sortable align="center">
        <template #default="{ row }">
          {{ row.isDir ? '-' : (row.size / 1024).toFixed(2) + 'KB' }}
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import type { FileItem } from '@/types/file'

const imgType = ['bmp', 'jpg', 'jpeg', 'png', 'gi']

defineProps<{
  fileList: FileItem[]
}>()

const checkAll = ref(false)
</script>

<style scoped lang="scss">
.file-item {
  &:hover {
    .check-item {
      visibility: visible;
    }
    .action {
      display: flex;
    }
  }
}
</style>
