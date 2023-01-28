//流程实例处理
import Vue from 'vue'
const selt = Vue.prototype
//审批一个任务
export function doTaskApproval(data) {
  return window.OUTVUE.prototype.request({
    url: `/work-flow/task/audit`,
    method: 'post',
    data
  })
}


//获取一个审批任务的详细信息
export function getTaskDetailInfo(query) {
  return window.OUTVUE.prototype.request({
    url: `/work-flow/instance/getInstanceInfo`,
    method: 'get',
    params: query,
  })
}
