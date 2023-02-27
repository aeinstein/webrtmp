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
        chunkFilename: "[name].js",
    },

    devtool: 'source-map',


    optimization: {
        concatenateModules: true,
        usedExports: true,
        providedExports: true,
        chunkIds: "deterministic" // To keep filename consistent between different modes (for example building only)
    }
};
