//批量解析房间


//const arr=raw.split('\n').filter(v=>!v.includes('#EXTINF')).map(v=>+v.replace('id=','')).filter(Boolean)
//console.log(JSON.stringify(arr))

const spawn = require('child_process').spawn


const DOUYU_ROOM_IDS = [9249162, 218859, 5581257, 9275635, 6655271, 122402, 252802, 20415, 248753, 5033502, 5581257, 5423, 2793084, 1226741, 7882691, 562225, 6763930, 2436390, 4290711, 5522351, 5127679, 7412199, 4246519, 2935323, 310926, 2337939, 4332, 434971, 6566671, 85894, 2793084, 7494871, 8722254, 3637765, 223521, 7305938, 431460, 2436390, 7270927, 7116591, 6079455, 4360438, 454867, 1339207, 4549169, 9292503, 7701735, 6537888, 323876, 263824, 5423, 9611578, 9292499, 248753, 20415, 3637778, 252802, 96577, 3637726, 315457, 10011042, 6140589, 8986148, 2516864, 9650887, 8770422, 7356023, 413573, 36337, 8814650, 74374, 9826611, 315131, 5129261, 4282654, 1165374, 3928, 1504768, 9292492, 6763930, 9683979]
const DOUYU_ROOM_IDS1 = [6566671, 5581257, 6079455]


var exec = require('child_process').execSync;
const iconv = require('iconv-lite');//解码包，解决中文乱码问题
const fs = require('fs')

const fetch = require('node-fetch')

const fireFetch = async (url, defaultRes = { room: {} }) => {


    try {
        const res = await fetch(url).then(res => res.json())
        //  console.log(res);
        return res
    } catch (e) {
        console.error(e)
        return { room: {} }
    }
}

//获取【一起看】的直播房间列表
const getLiveRooms = async () => {
    const cates = [290, 2827, 2828, 2829, 2930, 2831, 2832, 2833, 2834], rooms = []
    for (const cateId of cates) {
        console.log(`获取一起看分类 ${cateId} 的房间列表`);
        const url = `http://capi.douyucdn.cn/api/v1/getThreeList?cate_id=${cateId}&offset=0&limit=50&client_sys=android`,
            res = await fireFetch(url);
        if (res.error === 0 && Array.isArray(res.data)) {
            const list = res.data.map(({ nickname, room_id, room_name }) => ({ nickname, room_id, room_name }))
            rooms.push(...list)
        }

    }
    return rooms
}

(async () => {
    const jsonList = [], rooms = await getLiveRooms()
    for (let i = 0; i < rooms.length; i++) {

        const room = rooms[i], key = room.room_id;
        
        console.log(`正在解析${i + 1}第个房间, ID: ${key}, 共${rooms.length}个`);
        const stdout = exec(`python ../douyu.py ${key}`)
        const out = iconv.decode(stdout, 'cp936');
        // const out = 'flv x-p2p'
        console.log(out, ' python output');
        if (out.includes('flv') && out.includes('x-p2p')) {
            //`http://zzy789.xyz/douyu1.php?id=${key}`
            const json = JSON.parse(out.replace(/\'/g, "\""))

            const roomInfo = room.title ? room : await fireFetch(`https://www.douyu.com/betard/${key}`)

            const name = room.title
                ? `【${room.nickname}】${room.room_name}`
                : '【' + roomInfo['room']['owner_name'] + '】' + roomInfo['room']['room_name']
            // console.log(name);
            json.name = name || '未知名称'
            console.log('房间解析结果:', json);
            jsonList.push(json)

        } else {
            console.log(key, '房间解析异常', out);
        }

    }

    fs.writeFileSync(`../data/douyu.json`, JSON.stringify(jsonList))
    console.log('当前总数量', jsonList.length)


    const m3u_list = ['#EXTM3U']
    for (const i in jsonList) {
        const obj = jsonList[i],
         url = obj['flv'] || obj['x-p2p']
        m3u_list.push(`#EXTINF:-1 group-title="斗鱼", ${obj.name}`, url)
    }

    fs.writeFileSync(`../data/douyu.m3u`, m3u_list.join('\n'))
})()
