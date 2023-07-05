<template>
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
          <div
            class="mx-2 invisible check-item"
            :style="{ visibility: row.checked ? 'visible' : 'hidden' }"
          >
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
    <vxe-column
      title="分享时间"
      field="shareAt"
      :formatter="formatterTime"
      sortable
      align="center"
    />
    <vxe-column title="状态" field="expirationTime" align="center">
      <template #default="{ row }">
        <div v-if="row.expirationTime === -1">永久有效</div>
        <div v-else>{{ row.expirationTime }}天后过期</div>
      </template>
    </vxe-column>
    <vxe-column title="浏览次数" field="viewCount" align="center" />
    <vxe-column title="操作" field="action" align="center">
      <template #default="{ row }">
        <copy-outlined style="color: #1890ff; margin-right: 2px" />
        <a-button
          type="link"
          style="padding: 0; margin-right: 15px"
          class="mr-3"
          @click="copyUrl(row)"
          >复制链接</a-button
        >
        <poweroff-outlined style="color: #1890ff; margin-right: 2px" />
        <a-popconfirm
          :title="`确认要取消${row.name}的分享吗?`"
          @confirm="cancelShare(row)"
        >
          <a-button
            type="link"
            style="padding: 0; margin-right: 8px"
            class="mr-3"
            >取消分享</a-button
          >
        </a-popconfirm>
      </template>
    </vxe-column>
  </vxe-table>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import api from '../../api'
import { useCopy } from '../../hooks/useCopy'
import type { FileItem } from '../../types/file'
import type { VxeColumnPropTypes, VxeTableInstance } from 'vxe-table'

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
const selectList = ref<number[]>([])
const checkAll = ref(false)
const indeterminate = ref(false)
const tableRef = ref<VxeTableInstance<FileItem>>()

const getFileList = () => {
  api.file
    .getFileList({
      isShared: true,
    })
    .then((res) => {
      if (res.code === 200) {
        tableData.value = res.data
      }
    })
}

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

const copyUrl = (row: FileItem) => {
  const { copy } = useCopy(
    `链接: ${row!.shareUrl} 提取码: ${row.extractedCode}`,
    () => message.success('复制成功')
  )
  copy()
}

const cancelShare = (row: FileItem) => {
  api.file
    .cancelShare({
      id: row.id as number,
    })
    .then((res) => {
      if (res.code === 200) {
        message.success(res.msg)
        getFileList()
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
  getFileList()
})
</script>

<style scoped lang="scss">
.file-item {
  &:hover {
    .check-item {
      visibility: visible !important;
    }
    .action {
      display: flex !important;
    }
  }
}
</style>
