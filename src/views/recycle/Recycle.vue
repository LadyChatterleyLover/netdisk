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
            <div class="mx-2 invisible check-item">
              <a-checkbox v-model:checked="row.checked" />
            </div>
            <div class="w-8 flex ml-3">
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
                <a-image lazy :src="row.url" :preview-mask="false" />
              </div>
              <div v-if="row.ext === 'pdf'" class="h-8 w-8 rounded-md">
                <img class="w-full h-full" src="../../assets/pdf.png" />
              </div>
              <div v-if="row.ext === 'plain'" class="h-8 w-8 rounded-md">
                <img class="w-full h-full" src="../../assets/txt.png" />
              </div>
              <div v-if="row.ext.includes('.sheet')" class="h-8 w-8 rounded-md">
                <img class="w-full h-full" src="../../assets/excel.png" />
              </div>
              <div
                v-if="row.ext.includes('.document')"
                class="h-8 w-8 rounded-md"
              >
                <img class="w-full h-full" src="../../assets/docx.png" />
              </div>
              <div v-if="row.ext.includes('zip')" class="h-8 w-8 rounded-md">
                <img class="w-full h-full" src="../../assets/zip.png" />
              </div>
              <div
                v-if="videoType.includes(row.ext.toLowerCase())"
                class="h-8 w-8 rounded-md"
              >
                <img class="w-full h-full" src="../../assets/video.png" />
              </div>
              <div
                v-if="audioType.includes(row.ext.toLowerCase())"
                class="h-8 w-8 rounded-md"
              >
                <img class="w-full h-full" src="../../assets/audio.png" />
              </div>
            </div>
            <div class="flex-1 flex ml-[16px]">
              <div>{{ row.name }}</div>
            </div>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="删除时间" sortable align="center">
        <template #default="{ row }">
          {{ dayjs(row.deleteAt).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </vxe-column>
      <vxe-column title="大小" field="size" sortable align="center">
        <template #default="{ row }">
          {{ row.isDir ? '-' : useFormatFileSize(row.size) }}
        </template>
      </vxe-column>
      <vxe-column title="操作" field="action" align="center">
        <template #default="{ row }">
          <redo-outlined
            style="color: #1890ff; margin-right: 2px; transform: rotate(180deg)"
          />
          <a-button type="link" style="padding: 0" class="mr-3">还原</a-button>
          <delete-outlined style="color: #ff4d4f; margin-right: 2px" />
          <a-button type="text" danger style="padding: 0" @click="delFile(row)"
            >删除</a-button
          >
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script lang="ts" setup>
import { createVNode, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import api from '../../api'
import type { FileItem } from '@/types/file'
import { useFormatFileSize } from '@/hooks/useFormatFileSize'

const imgType = ['bmp', 'jpg', 'jpeg', 'png', 'gif']
const videoType = ['mp4', 'ogg', 'flv', 'avi', 'wmv', 'rmvb', 'mov']
const audioType = [
  'mpeg',
  'mp3',
  'wma',
  'aac',
  'ogg',
  'mpc',
  'flac',
  'ape',
  'wv',
]

const tableData = ref<FileItem[]>([])
const checkAll = ref(false)

const getFileList = () => {
  api.file
    .getFileList({
      isRecovery: true,
    })
    .then((res) => {
      tableData.value = res.data
    })
}

const delFile = (row: FileItem) => {
  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    content: '文件删除后将无法恢复，您确认要彻底删除所选文件吗？',
    okText: '删除',
    width: '500px',
    onOk() {
      api.file.deleteFile([row.id!]).then((res) => {
        if (res.code === 200) {
          message.success(res.msg)
          getFileList?.()
        } else {
          message.error(res.msg)
        }
      })
    },
  })
}

onMounted(() => {
  getFileList()
})
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
