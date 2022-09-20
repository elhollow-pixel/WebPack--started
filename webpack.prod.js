const HtmlWebPack    = require('html-webpack-plugin')
const MiniCssExtract = require("mini-css-extract-plugin");
const CopyPlugin     = require("copy-webpack-plugin");

const CssMinimizer   = require('css-minimizer-webpack-plugin');
const Terser         = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',

    output: {
        clean: true,
        filename: 'main.[contenthash].js'
    },

    module: {
        //reglas
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    sources: false
                }
            },
            {
                test: /\.css$/,
                exclude:/styles.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /styles.css$/,
                use: [MiniCssExtract.loader, 'css-loader']
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'file-loader',
            },
            {   
                //babel se asegura de pasar un codigo de js a un codigo mas leible para navegadores viejo
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            }
        ]

    },

    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizer(),
            new Terser(),
        ]
    },

    plugins:[
        //Para que acepte los cambioa que ingresa en el index.html y se reflejen en el dist
        new HtmlWebPack({
            title: 'Mi webpack App',
            //filename: 'index.html'
            template: './src/index.html'
        }),

        new MiniCssExtract({
            //El fullhash para que no mantengan en cache el archivo
            //pero no sirve en modo de desarrollo sino en produccion
            filename: '[name].[fullhash].css',
            ignoreOrder: false
        }),

        //En la carpeta asssets van recursos estaticos que no van a cambiar
        //si hay archivos que cae en una regla toca excluiro con exclude al menos que quiera que sea procesado
        //copiar y mover recurso 
        new CopyPlugin ({
            patterns: [
                {from: 'src/assets/', to:'assets/'}
            ]
        })
    ]
}

//ctrl + c terminal el proceso 