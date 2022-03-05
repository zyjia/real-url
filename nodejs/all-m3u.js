//合并索引的m3u文件

const fs = require('fs')
const path=require('path')

const douyuM3u = fs.readFileSync(path.join(__dirname,'../data/douyu.m3u')).toString()
const biliM3u = fs.readFileSync(path.join(__dirname,'../data/bilibili.m3u')).toString()
const huyaM3u = fs.readFileSync(path.join(__dirname,'../data/huya.m3u')).toString()
const allM3u = douyuM3u + biliM3u.replace('#EXTM3U', '') + huyaM3u.replace('#EXTM3U', '')
const date = new Date();
fs.writeFileSync(path.join(__dirname,`../data/bl-dy-hy-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.m3u`), allM3u)

