<template>
  <a-modal
    v-model:visible="visible"
    :title="`${txtName} - 文本阅读`"
    width="50%"
    :mask-closable="false"
    :footer="null"
  >
    <div style="white-space: pre-wrap" v-html="txtContent" />
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const txtName = ref('')
const txtContent = ref('')

const open = (content: string, name: string) => {
  txtContent.value = content
  txtName.value = name
  visible.value = true
}

defineExpose({
  open,
})
</script>

<style scoped></style>
