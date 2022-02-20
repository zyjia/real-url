//合并索引的m3u文件

const fs = require('fs')

const douyuM3u = fs.readFileSync('./data/douyu.m3u').toString()
const biliM3u = fs.readFileSync('./data/bilibili.m3u').toString()

const allM3u = douyuM3u + biliM3u.replace('#EXTM3U', '')
 
fs.writeFileSync(`./data/all.m3u`, allM3u)