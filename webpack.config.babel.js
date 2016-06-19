const debug = process.env.DEBUG != 0

export default {
  debug: debug,
  devtool: debug ? 'cheap-source-map' : 'source-map',
  target: 'web',
  entry: './src/content_scripts.js',
  output: {
    path: './app/',
    filename: 'js/content_scripts.js'
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
