let path = require('path');

module.exports = {
    node: {
        global: false
    },
    entry: {
        'sh-quill': './src/index.js',
    },

    debug: true,
    devtool: 'module-source-map',

    output: {
        path: './bin',
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
    },

    module: {
        // Shut off warnings about using pre-built javascript files
        // as Quill.js unfortunately ships one as its `main`.
        noParse: /node_modules\/quill\/dist/,
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]",
            },
            {
                test: /\.s?css$/,
                loaders: ['style', 'css', 'sass']
            },
        ],
    },

    externals: {
        'react': {
            'commonjs': 'react',
            'commonjs2': 'react',
            'amd': 'react',
            'root': 'React'
        },
        'react-dom': {
            'commonjs': 'react-dom',
            'commonjs2': 'react-dom',
            'amd': 'react-dom',
            'root': 'ReactDOM'
        },
        'react-dom/server': {
            'commonjs': 'react-dom/server',
            'commonjs2': 'react-dom/server',
            'amd': 'react-dom/server',
            'root': 'ReactDOMServer'
        }
    }
};
