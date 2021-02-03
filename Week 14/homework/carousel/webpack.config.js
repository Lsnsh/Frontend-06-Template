module.exports = {
  mode: 'development',
  // entry: './js/1.js',
  // entry: './js/2.js',
  // entry: './js/3.js',
  entry: './js/4.js',
  output: { filename: 'main.js' },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              // 配置 pragma，JSX语法转换后将不再使用 React.createElement 包裹而是，直接改为 createElement
              ['@babel/plugin-transform-react-jsx', { pragma: 'createElement' }]
            ]
          }
        }
      }
    ]
  }
}
