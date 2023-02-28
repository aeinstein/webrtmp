const path = require('path');

module.exports = {
    mode: "development",

    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "webrtmp.js",
        library: "webrtmpjs",
        libraryTarget: "umd",
        globalObject: "this",
        //chunkFilename: "[name].js"
    },

    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.worker\.js$/i,
                loader: "worker-loader",
                options: {
                    inline: "no-fallback",
                },
            },
        ],
    },


    optimization: {
        concatenateModules: true,
        usedExports: true,
        providedExports: true,
        chunkIds: "deterministic" // To keep filename consistent between different modes (for example building only)
    }
};
