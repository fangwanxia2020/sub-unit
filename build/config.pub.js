const utils = require('./utils');
module.exports = {
    resolve: {
        //用于配置在尝试过程中用到的后缀列表
        extensions: ['.js','.vue','.json','css'],
        alias: {
            'src': utils.resolve('src'),
            'components': utils.resolve('components'),
            'businessCom': utils.resolve('businessCom'),
            'utils': utils.resolve('utils'),
            'api': utils.resolve('api'),
            'ty-pc': utils.resolve('components/index.js'),
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
}
