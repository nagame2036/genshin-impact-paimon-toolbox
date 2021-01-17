module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            ident: 'postcss',
            syntax: 'postcss-scss',
            plugins: [
              require('postcss-import'),
              require('postcss-easy-import'),
              require('autoprefixer'),
              require('tailwindcss'),
            ]
          }
        }
      }
    ]
  }
}
