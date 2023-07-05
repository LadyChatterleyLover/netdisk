<template>
  <div v-if="tableData.length">
    <div class="flex items-center h-[60px] bg-[#409EFF] pl-[200px]">
      <cloud-upload-outlined style="color: #fff; font-size: 36px" />
      <span class="text-[#fff] font-bold text-xl ml-4">嘟嘟云盘</span>
    </div>
    <div class="mt-10 px-[150px]">
      <div class="flex items-center">
        <a-avatar
          v-if="shareData?.avatar"
          :size="30"
          :src="shareData?.avatar"
        />
        <a-avatar v-else :size="30">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <div class="ml-5">
          <div>{{ shareData?.username }} 分享于 {{ shareData?.shareAt }}</div>
          <div class="text-sm mt-1">分享文件: {{ shareData?.name }}</div>
        </div>
      </div>
      <a-divider />
      <vxe-table ref="tableRef" :data="tableData">
        <vxe-column title="文件名" field="name">
          <template #header="{ column }">
            <div class="flex">
              <div class="ml-2">
                <a-checkbox
                  v-model:checked="checkAll"
                  :indeterminate="indeterminate"
                  @change="selectAll"
                />
              </div>
              <div v-if="selectList.length" class="flex">
                <div class="mx-3 text-[#818999] text-xs relative top-[2px]">
                  已选中{{ selectList.length }}个文件/文件夹
                </div>
              </div>
              <div v-else class="ml-5">{{ column.title }}</div>
            </div>
          </template>
          <template #default="{ row }">
            <div class="flex items-center file-item cursor-pointer">
              <div class="mx-2 check-item">
                <a-checkbox
                  v-model:checked="row.checked"
                  @change="changeRow(row)"
                />
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
                <div
                  v-if="row.ext.includes('.sheet')"
                  class="h-8 w-8 rounded-md"
                >
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
        <vxe-column
          title="分享时间"
          field="shareAt"
          :formatter="formatterTime"
          sortable
          align="center"
        />
        <vxe-column title="大小" field="size" sortable>
          <template #default="{ row }">
            {{ row.isDir ? '-' : useFormatFileSize(row.size) }}
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
  <div v-else class="w-full h-full flex justify-center items-center">
    <div class="flex flex-col items-center w-[400px]">
      <div class="flex items-center mb-4">
        <cloud-upload-outlined style="color: #06a7ff; font-size: 36px" />
        <span class="text-[#06a7ff] font-bold text-xl ml-4">嘟嘟云盘</span>
      </div>
      <a-card
        style="width: 400px"
        :head-style="{ background: '#409EFF', color: '#fff' }"
        hoverable
      >
        <template #title>
          <div class="flex items-center">
            <a-avatar
              v-if="shareData?.avatar"
              :size="30"
              :src="shareData?.avatar"
            />
            <a-avatar v-else :size="30">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <div class="ml-5">
              <div>
                {{ shareData?.username }} 分享于 {{ shareData?.shareAt }}
              </div>
              <div class="text-sm mt-1">分享文件: {{ shareData?.name }}</div>
            </div>
          </div>
        </template>
        <a-form layout="vertical">
          <a-form-item label="请输入提取码:">
            <a-row :gutter="20">
              <a-col :span="18">
                <a-input v-model:value="code" allow-clear />
              </a-col>
              <a-col :span="4">
                <a-button type="primary" @click="confirm">提取文件</a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import api from '../../api'
import type { FileItem } from '../../types/file'
import type { VxeColumnPropTypes, VxeTableInstance } from 'vxe-table'
import { useFormatFileSize } from '@/hooks/useFormatFileSize'

interface ShareData {
  name: string
  shareAt: string
  username: string
  avatar: string
}

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

const route = useRoute()
const urlCode = route.params.code as string
const shareData = ref<ShareData>()
const code = ref('')
const tableData = ref<FileItem[]>([])
const selectList = ref<number[]>([])
const checkAll = ref(false)
const indeterminate = ref(false)
const tableRef = ref<VxeTableInstance<FileItem>>()

const formatterTime: VxeColumnPropTypes.Formatter<FileItem> = ({
  cellValue,
}) => {
  return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
}

const selectAll = () => {
  indeterminate.value = false
  if (checkAll.value) {
    selectList.value = tableData.value.map((item) => item.id) as number[]
    tableData.value.forEach((item) => {
      item.checked = true
    })
  } else {
    selectList.value = []
    tableData.value.forEach((item) => {
      item.checked = false
    })
  }
}

const changeRow = (row: FileItem) => {
  if (row.checked) {
    selectList.value.push(row.id as number)
  } else {
    selectList.value = selectList.value.filter((item) => item !== row.id)
  }
}

const getFile = () => {
  api.file
    .findFileByCode({
      code: urlCode,
    })
    .then((res) => {
      if (res.code === 200) {
        shareData.value = res.data
      }
    })
}

const confirm = () => {
  if (!code.value) {
    message.warning('提取码不能为空')
    return
  }
  api.file
    .extractFile({
      urlCode,
      code: code.value,
    })
    .then((res) => {
      if (res.code === 200) {
        tableData.value = [res.data]
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
    })
}

watch(
  () => selectList.value,
  (val) => {
    indeterminate.value = !!val.length && val.length < tableData.value.length
    checkAll.value = val.length === tableData.value.length
  },
  { deep: true }
)

onMounted(() => {
  getFile()
})
</script>
