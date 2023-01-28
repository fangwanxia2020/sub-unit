export function getTemplateUrl(params, type) {
    return window.OUTVUE.prototype.request({
        url: '/file/template/getTemplateUrl',
        method: type || 'get',
        params
    })
}
