const debug = process.env.DEBUG != 0

export default {
  debug: debug,
  devtool: debug ? 'cheap-source-map' : 'source-map',
  target: 'web',
  entry: {
    content_scripts: './src/content_scripts.js',
    options: './src/options.js'
  },
  output: {
    path: './app/',
    filename: 'js/[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  }
}
