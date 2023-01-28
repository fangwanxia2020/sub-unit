const { resolve,getComponentEntries } = require('./utils')
const pub = require('./config.pub')
const externals = {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex'
};

module.exports = {
    outputDir: resolve('lib'),
    productionSourceMap: false,
    //"@babel/parser": "^7.7.4",
    transpileDependencies: ["@babel/parser"],
    configureWebpack: {
        entry: {
            ...getComponentEntries('components'),
            ...getComponentEntries('businessCom')
        },
        output: {
            filename: '[name]/index.js',
            libraryTarget: 'commonjs2',
            libraryExport: 'default',
            library: 'ty-pc',
        },
        resolve: pub.resolve,
    },
    css: {
        sourceMap: true,
        extract: {
            filename: '[name]/style.css'
        }
    },
    chainWebpack: config => {
        //externals里的模块不打包
        Object.assign(config,{
            externals: externals
        })

        config.optimization.delete('splitChunks')
        config.plugins.delete('copy')
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
        config.plugins.delete('html')
        config.plugins.delete('hmr')
        config.entryPoints.delete('app')
        config.module
            .rule('fonts')
            .use('url-loader')
            .tap(option => {
                option.fallback.options.name = 'static/fonts/[name].[hash:8].[ext]'
                return option
            })

    }
}
