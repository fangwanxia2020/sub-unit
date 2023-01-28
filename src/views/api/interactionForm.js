const selt = window.OUTVUE.prototype

// 查询基础业务分类列表
export function enterpriseTypeTemplateList(params) {
  return selt.request({
    url: '/system/enterpriseTypeTemplate/list',
    method: 'get',
    params
  })
}

// 获取模板配置管理详细信息
export function getTemplateInfo(templateConfigurationId) {
  return selt.request({
    url: `/basic/configuration/${templateConfigurationId}`,
    method: 'get',
  })
}