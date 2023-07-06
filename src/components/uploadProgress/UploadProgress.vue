<template>
  <a-modal
    v-model:visible="visible"
    title="正在上传"
    style="top: 15%; left: 35%"
    :footer="null"
    @cancel="cancel"
  >
    <div class="flex items-center">
      <div class="w-10 h-10 flex ml-3">
        <div
          v-if="imgType.includes(current?.ext.toLowerCase()  as string)"
          class="w-full h-full rounded-md"
        >
          <img class="w-full h-full" src="../../assets/image2.png" />
        </div>
        <div v-if="current?.ext === 'pdf'" class="h-8 w-8 rounded-md">
          <img class="w-full h-full" src="../../assets/pdf.png" />
        </div>
        <div v-if="current?.ext === 'plain'" class="h-8 w-8 rounded-md">
          <img class="w-full h-full" src="../../assets/txt.png" />
        </div>
        <div v-if="current?.ext.includes('.sheet')" class="h-8 w-8 rounded-md">
          <img class="w-full h-full" src="../../assets/excel.png" />
        </div>
        <div
          v-if="current?.ext.includes('.document')"
          class="h-8 w-8 rounded-md"
        >
          <img class="w-full h-full" src="../../assets/docx.png" />
        </div>
        <div v-if="current?.ext.includes('zip')" class="h-8 w-8 rounded-md">
          <img class="w-full h-full" src="../../assets/zip.png" />
        </div>
        <div
          v-if="videoType.includes(current?.ext.toLowerCase() as string)"
          class="h-8 w-8 rounded-md"
        >
          <img class="w-full h-full" src="../../assets/video.png" />
        </div>
        <div
          v-if="audioType.includes(current?.ext.toLowerCase()  as string)"
          class="h-8 w-8 rounded-md"
        >
          <img class="w-full h-full" src="../../assets/audio.png" />
        </div>
      </div>
      <div class="flex-1 flex flex-col justify-center h-10 ml-3">
        <div>{{ current?.name }}</div>
        <div v-if="progress > 0 && progress < 100">
          <a-progress :percent="progress" :stroke-width="6" />
        </div>
        <div class="text-xs text-[#878c9c]">
          {{ useFormatFileSize(current?.size) }}
        </div>
      </div>
      <div v-if="progress > 0 && progress < 100" class="flex items-center">
        <a-tooltip placement="bottomLeft" title="取消">
          <div
            class="w-[28px] h-[28px] bg-[#f0faff] rounded-full cursor-pointer ml-3 flex justify-center items-center"
          >
            <redo-outlined
              v-if="canceled"
              style="color: #06a7ff"
              @click="reupload"
            />
            <close-outlined
              v-else
              style="color: #06a7ff"
              @click="cancelUpload"
            />
          </div>
        </a-tooltip>
      </div>
    </div>
    <a-divider />
    <div class="w-full flex justify-center text-[#afb3bf] text-xs">
      仅显示本次上传任务
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import api from '../../api'
import type { RcFile } from 'ant-design-vue/es/vc-upload/interface'
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

const props = defineProps<{
  uploadProgress: number
  upload: (file: RcFile) => void
}>()

const progress = ref(0)
const visible = ref(false)
const current = ref<File & { ext: string }>()
const canceled = ref(false)

const reupload = () => {
  canceled.value = false
  props.upload(current.value as any)
}

const cancelUpload = () => {
  canceled.value = true
  api.file.cancelUpload({
    name: current.value?.name as string,
  })
}

const open = (file: File & { ext: string }) => {
  current.value = file
  current.value.ext = current.value.type.split('/')[1]
  visible.value = true
}

const cancel = () => {
  visible.value = false
  progress.value = 0
  current.value = undefined
}

watch(
  () => props.uploadProgress,
  (val) => {
    progress.value = val
  },
  { immediate: true }
)

defineExpose({
  open,
})
</script>

<style scoped></style>
