const AwsSamPlugin = require("aws-sam-webpack-plugin")

const awsSamPlugin = new AwsSamPlugin();

module.exports = {
    entry: awsSamPlugin.entry(),
    output: {
        filename: "[name]/app.js",
        libraryTarget: "commonjs2",
        path: __dirname + "/.aws-sam/build"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            ".pg-native": 'noop2',
            tedious: 'noop2',
            sqllite3: 'noop2',
            mysql2: 'noop2'
        },
    },
    target: "node",
    externals: {
        'aws-sdk': 'aws-sdk'
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    },
    plugins: [
        awsSamPlugin
    ]
}