const pkg = require('./package.json');

let config = {
    entry: "./src/webrtmp.js",
    output: {
        path: __dirname, //path.join(__dirname, "../"),
        filename: pkg.main,
        chunkFilename: "[name].js",
        library: 'webrtmp',
        libraryTarget: 'umd'
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

module.exports = (env, argv) => {
    if (argv.mode === 'production') {
        config.output.filename = './dist/webrtmp.min.js';
    }

    return config;
};
