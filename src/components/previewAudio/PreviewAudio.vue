<template>
  <a-modal
    v-model:visible="visible"
    :mask-closable="false"
    :footer="null"
    :mask="false"
    style="top: 60%; left: -30%"
  >
    <vue-plyr>
      <audio controls crossorigin="*" playsinline>
        <source :src="url" type="audio/mp3" />
      </audio>
    </vue-plyr>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const url = ref('')

const open = (u: string) => {
  url.value = u
  visible.value = true
}

defineExpose({
  open,
})
</script>

<style scoped></style>
