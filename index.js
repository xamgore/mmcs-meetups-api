require('babel-register')({
    // stage: 0,
    plugins: [
        'transform-es2015-modules-commonjs',
        // 'syntax-async-functions',
        // 'syntax-async-generators',
    ]
})

// require('babel/polyfill')

require('dotenv').config()
require('./app')
