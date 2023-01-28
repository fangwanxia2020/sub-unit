<template>
  <div v-if="!showUrl" key="hideUrl">
    <a class="el-upload-list__item-name" href="javascript:void(0)">
      <span @click="$emit('download')">
        <i class="el-icon-document"></i>
        {{ file.name }}
      </span>
      <slot :data="file" />
    </a>
    <label class="el-upload-list__item-status-label">
      <i class="el-icon-upload-success el-icon-circle-check"></i>
    </label>
    <i
      class="el-icon-close"
      v-if="!disabled && isDelete"
      @click="$emit('remove')"
    ></i>
    <i class="el-icon-close-tip">按 delete 键可删除</i>
  </div>
  <div v-else key="showUrl">
    <el-input
      class="el-upload-list__item-name"
      style="width: 90%"
      size="mini"
      :value="file.url"
    />
    <i
      class="el-icon-close"
      v-if="!disabled && isDelete"
      @click="$emit('remove')"
    />
    <i class="el-icon-close-tip">按 delete 键可删除</i>
  </div>
</template>

<script>
/**
 * 上传文件列表项组件
 * @module TyUploadFileItem
 * @vue-prop {boolean} [showUrl=false] 是否显示 url
 * @vue-prop {boolean} [disabled=false] 是否禁用
 * @vue-prop {boolean} [isDelete=false] 是否显示删除按钮
 * @vue-prop {Object} [file={}] 文件数据
 * @vue-event {void} download 下载事件
 * @vue-event {void} remove 移除文件事件
 */
export default {
  name: 'TyUploadFileItem',
  props: {
    showUrl: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isDelete: {
      type: Boolean,
      default: true
    },
    file: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
