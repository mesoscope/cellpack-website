require('dotenv').config()
const path = require('path');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpack = require('webpack');

const Env = require('./constants').Env;

const BASE_PLUGINS = [
    new CleanWebpackPlugin(['dist'], {
        root: path.resolve(__dirname, '../'),
        watch: true,
    }),
    new MiniCssExtractPlugin({
        filename: 'style.[contenthash].css'
    }),
    new HtmlWebpackPlugin({
        favicon: './src/assets/AICS-logo.svg',
        template: path.resolve(__dirname, 'index.template.html')
    }),
    new webpack.EnvironmentPlugin({
        GH_BUILD: !!process.env.GH_BUILD,
    }),
];

const BUNDLE_ANALYZER = [new BundleAnalyzerPlugin({
    analyzerMode: 'static'
})];

const PLUGINS_BY_ENV = {
    [Env.PRODUCTION]: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new webpack.HashedModuleIdsPlugin(),
    ],
    [Env.STAGE]: [
        new webpack.NamedModulesPlugin(),
    ],
    [Env.DEVELOPMENT]: [
    ]
};

module.exports = (env, analyzer) => [
    ...BASE_PLUGINS,
    ...(analyzer ? BUNDLE_ANALYZER : []),
    ...(PLUGINS_BY_ENV[env] || [])
];