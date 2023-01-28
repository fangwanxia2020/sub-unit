<!--
	单选框组件
	@author nongzy
	@date 2021-07-12
	@since 1.0.0
	@describe
-->
<template>
    <div class="template-down">
        <el-button
                class="filter-item"
                type="primary"
                size="small"
                @click="toDown"
        >{{label}}
        </el-button>
    </div>
</template>
<script>
    import {getTemplateUrl} from "./api.js";

    export default {
        name: 'TemplateDown',
        components: {},
        props: {
            label: {
                default: '导入模板下载'
            },
            //值
            templateId: {
                default: null
            },
            templateFullPath: {
                default: null
            }
        },
        data() {
            return {}
        },
        methods: {
            toDown() {
                var param;
                if (this.templateId) {
                    param = {templateId: this.templateId}
                } else if (this.templateFullPath) {
                    param = {templateFullPath: this.templateFullPath}
                } else {
                    this.$message.error("没有指定资源文件");
                    return;
                }

                getTemplateUrl(param).then(res => {
                    if (res.code == 200) {
                        location.href = res.data;
                    } else {
                        this.$message.error("下载错误");
                    }
                })
            }
        }
    }

</script>
<style
        lang="scss"
        scoped
>
    .template-down {
        display: inline;
    }

</style>
