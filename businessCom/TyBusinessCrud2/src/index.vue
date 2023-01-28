<template>
  <div class="ty-business-crud">
    <!--查询设置-->
    <ty-dialog
      :show.sync="dialogVisible"
      :appendToBody="true"
      title="设置查询字段"
      :onOk="handleSearchColumnsChange"
    >
      <el-checkbox-group v-model="checkedSearchColumns">
        <el-checkbox
          v-for="(col, index) in finalColumns"
          :label="col.prop"
          :key="index"
          >{{ col.label }}</el-checkbox
        >
      </el-checkbox-group>
    </ty-dialog>
    <!--新建/修改-->
    <edit-dialog
      :show.sync="editDialogVisible"
      :data="editObj"
      :editFormData="editFormData"
      :dialogTitle="dialogTitle"
      :disabled="editFormDisabled"
      @refresh="refreshFun"
    >
      <div>
        <slot name="detail"></slot>
      </div>
    </edit-dialog>
    <div class="ty-business-crud__title" v-if="title">{{ title }}</div>
    <ty-table1
      :size="size"
      :id="id"
      ref="tableObj"
      :columns="finalColumns"
      :data="tableData"
      :pager="page"
      :tree-props="treeProps"
      :showSelect="showSelect"
      :showIndex="showIndex"
      :checkList.sync="selectedList"
      :hidePage="hidePage"
      :border="border"
      :stripe="stripe"
      :allAlign="allAlign"
      :multipleSort="multipleSort"
      :tooltipEffect="tooltipEffect"
      @selectionChange="handleSelectionChange"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @select="handleSelectFun"
      @sortMethod="sortMethod"
      @filterChange="filterHandler"
    >
      <div slot="table_oper">
        <!-- 高级查询 -->
        <template v-if="searchMode == 'high'">
          <template v-if="showSearch">
            <div class="searchBox-high">
              <div class="searchBox-form">
                <pc-form
                  :labelSuffix="labelSuffix"
                  :rowNum="rowNum"
                  :key="searchFormKey"
                  :data="searchFormJsonData"
                  v-model="searchFormData"
                  ref="searchGenerateForm"
                  @keyup.enter.native="goSearch"
                >
                  <template #form-content-before>
                    <slot name="baseSearch" />
                  </template>
                  <template #form-content>
                    <!-- todo ylq   非列表展示的时间查询配置 高级查询-->
                    <template v-if="timeSearchList.length&&searchHigh">
                        <template v-for="(item,index) in timeSearchList">
                            <!-- 单个时间查询 -->
                                <div class="el-form-item el-form-item--small"   :key="index" v-if="item.type=='single'">
                                  <label class="el-form-item__label" style="width: 100px;">{{item.attributeName1}}{{labelSuffix}}</label>
                                  <div class="el-form-item__content" style="margin-left: 100px;">
                                    <div class="fmDesignItem">
                                        <el-date-picker
                                          v-model=" timeSearchObj[item.attribute1]"
                                          placeholder="选择日期"
                                          :type="timeFormat.type"
                                          style="width: 100px;"
                                          :format="timeFormat.format"
                                        ></el-date-picker>
                                    </div>
                                  </div>
                                </div>
                                <!-- 时间区间查询 -->
                                <div class="el-form-item el-form-item--small"  :key="index" v-if="item.type=='interval'">
                                  <label class="el-form-item__label" style="width: 100px;">{{item.intervalName}}{{labelSuffix}}</label>
                                  <div class="el-form-item__content" style="margin-left: 100px;">
                                      <div class="fmDesignItem timeInterval">
                                          <el-date-picker
                                            v-model=" timeSearchObj[item.attribute1]"
                                            :placeholder="item.attributeName1"
                                            :type="timeFormat.type"
                                            :format="timeFormat.format"
                                          ></el-date-picker>
                                          <span class="spaceMark">-</span>
                                          <el-date-picker
                                            v-model=" timeSearchObj[item.attribute2]"
                                            :placeholder="item.attributeName2"
                                            :type="timeFormat.type"
                                            :format="timeFormat.format"
                                          ></el-date-picker>
                                      </div>
                                  </div>
                                </div>
                         </template>
                    </template>
                    <slot name="search" />
                  </template>
                </pc-form>

                <template>
                  <div class="searchBox-btn">
                    <!-- //TODO ylq -->
                    <template v-if="searchBtnList.length">
                      <div
                        class="searchBox-btn_check"
                        v-for="(item, idx) in searchBtnList"
                        :key="idx"
                        @click="searchConfigFun(item, 'search')"
                      >
                        {{ item.text }}
                      </div>
                    </template>
                    <template v-else>
                      <div class="searchBox-btn_check" @click="searchFun">
                        查询
                      </div>
                      <div @click="resetSearch" class="searchBox-btn_cancel">
                        重置
                      </div>
                    </template>
                        <el-link
                          type="primary"
                          class="high-link"
                          @click="searchHighFun"
                          >更多
                          <i class="el-icon-arrow-up" v-if="searchHigh"></i>
                          <i class="el-icon-arrow-down" v-else></i>
                        </el-link>
                  </div>
                </template>
              </div>
            </div>
          </template>
          <!-- ylq:高级查询时的功能列表 -->
          <div class="searchBox-high-operator-bar">
            <template v-if="optBtnList.length">
              <div :class="alignRight ? 'align-right' : ''">
                    <div v-if="showMoreOperator">
                      <div :class="alignRight?'more':'more more-noAlignRight'">
                        <el-button type="primary" size="small" @click="showMore">
                          更多
                          <i
                            :class="
                              showBtnList
                                ? 'el-icon-arrow-up'
                                : 'el-icon-arrow-down'
                            "
                          ></i>
                        </el-button>
                        <ul v-if="showBtnList" class="more-btn"  :class="alignRight?'':'more-noAlignRight-btn'">
                          <li
                            v-for="(item, index) in optBtnList"
                            :key="index"
                            class="more-btn-li"
                          >
                            <el-button
                              v-if="['uploadBtn', 'exportBtn'].indexOf(item.clickType) == -1"
                              @click="searchConfigFun(item, 'opt')"
                               size="small"
                               type="primary"
                              :disabled="
                                item.clickType == 'batchBtn' && selectedList.length == 0
                              "
                            >
                               {{ item.text }}
                            </el-button>
                            <ty-export
                              v-else-if="item.clickType=='exportBtn'"
                              class="export-file"
                              size="small"
                              :buttonText="item.text"
                              :method="item.interfaceDetail.invokeMode"
                              :action="export_upload_urlDetail(item.interfaceDetail)"
                              :exportName="item.templateTitle"
                             :actionParams="actionParamsFun[item.actionParamsFun]"
                              :beforeExport="handleBeforeExport_Input(item)"
                              :dynamicConfig="true"
                            />
                          <ty-upload-file
                            v-else-if="item.clickType=='uploadBtn'"
                            class="import-file"
                            width="auto"
                            size="small"
                            :method="item.interfaceDetail.invokeMode"
                            :action="export_upload_urlDetail(item.interfaceDetail)"
                            :uploadFileText="item.text"
                             :actionParams="actionParamsFun[item.actionParamsFun]"
                              :beforeUpload="handleBeforeExport_Input(item)"
                            :isDownLoad="false"
                            :showUploadList="false"
                            @change="importCallback"
                            :dynamicConfig="true"
                          />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div v-else>
                        <template v-for="(item, idx) in optBtnList">
                            <el-button
                              :key="idx"
                              v-if="['uploadBtn', 'exportBtn'].indexOf(item.clickType) == -1"
                              @click="searchConfigFun(item, 'opt')"
                               size="small"
                               type="primary"
                              :disabled="
                                item.clickType == 'batchBtn' && selectedList.length == 0
                              "
                            >
                               {{ item.text }}
                            </el-button>
                            <ty-export
                              v-else-if="item.clickType=='exportBtn'"
                              :key="idx"
                              class="export-file"
                              size="small"
                              :buttonText="item.text"
                              :method="item.interfaceDetail.invokeMode"
                              :action="export_upload_urlDetail(item.interfaceDetail)"
                              :exportName="item.templateTitle"
                             :actionParams="actionParamsFun[item.actionParamsFun]"
                              :beforeExport="handleBeforeExport_Input(item)"
                               :dynamicConfig="true"
                            />
                          <ty-upload-file
                            v-else-if="item.clickType=='uploadBtn'"
                            :key="idx"
                            class="import-file"
                            size="small"
                            :method="item.interfaceDetail.invokeMode"
                            :action="export_upload_urlDetail(item.interfaceDetail)"
                            :uploadFileText="item.text"
                             :actionParams="actionParamsFun[item.actionParamsFun]"
                              :beforeUpload="handleBeforeExport_Input(item)"
                            :isDownLoad="false"
                            :showUploadList="false"
                            @change="importCallback"
                            :dynamicConfig="true"
                          />
                        </template>
                    </div>
              </div>
            </template>
            <template v-else>
              <span v-if="showOperation.indexOf('add') >= 0">
                <el-button size="small" @click="editFun()" type="primary"
                  >新建</el-button
                >
              </span>

              <div :class="alignRight ? 'align-right' : ''">
                <slot name="operator"></slot>

                <div v-if="showMoreOperator">
                  <div class="more">
                    <el-button type="primary" size="small" @click="showMore">
                      更多
                      <i
                        :class="
                          showBtnList
                            ? 'el-icon-arrow-up'
                            : 'el-icon-arrow-down'
                        "
                      ></i>
                    </el-button>
                    <ul v-if="showBtnList" class="more-btn">
                      <li
                        v-for="(item, index) in btnOptions"
                        :key="index"
                        class="more-btn-li"
                      >
                        <el-button
                          @click="item.btnMethods"
                          :type="item.buttonType || 'primary'"
                          :plain="item.plain"
                          :size="item.buttonSize || 'small'"
                          :icon="item.icon ? item.icon : ''"
                          :disabled="item.disabled"
                        >
                          {{ item.btnName }}
                          <i :class="item.iClass ? item.iClass : ''"></i>
                        </el-button>
                      </li>
                      <slot name="operatorMore"></slot>
                    </ul>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
        <!-- base、default -->
        <template v-else>
          <div class="searchBox">
            <div class="searchBox-form">
              <template v-if="showSearch">
                <pc-form
                  :labelSuffix="labelSuffix"
                  :rowNum="rowNum"
                  :key="searchFormKey"
                  :data="searchFormJsonData"
                  v-model="searchFormData"
                  ref="searchGenerateForm"
                  @keyup.enter.native="goSearch"
                >
                  <template slot="form-content">
                   <!-- todo ylq   非列表展示的时间查询配置 base查询-->
                    <template v-if="timeSearchList.length">
                        <template v-for="(item,index) in timeSearchList" >
                            <!-- 单个时间查询 -->
                                <div class="el-form-item el-form-item--small"  v-if="item.type=='single'" :key="index">
                                  <label class="el-form-item__label" style="width: 100px;">{{item.attributeName1}}{{labelSuffix}}</label>
                                  <div class="el-form-item__content" style="margin-left: 100px;">
                                    <div class="fmDesignItem">
                                        <el-date-picker
                                          v-model=" timeSearchObj[item.attribute1]"
                                          placeholder="选择日期"
                                          :type="timeFormat.type"
                                          style="width: 100px;"
                                          :format="timeFormat.format"
                                        ></el-date-picker>
                                    </div>
                                  </div>
                                </div>
                                <!-- 时间区间查询 -->
                                <div class="el-form-item el-form-item--small" v-if="item.type=='interval'" :key="index">
                                  <label class="el-form-item__label" style="width: 100px;">{{item.intervalName}}{{labelSuffix}}</label>
                                  <div class="el-form-item__content" style="margin-left: 100px;">
                                      <div class="fmDesignItem timeInterval">
                                          <el-date-picker
                                            v-model=" timeSearchObj[item.attribute1]"
                                            :placeholder="item.attributeName1"
                                            :type="timeFormat.type"
                                            :format="timeFormat.format"
                                          ></el-date-picker>
                                          <span class="spaceMark">-</span>
                                          <el-date-picker
                                            v-model=" timeSearchObj[item.attribute2]"
                                            :placeholder="item.attributeName2"
                                            :type="timeFormat.type"
                                            :format="timeFormat.format"
                                          ></el-date-picker>
                                      </div>
                                  </div>
                                </div>
                         </template>
                    </template>
                    <slot name="search"></slot>
                  </template>
                </pc-form>
                <div class="searchBox-btn">
                  <template v-if="showSearch && !searchBtnList.length">
                    <div @click="searchFun" class="searchBox-btn_check">
                      查询
                    </div>
                    <div @click="resetSearch" class="searchBox-btn_cancel">
                      重置
                    </div>
                    <el-button
                      v-if="canSetsearchField"
                      type="primary"
                      size="small"
                      @click="searchSetFun"
                      >查询字段配置</el-button
                    >
                  </template>
                  <template v-else>
                    <div
                      class="searchBox-btn_check"
                      v-for="(item, idx) in searchBtnList"
                      :key="idx"
                      @click="searchConfigFun(item, 'search')"
                    >
                      {{ item.text }}
                    </div>
                  </template>
                  <template
                    v-if="
                      showSearch &&
                      searchMode == 'default' &&
                      !searchBtnList.length
                    "
                  >
                    <span v-if="showOperation.indexOf('add') >= 0">
                      <span class="line" v-if="showSearch"></span>
                      <el-button size="small" @click="editFun()" type="primary"
                        >新建</el-button
                      >
                    </span>
                  </template>
                </div>
              </template>
            </div>
          </div>
          <!-- ylq：功能按钮列表 -->
          <div
            style="padding: 10px 0 20px 0;"
            v-if="searchMode == 'default'"
            :class="alignRight ? 'align-right base-more' : ''"
          >
            <template v-if="optBtnList.length">
              <div
                class="default-more"
                v-if="showMoreOperator && searchMode == 'default'"
              >
                <div :class="alignRight?'more':'more more-noAlignRight'">
                  <el-button type="primary" size="small" @click="showMore">
                    更多
                    <i
                      :class="
                        showBtnList ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                      "
                    ></i>
                  </el-button>
                  <ul v-if="showBtnList" class="more-btn"  :class="alignRight?'':'more-noAlignRight-btn'">
                    <li
                      v-for="(item, index) in optBtnList"
                      :key="index"
                      class="more-btn-li"
                    >
                            <el-button
                              v-if="['uploadBtn', 'exportBtn'].indexOf(item.clickType) == -1"
                              @click="searchConfigFun(item, 'opt')"
                               size="small"
                               type="primary"
                              :disabled="
                                item.clickType == 'batchBtn' && selectedList.length == 0
                              "
                            >
                               {{ item.text }}
                            </el-button>
                            <ty-export
                              v-else-if="item.clickType=='exportBtn'"
                              class="export-file"
                              size="small"
                              :buttonText="item.text"
                              :method="item.interfaceDetail.invokeMode"
                              :action="export_upload_urlDetail(item.interfaceDetail)"
                              :exportName="item.templateTitle"
                             :actionParams="actionParamsFun[item.actionParamsFun]"
                              :beforeExport="handleBeforeExport_Input(item)"
                              :dynamicConfig="true"
                            />
                          <ty-upload-file
                            v-else-if="item.clickType=='uploadBtn'"
                            class="import-file"
                            width="auto"
                            size="small"
                            :method="item.interfaceDetail.invokeMode"
                            :action="export_upload_urlDetail(item.interfaceDetail)"
                            :uploadFileText="item.text"
                             :actionParams="actionParamsFun[item.actionParamsFun]"
                              :beforeUpload="handleBeforeExport_Input(item)"
                            :isDownLoad="false"
                            :showUploadList="false"
                            @change="importCallback"
                            :dynamicConfig="true"
                          />
                    </li>
                  </ul>
                </div>
              </div>
              <div v-else>
                        <template v-for="(item, idx) in optBtnList" >
                            <el-button
                             :key="idx"
                              v-if="['uploadBtn', 'exportBtn'].indexOf(item.clickType) == -1"
                              @click="searchConfigFun(item, 'opt')"
                               size="small"
                               type="primary"
                              :disabled="
                                item.clickType == 'batchBtn' && selectedList.length == 0
                              "
                            >
                               {{ item.text }}
                            </el-button>
                            <ty-export
                             :key="idx"
                              v-else-if="item.clickType=='exportBtn'"
                              class="export-file"
                              size="small"
                              :buttonText="item.text"
                              :method="item.interfaceDetail.invokeMode"
                              :action="export_upload_urlDetail(item.interfaceDetail)"
                              :exportName="item.templateTitle"
                             :actionParams="actionParamsFun[item.actionParamsFun]"
                              :beforeExport="handleBeforeExport_Input(item)"
                             :dynamicConfig="true"
                            />
                          <ty-upload-file
                           :key="idx"
                            v-else-if="item.clickType=='uploadBtn'"
                            class="import-file"
                            width="auto"
                            size="small"
                            :method="item.interfaceDetail.invokeMode"
                            :action="export_upload_urlDetail(item.interfaceDetail)"
                            :uploadFileText="item.text"
                             :actionParams="actionParamsFun[item.actionParamsFun]"
                              :beforeUpload="handleBeforeExport_Input(item)"
                            :isDownLoad="false"
                            :showUploadList="false"
                            @change="importCallback"
                            :dynamicConfig="true"
                          />
                        </template>
              </div>
            </template>
            <template v-else>
              <slot name="operator"></slot>
              <div
                class="default-more"
                v-if="showMoreOperator && searchMode == 'default'"
              >
                <div class="more">
                  <el-button type="primary" size="small" @click="showMore">
                    更多
                    <i
                      :class="
                        showBtnList ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                      "
                    ></i>
                  </el-button>
                  <ul v-if="showBtnList" class="more-btn">
                    <li
                      v-for="(item, index) in btnOptions"
                      :key="index"
                      class="more-btn-li"
                    >
                      <el-button
                        @click="item.btnMethods"
                        :type="item.buttonType || 'primary'"
                        :plain="item.plain"
                        :size="item.buttonSize || 'small'"
                        :icon="item.icon ? item.icon : ''"
                        :disabled="item.disabled"
                      >
                        {{ item.btnName }}
                        <i :class="item.iClass ? item.iClass : ''"></i>
                      </el-button>
                    </li>
                    <slot name="operatorMore"></slot>
                  </ul>
                </div>
              </div>
            </template>
          </div>
          <template v-if="showSearch && searchMode == 'base'">
            <div class="searchBox-high-operator-bar">
              <span v-if="showOperation.indexOf('add') >= 0">
                <el-button size="small" @click="editFun()" type="primary"
                  >新建</el-button
                >
              </span>
            </div>
            <!-- ylq：功能按钮列表 -->
            <div :class="alignRight ? 'align-right base-more' : ''">
              <template v-if="optBtnList.length">
                <div v-show="showMoreOperator">
                   <div :class="alignRight?'more':'more more-noAlignRight'">
                          <el-button type="primary" size="small" @click="showMore">
                            更多
                            <i
                              :class="
                                showBtnList
                                  ? 'el-icon-arrow-up'
                                  : 'el-icon-arrow-down'
                              "
                            ></i>
                          </el-button>
                          <ul v-if="showBtnList" class="more-btn"  :class="alignRight?'':'more-noAlignRight-btn'">
                            <li
                              v-for="(item, index) in optBtnList"
                              :key="index"
                              class="more-btn-li"
                            >
                            <el-button
                              v-if="['uploadBtn', 'exportBtn'].indexOf(item.clickType) == -1"
                              @click="searchConfigFun(item, 'opt')"
                               size="small"
                               type="primary"
                              :disabled="
                                item.clickType == 'batchBtn' && selectedList.length == 0
                              "
                            >
                               {{ item.text }}
                            </el-button>
                            <ty-export
                              v-else-if="item.clickType=='exportBtn'"
                              class="export-file"
                              size="small"
                              :buttonText="item.text"
                              :method="item.interfaceDetail.invokeMode"
                              :action="export_upload_urlDetail(item.interfaceDetail)"
                              :exportName="item.templateTitle"
                             :actionParams="actionParamsFun[item.actionParamsFun]"
                              :beforeExport="handleBeforeExport_Input(item)"
                               :dynamicConfig="true"
                            />
                          <ty-upload-file
                            v-else-if="item.clickType=='uploadBtn'"
                            class="import-file"
                            width="auto"
                            size="small"
                            :method="item.interfaceDetail.invokeMode"
                            :action="export_upload_urlDetail(item.interfaceDetail)"
                            :uploadFileText="item.text"
                            :actionParams="actionParamsFun[item.actionParamsFun]"
                              :beforeUpload="handleBeforeExport_Input(item)"
                            :isDownLoad="false"
                            :showUploadList="false"
                            @change="importCallback"
                            :dynamicConfig="true"
                          />
                            </li>
                          </ul>
                        </div>
                      </div>
                        <template v-for="(item, idx) in optBtnList">
                            <el-button
                             :key="idx" 
                              v-if="['uploadBtn', 'exportBtn'].indexOf(item.clickType) == -1"
                              @click="searchConfigFun(item, 'opt')"
                               size="small"
                               type="primary"
                              :disabled="
                                item.clickType == 'batchBtn' && selectedList.length == 0
                              "
                            >
                               {{ item.text }}
                            </el-button>
                            <ty-export
                             :key="idx" 
                              v-else-if="item.clickType=='exportBtn'"
                              class="export-file"
                              size="small"
                              :buttonText="item.text"
                              :method="item.interfaceDetail.invokeMode"
                              :action="export_upload_urlDetail(item.interfaceDetail)"
                              :exportName="item.templateTitle"
                               :actionParams="actionParamsFun[item.actionParamsFun]"
                              :beforeExport="handleBeforeExport_Input(item)"
                               :dynamicConfig="true"
                            />
                          <ty-upload-file
                           :key="idx" 
                            v-else-if="item.clickType=='uploadBtn'"
                            class="import-file"
                            width="auto"
                            size="small"
                            :method="item.interfaceDetail.invokeMode"
                            :action="export_upload_urlDetail(item.interfaceDetail)"
                            :uploadFileText="item.text"
                           :actionParams="actionParamsFun[item.actionParamsFun]"
                            :beforeUpload="handleBeforeExport_Input(item)"
                            :isDownLoad="false"
                            :showUploadList="false"
                            @change="importCallback"
                             :dynamicConfig="true"
                          />
                        </template>
              </template>
              <template v-else>
                <slot name="operator"></slot>
                <div v-show="showMoreOperator">
                  <div class="more">
                    <el-button type="primary" size="small" @click="showMore">
                      更多
                      <i
                        :class="
                          showBtnList
                            ? 'el-icon-arrow-up'
                            : 'el-icon-arrow-down'
                        "
                      ></i>
                    </el-button>
                    <ul v-if="showBtnList" class="more-btn">
                      <li
                        v-for="(item, index) in btnOptions"
                        :key="index"
                        class="more-btn-li"
                      >
                        <el-button
                          @click="item.btnMethods"
                          :type="item.buttonType || 'primary'"
                          :plain="item.plain"
                          :size="item.buttonSize || 'small'"
                          :icon="item.icon ? item.icon : ''"
                          :disabled="item.disabled"
                        >
                          {{ item.btnName }}
                          <i :class="item.iClass ? item.iClass : ''"></i>
                        </el-button>
                      </li>
                      <slot name="operatorMore"></slot>
                    </ul>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </template>
        <!-- 批量按钮工具栏 -->
        <div
          v-show="hasBatchBtn && selectedList.length"
          class="button-batch-group"
        >
          <div class="batch-btn">
            <div class="batch-l">
              <span>选择了{{ selectedList.length }}项</span>
              <el-button type="text" @click="clearBatch">取消选择</el-button>
            </div>
            <div class="batch-r">
              <slot name="button-batch-group">
                <el-dropdown>
                  <el-button type="default">
                    批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(item, index) in BatchBtnList"
                      :key="index"
                    >
                      <span @click="clickBatchOptions(item.type)">{{
                        item.name
                      }}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </slot>
            </div>
          </div>
        </div>
      </div>
      <template v-for="col in slotColumns" v-slot:[col.prop]="{ data }">
        <slot :name="col.prop" :data="data" />
        
      </template>
      <template v-slot:operation="scope">
        <!-- ylq 表格按钮配置 -->
        <slot name="rowOperator" v-bind:row="scope.row"></slot>
        <template v-if="tableBtnList.length">
          <!-- 显示隐藏按钮样式问题修复 by ylq  -2022.10.28 -->
          <template 
                v-for="(item, idx) in tableBtnList"
          
          >
              <el-button
                :key="idx"
                size="small"
                type="text"
                @click="searchConfigFun(item, 'table',scope.row)"
                v-if="showBtn(item.showDetail,JSON.parse(JSON.stringify(scope.row)))"
              >
                {{ item.text }}
              </el-button>
          </template>
        </template>
        <template v-else>
          <el-button
            @click="editFun(scope.row, true)"
            :type="buttonType"
            :plain="buttonType != 'text'"
            :size="buttonSize"
            v-if="showOperation.indexOf('detail') >= 0"
            >详情</el-button
          >
          <el-button
            @click="editFun(scope.row, false)"
            :type="buttonType"
            :size="buttonSize"
            :plain="buttonType != 'text'"
            v-if="showOperation.indexOf('update') >= 0"
          >
            修改
          </el-button>
          <el-button
            @click="delectRow(scope.row)"
            :type="buttonType"
            :size="buttonSize"
            :plain="buttonType != 'text'"
            class="delete-btn"
            v-if="showOperation.indexOf('delete') >= 0"
          >
            删除
          </el-button>
        </template>
      </template>
    </ty-table1>
    <ConfigDialog ref="congfigDialog" :dialogWidth="dialogWidth" @refresh="_getListData" />
  </div>
</template>
<script>
/**
 * 组件名称 TyBusinessCrud2
 * @desc 配置列表组件
 * @author hongjm  ylq
 * @date 2022年11月01日
 **/
import PcForm from 'components/PcForm'
import TyTable1 from 'components/TyTable1'
import EditDialog from './editDialog'
import ConfigDialog from './congfigDialog'
import componentsConfig from 'components/FmDesign/src/json/componentsConfig'
import { getList, delRow, batchOpts } from './api'
import DateUtil from "utils/date";
export default {
  name: 'TyBusinessCrud2',
  components: {
    EditDialog,
    TyTable1,
    PcForm,
    ConfigDialog,
  },
  props: {
    //查询模式
    //default:默认模式--新建，操作按钮在查询后面
    //base:基础模式--新建，操作按钮换行显示
    //high：高级模式--带折叠查询
    searchMode: {
      type: String,
      default: 'default',
    },
    //显示序号
    showIndex: {
      type: Boolean,
      default: false,
    },
    buttonType: {
      type: String,
      default: 'primary',
    },
    buttonSize: {
      type: String,
      default: 'mini',
    },
    //Table 的尺寸medium / small / mini
    size: {
      type: String,
      default: 'medium',
    },
    //每个项目的分页信息不统一
    pageFormat: {
      type: Object,
      default: () => {
        return {
          pageNum: 'pageNum',
          pageSize: 'pageSize',
        }
      },
    },
    //分页信息
    pageInfo: {
      type: Object,
      default: () => {
        return {
          pageNo: 1,
          limit: 10,
          sizes: [5, 10, 20],
          total: 0,
        }
      },
    },
    //唯一标识,用于存储这个列表的配置，如显示搜索的字段
    mainKey: {
      type: String,
      default: 'ty_dict_list',
    },
    // "add", "delete", "update", "detail"
    //显示的功能列表
    showOperation: {
      type: Array,
      default: () => [],
    },
    //是否可以设置查询字段
    canSetsearchField: {
      type: Boolean,
      default: false,
    },
    //显示的查询的字段
    showSearchFields: {
      type: Array,
      default: () => ['dictName', 'dictType'],
    },
    //列表主键
    id: {
      type: String,
      default: 'dictId',
    },
    //标题
    title: {
      type: String,
      default: '',
    },
    //是否显示复选框
    showSelect: {
      type: Boolean,
      default: false,
    },
    //是否显示查询
    showSearch: {
      type: Boolean,
      default: true,
    },
    //字段
    columns: {
      type: Array,
      default: () => {
        return [
          {
            baseSearch: true,
            label: '字典名称', //字段名
            prop: 'dictName', //字段key
            edit: true, //是否出现在新增修改
            formFormat: {}, //表单的数据对应表单设计器的数据
          },
          {
            label: '字典类型',
            prop: 'dictType',
            edit: true,
          },
          {
            label: '状态',
            prop: 'status',
            edit: true,
            formatter: (val) => {
              //格式化数据
              return val == 0 ? '正常' : '停用'
            },
            formFormat: {
              type: 'select',
              icon: 'icon-select',
              name: '下拉选择',
              options: {
                defaultValue: '',
                multiple: false,
                disabled: false,
                clearable: false,
                placeholder: '',
                required: false,
                showLabel: true,
                width: '',
                options: [
                  {
                    value: '1',
                    label: '停用',
                  },
                  {
                    value: '0',
                    label: '正常',
                  },
                ],
                filterable: false,
                optionDataType: 1,
                interfaceMethod: '',
                interfaceParam: '',
                interfaceId: '',
                tipFont: '',
                dictKey: '',
                props: {
                  value: 'value',
                  label: 'label',
                },
              },
              key: 1608804132000,
              model: 'select_1608804132000',
              rules: [],
            },
          },
          {
            label: '备注',
            prop: 'remark',
            edit: true,
          },
          {
            label: '创建时间',
            prop: 'createTime',
            type: 'datetime',
            edit: false,
            width: 200,
          },
          {
            prop: 'operation',
            label: '操作',
            width: 200,
            type: 'operation',
            fixed: 'right',
            align: 'right',
          },
        ]
      },
    },
    //删除方法
    delInterface: {
      type: Object,
      default: () => {
        return {
          url: '', //接口地址
          methodType: '', //接口请求类型
          resFormatFun: null, //删除接口参数格式化方法
        }
      },
    },
    //查询列表接口信息
    getListInterface: {
      type: Object,
      default: () => {
        return {
          url: '', //接口地址
          params: '', //传参数据
          methodType: '', //接口请求类型
          resFormatFun: null, //返回数据格式方法,返回包含list和total的对象
          timeout: 6e5, // 默认 10 分钟
        }
      },
    },
    //保存方法
    saveInterface: {
      type: Object,
      default: () => {
        return {
          params: '', //传参数据
          url: '', //接口地址
          methodType: '', //接口请求类型
        }
      },
    },
    //修改方法
    updateInterface: {
      type: Object,
      default: () => {
        return {
          params: '', //传参数据
          url: '', //接口地址
          methodType: '', //接口请求类型
        }
      },
    },
    // 是否隐藏分页
    hidePage: {
      type: Boolean,
      default: false,
    },
    // 是否显示更多形式的按钮
    showMoreOperator: {
      type: Boolean,
      default: false,
    },
    // 更多按钮选项
    btnOptions: {
      type: Array,
      default: () => [
        // {
        //   btnName: "导出",
        //   buttonType: "primary",
        //   buttonSize: "small",
        //   btnMethods: "",
        // },
      ],
    },
    // 是否居右
    alignRight: {
      type: Boolean,
      default: true,
    },
    stripe: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    // 所有列文字居中方式
    allAlign: {
      type: String,
      default: 'left',
    },
    // 搜索显示多少列
    rowNum: {
      type: Number,
      default: 3,
    },
    // 多个排序功能
    multipleSort: {
      type: Boolean,
      default: false,
    },
    //搜索表单label的宽度
    labelWidth: {
      type: String | Number,
      default: 100,
    },
    //接口请求排序自定义
    customSort: {
      type: Boolean,
      default: false,
    },
    //树形渲染嵌套数据的配置选项
    treeProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          hasChildren: 'hasChildren',
        }
      },
    },
    // 是否显示批量按钮工具栏
    hasBatchBtn: {
      type: Boolean,
      default: false,
    },
    //批量按钮列表

    BatchBtnList: {
      type: Array,
      default: () => {
        return [
          {
            name: '批量删除',
            type: 'del',
          },
        ]
      },
    },
    //TODO ylq
    searchBtnList: {
      type: Array,
      default: () => [],
    },
    optBtnList: {
      type: Array,
      default: () => [],
    },
    tableBtnList: {
      type: Array,
      default: () => [],
    },
    //附加查询参数
    affixQueryList:{
     type:Array,
     default:()=>[] 
    },
   // 全局日期格式配置
    timeFormat:{
      type: Object,
      default: () => {
        return {
          type: 'date',
          format: 'yyyy-MM-dd'
        }
      },
    },
    //自定义弹窗宽度
    dialogWidth:{
      type: String | Number,
      default: '500',
    },
  //文字超出时浮动显示样式
    tooltipEffect:{
      type: String,
      default: "light",
    },
  //列表项功能配置
    columnFieldList:{
      type:Array,
      default:()=>[] 
    },
  //查询接口方式是否为表达式查询
   expressionStatus:{
      type:Boolean,
      default:false
    },
 // 非列表展示的时间查询配置
     timeSearchList:{
      type:Array,
      default:()=>[] 
    },
    //搜索框是否显示冒号 --2022/12/27 ylq
    showLabelSuffix:{
      type:Boolean,
      default:true
    },
    //全局配置 --2022/12/28 ylq
    totalData:{
      type:Object,
      default:()=>({})
    }
  },
  data() {
    let fields = this.showSearchFields || []
    if (this.canSetsearchField) {
      const saveSearchField = JSON.parse(
        localStorage.getItem('tyBusinessCrud_set') || '{}'
      )['searchSet']
      fields =
        (saveSearchField && saveSearchField[this.mainKey]) ||
        this.showSearchFields ||
        []
    }
    return {
      searchHigh: false, //是否为高级搜索展开模式
      checkedSearchColumns: fields, //显示查询的字段,用来同步checkbox
      showSearchColumns: fields, //总的显示查询字段
      dialogVisible: false,
      selectedList: [], //复选框的选中的值包含分页
      editFormDisabled: false, //是否可以编辑表单
      searchFormKey: Date.parse(new Date()),
      searchFormData: {}, //搜索表单的值
      searchFormDataByBtn:{},//点击搜索按钮才去发起查询 --ylq 2022/11/18
      editObj: {}, //编辑表单的数据
      editDialogVisible: false, //修改或者新增
      checkTableRow: [], //复选框选中列表
      tableData: [], //列表数据
      page: this.getInitPageObj(), //分页对象
      showBtnList: false,
      sortList: [],
      dialogTitle: '', //dialogtitle自定义展示字段
      queryExpression:[],
      filterParams:{},
      timeSearchObj:{},//非列表展示的查询时间集合
      actionParamsFun:{},
      labelSuffix:":" //搜索框前缀
    }
  },
  provide() {
    return {
      crudObj: this,
    }
  },
  watch: {
    selectedList(val) {
      this.$emit('checkedChange', val)
    },
  },
  computed: {
    //搜索表单格式
    searchFormJsonData() {
      const formatList = []
      if(!this.showLabelSuffix){
        this.labelSuffix=""
      }
      let searchColumns = this.columns.filter(
        (item) => this.showSearchColumns.indexOf(item.prop) >= 0
      )
      //高级搜索模式
      if (this.searchMode == 'high') {
        let base = searchColumns.filter((item) => item.baseSearch == true)
        let noBase = searchColumns.filter((item) => !item.baseSearch)
        searchColumns = base.concat(noBase)
        if (this.searchHigh == false) {
          searchColumns = base
        }
      }
      return {
        list: this.creatFormatFormFun(searchColumns, true),
        config: {
          id: 'form_1591861099000',
          labelWidth: this.labelWidth,
          labelPosition: 'right',
          size: 'small',
          formName: '111',
        },
      }
    },
    //编辑表单的格式
    editFormData() {
      const editColumns = this.columns.filter((item) => item.edit == true)
      this.dialogTitle = this.columns.filter(
        (item) => item.isDialogTitle == true
      )[0]?.prop
      return this.creatFormatFormFun(editColumns)
    },
    //插槽字段
    slotColumns() {
      return this.columns.filter((item) => item.type == 'slot')
    },
   //在接收父组件传入的columns字段后做相关前置处理后得到最终的columns字段
   finalColumns(){
     const resColumns=this.columns
     const columnFieldList=this.columnFieldList
     const filterList=  columnFieldList.filter(i=>i.type=="filter").map(v=>v.columnProps)
     const sortList= columnFieldList.filter(i=>i.type=="sort").map(v=>v.columnProps)
     resColumns.forEach((item) => {
         //列表日期格式处理
          if (item.isDateFormat) {
            if(sortList.includes(item.prop)){
              item.sortable="custom"
            }
            Object.assign(item, {
              formatter: (val) => {
                if (val) {
                  const isIE=!!window.ActiveXObject || "ActiveXObject" in window
                  const isFF=navigator.userAgent.toLowerCase().indexOf("firefox") > 0 ? true : false;
                  if(isIE||isFF){
                  //todo ylq  
                  return val
                  // return DateUtil.formatDateTime(val, this.timeFormat.format).replace(new RegExp(/-/gm) ,"/")
                  }
                  return DateUtil.formatDateTime(val, this.timeFormat.format);  // todo ylq
                }
                return val
              }
            })
          }
        //字典格式数据转换处理
          if(item.dictType){
            if(filterList.includes(item.prop)){
              item.filters=item.dictTypeList.map(i=>({text:i.dictLabel,value:i.dictValue}))
            }
              Object.assign(item, {
                formatter: (val) => {
                    if(typeof val === 'undefined' || val === null || val === ""){
                      return ""
                    }else{
                      const dict = item.dictTypeList.find((_dict) => Number(_dict.dictValue) === Number(val))
                      return dict ? dict.dictLabel : ''
                    }
                }
              })
          }
        })
        //操作列不对齐样式修复 by ylq  -2022.10.28
     resColumns[resColumns.length-1].width=null
     //判断是否有列表按钮配置，有则加入操作栏
     const hasOperation = resColumns.find((i) => i.prop == 'operation')
     if (this.tableBtnList.length && !hasOperation) {
       resColumns.push({
            prop: 'operation',
            label: '操作',
            baseSearch: false,
            width: 200,
            search: false,
            type: 'operation',
            show: true,
            fixed: 'right',
            align: 'right'
          })
        }
        //操作列不对齐样式修复 by ylq  -2022.10.28
     this.$nextTick(()=>{
       this.$refs.tableObj.$refs.tyTableObj.doLayout()
     })
     return resColumns
   },
  },
  created() {
    //获取模板配置后的前置处理
    this.$emit("preConfig")
    this._getListData()
  },
  methods: {
    //获取搜索表单的值
    getSearchFormData() {
      // return this.searchFormData;
      //点击搜索按钮才去发起查询 --ylq 2022/11/18
      return this.searchFormDataByBtn;
    },
    //修改新增数据后操作
    refreshFun(res) {
      const { isAdd, data } = res
      if (isAdd) {
        this.$emit('add', data)
      } else {
        this.$emit('update', data)
      }
      this._getListData()
    },
    //保存显示搜索的字段
    handleSearchColumnsChange() {
      const checkField = this.checkedSearchColumns
      let setting = JSON.parse(
        localStorage.getItem('tyBusinessCrud_set') || '{}'
      )
      const obj = {
        [this.mainKey]: checkField,
      }
      setting['searchSet'] = obj
      localStorage.setItem('tyBusinessCrud_set', JSON.stringify(setting))
      this.showSearchColumns = checkField
      this.dialogVisible = false
    },
    //查询设置
    searchSetFun() {
      this.dialogVisible = true
    },
    //获取选中的列表项
    getCheckList() {
      return this.selectedList
    },
    //设置选中的列表项
    setCheckList(list) {
      this.$refs.tableObj.changeRowSelection(list, this.id)
      this.$set(this, 'selectedList', list)
      //this.selectedList = list;
    },
    //格式化表单
    creatFormatFormFun(columns, isSearch) {
      const formatList = []
      columns.forEach((item) => {
        const { label, prop, formFormat = {} } = item
        const formatType = (formFormat && formFormat.type) || 'input'
        const configCom = componentsConfig.pc.base
        const comFormatObj = configCom.find((o) => formatType == o.type)
        if (comFormatObj) {
          const thisObj = {
            ...comFormatObj,
            ...formFormat,
            name: label,
            key: prop,
            model: prop,
          }
          //设置宽度为100%
          if (this.searchMode == 'high') {
            thisObj.options.width = '100%'
          }
          // else {
          //   thisObj.options.width = "130px";
          // }
          if (isSearch) {
            //查询不用有验证规则
            thisObj.rules = []
            thisObj.options.clearable = true
          }
          formatList.push(thisObj)
        }
      })
      const { baseSearch } = this.$scopedSlots
      let baseSearchNodes = []
      if (baseSearch) {
        baseSearchNodes = this.$scopedSlots.baseSearch()
      }
      // console.log(baseSearchNodes)
      //高级搜索时查询三个元素插入搜索按钮
      // if (this.searchMode == "high") {
      //   formatList.splice(2 - baseSearchNodes.length, 0, {
      //     type: "slot",
      //     icon: "icon-wenzishezhi-",
      //     name: "搜索按钮插槽",
      //     flag: 1,
      //     options: {
      //       width: "100%",
      //       slotName: "searchBtnSlot",
      //       defaultValue: "",
      //       required: false,
      //       validator: "",
      //       hideLabel: true,
      //     },
      //     key: 1619576911000,
      //     model: "slot_1619576911000",
      //     rules: [],
      //   });
      // }
      return formatList
    },
    // 复选框选择
    handleSelectionChange(val) {
      this.checkTableRow = val
    },
    //删掉此项数据
    deleteCheckRow(item) {
      this.checkTableRow = this.checkTableRow.filter(
        (obj) => obj[this.id] != item[this.id]
      )
      this.$refs.tableObj.changeRowSelection(this.checkTableRow)
    },
    // 获取初始化分页对象
    getInitPageObj() {
      const page = Object.assign(
        {
          pageNo: 1,
          limit: 10,
          sizes: [5, 10, 20],
          total: 0,
        },
        this.pageInfo
      )
      return page
    },
    // 重置查询
    resetSearch() {
      this.$set(this, 'selectedList', [])
      this.searchFormKey = Date.parse(new Date())
      this.searchFormData = {}
      //点击搜索按钮才去发起查询 --ylq 2022/11/18
      this.searchFormDataByBtn={}
      this.page = this.getInitPageObj()
      // this.sortList = []
      this.timeSearchObj={} //重置非列表展示的查询时间 ylq 2022/10/29
      this.$emit('resetSearch')
      this.searchHigh = false
      this._getListData()
      this.$emit('highSearchChange', this.searchHigh)
    },
    // 查询
    searchFun() {
      this.$set(this, 'selectedList', [])
      this.page = this.getInitPageObj()
      //点击搜索按钮才去发起查询 --ylq 2022/11/18
      this.searchFormDataByBtn=this.searchFormData
      this.$emit('search')
      this.searchHigh = false
      this._getListData()
      this.$emit('highSearchChange', this.searchHigh)
    },
    // 查询列表
    _getListData() {
      //页数，页码
      const { pageNo, limit } = this.page
      const { params, resFormatFun } = this.getListInterface
      let postData = {
        [this.pageFormat['pageNum'] || 'pageNum']: pageNo,
        [this.pageFormat['pageSize'] || 'pageSize']: limit,
      }
      if(this.expressionStatus){
        //排序筛选
        if (this.queryExpression && this.queryExpression.length > 0) { 
          let map = new Map();
          for (let item of this.queryExpression) {
              map.set(item.key, item);
          }
          this.queryExpression = [...map.values()];
        }
        const customQueryList= this.columnFieldList.filter(i=>i.type=="customQuery").map(v=>v.columnProps)
       let obj={
        // ...this.searchFormData,
        ...this.searchFormDataByBtn
       }
       if (this.affixQueryList.length) {
            const affixQuery = {}
            this.affixQueryList.map((item) => {
            const { key,value } = item
            affixQuery[key] = value
            })
            obj={
              ...obj,
              ...affixQuery
            }
          }
        if(params){
            obj={
              ...obj,
              ...params
           }
        }
        let arr=[]
        Object.keys(obj).forEach((key) => {
          arr.push(
            {
              expression: 'EQ',
              key,
              value:obj[key]
             }
            ); 
        })
      //非列表展示时间参数表达式查询 格式化 ylq
        Object.keys(this.timeSearchObj).forEach((key) => {
          arr.push(
            {
              expression: 'EQ',
              key,
              value:DateUtil.formatDateTime(this.timeSearchObj[key], this.timeFormat.format)
             }
            ); 
        })
        arr.forEach(item=>{
           if(customQueryList.includes(item.key)){
             item.expression=  this.columnFieldList.find(i=>i.type=="customQuery"&&i.columnProps==item.key).expressionType
           }
        })
      postData.query = [...this.queryExpression,...arr]
      }else{
        const timeSearchObj={}
        for(var key in this.timeSearchObj){
          timeSearchObj[key]=DateUtil.formatDateTime(this.timeSearchObj[key], this.timeFormat.format)
	    	}
        //普通查询
          postData = {
            // ...this.searchFormData,
            ...this.searchFormDataByBtn,
            ...postData,
            ...timeSearchObj, //非列表展示参数查询 ylq
          }
          if (params) {
            postData = {
              ...params,
              ...postData,
            }
          }
          if(this.filterParams){
            postData = {
              ...this.filterParams,
              ...postData,
            }
          }
        //附加查询参数
          if (this.affixQueryList.length) {
              const affixQuery = {}
              this.affixQueryList.map((item) => {
                const { key,value } = item
                affixQuery[key] = value
              })
              postData = {
                ...affixQuery,
                ...postData,
              }
          }
          if (this.sortList && this.sortList.length > 0) {
            console.log('排序', this.sortList)
            postData.sortList = encodeURI(JSON.stringify(this.sortList))
          }
      }
      getList(postData, this.getListInterface).then((res) => {
        let list = []
        let pageTotal = 0
        if (resFormatFun) {
          const formatObj = resFormatFun(res)
          list = formatObj.list
          pageTotal = formatObj.total
        } else {
          list = res.data.records
          pageTotal = res.data.total
        }
        this.tableData = list
        this.page.total = pageTotal
        //数据为空并且总页数大于一页的数据是进行上一页处理
        let { limit, total, pageNo } = this.page
        if (this.tableData && this.tableData.length == 0 && total >= limit) {
          this.handleCurrentChange(1)
          // this.handleCurrentChange(pageNo - 1 <= 0 ? 1 : pageNo - 1)
        }
        	this.$nextTick(()=>{
             this.$refs.tableObj.$refs.tyTableObj.doLayout();
          })
      })
    },
    // 改变页面大小处理
    handleSizeChange(val) {
      this.page.limit = val
      let pageSize = Math.ceil(this.page.total / val)
      if (this.page.pageNo > pageSize) {
        //如果当前页数超过页面总数，则会触发翻页方法，不需要再进行多次列表接口请求
        return
      }
      this._getListData()
    },
    // 翻页处理
    handleCurrentChange(val) {
      this.page.pageNo = val
      this._getListData()
    },
    // 删除
    delectRow(row) {
      this.$confirm('确定删除此数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let parmasObj = {
            [this.id]: row[[this.id]],
          }
          const { resFormatFun } = this.delInterface
          if (resFormatFun) {
            parmasObj = resFormatFun(row)
          }
          delRow(parmasObj, this.delInterface).then((res) => {
            this.$message.success('删除成功!')
            this.$emit('delete', row[[this.id]])
            this._getListData()
          })
        })
        .catch(() => {})
    },
    //新建/修改
    editFun(row, editDisabled) {
      if (row) {
        this.editObj = row
      } else {
        this.editObj = {}
      }
      this.editDialogVisible = true
      this.editFormDisabled = !!editDisabled
    },
    //切换高级搜索模式
    searchHighFun() {
      this.searchHigh = !this.searchHigh
      this.$emit('highSearchChange', this.searchHigh)
    },
    //选择复选框
    handleSelectFun(selectObj) {
      this.$emit('select', selectObj)
    },

    // 显示更多里面的按钮列表
    showMore() {
      this.showBtnList = !this.showBtnList
    },
    // 排序方法
    sortMethod(val, orderArray) {
      let list = []
      if (this.multipleSort) {
        if (val.order) {
          //参与排序
          let flagIsHave = false
          orderArray.forEach((element) => {
            if (element.prop === val.prop) {
              element.order = val.order
              flagIsHave = true
            }
          })
          if (!flagIsHave) {
            orderArray.push({
              prop: val.prop,
              order: val.order,
            })
          }
        } else {
          //不参与排序
          orderArray = orderArray.filter((element) => {
            if (element.prop === val.prop) {
              element.order = val.order
            }
            return element.prop !== val.prop
          })
        }
        orderArray.map((item) => {
          if (item.order != null) {
            let sortMap = {}
            sortMap['key'] = item.prop
            let order = ''
            if (item.order == 'ascending') {
              order = 'asc'
            }
            if (item.order == 'descending') {
              order = 'desc'
            }
            sortMap['sortType'] = order
            list.push(sortMap)
          }
        })
      }
      if (!this.multipleSort && val.order != null) {
        let sortMap = {}
        sortMap['key'] = val.prop
        let order = ''
        if (val.order == 'ascending') {
          order = 'asc'
        }
        if (val.order == 'descending') {
          order = 'desc'
        }
        sortMap['sortType'] = order
        list.push(sortMap)
      }
      if (this.customSort&&this.expressionStatus) {
        if(this.$listeners.sortMethod) {
           this.$emit('sortMethod', val, list)
        }else{
          if(list.length==0){
             this.queryExpression= this.queryExpression.filter(i=>i.key!=val.prop)
          }
          const queryExpression = list.map((item) => {
            return {
              expression: 'ORDER',
              key: item.key,
              value: item.sortType == 'desc' ? 'DESC' : item.sortType == 'asc' ?'ASC':''
            }
          })
         this.queryExpression=this.queryExpression.concat(queryExpression)
         this._getListData()
        }
      } else {
        this.sortList = list
        this._getListData()
      }
    },
    // 列表筛选数据
    filterHandler(val) {
      this.page = this.getInitPageObj()
      if(this.$listeners.filterChange) {
         this.$emit('filterChange', val)
        }else{
          if(this.expressionStatus){
              const obj={
                "expression": "IN",
                "key": Object.keys(val)[0],
                "value":val[Object.keys(val)[0]]
              }
            this.queryExpression.push(obj)
            this._getListData()
          }else{
            if(val[Object.keys(val)[0]].length){
              this.filterParams[Object.keys(val)[0]]=val[Object.keys(val)[0]].toString()
            }else{
              delete this.filterParams[Object.keys(val)[0]];
            }
            this._getListData()
          }
        }
    },
    // 点击批量操作
    clickBatchOptions(type) {
      this.$emit('handleBatchOption', type)
    },
    clearBatch() {
      this.$refs.tableObj.changeRowSelection([], this.id)
      this.$set(this, 'selectedList', [])
    },
    // 回车键进行查询  -- 2022.09.08 - by hjm
    goSearch() {
      this.searchFun()
    },
    searchConfigFun(item, type,row) {
      if (type == 'table') {
        this.dealTableBtnFun(item,row)
        return
      }
      const { clickTypeDetail, clickType,templateTitle ,checkAttribute,interfaceDetail} = item
      if (clickType == 'toPath') {
        this.$emit('goDetailPath', {clickTypeDetail,templateTitle})
      }
      if (clickType == 'openDialog') {
        let submitText=""
        let backBtnText=""
        if(this.totalData.formBtnText){
          submitText=this.totalData.formBtnText.submitText||""
          backBtnText=this.totalData.formBtnText.backBtnText||""
        }
        this.$refs.congfigDialog.getConfigurationInfo({clickTypeDetail,templateTitle},{submitText,backBtnText})
      }
      if (clickType == 'search') {
        this.searchFun()
      }
      if (clickType == 'reset') {
        this.resetSearch()
      }
      if (clickType == 'link') {
        window.open(clickTypeDetail, '_blank')
      }
      if (clickType == 'custom') {
        //功能区自定义按钮，将列表选中数据分发出去 -ylq
        this.$emit(clickTypeDetail,this.selectedList)
      }
      if (clickType == 'batchBtn') {
        let data
        const reg = new RegExp(/\{([^}]+)\}/g);
        let regContent = reg.exec(interfaceDetail.interfaceUrl);
        if(regContent) {
          const apiObj = {
            url: interfaceDetail.interfaceUrl.slice(0,regContent.index),
            methodType: interfaceDetail.invokeMode,
          }
          data=this.selectedList.map(i=>i[checkAttribute.value]).filter(v=>v!=undefined).toString()
          batchOpts(data, apiObj).then((res) => {
            this.$message.success(res.msg)
            this.resetSearch()
          })
        }
      }
    },
    dealTableBtnFun(item,row) {
      //todo ylq
      const { clickTypeDetail, clickType, interactionType, checkAttribute,templateTitle,interfaceDetail } =
        item
      let checkObj={}
      if(clickType == 'del'){
        checkObj= row[checkAttribute.value]
      }else{
        const checkIdList = checkAttribute || []
        checkIdList.map(i=>{
              const { value } = i
              checkObj[value] = row[value]
        })
      }
    if (clickType == 'del') {
        const reg = new RegExp(/\{([^}]+)\}/g);
        let regContent = reg.exec(interfaceDetail.interfaceUrl);
        if(regContent) {
          const apiObj = {
            url: interfaceDetail.interfaceUrl.slice(0,regContent.index),
            methodType: interfaceDetail.invokeMode,
          }
          // 增加调接口前弹出框提示  -- by hjm 2022.10.25
          this.$confirm(templateTitle, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            batchOpts(checkObj, apiObj).then((res) => {
              this.$message.success(res.msg)
              this.resetSearch()
            })
          }).catch(() => {        
          });
          // data[clickTypeDetail.attrVoList[0].attrKey] = checkId
        }
      }
      if (clickType == 'custom') {
        this.$emit(clickTypeDetail,checkObj)
      } else {
        if (interactionType == 'toPath') {
        //添加表单类型判断  by ylq  -2022.10.28
          this.$emit('goDetailPath', {clickTypeDetail,checkObj,templateTitle,clickType})
        }
        if (interactionType == 'openDialog') {
          let submitText=""
          let backBtnText=""
          if(this.totalData.formBtnText){
            submitText=this.totalData.formBtnText.submitText||""
            backBtnText=this.totalData.formBtnText.backBtnText||""
          }
        //添加表单类型判断  by ylq  -2022.10.28
          this.$refs.congfigDialog.getConfigurationInfo({clickTypeDetail,checkObj,templateTitle,clickType},{submitText,backBtnText})
        }
      }
    },
    //判断按钮是否显示  -- by hjm 2022.10.25
    showBtn(e,obj){
      if (typeof(e) == 'string' && e != '') {
        for(let key in obj){
          e = e.toString().replace(new RegExp("(\")?\\$\\{"+(key)+"\\}(\")?","g"), typeof(obj[key])=='string' ?`'${obj[key]}'`:obj[key]);
        }
        return eval(e);
      }else{
        return true
      }    
    },
    //导入导出接口路径处理
    export_upload_urlDetail(interfaceDetail){
        const reg = new RegExp(/\{([^}]+)\}/g);
        let regContent = reg.exec(interfaceDetail.interfaceUrl);
        if(regContent) {
          return  interfaceDetail.interfaceUrl.slice(0,regContent.index)
        }else{
           return  interfaceDetail.interfaceUrl
        }
    },
    //上传回调
    importCallback(data){
      var res= data.res;
      if(res.code == 200){
        this.$message.success(res.msg)
      }else{
        this.$message.error(res.msg)
      }
    },
    //导入导出自定义回调
    handleBeforeExport_Input(item){
      if(this.$listeners[item.actionParamsFun]){
        if(item.clickType=='exportBtn'){
          this.$emit(item.actionParamsFun,this.selectedList,val => {
           this.$nextTick(()=>{
           this.actionParamsFun[item.actionParamsFun]=val
           })
          })
        }else{
          this.$emit(item.actionParamsFun,[],val => {
           this.$nextTick(()=>{
           this.actionParamsFun[item.actionParamsFun]=val
           })
          })
        }
      }else{
          this.actionParamsFun[item.actionParamsFun]={}
      }
    }
  },
}
</script>
<style lang="scss" scoped>
$primaryColor-ie: #409eff !default;
$primaryColor: #409eff !default;

.searchBox-high-operator-bar {
  padding: 10px 0 20px;
}

.searchBox-btn {
  position: absolute;
  right: 0;
  top: 0;
  width: 280px;
  display: flex;
  .high-link {
    margin-left: 10px;
    color: #026dff;

    &::after {
      display: none;
    }
  }
}

.searchBox-high {
  display: flex;
  padding: 20px 0 0;

  /* overflow-x: auto; */

  .searchBox-form {
    flex: 1;
    min-width: 700px;
    display: flex;
    position: relative;

    ::v-deep .el-form {
      width: 100%;
      text-align: center;
      display: flex;
      align-content: flex-start;
      flex-flow: row wrap;
      margin-right: 290px;

      .el-form-item {
        text-align: left;
        flex: 0 0 33%;
        margin-bottom: 20px;
        padding-right: 10px;
        box-sizing: border-box;
      }

      .search-item {
        .el-form-item__label {
          float: left;
          line-height: 36px;
          font-size: 14px;
          color: #606266;
          text-align: right;
          padding: 0 12px 0 0;
          box-sizing: border-box;
        }

        .search-item-ctn,
        .el-form-item__content {
          text-align: left;
          line-height: 32px;
          /* margin-left: 0 !important; */
        }
      }
    }
  }
}

.searchBox {
  padding: 20px 0 0;
  background: #fff;
  ::v-deep label {
    font-size: 14px;
    color: #666;
  }

  .line {
    height: 20px;
    width: 2px;
    background: #ccc;
    display: inline-block;
    vertical-align: middle;
    margin: 10px 10px;
  }

  display: flex;
  flex-wrap: wrap;

  .searchBox-form {
    flex: 1;
    display: flex;
    position: relative;
  }

  ::v-deep .el-form {
    width: 100%;
    text-align: center;
    display: flex;
    align-content: flex-start;
    flex-flow: row wrap;
    margin-right: 290px;

    .el-form-item {
      text-align: left;
      flex: 0 0 33%;
      margin-bottom: 20px;
      padding-right: 10px;
      box-sizing: border-box;
    }

    .search-item {
      .el-form-item__label {
        float: left;
        line-height: 36px;
        font-size: 14px;
        color: #606266;
        text-align: right;
        width: 100px;
        padding: 0 12px 0 0;
        box-sizing: border-box;
      }

      .search-item-ctn,
      .el-form-item__content {
        margin-left: 100px;
        text-align: left;
        line-height: 32px;
        /* margin-left: 0 !important; */
      }
    }

    .searchBox-btn {
      margin-bottom: 20px;
      display: flex;
    }

    .el-radio-group {
      margin-top: -10px;
    }
  }
}

.searchBox-btn_check {
  background: #026dff;
  width: 100px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
  font-weight: normal;
  padding: 0;
  margin-right: 10px;
  cursor: pointer;
  text-align: center;
}
.searchBox-btn_cancel {
  color: #026dff;
  width: 100px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  font-size: 14px;
  border: solid 1px #026dff;
  font-weight: normal;
  padding: 0;
  cursor: pointer;
  box-sizing: border-box;
  text-align: center;
}

.ty-business-crud__title {
  font-size: 20px;
  font-weight: bold;
  color: rgba(29, 29, 30, 1);
  line-height: 38px;
  position: relative;
  padding-left: 16px;
  margin-right: 30px;

  &::before {
    position: absolute;
    left: 0;
    top: 7px;
    content: '';
    width: 6px;
    height: 24px;
    background-color: $primaryColor-ie;
    background-color: $primaryColor;
  }
}

.button-batch-group {
  .batch-btn {
    width: 100%;
    height: 50px;
    background-color: #f6faff;
    padding: 0 10px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 14px;
    }
    ::v-deep .el-button {
      height: 30px;
      padding: 0 10px;
    }
  }
}

::v-deep .el-button.delete-btn {
  color: #f56c6c;
  background: #fef0f0;
  border-color: #fbc4c4;
}

::v-deep .el-button--text.delete-btn {
  color: #f56c6c;
  background: none;
  border-color: transparent;
}

::v-deep .searchBox-form {
  .el-form-item {
    display: flex;
    flex-direction: row;
    .el-form-item__label,
    label {
      padding: 7px 12px 0 0 !important;
      line-height: 18px !important;
      overflow: hidden;
      max-height: 40px;
      font-weight: normal;
    }
    .el-form-item__content {
      margin-left: 0 !important;
      flex: 1;
    }
  }
}
.more {
  position: relative;
  text-align: right;
  margin-left: 20px;
  &-btn {
    list-style: none;
    border: solid 1px #dcdcdc;
    position: absolute;
    top: 20px;
    right: 0;
    z-index: 999;
    background: #fff;
    padding: 10px;
    border-radius: 2px;
    &-li {
      margin: 5px;
    }
  }
}
.more-noAlignRight {
  text-align: unset;
  margin-left: unset;
  &-btn {
    left: 0;
    right: unset;
  }
}
.align-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.default-more,
.base-more {
  margin-bottom: 20px;
}

.more-btn-item {
  width: 100px;
}

::v-deep.el-form-item--small {
  display: inline-block;
}
.timeInterval {
  display: flex;
  justify-content: space-between;
  .spaceMark {
    padding:  0 12px;
  }
}
.export-file {
  margin: 0 10px;
}
.import-file {
  margin: 0 10px;
  display: inline-block;
}
</style>
