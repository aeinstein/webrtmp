let config = {
    entry: "./src/webrtmp.js",
    output: {
        path: __dirname, //path.join(__dirname, "../"),
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


module.exports = (env, argv) => {
    /*
    if (argv.mode === 'production') {
        config.output.filename = 'dist/webrtmp.min.js';
    }*/

    return config;
};
