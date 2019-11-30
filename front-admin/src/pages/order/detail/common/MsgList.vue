<template>
  <el-row class="baseInfo-box">
    <p v-for="(item, index) in msgList" :key="index">
      <span v-if="item.msgType == 1">{{ item.content || '' }}</span>
      
      <span class="btn" v-else-if="item.msgType == 2" @click="handlePlayAudio(item, index)">
        <audio :src="item.filePath" :id="`audio_${index}`"></audio>
        <template v-if="item.isEnded">
          <span class="el-icon-microphone cl-primary"></span>
          <span>{{ item.recordTime ? item.recordTime + '秒，' : '' }}点击收听</span>
        </template>
        <template v-else-if="item.isPaused">
          <span class="el-icon-video-pause cl-primary"></span>
          <span>播放暂停... {{ item.currentTime }} 秒，剩余 {{ item.recordTime - item.currentTime }} 秒</span>
        </template>
        <template v-else>
          <span class="el-icon-video-play cl-primary"></span>
          <span v-if="item.currentTime">正在播放... {{ item.currentTime }} 秒，剩余 {{ item.recordTime - item.currentTime }} 秒</span>
          <span v-else>准备播放...</span>
        </template>
      </span>
      <span v-else-if="item.msgType == 4">
        <span class="el-icon-document cl-primary"></span>
        <a class="cl-666" :href="item.filePath">{{ item.fileName || '' }}</a>
      </span>
    </p>
  </el-row>
</template>

<script>

const initList = list => list.reduce((res, cur) => {
  cur.isEnded = true
  cur.isPaused = false
  cur.checkStateTimer = null
  cur.currentTime = 0
  res.push(cur)
  return res
}, []);

export default {
  props: {
    row: Object
  },
  data() {
    return {
      msgList: initList(this.$val(this.row, 'msgList', []))
    }
  },
  watch: {
    row: {
      handler: function() {
        this.msgList = initList(this.$val(this.row, 'msgList', []))
      },
      deep: true
    }
  },
  methods: {
    setCheckItemPlayStateTimer(item, index) {
      if (item.checkStateTimer) {
        clearInterval(item.checkStateTimer)
      }
      
      item.checkStateTimer = setInterval(() => {
        if (item.audio.ended) {
          this.clearCheckItemPlayStateTimer(item, index)
        } else {
          item.currentTime = parseInt(item.audio.currentTime)
          this.$set(this.msgList, index, item)
        }
      }, 1000)
    },
    clearCheckItemPlayStateTimer(item, index) {
      if (item.checkStateTimer) {
        clearInterval(item.checkStateTimer)
        item.checkStateTimer = null
        item.isEnded = true
        item.isPaused = false
        item.currentTime = 0
        this.$set(this.msgList, index, item)
      }
    },
    handlePlayAudio(item, index) {
      item.audio = item.audio || document.getElementById(`audio_${ index }`)
      this.msgList.forEach((v, i) => {
        if (i !== index && v.audio && !v.isEnded && !v.isPaused) {
          v.audio.pause()
          v.isPaused = true
          this.$set(this.msgList, index, v)
          clearInterval(v.checkStateTimer)
        }
      })
      if (item.isEnded) {
        item.audio.play()
        item.isEnded = false
        this.$set(this.msgList, index, item)
        this.setCheckItemPlayStateTimer(item, index)
      } else {
        if (item.isPaused) {
          item.audio.play()
          item.isPaused = false
          this.$set(this.msgList, index, item)
          this.setCheckItemPlayStateTimer(item, index)
        } else {
          item.audio.pause()
          item.isPaused = true
          this.$set(this.msgList, index, item)
          clearInterval(item.checkStateTimer)
        }
      }
    }
  },
  destroyed() {
    this.msgList.forEach((item, index) => {
      this.clearCheckItemPlayStateTimer(item, index)
    })
  }
}
</script>

<style lang="less" scoped>
  .btn {
    cursor: pointer;
  }
  .el-icon-document {
    font-size: 20px;
  }
  .el-icon-video-pause,
  .el-icon-video-play,
  .el-icon-microphone {
    position: relative;
    top: 2px;
    padding-right: 4px;
    font-size: 24px;
  }
</style>