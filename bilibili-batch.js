//批量

//const arr=raw.split('\n').filter(v=>!v.includes('#EXTINF')).map(v=>+v.replace('id=','')).filter(Boolean)
//console.log(JSON.stringify(arr))

const BILI_ROOM_IDS = [22621344, 23150921, 21715386, 23169468, 23285297, 896137, 10375360, 70155, 21680912, 21377115, 3963033, 482946, 5854051, 1895574, 308438, 6694373, 21070039, 21298611, 5226265, 11765640, 279430, 127343, 3568283, 82997, 15083950, 662181, 8412120, 142721, 21354981, 5960549, 136843, 906034, 5438349, 3712061, 22239221, 21676478, 10544270, 11709851, 15053669, 2171135, 21204893, 5568482, 4928767, 22375571, 14457148, 11259274, 6837959, 21070400, 21360358, 655291, 22241668, 181453, 21668357, 8504386, 6827037, 22128694, 21694925, 21763462]
const BILI_ROOM_IDS1 = [22621344]

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
        return defaultRes
    }
}
//获取影音馆的所有房间
const getYygRooms = async () => {
    const baseUrl = 'https://api.live.bilibili.com/xlive/web-interface/v1/second/getList',
        genUrl = (p = 1) => `${baseUrl}?platform=web&parent_area_id=10&area_id=33&sort_type=online&page=${p}`
    let page = 1;
    const rooms = [];
    while (page < 10) {

        const res = await fireFetch(genUrl(page))
        const { data, code } = res;
        if (code === 0) {
            const list = data.list || [];
            const ids = list.map(({ roomid, title, uname, uid }) => ({ roomid, title, uname, uid }))
            rooms.push(...ids)
        }

        page++;
    }

    return rooms;
}

(async () => {
    const jsonList = [], rooms = await getYygRooms()//BILI_ROOM_IDS
    for (let i = 0; i < rooms.length; i++) {


        const room = rooms[i], key = room.roomid
        const stdout = exec(`python bilibili.py ${key}`)
        const out = iconv.decode(stdout, 'cp936');
        console.log(out);
        if (out.includes('线路') && out.includes('uid')) {
            const json = JSON.parse(out.replace(/\'/g, "\""))

            const user = room.uname && room.title ? { ...room } : await fireFetch(`https://api.bilibili.com/x/space/acc/info?mid=${json.uid}`)

            const uname = room.uname || user.data?.name, rname = room.title || user?.data?.live_room?.title

            json.name = `【${uname}】${rname}` || '未知名称'
            console.log('房间解析结果:', json);
            jsonList.push(json)

        } else {
            console.log(key, '房间解析异常', out);
        }

    }

    fs.writeFileSync(`./data/bilibili.json`, JSON.stringify(jsonList))
    console.log('当前总数量', jsonList.length)


    const m3u_list = ['#EXTM3U']
    for (const i in jsonList) {
        const obj = jsonList[i], url = obj['线路1'] || obj['线路2']
        if (url) {
            m3u_list.push(`#EXTINF:-1 group-title="B站", ${obj.name}`, url)
        }
    }

    fs.writeFileSync(`./data/bilibili.m3u`, m3u_list.join('\n'))
})()
