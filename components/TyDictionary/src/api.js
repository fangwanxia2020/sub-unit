//平台管理员----------------------------------------------
// 字段	字典类型	label	value
// 审核状态	bu_item_examine_status	未审核	1
// 		已审核	2
// 		已拒绝	3

// 租户类型	sys_tenant_type	平台	1
// 		供应商 	2
// 		代理机构	3
// 		采购商	4

// 报名状态	bu_bidding_enroll_status	申请中	1
// 		已通过	2
// 		已拒绝	3
// 		已报价	4

// 公告类型	bu_bidding_notice_type	招标公告	1
// 		补充公告	2
// 		更正公告	3
// 		废标公告	4
// 		中标公告	5

// 公告选项	bu_bidding_choose	项目继续	1
// 		项目终止	2
// 		项目废标	3

// 报价规则	bu_bidding_set_rule	不公开报价	1
// 		半公开报价	2
// 		全公开报价	3

// 调研项目	bu_investigation_project_state	已立项	1
// 		已发布	2
// 		已结束	3
// 		已中止	4	

// 收费结果	sys_charge_result	未登记	1
// 		未收费	2
// 		已收费	3

// 项目类型	sys_project_type	竞价项目	1
// 		调研项目	2

// 账号状态	account_number_status	已启动	1
// 		已冻结	2

// 证件类型	certificates_type	统一信用代码	1
// 		组织机构代码证	2
// 			3
// 选择收费规则	sys_charge_rules	按单个项目费用收费	1
// 		按项目个数收费	2
// 		买断，一次性费用	3

// 权限控制	sys_authority_control	可以设置公告在门户是否显示	1
// 		可以修改项目的报名时间，报价时间	2
// 		可以查看投标公司的名称和报价金额	3

// 审核状态	sys_examine_status	未审核	1
// 		已审核	2
// 		已拒绝	3

// 租户类型	sys_tenant_type	平台	1
// 		供应商 	2
// 		代理机构	3
// 		采购商	4


//代理机构----------------------------------------------
// 审核结果	bu_sys_examine_result	待审核	1
// 		审核通过	2
// 		审核不通过	3

// 证件类型	certificates_type	统一信用代码	1
// 		组织机构代码证	2

// 缴费状态	bu_agent_pay_status	未登记	1
// 		未缴费	2
// 		已缴费	3

// 报价规则	bu_agent_offer_rules	不公开报价：不公开报价供应商的公司名称及报价金额	1
// 		半公开报价：不公开报价供应商的公司名称，公开报价金额	2
// 		全公开报价：公开报价供应商的公司名称及报价金额	3

// 中标规则	bu_bidding_rule_type	最低价中标法	1
// 		最高价中标法	2
// 		平均价中标法	3
// 		次低价中标法	4
// 		二次平均值法	5
// 		其他方式	6

// 是否退回及退回原因		无	

//采购商----------------------------------------------
// 成交方式	bu_bidding_deal_type	最低价中标法	1
// 		最高价中标法	2
// 		平均价中标法	3
// 		次低价中标法	4
// 		二次平均值法	5
// 		其他方式	6

// 审核状态	bu_buyer_examine_status	未审核	1
// 		已审核	2
// 		已拒绝	3

// 审核操作	bu_buyer_examine_operate	通过	1
// 		退回	2
// 		终止	3

// 调研项目状态	project_survey	正在报名	1
// 		正在调研	2
// 		调研结束	3
// 		结项项目	4
// 		终止项目	5

// 项目状态	bu_bidding_project_status	已委托	1
// 		编制完成	2
// 		通过审核	3
// 		已公布	4
// 		正在报名	5
// 		正在报价	6
// 		报价完成待审批	7
// 		待确认结果	8
// 		待发布结果公告	9
// 		项目结项	10
// 		项目中止	11
// 		项目废标	12

//获取第三方的请求信息 包括url，token等
const appInfo=()=>{
  return JSON.parse(localStorage.getItem("AppInfo")) ||{}
}

export function getChildrenItemsByDictType(url,params,type) {
  return window.OUTVUE.prototype.request({
    url: url || '/system/SysDictData/getChildrenItemsByDictType',
    method: type || 'get',
    [type == 'get' ? 'params' : 'data']: params,
    dynamicConfig:appInfo()||{},
  })
}
