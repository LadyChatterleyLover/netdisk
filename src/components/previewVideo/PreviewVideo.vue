<template>
  <div
    v-show="visible"
    class="fixed top-0 bottom-0 right-0 left-0 flex justify-center items-center z-[9999]"
  >
    <div class="absolute w-full h-full top-0 left-0 opacity-50 bg-black" />
    <vue3videoPlay v-if="src" v-bind="options" />
    <div
      class="absolute flex justify-center items-center z-10 top-10 right-10 w-11 h-11 text-2xl text-white cursor-pointer"
      @click="close"
    >
      <close-circle-outlined />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)

const options = ref({})
const src = ref('')

const open = (url: string) => {
  src.value = url
  visible.value = true
  options.value = {
    width: '800px', //播放器高度
    height: '450px', //播放器高度
    color: '#409eff', //主题色
    title: '', //视频名称
    src: url, //视频源
    muted: false, //静音
    webFullScreen: false,
    speedRate: ['0.75', '1.0', '1.25', '1.5', '2.0'], //播放倍速
    autoPlay: false, //自动播放
    loop: false, //循环播放
    mirror: false, //镜像画面
    ligthOff: false, //关灯模式
    volume: 0.3, //默认音量大小
    control: true, //是否显示控制
    controlBtns: [
      'audioTrack',
      'quality',
      'speedRate',
      'volume',
      'setting',
      'pip',
      'pageFullScreen',
      'fullScreen',
    ], //显示所有按钮,
  }
}

const close = () => {
  visible.value = false
}
defineExpose({
  open,
  close,
})
</script>

<style lang="scss" scoped></style>
