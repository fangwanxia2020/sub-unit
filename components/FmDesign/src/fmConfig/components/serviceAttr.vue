<template>
  <div>
    <div v-for="(item,index) in data.prop.relation" :key="index" class="service-list">
      <el-select v-model="item.templateServiceInterfaceId" placeholder="请选择" @change="selectAttr(item)">
        <el-option
          v-for="item1 in interfaceJsonData"
          :key="item1.templateServiceInterfaceId"
          :label="item1.interfaceName"
          :value="item1.templateServiceInterfaceId">
        </el-option>
      </el-select>
      <el-select v-model="item.attrKey" placeholder="请选择" @change="selectAttrKey(item)">
        <el-option
          v-for="item1 in getRelationAttr(item.templateServiceInterfaceId)"
          :key="item1.attrKey"
          :label="`${item1.requiredStatus == 1 ? '*' :''}${item1.attrName}`"
          :value="item1.attrKey">
        </el-option>
      </el-select>
      <el-button icon="el-icon-plus" circle type="primary" @click="addServiceAttr"></el-button>
      <el-button icon="el-icon-minus" circle type="danger" @click="deleteServiceAttr(index)" v-show="index !== 0"></el-button>
    </div>
  </div>
</template>

<script>
  import { BIND_ITEM_LIST } from '../../constants'
  export default {
    props:{
      interfaceJsonData:{
        type:Array,
        default:() =>{
          return []
        }
      },
      data:{
        type:Object,
        require:true,
        default:() =>{
          return {}
        }
      }
    },
    computed: {
      getRelationAttr() {
        return (interfaceId) => {
          if(interfaceId) {
            const targetItem = this.interfaceJsonData.find(item=>{
              return interfaceId === item.templateServiceInterfaceId
            })
            let attrs = []
            if(this.data.type === 'binding' || this.data.type === 'customAttr') {// 关联组件，只获取list类型的参数
              targetItem.attrVoList.forEach(attr=>{
                if(attr.attrType && ((attr.attrType).toLowerCase() === 'list')) {
                  attrs.push(attr);
                }
              })
              this.bindingItemList = attrs;
            } else {
              attrs = targetItem.attrVoList
              this.bindingItemList = []
            }
            return attrs
          } else{
            return []
          }
        }
      }
    },
    data() {
      return {
        modelRelation:this.data.prop.relation,
        bindingItemList:[],
      }
    },
    watch:{
      'data.prop.relation':{
        handler(newValue) {
          this.modelRelation = newValue;
        },
        deep:true
      }
    },
    methods:{
      addServiceAttr() {
        this.modelRelation.push({
          templateServiceInterfaceId:null,
          attrKey:null,
        })
      },
      deleteServiceAttr(index) {
        this.modelRelation.splice(index,1);
      },
      selectAttr(item) {
        item.attrKey = null;
      },
      selectAttrKey(item) {
        let list = this.getRelationAttr(item.templateServiceInterfaceId)
        let selectAttrItem = list.find(attrItem=>{
          return attrItem.attrKey == item.attrKey
        })
        if(this.data.type === 'binding') {
          for(let i = 0;i < this.bindingItemList.length;i++) {
            if(this.bindingItemList[i].attrKey === item.attrKey) {
              this.data.childrenItemList = this.bindingItemList[i][BIND_ITEM_LIST] || [];
              return;
            }
          }
        } else {
          this.data.name = selectAttrItem.attrName || this.data.name;
          this.data.options.required = selectAttrItem.requiredStatus === 1 ? true :false;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .service-list {
    display: flex;
  }
</style>