//批量
var exec = require("child_process").execSync;
const iconv = require("iconv-lite"); //解码包，解决中文乱码问题
const fs = require("fs");
const {getHuyaLiveInfo} = require("./huya-parser");

const fetch = require("node-fetch");

const fireFetch = async (url, defaultRes = {}, isJson = false) => {
  try {
    const res = await fetch(url).then((res) =>
      isJson ? res.json() : res.text()
    );
    //  console.log(res);
    return res;
  } catch (e) {
    console.error(e);
    return defaultRes;
  }
};
//指定子分区
//获取第一页，可自行更改
const getYqkRooms = async () => {
  //const tmpIds = [4201];
  const tmpIds = [4201, 4183, 2067, 4061, 2079];
  const genUrl = (tmpId) =>
    `https://live.cdn.huya.com/livelist/game/tagLivelist?gameId=2135&tmpId=${tmpId}&callback=getLiveListJsonpCallback&page=1`;
  const rooms = [];
  for (const tmpId of tmpIds) {
    console.log(`获取一起看 ${tmpId} 子分区  的房间列表`);
    let resTxt = await fireFetch(genUrl(tmpId), { data: { datas: [] } }, false);
    (resTxt = resTxt
      .replace("getLiveListJsonpCallback(", "")
      .replace("}})", "}}")),
      (res = JSON.parse(resTxt));
    const { data, status } = res;
    if (status === 200) {
      const list = data.datas || [];
      const rs = list.map(({ profileRoom, introduction, nick, uid }) => ({
        roomid: profileRoom,
        introduction,
        nick,
        uid,
      }));
      rooms.push(...rs);
    }
  }

  return rooms;
};

(async () => {
  const jsonList = [],
    rooms = [... await getYqkRooms()]

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i],
      key = room.roomid;
    console.log(`正在解析${i + 1}第个房间,ID: ${key}, 共${rooms.length}个`);
 /*    const stdout = exec(`python ../huya.py ${key}`);
    let out = "";
    try {
      out = iconv.decode(stdout, "cp936");
    } catch {}

    console.log(out, "python out"); */
    const out='raw url name'
    if (out.includes("url") && out.includes("name")) {
      const json =await getHuyaLiveInfo(key); //JSON.parse(out.replace(/\'/g, '"'));
      json.name = room.nick
        ? `【${room.nick}】${room.introduction}`
        : json.name || "未知名称";
      console.log("房间解析结果:", json);
      jsonList.push(json);
    } else {
      console.log(key, "房间解析异常", out);
    }
  }

  fs.writeFileSync(`../data/huya.json`, JSON.stringify(jsonList));
  console.log("当前总数量", jsonList.length);

  const m3u_list = ["#EXTM3U"];
  for (const i in jsonList) {
    const obj = jsonList[i],
      url = obj["url1"] || obj["url2"]|| obj["url"];
    if (url) {
      m3u_list.push(`#EXTINF:-1 group-title="虎牙", ${obj.name}`, url);
    }
  }

  fs.writeFileSync(`../data/huya.m3u`, m3u_list.join("\n"));
})();
