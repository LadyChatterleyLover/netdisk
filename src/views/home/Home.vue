<template>
  <div class="flex">
    <a-dropdown>
      <a-upload
        multiple
        :max-count="10"
        :show-upload-list="false"
        :custom-request="handleCustomRequest"
      >
        <a-button type="primary" style="border-radius: 24px">
          <template #icon>
            <upload-outlined />
          </template>
          上传
        </a-button>
      </a-upload>
      <template #overlay>
        <a-menu>
          <a-menu-item key="1">
            <a-upload
              multiple
              :max-count="10"
              :show-upload-list="false"
              :custom-request="handleCustomRequest"
            >
              <span>上传文件</span>
            </a-upload>
          </a-menu-item>
          <a-menu-item key="2">
            <a-upload
              multiple
              :max-count="10"
              :show-upload-list="false"
              directory
              :custom-request="handleCustomRequest"
            >
              <span>上传文件夹</span>
            </a-upload>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <div
      class="flex items-center px-4 ml-5 h-8 bg-[#f0faff] text-[#06a7ff] rounded-3xl cursor-pointer"
    >
      <div class="flex h-full items-center">
        <folder-add-outlined class="text-sm" />
        <div class="ml-2 font-bold" @click="addDir">新建文件夹</div>
      </div>
      <a-divider type="vertical" />
      <div class="flex h-full items-center">
        <file-add-outlined class="text-sm" />
        <div class="ml-2 font-bold">新建在线文档</div>
      </div>
      <a-divider type="vertical" />
      <div class="flex h-full items-center">
        <download-outlined class="text-sm" />
        <div class="ml-2 font-bold" @click="downloadFile">下载文件</div>
      </div>
    </div>
  </div>
  <div class="h-full">
    <FileList
      ref="fileListRef"
      v-model:file-list="fileList"
      v-model:select-data="selectList"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { type UploadProps, message } from 'ant-design-vue'
import dayjs from 'dayjs'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import type { FileItem } from '@/types/file'
import api from '@/api'
import FileList from '@/components/home/FileList.vue'
import { useFileStore } from '@/stores/file'

const route = useRoute()
const fileStore = useFileStore()
const fileList = computed(() => fileStore.fileList)

const selectList = ref<FileItem[]>([])
const fileListRef = ref()
const category = ref('')
const loading = ref(false)

const getFileList = (
  params?: {
    name?: string
    type?: string
    dirId?: number
    isDir?: number
    isRecovery?: number
  },
  row?: FileItem
) => {
  api.file.getFileList(params).then((res) => {
    res.data.forEach((item) => {
      item.checked = false
      item.isAdd = false
      item.isRename = false
    })
    fileStore.setFileList(res.data)
    if (row && res.data.length) {
      row.children = res.data
    }
  })
}

const handleCustomRequest: UploadProps['customRequest'] = (options) => {
  const { file } = options
  const formData = new FormData()
  formData.append('file', file)
  loading.value = true
  api.file
    .uploadFile(formData)
    .then((res) => {
      if (res.code === 200) {
        message.success(res.msg)
        getFileList()
      } else {
        message.error(res.msg)
      }
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

const addDir = () => {
  fileList.value.unshift({
    name: '',
    createAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updateAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    isDir: true,
    size: 0,
    checked: false,
    ext: '',
    url: '',
    isAdd: true,
  })
  fileListRef.value?.setInputFocus()
}

const downloadFile = async () => {
  if (!selectList.value.length) {
    message.warning('请先选择文件!')
    return
  }
  selectList.value = selectList.value.filter((item) => !item.isDir)
  const zip = new JSZip()
  const fileUrls = selectList.value.map((item) => item.url)
  await Promise.all(fileUrls.map((url) => addFileToZip(zip, url)))
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  FileSaver.saveAs(zipBlob, `【批量下载】${selectList.value[0].name}等.zip`)
}

const addFileToZip = async (zip: JSZip, url: string) => {
  const response = await fetch(url)
  const blob = await response.blob()
  const filename = url.slice(Math.max(0, url.lastIndexOf('/') + 1))
  zip.file(window.decodeURIComponent(filename), blob)
}

provide('getFileList', getFileList)

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

onMounted(() => {
  getFileList()
})
</script>
