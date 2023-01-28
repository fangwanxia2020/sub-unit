<template>
  <div class="binding-content">
    <el-checkbox-group v-model="checkList">
      <div v-for="bindItem in item.list" :key="bindItem.key" :style="{borderStyle:item.options.borderStyle,backgroundColor:item.options.backgroundColor}" class="binding-item">
        <el-checkbox :label="bindItem.key" class="checkbox-binding">
          <div v-if="bindItem.type === 'grid'">
            <grid-item :item="bindItem" v-bind="$attrs" v-on="$listeners" :bindInfo="item" :models.sync="dataModel"></grid-item>
          </div>
          <div v-else>
            <pc-form-item
              :key="bindItem.key"
              v-bind="$attrs"
              :widget="bindItem"
              v-on="$listeners"
              :models.sync="dataModel"
              :bindInfo="item"
            >
              <div
                :slot="bindItem.options.slotName"
                slot-scope="{data}"
              >
                <slot
                  :name="bindItem.options.slotName"
                  :data="data"
                ></slot>
              </div>
            </pc-form-item>
          </div>
        </el-checkbox>
      </div>
    </el-checkbox-group>
    <div class="bind-btn">
      <el-button :type="item.options.addBtnType" :size="item.options.btnSize" @click="addBindingItem">{{item.options.addBtnText}}</el-button>
      <el-button :type="item.options.delBtnType" :size="item.options.btnSize" @click="deleteBindingItem">{{item.options.delBtnText}}</el-button>
    </div>
  </div>
</template>
<script>
  import { itemMixin } from '../mixins/itemMixin';
  import gridItem from './gridItem.vue';
  import { copyBindItem } from '../json/commonFun';
  export default {
    mixins: [itemMixin],
    components: { gridItem },
    data() {
      return {
        checkList:[]
      }
    },
    created() {
      
    },
    methods:{
      //添加绑定项
      addBindingItem() {
        let item = this.item.list[0]
        let chilItem = copyBindItem(item);
        this.item.list.push(chilItem);
      },
      //删除绑定项
      deleteBindingItem() {
        if(this.checkList.length >= this.item.list.length) {
          
        } else {
          for(let i = 0;i<this.checkList.length;i++) {
            this.item.list.forEach((item,index)=>{
              if(item.key === this.checkList[i]){
                this.item.list.splice(index,1);
              }
            })
          }
          this.checkList = [];
        }
        
      }
    }
  }

</script>
<style lang="scss" scoped>
  .binding-content {
    margin:10px 0;
    
  }
  .checkbox-binding {
    display: flex;
  }
  .binding-item {
    border:#ccc 1px;
    padding:10px;
    margin:10px 0;
  }
  // .bind-btn {
  //   padding-left:50px;
  // }
</style>