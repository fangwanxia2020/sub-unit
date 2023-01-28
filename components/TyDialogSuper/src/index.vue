<template>
  <el-dialog v-bind="$data" v-on="events" class="dialog-super" @close="close">
    <slot></slot>
    <template slot="title">
      <div class="dialog-super-title">
        <div>
          <slot name="title">
            {{ title }}
          </slot>
        </div>
        <div>
          <i
            v-if="maximize"
            class="el-icon-full-screen"
            @click="changeFullscreen"
          ></i>
          <i v-if="minimize" class="el-icon-minus" @click="addDialogTag"></i>
        </div>
      </div>
    </template>
    <template slot="footer">
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script>
import {  generateId,deepClone } from 'utils/common'
import pubsub from "pubsub-js";
// deepClone,
export default {
  inheritAttrs: false,
  name: 'TyDialogSuper',
  props: {
    /* 是否最小化 缓存至任务栏 */
    minimize: {
      type: Boolean,
      default: false,
    },

    /* 是否最大化 */
    maximize: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    let opt = {
      //是否全屏展示
      fullscreen: false,
      //是否插入至 body 元素上
      appendToBody: true,
      //外部接收，参照element ui dialog文档
      ...this.$attrs,
    }

    return {
      ...opt,
      //todo
      isMinimize: false,
      tagsList:[],
      activeTag:null
    }
  },

  computed: {
    events() {
      // let events = JSON.parse(JSON.stringify(this.$listeners))
      let events = deepClone(this.$listeners)
      delete events.close
      return events
    },
  },

  watch: {
    $attrs(nval) {
      Object.keys(nval).forEach((key) => {
        this[key] = nval[key]
      })
    },

    fullscreen(nval) {
      this.$emit('update:fullscreen', nval)
    },
  },
  mounted(){
   pubsub.subscribe("dialogTagChange", (msgName,data) => this.tagsList=data||[]);
   pubsub.subscribe("activeTagChange", (msgName,data) => this.activeTag=data||null);
  },
  beforeDestroy(){
   pubsub.publish("dialogTagChange",this.tagsList);
  },
  methods: {
    closeDialog() {
      this.visible = false
      this.emitVisible()
    },

    openDialog() {
      this.visible = true
      this.emitVisible()
    },

    emitVisible() {
      this.$emit('update:visible', this.visible)
    },
    //是否全屏展开
    changeFullscreen() {
      this.fullscreen = !this.fullscreen
    },
    //最小化时添加组件缓存
    addDialogTag() {
      // this.$set(this.$route.meta, 'keepAlive', true);
     this.isMinimize = true
      const dialogTags=this.tagsList||[]
      let dialogTagsList = this.tagsList||[]
      let some = dialogTags.some((i) => this === i.component)
       if (!some) {
          const item = {
            component: this,
            title: this.title ? this.title : '',
            cid: generateId(),
            sign: 'dialogTag' + this.$route.name, //缓存标志
          }
          dialogTagsList.push(item)
        }
      pubsub.publish("dialogTagChange",dialogTagsList);
      this.closeDialog()
    },
    //重写内部关闭事件
    close() {
        if (this.isMinimize) return (this.isMinimize = false)
        if(this.minimize){
        let row = this.activeTag
        let tags =this.tagsList||[]
        let index = tags.findIndex((i) => i.cid === row.cid)
        tags.splice(index, 1)
        pubsub.publish("dialogTagChange",tags);
        }
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.el-icon-full-screen,
.el-icon-minus {
  cursor: pointer;
  padding-right: 18px;
}

.el-icon-minus {
  font-weight: bold;
}
</style>

<style lang="scss">
.dialog-super {
  .dialog-super-title {
    display: flex;
    justify-content: space-between;
    padding-right: 14px;
    i {
      color: #909399;
      &:hover {
        color: #1890ff;
      }
    }
  }
  .el-icon-close {
    font-weight: bold;
  }
}
</style>
