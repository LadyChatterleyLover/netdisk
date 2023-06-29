<template>
  <div class="mt-8 file-list-table">
    <vxe-table :data="tableData">
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
            <div v-if="!row.isAdd" class="mx-2 invisible check-item">
              <a-checkbox v-model:checked="row.checked" />
            </div>
            <div class="w-8 flex">
              <img
                v-if="row.isDir"
                width="32"
                height="32"
                src="../../assets/dir.png"
                alt="dir"
                :style="{ marginLeft: row.isAdd ? '32px' : '0' }"
              />
              <div
                v-if="imgType.includes(row.ext.toLowerCase())"
                class="h-8 w-8 rounded-md"
              >
                <img class="w-full h-full" :src="row.url" />
              </div>
            </div>
            <div class="flex-1 flex ml-[16px]">
              <div v-if="row.isAdd" class="flex ml-8">
                <a-input v-model:value="row.name" size="small" allow-clear />
              </div>
              <div v-else>{{ row.name }}</div>
            </div>
            <div v-if="row.isAdd" class="flex items-center">
              <div
                class="w-6 h-6 flex justify-center items-center ml-2 bg-[#06a7ff] text-white rounded-md"
                @click="confirm(row)"
              >
                <check-outlined class="text-small" />
              </div>
              <div
                class="w-6 h-6 flex justify-center items-center ml-3 bg-[#06a7ff] text-white rounded-md"
                @click="cancel"
              >
                <close-outlined class="text-small" />
              </div>
            </div>
            <div v-if="!row.isAdd" class="hidden action">
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
import { inject, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { message } from 'ant-design-vue'
import api from '../../api'
import type { FileItem } from '@/types/file'

const imgType = ['bmp', 'jpg', 'jpeg', 'png', 'gi']
const getFileList = inject<() => void>('getFileList')

const props = defineProps<{
  fileList: FileItem[]
}>()
const emits = defineEmits<{
  'update:fileList': [val: FileItem[]]
}>()

const tableData = ref<FileItem[]>([])
const checkAll = ref(false)

const confirm = (row: FileItem) => {
  if (!row.name) {
    message.error('文件夹名字不能为空!')
    return
  }
  api.file
    .createDir({
      name: row.name,
    })
    .then((res: any) => {
      if (res.code === 200) {
        row.isAdd = false
        getFileList?.()
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
    })
}

const cancel = () => {
  tableData.value.shift()
  emits('update:fileList', tableData.value)
}

watch(
  () => props.fileList,
  (val) => {
    tableData.value = cloneDeep(val)
  },
  { deep: true, immediate: true }
)
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
