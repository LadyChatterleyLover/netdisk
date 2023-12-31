<template>
  <div class="flex justify-between">
    <div v-if="!selectList.length" class="flex">
      <a-dropdown>
        <a-upload
          multiple
          :max-count="10"
          :show-upload-list="false"
          :custom-request="(e: any) => handleCustomRequest(e, 'file')"
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
                :custom-request="(e: any) => handleCustomRequest(e, 'file')"
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
                :custom-request="(e: any) => handleCustomRequest(e, 'dir')"
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

    <div v-else class="flex">
      <div
        class="flex items-center px-4 h-8 bg-[#f0faff] text-[#06a7ff] rounded-3xl cursor-pointer"
      >
        <div class="flex h-full items-center" @click="shareFiles">
          <share-alt-outlined class="text-sm" />
          <div class="ml-2 font-bold">分享</div>
        </div>
        <a-divider type="vertical" />
        <div class="flex h-full items-center" @click="downloadFile">
          <download-outlined class="text-sm" />
          <div class="ml-2 font-bold">下载</div>
        </div>
        <a-divider type="vertical" />
        <div class="flex h-full items-center" @click="deleteFile">
          <delete-outlined class="text-sm" />
          <div class="ml-2 font-bold">删除</div>
        </div>
        <a-divider type="vertical" />
        <div class="flex h-full items-center" @click="copyFiles">
          <copy-outlined class="text-sm" />
          <div class="ml-2 font-bold">复制</div>
        </div>
        <a-divider v-if="selectList.length === 1" type="vertical" />
        <div v-if="selectList.length === 1" class="flex h-full items-center">
          <column-height-outlined class="text-sm" />
          <div class="ml-2 font-bold">重命名</div>
        </div>
        <a-divider type="vertical" />
        <div class="flex h-full items-center" @click="moveFiles">
          <drag-outlined class="text-sm" />
          <div class="ml-2 font-bold">移动</div>
        </div>
      </div>
    </div>

    <div>
      <a-input-search
        v-model:value="value"
        placeholder="搜索我的文件"
        enter-button
        allow-clear
        @search="onSearch"
      />
    </div>
  </div>
  <div class="h-full">
    <FileList
      ref="fileListRef"
      v-model:file-list="fileList"
      v-model:select-data="selectList"
    />
  </div>
  <UploadProgress
    ref="UploadProgressRef"
    :upload-progress="uploadProgress"
    :upload="upload"
  />
  <MoveFile ref="MoveFileRef" />
  <ShareFile ref="ShareFileRef" />
</template>

<script setup lang="ts">
import { computed, createVNode, onMounted, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Modal, message } from 'ant-design-vue'
import dayjs from 'dayjs'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import io from 'socket.io-client'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '../../stores/user'
import type { FileItem } from '@/types/file'
import type {
  RcFile,
  UploadRequestOption,
} from 'ant-design-vue/es/vc-upload/interface'
import api from '@/api'
import FileList from '@/components/home/FileList.vue'
import MoveFile from '@/components/moveFile/MoveFile.vue'
import ShareFile from '@/components/shareFile/ShareFile.vue'
import UploadProgress from '@/components/uploadProgress/UploadProgress.vue'
import { useFileStore } from '@/stores/file'
import { download } from '@/utils/util'

const socket = io('http://localhost:3000', {
  path: '/socket',
  transports: ['websocket'],
  secure: true,
})

const userStore = useUserStore()
const route = useRoute()
const fileStore = useFileStore()
const fileList = computed(() => fileStore.fileList)

const MoveFileRef = ref()
const ShareFileRef = ref()
const selectList = ref<FileItem[]>([])
const uploadFileList = ref<RcFile[]>([])
const fileListRef = ref()
const category = ref('')
const value = ref('')
const loading = ref(false)
const uploadProgress = ref(0)
const UploadProgressRef = ref()

const getUserInfo = () => {
  api.user.getUserInfo().then((res) => {
    userStore.setUser(res.data)
  })
}

const getFileList = (
  params?: {
    name?: string
    type?: string
    dirId?: number
    isDir?: number
    isRecovery?: boolean
    isShared?: boolean
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

const onSearch = (val: string) => {
  getFileList({
    name: val,
  })
}

const upload = (file: RcFile) => {
  const formData = new FormData()
  formData.append('file', file)
  loading.value = true
  api.file
    .uploadFile(formData)
    .then((res) => {
      if (res.code === 200) {
        message.success(res.msg)
        getFileList()
        getUserInfo()
      } else {
        message.error(res.msg)
      }
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

const handleCustomRequest = (
  options: UploadRequestOption<any>,
  type: string
) => {
  const { file } = options
  UploadProgressRef.value?.open(file)
  if (type === 'file') {
    upload(file as RcFile)
  } else {
    uploadFileList.value.push(file as RcFile)
  }
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
    isRename: false,
    isShared: 0,
    extractedCode: '',
    viewCount: 0,
    shareUrl: '',
  })
  fileListRef.value?.setInputFocus()
}

const downloadFile = async () => {
  if (!selectList.value.length) {
    message.warning('请先选择文件!')
    return
  }
  selectList.value = selectList.value.filter((item) => !item.isDir)
  if (selectList.value.length === 1) {
    download(selectList.value[0].url)
  } else {
    const zip = new JSZip()
    const fileUrls = selectList.value.map((item) => item.url)
    await Promise.all(fileUrls.map((url) => addFileToZip(zip, url)))
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    FileSaver.saveAs(zipBlob, `【批量下载】${selectList.value[0].name}等.zip`)
  }
}

const addFileToZip = async (zip: JSZip, url: string) => {
  const response = await fetch(url)
  const blob = await response.blob()
  const filename = url.slice(Math.max(0, url.lastIndexOf('/') + 1))
  zip.file(window.decodeURIComponent(filename), blob)
}

const shareFiles = () => {
  if (selectList.value.some((item) => item.isShared === 1)) {
    message.warning('选中的文件存在已经分享过的文件')
    return
  }
  ShareFileRef.value?.open(selectList.value)
}

const moveFiles = () => {
  MoveFileRef.value?.open(selectList.value)
}

const copyFiles = () => {
  const ids = selectList.value.map((item) => item.id) as number[]
  const arr = ids.map((item) => {
    return api.file.copyFile({
      id: item,
    })
  })
  Promise.all(arr)
    .then(() => {
      message.success('复制成功')
      getFileList()
    })
    .catch(() => {
      message.error('复制失败')
    })
}

const deleteFile = () => {
  const ids = selectList.value.map((item) => item.id) as number[]
  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', { style: { fontSize: '16px' } }, [
      '确定删除所选的文件吗？',
      createVNode(
        'div',
        { style: { color: '#ca963b', marginLeft: '38px', marginTop: '10px' } },
        '删除的文件可在回收站查看'
      ),
    ]),
    okText: '删除',
    onOk() {
      api.file.recoveryFile(ids).then((res) => {
        if (res.code === 200) {
          message.success(res.msg)
          getFileList()
        } else {
          message.error(res.msg)
        }
      })
    },
  })
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

watch(
  () => uploadFileList.value,
  (val) => {
    if (val.length) {
      const arr = val[0].webkitRelativePath.split('/')
      const dirName = arr[0]
      api.file
        .createDir({
          name: dirName,
        })
        .then((res) => {
          if (res.code === 200) {
            const dirId = res.data.id
            const uploadArr: Promise<any>[] = []
            val.forEach((item) => {
              const formData = new FormData()
              formData.append('file', item)
              formData.append('dirId', String(dirId))
              const request = api.file.uploadFile(formData)
              uploadArr.push(request)
            })
            Promise.all(uploadArr)
              .then((res) => {
                if (res.length) {
                  message.success('上传成功')
                  getFileList?.()
                }
              })
              .catch(() => {
                message.error('上传失败')
              })
          } else {
            message.error(res.msg)
          }
        })
    }
  },
  { deep: true }
)

onMounted(() => {
  getFileList()
  socket.on('uploadProgress', (data: number) => {
    uploadProgress.value = data
  })
})
</script>
