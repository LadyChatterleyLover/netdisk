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
                <a-image lazy :src="row.url" :preview-mask="false" />
              </div>
              <div v-if="row.ext === 'pdf'" class="h-8 w-8 rounded-md">
                <img
                  class="w-full h-full"
                  src="../../assets/pdf.png"
                  @click="viewPdf(row.url)"
                />
              </div>
              <div v-if="row.ext === 'plain'" class="h-8 w-8 rounded-md">
                <img
                  class="w-full h-full"
                  src="../../assets/txt.png"
                  @click="viewTxt(row.url, row.name)"
                />
              </div>
              <div
                v-if="row.ext.includes('.sheet')"
                class="h-8 w-8 rounded-md"
                @click="viewExcel(row)"
              >
                <img class="w-full h-full" src="../../assets/excel.png" />
              </div>
              <div
                v-if="row.ext.includes('.document')"
                class="h-8 w-8 rounded-md"
                @click="viewDocx(row)"
              >
                <img class="w-full h-full" src="../../assets/docx.png" />
              </div>
              <div
                v-if="row.ext.includes('zip')"
                class="h-8 w-8 rounded-md"
                @click="viewZip(row)"
              >
                <img class="w-full h-full" src="../../assets/zip.png" />
              </div>
              <div
                v-if="videoType.includes(row.ext.toLowerCase())"
                class="h-8 w-8 rounded-md"
              >
                <img
                  class="w-full h-full"
                  src="../../assets/video.png"
                  @click="viewVideo(row.url)"
                />
              </div>
              <div
                v-if="audioType.includes(row.ext.toLowerCase())"
                class="h-8 w-8 rounded-md"
              >
                <img
                  class="w-full h-full"
                  src="../../assets/audio.png"
                  @click="viewAudio(row.url)"
                />
              </div>
            </div>
            <div class="flex-1 flex ml-[16px]">
              <div v-if="row.isAdd" class="flex ml-8">
                <a-input v-model:value="row.name" size="small" allow-clear />
              </div>
              <div v-else @click="clickItem(row)">{{ row.name }}</div>
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
              <a-tooltip title="分享" placement="bottom">
                <share-alt-outlined
                  class="mr-3 text-sm"
                  style="color: #06a7ff"
                />
              </a-tooltip>
              <a-tooltip title="下载" placement="bottom">
                <download-outlined
                  class="mr-3 text-sm"
                  style="color: #06a7ff"
                  @click="downloadFile(row.url)"
                />
              </a-tooltip>
              <a-tooltip title="删除" placement="bottom">
                <delete-outlined
                  class="mr-3 text-sm"
                  style="color: #06a7ff"
                  @click="delFile(row)"
                />
              </a-tooltip>
              <a-dropdown>
                <ellipsis-outlined
                  class="mr-3 text-sm"
                  style="color: #06a7ff"
                />
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="1">
                      <span>重命名</span>
                    </a-menu-item>
                    <a-menu-item key="2">
                      <span>复制</span>
                    </a-menu-item>
                    <a-menu-item key="3">
                      <span>移动</span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </template>
      </vxe-column>
      <vxe-column
        title="修改时间"
        field="updateAt"
        :formatter="formatterTime"
        sortable
      />
      <vxe-column title="大小" field="size" sortable>
        <template #default="{ row }">
          {{ row.isDir ? '-' : useFormatFileSize(row.size) }}
        </template>
      </vxe-column>
    </vxe-table>
    <PreviewVideo ref="PreviewVideoRef" />
    <PreviewAudio ref="PreviewAudioRef" />
    <PreviewTxt ref="PreviewTxtRef" />
    <PreviewZip ref="PreviewZipRef" />
  </div>
</template>

<script lang="ts" setup>
import { createVNode, inject, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { Modal, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import api from '../../api'
import type { VxeColumnPropTypes } from 'vxe-table'
import type { FileItem } from '@/types/file'
import { useFormatFileSize } from '@/hooks/useFormatFileSize'
import PreviewVideo from '@/components/previewVideo/PreviewVideo.vue'
import PreviewAudio from '@/components/previewAudio/PreviewAudio.vue'
import PreviewTxt from '@/components/previewTxt/PreviewTxt.vue'
import PreviewZip from '@/components/previewZip/PreviewZip.vue'
import { download } from '@/utils/util'

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

const getFileList = inject<() => void>('getFileList')

const props = defineProps<{
  fileList: FileItem[]
}>()
const emits = defineEmits<{
  'update:fileList': [val: FileItem[]]
}>()

const router = useRouter()

const PreviewVideoRef = ref()
const PreviewAudioRef = ref()
const PreviewTxtRef = ref()
const PreviewZipRef = ref()
const tableData = ref<FileItem[]>([])
const checkAll = ref(false)

const formatterTime: VxeColumnPropTypes.Formatter<FileItem> = ({
  cellValue,
}) => {
  return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
}

const clickItem = (row: FileItem) => {
  if (videoType.includes(row.ext)) {
    viewVideo(row.url)
  }
  if (audioType.includes(row.ext)) {
    viewAudio(row.url)
  }
  if (row.ext === 'pdf') {
    viewPdf(row.url)
  }
  if (row.ext === 'plain') {
    viewTxt(row.url, row.name)
  }
  if (row.ext.includes('.sheet')) {
    viewExcel(row)
  }
  if (row.ext.includes('.document')) {
    viewDocx(row)
  }
  if (row.ext.includes('zip')) {
    viewZip(row)
  }
}

const viewExcel = async (row: FileItem) => {
  const { href } = router.resolve({
    path: '/previewExcel',
    query: {
      excelUrl: row.url,
    },
  })
  window.open(href, '_blank')
}

const viewDocx = async (row: FileItem) => {
  const { href } = router.resolve({
    path: '/previewDocx',
    query: {
      excelUrl: row.url,
    },
  })
  window.open(href, '_blank')
}

const viewPdf = (url: string) => {
  window.open(url)
}

const viewVideo = (url: string) => {
  PreviewVideoRef.value?.open(url)
}

const viewAudio = (url: string) => {
  PreviewAudioRef.value?.open(url)
}

const viewTxt = async (url: string, name: string) => {
  const { data } = await axios.get(url, {
    headers: {
      'Content-Type': 'txt/plain;charset=utf-8',
    },
  })
  PreviewTxtRef.value?.open(data, name)
}

const viewZip = async (row: FileItem) => {
  PreviewZipRef.value?.open(row)
}

const downloadFile = (url: string) => {
  download(url)
}

const delFile = (row: FileItem) => {
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
      api.file.recoveryFile([row.id!]).then((res) => {
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
