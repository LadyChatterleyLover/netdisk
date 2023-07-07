<template>
  <a-modal v-model:visible="visible" title="分享文件" :msak-close="false">
    <a-form
      v-if="shareData"
      :model="shareData"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item v-if="current.length === 1" label="文件">
        <div>{{ current[0].name }}</div>
      </a-form-item>
      <a-form-item label="分享链接">
        <div>{{ shareData!.url }}</div>
      </a-form-item>
      <a-form-item label="提取码">
        <div>{{ shareData!.code }}</div>
      </a-form-item>
      <a-form-item label=" " :colon="false">
        <a-button type="primary" @click="copyUrl">复制链接及提取码</a-button>
      </a-form-item>
    </a-form>
    <a-form
      v-else
      ref="formRef"
      :model="model"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      autocomplete="off"
    >
      <a-form-item
        label="有效期"
        name="effectiveTime"
        :rules="[
          { required: true, message: '请选择有效期', trigger: 'change' },
        ]"
      >
        <a-radio-group v-model:value="model.effectiveTime">
          <a-radio :value="1">1天</a-radio>
          <a-radio :value="7">7天</a-radio>
          <a-radio :value="30">30天</a-radio>
          <a-radio :value="-1">永久</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="提取码"
        name="extractedMethod"
        :rules="[
          { required: true, message: '请选择提取码方式', trigger: 'change' },
        ]"
      >
        <a-radio-group v-model:value="model.extractedMethod">
          <a-radio value="system">系统自动生成</a-radio>
          <a-radio value="custom">自定义提取码</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        v-if="model.extractedMethod === 'custom'"
        label="自定义提取码"
        name="extractedCode"
        :rules="[
          { required: true, message: '请输入自定义提取码', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{4}$/,
            message: '提取码为4位数字和字母组合',
            trigger: 'blur',
          },
        ]"
      >
        <a-input v-model:value="model.extractedCode" size="small" allow-clear />
      </a-form-item>
    </a-form>
    <template #footer>
      <div v-if="shareData" class="flex justify-end">
        <a-button type="primary" @click="cancel">关闭</a-button>
      </div>
      <div v-else class="flex justify-end">
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" @click="confirm">确认</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import type { FileItem } from '@/types/file'
import { useCopy } from '@/hooks/useCopy'
import api from '@/api'

interface ShareData {
  code: string
  url: string
}

const visible = ref(false)
const current = ref<FileItem[]>([])
const formRef = ref<FormInstance>()
const shareData = ref<ShareData>()
const model = ref({
  effectiveTime: 7,
  extractedMethod: 'system',
  extractedCode: '',
})

const confirm = () => {
  const ids = current.value.map((item) => item.id) as number[]
  formRef
    .value!.validate()
    .then(() => {
      api.file
        .shareFile({
          ids,
          ...model.value,
        })
        .then((res) => {
          if (res.code === 200) {
            message.success(res.msg)
            shareData.value = res.data
          } else {
            message.error(res.msg)
          }
        })
    })
    .catch(() => {
      message.error('表单填写有误,请检查')
    })
}

const cancel = () => {
  current.value = []
  shareData.value = undefined
  model.value.effectiveTime = 7
  model.value.extractedCode = ''
  model.value.extractedMethod = 'system'
  visible.value = false
}

const copyUrl = () => {
  const { copy } = useCopy(
    `链接: ${shareData.value!.url} 提取码: ${shareData.value!.code}`,
    () => message.success('复制成功')
  )
  copy()
}

const open = (row: FileItem[]) => {
  current.value = row
  visible.value = true
}

defineExpose({
  open,
})
</script>

<style scoped></style>
