require('babel-register')({
    // stage: 0,
    plugins: [
        'transform-es2015-modules-commonjs',
        // 'syntax-async-functions',
        // 'syntax-async-generators',
    ]
})

// require('babel/polyfill')


var fs = require('fs')

if (!fs.existsSync('.env')) {
  fs.writeFileSync('.env', fs.readFileSync('.env.example'))
}

require('dotenv').config()
require('./app')
