<template>
  <div class="w-full h-full flex justify-center items-center">
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
              {{ shareData?.username }} 分享于 {{ shareData?.shareAt }}
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
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import api from '../../api'

interface ShareData {
  name: string
  shareAt: string
  username: string
  avatar: string
}

const route = useRoute()
const urlCode = route.params.code as string
const shareData = ref<ShareData>()
const code = ref('')

const getFile = () => {
  api.file
    .findFileByCode({
      code: urlCode,
    })
    .then((res) => {
      if (res.code === 200) {
        shareData.value = res.data as ShareData
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
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
    })
}

onMounted(() => {
  getFile()
})
</script>

<style scoped></style>
