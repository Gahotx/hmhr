<template>
  <!-- 放置一个图标 -->
  <div>
    <svg-icon
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      class="fullscreen"
      @click="toggleScreen"
    />
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'ScreenFull',
  data() {
    return {
      isFullscreen: false // 全屏
    }
  },
  created() {
    screenfull.on('change', () => {
      this.isFullscreen = screenfull.isFullscreen
    })
  },
  methods: {
    toggleScreen() {
      screenfull.toggle()
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
