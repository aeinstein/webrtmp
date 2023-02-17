const path = require('path');

module.exports = {
    entry: "./webrtmp.js",
    output: {
        path: path.join(__dirname, "../"),
        filename: "dist/webrtmp.js",
        chunkFilename: "[name].js",
        publicPath: "/webrtmp/"
    },
    mode: "development",
    devtool: 'source-map',
    optimization: {
        concatenateModules: true,
        usedExports: true,
        providedExports: true,
        chunkIds: "deterministic" // To keep filename consistent between different modes (for example building only)
    }
};
