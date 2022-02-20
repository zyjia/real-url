//批量解析房间

const raw = `#EXTM3U

#EXTINF:-1 ,斗鱼4K
http://zzy789.xyz/douyu1.php?id=9249162
#EXTINF:-1 ,斗鱼-林正英
http://zzy789.xyz/douyu1.php?id=218859
#EXTINF:-1 ,斗鱼-华语院线
http://zzy789.xyz/douyu1.php?id=5581257
#EXTINF:-1 ,斗鱼-恐怖电影
http://zzy789.xyz/douyu1.php?id=9275635
#EXTINF:-1 ,斗鱼-奶瓶
http://zzy789.xyz/douyu1.php?id=6655271
#EXTINF:-1 ,斗鱼电影1
http://zzy789.xyz/douyu1.php?id=122402
#EXTINF:-1 ,斗鱼电影3
http://zzy789.xyz/douyu1.php?id=252802
#EXTINF:-1 ,斗鱼电影4
http://zzy789.xyz/douyu1.php?id=20415
#EXTINF:-1 ,斗鱼电影5
http://zzy789.xyz/douyu1.php?id=248753
#EXTINF:-1 ,斗鱼电影9-粤语
http://zzy789.xyz/douyu1.php?id=5033502

#EXTINF:-1 ,斗鱼电影11
http://zzy789.xyz/douyu1.php?id=5581257
#EXTINF:-1 ,斗鱼电影12
http://zzy789.xyz/douyu1.php?id=5423
#EXTINF:-1 ,斗鱼电影13
http://zzy789.xyz/douyu1.php?id=2793084
#EXTINF:-1 ,斗鱼电影14
http://zzy789.xyz/douyu1.php?id=1226741
#EXTINF:-1 ,斗鱼电影15
http://zzy789.xyz/douyu1.php?id=7882691
#EXTINF:-1 ,斗鱼电影19
http://zzy789.xyz/douyu1.php?id=562225
#EXTINF:-1 ,斗鱼电影20
http://zzy789.xyz/douyu1.php?id=6763930
#EXTINF:-1 ,斗鱼电影21
http://zzy789.xyz/douyu1.php?id=2436390
#EXTINF:-1 ,斗鱼电影22
http://zzy789.xyz/douyu1.php?id=4290711
#EXTINF:-1 ,斗鱼电影23
http://zzy789.xyz/douyu1.php?id=5522351
#EXTINF:-1 ,斗鱼电影24
http://zzy789.xyz/douyu1.php?id=5127679
#EXTINF:-1 ,斗鱼电影28
http://zzy789.xyz/douyu1.php?id=7412199
#EXTINF:-1 ,邵氏影院
http://zzy789.xyz/douyu1.php?id=4246519
#EXTINF:-1 ,鬼片恐怖惊悚
http://zzy789.xyz/douyu1.php?id=2935323
#EXTINF:-1 ,恐怖灾难
http://zzy789.xyz/douyu1.php?id=310926
#EXTINF:-1 ,恐怖故事
http://zzy789.xyz/douyu1.php?id=2337939
#EXTINF:-1 ,科幻动作
http://zzy789.xyz/douyu1.php?id=4332
#EXTINF:-1 ,怡寳影院
http://zzy789.xyz/douyu1.php?id=434971
#EXTINF:-1 ,粤语电影
http://zzy789.xyz/douyu1.php?id=6566671
#EXTINF:-1 ,神乐影院
http://zzy789.xyz/douyu1.php?id=85894
#EXTINF:-1 ,苹果影院
http://zzy789.xyz/douyu1.php?id=2793084
#EXTINF:-1 ,萌牛影院
http://zzy789.xyz/douyu1.php?id=7494871
#EXTINF:-1 ,午夜故事
http://zzy789.xyz/douyu1.php?id=8722254
#EXTINF:-1 ,功夫港片
http://zzy789.xyz/douyu1.php?id=3637765
#EXTINF:-1 ,超清港剧
http://zzy789.xyz/douyu1.php?id=223521
#EXTINF:-1 ,桃花影院
http://zzy789.xyz/douyu1.php?id=7305938
#EXTINF:-1 ,贝贝影院
http://zzy789.xyz/douyu1.php?id=431460
#EXTINF:-1 ,译制国语
http://zzy789.xyz/douyu1.php?id=2436390
#EXTINF:-1 ,幸运影院
http://zzy789.xyz/douyu1.php?id=7270927
#EXTINF:-1 ,黎黎影院
http://zzy789.xyz/douyu1.php?id=7116591
#EXTINF:-1 ,蚂蚱影院
http://zzy789.xyz/douyu1.php?id=6079455
#EXTINF:-1 ,纪录片
http://zzy789.xyz/douyu1.php?id=4360438
#EXTINF:-1 ,贝爷求生
http://zzy789.xyz/douyu1.php?id=454867
#EXTINF:-1 ,野外生存
http://zzy789.xyz/douyu1.php?id=1339207
#EXTINF:-1 ,经典港剧
http://zzy789.xyz/douyu1.php?id=4549169
#EXTINF:-1 ,鬼吹灯
http://zzy789.xyz/douyu1.php?id=9292503
#EXTINF:-1 ,胡八一
http://zzy789.xyz/douyu1.php?id=7701735
#EXTINF:-1 ,米娅影院
http://zzy789.xyz/douyu1.php?id=6537888
#EXTINF:-1 ,小宇影院
http://zzy789.xyz/douyu1.php?id=323876
#EXTINF:-1 ,恐怖丧尸鬼片
http://zzy789.xyz/douyu1.php?id=263824
#EXTINF:-1 ,表妹影院
http://zzy789.xyz/douyu1.php?id=5423
#EXTINF:-1 ,荒野建造者
http://zzy789.xyz/douyu1.php?id=9611578
#EXTINF:-1 ,邦德影院
http://zzy789.xyz/douyu1.php?id=9292499
#EXTINF:-1 ,科幻动作灾难
http://zzy789.xyz/douyu1.php?id=248753
#EXTINF:-1 ,可乐影院
http://zzy789.xyz/douyu1.php?id=20415
#EXTINF:-1 ,特辑影院
http://zzy789.xyz/douyu1.php?id=3637778
#EXTINF:-1 ,贝爷影院
http://zzy789.xyz/douyu1.php?id=252802
#EXTINF:-1 ,惊悚影院
http://zzy789.xyz/douyu1.php?id=96577
#EXTINF:-1 ,港式恐怖
http://zzy789.xyz/douyu1.php?id=3637726
#EXTINF:-1 ,吃米滴虫
http://zzy789.xyz/douyu1.php?id=315457
#EXTINF:-1 ,CCTV放映室
http://zzy789.xyz/douyu1.php?id=10011042
#EXTINF:-1 ,漫威影片
http://zzy789.xyz/douyu1.php?id=6140589
#EXTINF:-1 ,丸子经典电影
http://zzy789.xyz/douyu1.php?id=8986148
#EXTINF:-1 ,刘德华电影1
http://zzy789.xyz/douyu1.php?id=2516864
#EXTINF:-1 ,喜剧经典
http://zzy789.xyz/douyu1.php?id=9650887
#EXTINF:-1 ,豆瓣高分
http://zzy789.xyz/douyu1.php?id=8770422
#EXTINF:-1 ,林正英电影2
http://zzy789.xyz/douyu1.php?id=7356023
#EXTINF:-1 ,宇哥电影
http://zzy789.xyz/douyu1.php?id=413573
#EXTINF:-1 ,贝爷影厅2
http://zzy789.xyz/douyu1.php?id=36337
#EXTINF:-1 ,霍格影片
http://zzy789.xyz/douyu1.php?id=8814650
#EXTINF:-1 ,冰冰经典电影
http://zzy789.xyz/douyu1.php?id=74374
#EXTINF:-1 ,避风港影院
http://zzy789.xyz/douyu1.php?id=9826611
#EXTINF:-1 ,星星影院
http://zzy789.xyz/douyu1.php?id=315131
#EXTINF:-1 ,恐怖动作片
http://zzy789.xyz/douyu1.php?id=5129261
#EXTINF:-1 ,漫威电影
http://zzy789.xyz/douyu1.php?id=4282654
#EXTINF:-1 ,恐怖经典
http://zzy789.xyz/douyu1.php?id=1165374
#EXTINF:-1 ,华语电影
http://zzy789.xyz/douyu1.php?id=3928
#EXTINF:-1 ,华语动作电影
http://zzy789.xyz/douyu1.php?id=1504768
#EXTINF:-1 ,喜剧电影
http://zzy789.xyz/douyu1.php?id=9292492
#EXTINF:-1 ,高帧影片
http://zzy789.xyz/douyu1.php?id=6763930
#EXTINF:-1 ,国外电影
http://zzy789.xyz/douyu1.php?id=9683979
`

//const arr=raw.split('\n').filter(v=>!v.includes('#EXTINF')).map(v=>+v.replace('http://zzy789.xyz/douyu1.php?id=','')).filter(Boolean)
//console.log(JSON.stringify(arr))

const spawn = require('child_process').spawn


const DOUYU_ROOM_IDS = [9249162, 218859, 5581257, 9275635, 6655271, 122402, 252802, 20415, 248753, 5033502, 5581257, 5423, 2793084, 1226741, 7882691, 562225, 6763930, 2436390, 4290711, 5522351, 5127679, 7412199, 4246519, 2935323, 310926, 2337939, 4332, 434971, 6566671, 85894, 2793084, 7494871, 8722254, 3637765, 223521, 7305938, 431460, 2436390, 7270927, 7116591, 6079455, 4360438, 454867, 1339207, 4549169, 9292503, 7701735, 6537888, 323876, 263824, 5423, 9611578, 9292499, 248753, 20415, 3637778, 252802, 96577, 3637726, 315457, 10011042, 6140589, 8986148, 2516864, 9650887, 8770422, 7356023, 413573, 36337, 8814650, 74374, 9826611, 315131, 5129261, 4282654, 1165374, 3928, 1504768, 9292492, 6763930, 9683979]
const DOUYU_ROOM_IDS1 = [6566671, 5581257, 6079455]


var exec = require('child_process').execSync;
const iconv = require('iconv-lite');//解码包，解决中文乱码问题
const fs = require('fs')

const fetch = require('node-fetch')

const fireFetch = async (url) => {


    try {
        const res = await fetch(url).then(res => res.json())
        //  console.log(res);
        return res
    } catch (e) {
        console.error(e)
        return { room: {} }
    }
}

(async () => {
    const jsonList = []
    for (let i = 0; i < DOUYU_ROOM_IDS.length; i++) {


        const key = DOUYU_ROOM_IDS[i]
        const stdout = exec(`python douyu.py ${key}`).toString()
       const out = iconv.decode(stdout, 'cp936');
        console.log(out);
        if (out.includes('flv') && out.includes('x-p2p')) {
            const json = JSON.parse(out.replace(/\'/g, "\""))

            const roomInfo = await fireFetch(`https://www.douyu.com/betard/${key}`)

            const name = '【' + roomInfo['room']['owner_name'] + '】' + roomInfo['room']['room_name']
            console.log(name);
            json.name = name
            console.log('房间解析结果:', json);
            jsonList.push(json)

        } else {
            console.log(key, '房间解析异常', out);
        }

    }
    
    fs.writeFileSync(`./data/douyu.json`, JSON.stringify(jsonList))
    console.log('当前总数量', jsonList.length)
    
    
    const m3u_list=['#EXTM3U']
    for (const i in jsonList) {
        const obj=jsonList[i]
        m3u_list.push(`#EXTINF:-1 group-title="斗鱼", ${obj.name}`,obj.flv)
    }
    
    fs.writeFileSync(`./data/douyu.m3u`,m3u_list.join('\n'))
})()