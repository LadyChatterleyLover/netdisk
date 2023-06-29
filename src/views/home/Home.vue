<template>
  <div class="flex">
    <a-dropdown>
      <a-upload
        multiple
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
              :show-upload-list="false"
              :custom-request="handleCustomRequest"
            >
              <span>上传文件</span>
            </a-upload>
          </a-menu-item>
          <a-menu-item key="2">
            <a-upload
              multiple
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
  <a-spin :spinning="loading" tip="上传中...">
    <FileList :file-list="fileList" />
  </a-spin>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { type UploadProps, message } from 'ant-design-vue'
import type { FileItem } from '@/types/file'
import api from '@/api'
import FileList from '@/components/home/FileList.vue'

const route = useRoute()
const category = ref('')

const loading = ref(false)
const fileList = ref<FileItem[]>([])

const getFileList = () => {
  api.file.getFileList().then((res) => {
    res.data.forEach((item) => {
      item.checked = false
    })
    fileList.value = res.data
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
