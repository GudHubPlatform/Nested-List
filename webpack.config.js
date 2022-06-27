import MiniCssExtractPlugin from "mini-css-extract-plugin";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";

export default {
    experiments: {
        outputModule: true,
    },
    optimization: {
        minimize: false,
    },
    mode: 'production',
    entry: {
        main: './src/entry.js',
    },
    output: {
        filename: '[name].js',
        library: {
            type: 'module'
        }
    },
    //target: 'es2020',
    module: {
        rules: [
            {
                test: /\.(sass|scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            sourceMap: false,
                            modules: false,
                        },
                    },
                    'sass-loader',
                ],
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css'
        })
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin()
        ]
    }
};
