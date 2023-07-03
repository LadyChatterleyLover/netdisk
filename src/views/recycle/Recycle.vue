<template>
  <a-button type="primary" shape="round" @click="clear">清空回收站</a-button>
  <div class="font-bold mt-3">回收站</div>
  <div class="mt-8 file-list-table">
    <vxe-table ref="tableRef" :data="tableData">
      <vxe-column title="文件名">
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
              <div class="flex">
                <redo-outlined
                  style="
                    color: #1890ff;
                    margin-right: 2px;
                    transform: rotate(180deg);
                    position: relative;
                    top: -13px;
                  "
                />
                <a-button
                  type="link"
                  style="padding: 0"
                  class="mr-3 relative top-[-5px]"
                  @click="reductionFile"
                  >还原</a-button
                >
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
        title="删除时间"
        field="deleteAt"
        :formatter="formatterTime"
        sortable
        align="center"
      />
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
          <a-button
            type="link"
            style="padding: 0"
            class="mr-3"
            @click="reductionFile(row)"
            >还原</a-button
          >
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
import { computed, createVNode, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import api from '../../api'
import type { VxeColumnPropTypes, VxeTableInstance } from 'vxe-table'
import type { FileItem } from '@/types/file'
import { useFormatFileSize } from '@/hooks/useFormatFileSize'
import { useFileStore } from '@/stores/file'

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

const fileStore = useFileStore()

const tableData = computed(() => fileStore.fileList)
const selectList = ref<number[]>([])
const checkAll = ref(false)
const indeterminate = ref(false)
const tableRef = ref<VxeTableInstance<FileItem>>()

const formatterTime: VxeColumnPropTypes.Formatter<FileItem> = ({
  cellValue,
}) => {
  return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
}

const getFileList = () => {
  api.file
    .getFileList({
      isRecovery: true,
    })
    .then((res) => {
      fileStore.setFileList(res.data)
    })
}

const selectAll = () => {
  indeterminate.value = false
  if (checkAll.value) {
    selectList.value = tableData.value.map((item) => item.id)
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
    selectList.value.push(row.id)
  } else {
    selectList.value = selectList.value.filter((item) => item !== row.id)
  }
}

const clear = () => {
  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    content: '确认清空回收站吗？',
    okText: '删除',
    width: '500px',
    onOk() {
      const ids = tableData.value.map((item) => item.id)
      api.file.deleteFile(ids).then((res) => {
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

const reductionFile = (row?: FileItem) => {
  const ids: number[] = []
  if (row.id) {
    ids.push(row.id)
  }
  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    content: '确认还原选中的文件？',
    onOk() {
      api.file.reductionFile(row.id ? ids : selectList.value).then((res) => {
        if (res.code === 200) {
          message.success(res.msg)
          getFileList()
          selectList.value = []
          checkAll.value = false
        } else {
          message.error(res.msg)
        }
      })
    },
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
