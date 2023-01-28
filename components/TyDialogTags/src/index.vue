<template>
  <div class="DialogTags" ref="dialogTags">
    <div class="dialog-tag" :key="tag.cid" v-for="tag in tagsList">
      <div class="dialog-tag-warpper">
        <span>{{ tag.title }}</span>
        <div class="dialog-tag-operation flex flex-vertical-center">
          <i class="el-icon-zoom-in mr5" @click="zoom(tag)"></i>
          <i class="el-icon-close" @click="close(tag)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pubsub from "pubsub-js";

  export default {
    name: 'TyDialogTags',
    data() {
      return {
        tagsList:[]
      }
    },
    props:{
    offsetLeft:{
      type: Number|| String,
      default:20
    }
    },
    mounted() {
      this.pubid = pubsub.subscribe("dialogTagChange", (msgName,data) => this.tagsList=data||[]);
      this.$refs.dialogTags.style.left  = this.offsetLeft + 'px';
    },

    methods: {
      zoom(row) {
        pubsub.publish("activeTagChange",row);
        let selected = this.tagsList.find(i=>i.cid===row.cid);
        selected && (selected.component.openDialog());
      },
      close(row = {}) {
        let index =  this.tagsList.findIndex(i=>i.cid === row.cid);
        let tags =this.tagsList||[]
        tags.splice(index, 1)
        pubsub.publish("dialogTagChange",tags);
      }
    }
  }
</script>

<style
  lang="scss"
  scoped
>
  .DialogTags {
    position: fixed;
    bottom: 0;
    z-index: 100;
  }
  .dialog-tag {
    background: #fff;
    padding: 10px 15px;
    border: 1px solid #ccc;
    display: inline-block;
    box-shadow: 1px 1px 5px #ccc;
    border-radius: 5px;
    margin-right: 10px;
    margin-bottom: 10px;

    .dialog-tag-warpper {
      display: flex;
    }

    .dialog-tag-operation {
      cursor: pointer;
      margin-left: 20px;
    }
  }
</style>
