const webpack=require('webpack')
module.exports={
    outputDir:__dirname+'/../server/web',
    publicPath:process.env.NODE_ENV==='production' ?'/':'/',
    configureWebpack:{
        plugins:[
            new webpack.ProvidePlugin({
                $:'jquery',
                jQuery:'jquery',
                'window.jQuery':'jquery',
                Popper:['popper.js','default']
            })
        ]
    }
}