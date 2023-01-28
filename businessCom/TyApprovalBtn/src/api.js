//流程实例
//某用户发起（实例化）一个流程
export function instantiateFlow(data) {
  return window.OUTVUE.prototype.request({
    url: `/work-flow/instance/newInstance`,
    method: 'post',
    data
  })
}

//如果不需要新建实例，直接通过审批
export function noInstance(data) {
  return window.OUTVUE.prototype.request({
    url: `/work-flow/instance/noInstance`,
    method: 'post',
    data
  })
}

//查询某领域下的流程模板定义列表
export function getFlowsDefineList(params) {
  return window.OUTVUE.prototype.request({
    url: `/work-flow/define/list`,
    method: 'get',
    params
  })
}

//获取实例化时需要的参数接口
export function getInfoByConfigType(code) {
  return window.OUTVUE.prototype.request({
    url: `/basic/interfaceInfoConfig/getInfoByConfigType/${code}`,
    method: 'get'
  })
}

//按条件获取流程实例id
export function getInstanceInfoId(params) {
  return window.OUTVUE.prototype.request({
    url: `/work-flow/instance/getInstanceId`,
    method: 'get',
    params
  })
}

//按条件获取流程实例id
export function cancelApproval(data) {
  return window.OUTVUE.prototype.request({
    url: `/work-flow/instance/cancel`,
    method: 'post',
    data
  })
}


