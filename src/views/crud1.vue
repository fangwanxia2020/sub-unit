<!-- 安全制度管理 ——法律法规维护 -->
<template>
    <div class="technology">
        <ty-business-crud1
                :id="'statuteId'"
                class="high-search-crud"
                mainKey="ty-list"
                searchMode="high"
                :getListInterface="getListInterface"
                :columns="columns"
                :showSearchFields="['wjmc', 'fgbh']"
                :showOperation="[]"
                title=""
                :alignRight="true"
                @resetSearch="resetSearchFun"
                @highSearchChange="highSearchChangeFun"
                @checkedChange="handleSelectionChange"
                ref="lawsCrud"
        >
            <!--  :showMoreOperator="true" //是否显示更多按钮
              :btnOptions="btnOptions"  //更多按钮参数
              :alignRight="true" //按钮居右 -->
            <div slot="operator" class="handle-group">
                    <el-button
                            type="primary"
                            @click="goEdit('new')"
                    >
                        <ty-icon type="whp_add"></ty-icon>
                        <span class="btn-text">新增</span>
                    </el-button>
                <more-button
                        :isShowMore.sync="isShowMore"
                >
                <span class="operation-more-btn">
                          <el-button
                                style="background: #416DDD;color: white"
                                size="small"
                                @click="importFun"
                                class="operation-more-btn"
                        >导入</el-button>
                </span>
                        
                </more-button>
            </div>
            <template
                    slot="wjmc"
                    slot-scope="{ data }"
            >
        <span
                v-html="data.wjmc"
        ></span>
            </template>
            <!-- 查询字段的插槽，在查询表单中字段比较难处理的时候使用这种自定义方式 -->
            <template slot="search">
                <template v-if="searchDateRangShow">
          <span class="el-form-item el-form-item--medium search-item">
            <label class="el-form-item__label">创建时间:</label>
            <div class="el-form-item__content">
              <el-date-picker
                      style="min-width: 280px; width: 100%"
                      size="small"
                      v-model="searchDateRang"
                      type="datetimerange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
              >
              </el-date-picker>
            </div>
          </span>
                </template>
            </template>
            <!-- 插槽按钮 -->
            <template v-slot:rowOperator="scope">
<!--                <el-button-->
<!--                        class="handle-text-btn"  :icon="$detailIcon"-->
<!--                        type="text"-->
<!--                        @click="goEdit('check', scope.row)"-->
<!--                        style="margin-right: 10px"-->
<!--                >详情</el-button>-->

                <span class="operation-btn"  @click="goEdit('check', scope.row)">详情</span>
                <span class="operation-btn"   @click="handledown(scope.row)">预览</span>
                <span class="operation-btn"   @click="goEdit('modify', scope.row)">修改</span>
                <span class="operation-btn"  v-if="scope.row.status == 3"  @click="operationItem(scope.row, 2)">推送</span>
                <span class="operation-btn"   v-if="scope.row.status == 1 || scope.row.status == 2"   @click="operationItem(scope.row, 3)">废止</span>

<!--                <el-button-->
<!--                        :icon="$editIcon"  class="handle-text-btn"-->
<!--                        type="text"-->
<!--                        @click="goEdit('modify', scope.row)"-->
<!--                >修改</el-button>-->
<!--                <el-button-->
<!--                        type="text"-->
<!--                        class="handle-text-btn"-->
<!--                        v-if="scope.row.status == 3"-->
<!--                        @click="operationItem(scope.row, 2)"-->
<!--                >推送</el-button>-->

<!--                <el-button-->
<!--                        type="text"-->
<!--                        class="handle-text-btn"-->
<!--                        v-if="scope.row.status == 1 || scope.row.status == 2"-->
<!--                        @click="operationItem(scope.row, 3)"-->
<!--                >废止</el-button>-->

                <!--          <el-popover-->
                <!--            placement="right"-->
                <!--            popper-class="laws_style"-->
                <!--            trigger="hover"-->
                <!--          >-->
                <!--            <ul class="opbtn-list">-->
                <!--              <li>-->
                <!--                <el-button-->
                <!--                  type="text"-->
                <!--                  style="color: #333"-->
                <!--                  @click="identify(scope.row)"-->
                <!--                >辨识</el-button>-->
                <!--              </li>-->
                <!--              <li>-->
                <!--                <el-button-->
                <!--                  type="text"-->
                <!--                  style="color: #333"-->
                <!--                  @click="goEdit('update', scope.row)"-->
                <!--                  v-if="scope.row.updateFlag == 0"-->
                <!--                >更新</el-button>-->
                <!--              </li>-->
                <!--              <li>-->
                <!--                <el-button-->
                <!--                  type="text"-->
                <!--                  v-if="scope.row.status == 3"-->
                <!--                  style="color: #333"-->
                <!--                  @click="operationItem(scope.row, 2)"-->
                <!--                >启用</el-button>-->
                <!--              </li>-->
                <!--              <li>-->
                <!--                <el-button-->
                <!--                  type="text"-->
                <!--                  style="color: red"-->
                <!--                  v-if="scope.row.status == 1 || scope.row.status == 2"-->
                <!--                  @click="operationItem(scope.row, 3)"-->
                <!--                >废止</el-button>-->
                <!--              </li>-->
                <!--              <li>-->
                <!--                <el-button-->
                <!--                  type="text"-->
                <!--                  style="color: #333"-->
                <!--                  @click="goEdit('modify', scope.row)"-->
                <!--                >修改</el-button>-->
                <!--              </li>-->
                <!--              <li>-->
                <!--                <el-button-->
                <!--                  v-if="scope.row.status == 3"-->
                <!--                  type="text"-->
                <!--                  style="color: red"-->
                <!--                  @click="delItem(scope.row.statuteId)"-->
                <!--                >删除</el-button>-->
                <!--              </li>-->
                <!--            </ul>-->
                <!--            <el-button-->
                <!--              type="text"-->
                <!--              class="opbtn-more"-->
                <!--              slot="reference"-->
                <!--            >更多<i class="el-icon-arrow-down"></i></el-button>-->
                <!--          </el-popover>-->
                <!--        </div>-->
            </template>
        </ty-business-crud1>
        <!-- 导入 -->
        <el-dialog
                title="导入"
                width="50%"
                :visible.sync="importVisible"
        >
            <div> 参考模板： <ty-export
                    size="small"
                    buttonText="模板下载"
                    action="/system/lawStatute/downloadLawStatuteInfoTemplate"
                    exportName="法律法规导入模板"
                    style="margin-left: 10px"
            ></ty-export>
            </div>
            <div style="margin-top: 20px; display: flex; align-items: center"> 上传文件： <ty-upload-file
                    :action="`/system/lawStatute/importExcelOfLawManage`"
                    v-model="importFileVal"
                    :fileSuffixs="['xls', 'xlsx']"
                    :length="1"
                    @change="upFile"
                    :showUploadList="false"
            >
                <el-button
                        size="small"
                        icon="el-icon-upload2"
                        type="primary"
                        slot="trigger"
                        @click="setInit"
                >导入文件</el-button>
                <!-- <span
                  class="fileOp"
                  slot="fileOperator"
                  slot-scope="{ data }"
                  @click="previewFile(data.url)"
                  >预览</span
                > -->
            </ty-upload-file>
            </div>
            <div style="margin-top: 40px">
                <div class="import-tip">上传要求:</div>
                <div class="import-tip">1.文件类型仅支持xls、xlsx格式。</div>
                <div class="import-tip"> 2.不支持图片和其他类型附件导入，如有需求请导入后再次编辑。 </div>
            </div>
            <!-- <div class="footer">
              <el-button
                type="primary"
                size="small"
                @click="saveImport"
              >确定导入</el-button>
              <el-button
                size="small"
                @click="importVisible = false"
              >取消</el-button>
            </div> -->
        </el-dialog>
        <!-- 业务关联 -->
        <relative-dialog
                v-if="relativeVisible"
                :status="XStatus"
                :relativeVisible="relativeVisible"
                @getData="saveRelative"
                @cancel="closeDialog"
                :detailId="lawId"
        ></relative-dialog>
    </div>
</template>
<script>
  // import MoreButton from "@/components/MoreButton/MoreButton"
  // import {
  //   deleteLaws,
  //   modifyLaw,
  //   importLaws,
  //   saveRelative,
  //   editLaws,
  //   getfile
  // }
  //   from "@/api/safe/laws";
  // import RelativeDialog from "../component/relativeDialog.vue";
  export default {
    components: {
      // RelativeDialog,
      // MoreButton
    },
    data() {
      return {
        isShowMore: false,
        importFile: [],
        columns: [{
          sortable: true,
          label: "法规名称", //字段名
          prop: "wjmc", //字段key
          baseSearch: true,
          showOverflowTooltip: true,
          type: "slot",
          width: 150,
          formFormat: {
            type: "input",
            name: "法规名称",
            options: {
              disabled: false,
              clearable: true,
              placeholder: "请输入法规名称",
              showLabel: true,
              width: "100%",
            },
          },
        }, {
          label: "法规编号",
          prop: "fgbh",
          baseSearch: true,
          formFormat: {
            type: "input",
            name: "法规编号",
            options: {
              disabled: false,
              clearable: true,
              placeholder: "请输入法规编号",
              showLabel: true,
              width: "100%",
            },
          },
        }, {
          label: "法规主题",
          prop: "fgzt",
          showOverflowTooltip: true,
          filters: [{text: 'ooo', value: '111'}]
        },{
          label: "法规分类",
          prop: "fgfl",
          formFormat: {
            type: "select",
            icon: "icon-select",
            name: "下拉选择",
            flag: 0,
            options: {
              borderRadius: "no",
              defaultValue: "",
              multiple: false,
              disabled: false,
              clearable: false,
              placeholder: "全部",
              required: false,
              showLabel: false,
              width: "100%",
              options: [{
                value: "选项1",
              }, {
                value: "选项2",
              }, {
                value: "选项3",
              }, ],
              filterable: false,
              optionDataType: 2,
              interfaceMethod: "/basic/system/dict/data/list",
              interfaceParam: '{"dictType":"hse_FGFL"}',
              interfaceId: 1614917845000,
              resList: "rows",
              interfaceType: "get",
              tipFont: "",
              dictKey: "",
              props: {
                value: "dictValue",
                label: "dictLabel",
              },
            },
            key: 1614917844001,
            model: "fgfl",
            rules: [],
          },
          // formatter: (val) => {
          //   return this.selectDictLabel(this.fgflOptions, val);
          // },
        },
          {
            label: "法规摘要",
            prop: "zy",
            showOverflowTooltip: true,
            sortable: 'custom',
          },
          {
            label: "创建时间",
            prop: "createTime",
            width: 160,
            sortable: 'custom',
            formatter: (val) => {
              if (val) {
                return val.substring(0, 16);
              }
            },
          },
          {
            prop: "operation",
            label: "操作",
            width: 200,
            type: "operation",
            fixed: "right",
            align:"right",
          }],
        //当前选中的数据
        selectRows: [],
        //是否展示查询时间段
        searchDateRangShow: false,
        //查询时间段的值
        searchDateRang: [],
        getListInterface: {
          url: "/system/lawStatute/listsOfLawStatuteWithPage",
          methodType: "get",
          params: {
            pageSize: 10,
            pageNum: 1,
          },
          resFormatFun: this.getListResFormatFun,
        },
        qzcdOptions: [],
        fgflOptions: [],
        xxfgOptions: [],
        // 导入
        importFileVal: [],
        importVisible: false,
        // 业务关联
        relativeVisible: false,
        XStatus: "",
        lawId: "",
        // 更多按钮
        btnOptions: [
          {
            btnName: '导入',
            buttonType: '', //默认primary
            buttonSize: 'small', //默认small
            plain:false,  //默认false
            icon: 'el-icon-plus', //按钮左边的图片用这个参数
            iClass: '', //按钮右边的图标用这个参数
            btnMethods: this.importFun, //按钮绑定方法
          },
        ]
      };
    },
    created() {
      this.getDicts("hse_QZCD").then((response) => {
        this.qzcdOptions = response.data;
      });
      this.getDicts("hse_FGFL").then((response) => {
        this.fgflOptions = response.data;
      });
      this.getDicts("hse_XXFG").then((response) => {
        this.xxfgOptions = response.data;
      });
    },
    watch: {
      //当时间段发生改变同步列表查询字段
      searchDateRang(timeRang) {
        if (timeRang && timeRang.length > 0) {
          this.getListInterface.params.beginTime = this.toDateUtil.formatDateTime(timeRang[0],
            "yyyy-MM-dd HH:mm:ss");
          let endTime = this.toDateUtil.formatDateTime(timeRang[1], "yyyy-MM-dd HH:mm:ss");
          this.getListInterface.params.endTime = endTime.replace(/00:00:00/, "23:59:59")
        }
      },
    },
    computed: {
      canModify() {
        return this.selectRows.length == 1;
      },
      canDelete() {
        return this.selectRows.length > 0;
      },
    },
    methods: {
      //格式化列表返回值
      getListResFormatFun(res) {
        if (res.data.records && res.data.records[0]) {
          res.data.records.map((item) => {
            item.showOpbtn = false;
          });
        }
        return {
          list: res.data.records,
          total: res.data.total,
        };
      },
      //高级搜索切换展开收起方法
      highSearchChangeFun(val) {
        this.searchDateRangShow = val;
      },
      //重置查询
      resetSearchFun() {
        this.getListInterface.params = {};
        this.searchDateRang = [];
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.selectRows = selection;
        if (this.selectRows.length > 0) {
          this.XStatus = this.selectRows[0].sftsxx + "";
          this.lawId = this.selectRows[0].statuteId;
        }
        // this.single = selection.length != 1;
        // this.multiple = !selection.length;
        // console.log(selection, "--selection", this.single, selection.length);
      },
      handledown(row) {
        getfile(row.fileId.split(',')[0]).then((res) => {
          this.previewFile(res.data.url);
        });
      },
      // 新增、修改、更新
      goEdit(type, val) {
        let obj = {
          path: "/lawsMaintain/add",
        };
        if (type == "modify") {
          if (val.identifiedFlag == '1') {
            return this.$message.warning('该文件已辨识，不能修改')
          }
          obj = {
            path: "/lawsMaintain/edit",
            query: {
              id: val.statuteId,
              isModify: true,
            },
          };
        }
        if (type == "update") {
          obj = {
            path: "/lawsMaintain/update",
            query: {
              id: val.statuteId,
              isUpdate: true,
            },
          };
        }
        if (type == "check") {
          obj = {
            path: "/lawsMaintain/check",
            query: {
              id: val.statuteId,
              isCheck: true,
            },
          };
        }
        this.$router.push(obj);
      },
      // 删除
      delItem(statuteId) {
        // const canDel = this.selectRows.every((item) => {
        //   return item.status == 3;
        // });
        // if (!canDel) {
        //   return this.$message.warning("所选数据为废止状态才能删除");
        // }
        // const ids = this.selectRows.map((item) => item.statuteId);
        const ids = [statuteId];
        this.$confirm("是否确认删除所选数据项?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(function() {
          return deleteLaws(ids);
        }).then(() => {
          this.$refs.lawsCrud._getListData();
          this.$refs.lawsCrud.setCheckList([]);
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      // 每次把文件缓存清空
      setInit() {
        this.importFileVal = []
      },
      //启用/废止
      operationItem(val, status) {
        let postData = {
          statuteId: val.statuteId,
          status: status,
        };
        let text = status == 2 ? "推送" : "废止";
        this.$confirm("是否确认" + text + "当前法规", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(function() {
          return modifyLaw(postData);
        }).then(() => {
          this.$message.success(text + "成功");
          this.$refs.lawsCrud._getListData();
          this.$refs.lawsCrud.setCheckList([]);
        }).catch(function() {});
      },
      // 辨识
      identify(val) {
        this.$router.push({
          path: "/lawsMaintain/identify",
          query: {
            id: val.statuteId,
          },
        });
      },
      // 导入
      importFun() {
        this.$refs.lawsCrud.showMore() //这个方法可以触发更多按钮显示收起
        this.importVisible = true
      },
      // 导入
      saveImport() {
        let ids = this.importFileVal.map((item) => item.id);
        let fileId = ids.length > 1 ? ids.join(",") : ids[0] + "";
        importLaws(fileId).then((res) => {
          this.$message.success("导入成功");
          this.importVisible = false;
          this.importFileVal = [];
          this.$refs.lawsCrud._getListData();
          this.$refs.lawsCrud.setCheckList([]);
        });
      },
      closeDialog() {
        this.relativeVisible = false;
      },
      saveRelative(val) {
        let postData = {
          addBusinessCorrelationConfigDtos: val.planExist == "0" ? [] : val.list,
          businessSourceName: this.$route.meta.title,
          businessSourceNo: this.$route.name,
          planExist: val.planExist,
          receiptId: this.selectRows[0].statuteId,
          receiptNo: this.selectRows[0].fgbh,
          receiptName: this.selectRows[0].wjmc,
          processUserId: val.user[0].userId,
          processUserName: val.user[0].nickName,
          relevancyStatus: val.planExist, //关联状态
          beanName: "iBusinessLawStatute",
        };
        // let modifyData = {...this.selectRows[0], sftsxx: val.planExist}
        // let f1 = saveRelative(postData)
        // let f2 = editLaws(modifyData)
        // Promise.all([f1, f2]).then(res => {
        //   this.relativeVisible = false
        //   this.$message.success('保存成功')
        //   this.$refs.lawsCrud._getListData();
        //   this.$refs.lawsCrud.setCheckList([]);
        // })
        saveRelative(postData).then((res) => {
          this.relativeVisible = false;
          this.$message.success("保存成功");
          this.$refs.lawsCrud._getListData();
          this.$refs.lawsCrud.setCheckList([]);
        });
      },
      // 上传文件回调
      upFile(res) {
        console.log('0000000上传回调', res)
        if (res.res.code == 200) {
          this.$message.success("导入成功");
          this.importVisible = false;
          this.$refs.lawsCrud._getListData();
          this.$refs.lawsCrud.setCheckList([]);
        }
      }
    },
  };

</script>
<style
        lang="scss"
        scoped
>
.technology {
  width: 1000px;
  margin:  0 auto;
}
    /* @import '~@/assets/styles/fromSearch/fromSearch.scss';
    @include handle-group; */
    ::v-deep .searchBox .el-form .el-form-item {
      flex: 0 0 50% !important;
    }
    ::v-deep .searchBox-high .searchBox-form .el-form .el-form-item {
      flex: 0 0 50% !important
    }
    /* ::v-deep .searchBox-high .searchBox-form .el-form .el-form-item .el-form-item__label { */
        /* width: 120px !important;
    }

    ::v-deep .searchBox-high .searchBox-form .el-form .el-form-item .el-form-item__content {
        margin-left: 120px !important;
    } */

    ::v-deep {
        .el-table {
            width: 99.9% !important;
        }
    }

    .import-tip {
        color: #666;
        font-size: 14px;
        line-height: 30px;
    }

    .footer {
        text-align: right;
        margin-top: 20px;
    }

    .opbtn-flex {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .opbtn-more {
        position: relative;
        overflow: hidden;
    }

    .fgx {
        width: 0;
        height: 16px;
        border-right: solid 1px #dcdcdc;
        margin: 0 10px;
    }

    .opbtn-list {
        list-style: none;
        text-align: center;
        padding: 0;
        background: #fff;
    }

</style>
