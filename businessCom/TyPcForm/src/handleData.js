import { isObject, isArray } from '../../../utils/common';
import { copyBindItem } from '../../../components/PcForm/src/json/commonFun'
import { ATTR_KEY, VALUE, NAME, FILED, TEMPLATE_SERVICE_INTERFACE_ID } from './constants';
export const commonType = ['input','password','textarea','number','checkbox','time','date','rate','color','select','switch','slider','imgupload','editor','text','radio','hide']

export function handleCommon(item,targetMap,data) {
  for(let i = 0;i<item.prop.relation.length;i++) {
    const relationItem = item.prop.relation[i]
    const targetObj = targetMap.get(relationItem[TEMPLATE_SERVICE_INTERFACE_ID]);
    if(isObject(data)) {
      if(isArray(data)) {
        targetObj[relationItem[ATTR_KEY]] = data;
      } else {
        targetObj[relationItem[ATTR_KEY]] = data[item.model] !== undefined ? data[item.model] : item.options.defaultValue !== '' ? item.options.defaultValue : null;
      }
    } else {
      targetObj[relationItem[ATTR_KEY]] = data;
    }
  }
} 

export function handleUploadFile(item,targetMap,data) {
  for(let i = 0;i<item.prop.relation.length;i++) {
    const relationItem = item.prop.relation[i]
    const targetObj = targetMap.get(relationItem[TEMPLATE_SERVICE_INTERFACE_ID]);
    if(isObject(data)) {
      if(isArray(data)) {
        targetObj[relationItem[ATTR_KEY]] = data;
      } else {
        const targetData = data[item.model] !== undefined ? data[item.model] : item.options.defaultValue !== '' ? item.options.defaultValue : null;
        if(item.options.fileIdsIsString && targetData) {
          const ids = targetData.map(file=>file[item.options.fileIdKey])
          targetObj[relationItem[ATTR_KEY]] = ids.join(item.options.fileIdsToString)
        } else {
          targetObj[relationItem[ATTR_KEY]] = targetData
        }
      }
    } else {
      targetObj[relationItem[ATTR_KEY]] = data;
    }
  }
} 

export function handleGrid(item,targetMap,data) {
  for(let i = 0;i<item.columns.length;i++) {
    for(let j = 0;j<item.columns[i].list.length;j++) {
      let columnsListItem = item.columns[i].list[j];
      if(isObject(columnsListItem.prop)) {
        if(columnsListItem.type === 'customAttr') {
          handleCustomAttr(columnsListItem,targetMap,data)
        } else {
          handleCommon(columnsListItem,targetMap,data)
        }
      } else {
        targetMap[columnsListItem.prop] = data[columnsListItem.model] !== undefined ? data[columnsListItem.model] : null;
      }
    }
  }
}

export function handleBind(item,targetMap,data) {
  let targetList = [];
  for(let i = 0;i<item.list.length;i++) {
    let listItem = item.list[i];
    let obj = {};
    if(listItem.type === 'grid') {
      handleGrid(listItem,obj,data)
    } else if(commonType.includes(listItem.type)) {
      obj[listItem.prop] = data[listItem.model] !== undefined ? data[listItem.model] : listItem.options.defaultValue !== '' ? listItem.options.defaultValue : null;
    }
    targetList.push(obj);
  }
  targetList = targetList.length > 0 ? targetList : null;
  handleCommon(item,targetMap,targetList);
}

export function handleCustomAttr(item,targetMap,data) {
  for(let i = 0;i<item.prop.relation.length;i++) {
    const relationItem = item.prop.relation[i]
    const targetObj = targetMap.get(relationItem[TEMPLATE_SERVICE_INTERFACE_ID]);
    if(!targetObj){
      continue;
    }
    if(!isArray(targetObj[relationItem[ATTR_KEY]])) {
      targetObj[relationItem[ATTR_KEY]] = []
    }
    if(isObject(data)) {
      let listItem = item.list[0];
      if(data[listItem.model]) {
        let obj = {
          [NAME]:listItem.name,
          [FILED]:listItem.prop,
          [VALUE]:data[listItem.model]
        }
        targetObj[relationItem[ATTR_KEY]].push(obj)
      }
    }
  }
}


export function handleCommonReq(item,targetObj,data) {
  for(let i = 0;i<item.prop.relation.length;i++) {
    const relationItem = item.prop.relation[i]
    const resDataItem = data[relationItem[ATTR_KEY]]
    if(resDataItem !== "" || resDataItem !== null) {
      targetObj[item.model] = resDataItem;
      continue;
    }
  }
} 

export function handleBindReq(item,targetObj,data,list,index) {
  let resList = [];
  for(let i = 0;i<item.prop.relation.length;i++) {
    let relationItem = item.prop.relation[i];
    if(data[relationItem[ATTR_KEY]] && isArray(data[relationItem[ATTR_KEY]])) {
      resList = data[relationItem[ATTR_KEY]];
      continue;
    }
  }
  if(resList.length > 0) {
    let resLen = resList.length;
    let itemLen = item.list.length
    if(resLen > itemLen) {
      for(let j = itemLen;j<resLen;j++) {
        let copyItem = copyBindItem(item.list[0]);
        targetObj[copyItem.model] = data[copyItem.prop]
        item.list.push(copyItem)
        list[index].list.push(copyItem)
      }
    }
    for(let i = 0;i<item.list.length;i++) {
      let listItem = item.list[i];
      if(listItem.type === 'grid') {
        handleGridReq(listItem,targetObj,resList[i])
      } else if(commonType.includes(listItem.type)) {
        targetObj[listItem.model] = resList[i][listItem.prop]
      }
    }
  }
}

export function handleGridReq(item,targetObj,data) {
  for(let i = 0;i<item.columns.length;i++) {
    for(let j = 0;j<item.columns[i].list.length;j++) {
      let columnsListItem = item.columns[i].list[j];
      if(isObject(columnsListItem.prop)) {
        if(columnsListItem.type === 'customAttr') {
          handleCustomAttrReq(columnsListItem,targetObj,data)
        } else {
          handleCommonReq(columnsListItem,targetObj,data)
        }
        
      } else {
        targetObj[columnsListItem.model] = data[columnsListItem.prop]
      }
    }
  }
}

export function handleCustomAttrReq(item,targetObj,data) {
  const attrItem = item.list[0]
  if(targetObj[attrItem.model]) return;
  for(let i = 0;i<item.prop.relation.length;i++) {
    const relationItem = item.prop.relation[i]
    const resDataItem = data[relationItem[ATTR_KEY]]
    if(resDataItem && isArray(resDataItem)) {
      for(let j = 0;j<resDataItem.length;j++) {
        let authAttrItem = resDataItem[j];
        if(authAttrItem[FILED] === attrItem.prop) {
          targetObj[attrItem.model] = authAttrItem[VALUE];
          break;
        }
      }
      break;
    }
  }
}