const express = require('express')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

const exphbs = require('express-handlebars')

app.engine('hbs', exphbs({ extname: '.hbs' })) // 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.set('view engine', 'hbs')// 設定使用 Handlebars 做為樣板引擎
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app