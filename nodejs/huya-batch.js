/**
 *
 * 新版虎牙解析
 */

const {
  fireFetch,
  COMM_CONF,
  getRandomInt,
  encrypt,
  parseUrlSearch,
  genUrlSearch,
} = require("./utils/utils.js");
//批量
const fs = require("fs");
const path = require("path");

const CONFIG = {
  headers: {
    "User-Agent": COMM_CONF.MOBILE_USER_AGENT,
  },
  M_HOST: "https://m.huya.com",
  UID: "1463962478092",
};

const fireHyFetch = async (url, opts = {}, isJson = false) => {
  return fireFetch(opts.fullUrl ? url : CONFIG.M_HOST + url, opts, isJson);
};

//提取初始直播url
const extractLiveLineUrl = async (roomId, all = false) => {
  const url = `https://mp.huya.com/cache.php?m=Live&do=profileRoom&roomid=${roomId}`;
  const res = await fireHyFetch(url, { fullUrl: true }, true);
  if (res.status !== 200) {
    return all ? {} : "";
  }
  const { data } = res,
    multiLine = data?.stream?.hls.multiLine || [],
    liveUrl = multiLine
      .map((item) => item.url)
      .filter(Boolean)
      .pop();

  return all ? data : liveUrl;
};

//解析
const getHuyaRealUrl = async (roomId, rawUrl = "", type = "flv") => {
  const liveUrl = rawUrl || (await extractLiveLineUrl(roomId));
  if (!liveUrl) {
    return "";
  }
  const query = parseUrlSearch(liveUrl);

  const uuid = Number(
      ((Date.now() % 1e10) * 1e3 + ((1e3 * Math.random()) | 0)) % 4294967295
    ),
    uid = getRandomInt(1460000000000, 1650000000000),
    seqid = parseInt(uid) + Date.now() * 1e4;
  const s = encrypt(`${seqid}|${query.ctype}|${query.t}`),
    pathname = liveUrl.split("?").shift().split("/").pop(),
    _sStreamName = pathname.replace("." + type, ""),
    _fm = Buffer.from(query.fm, "base64").toString(),
    n = _fm
      .replace("$0", uid + "")
      .replace("$1", _sStreamName)
      .replace("$2", s)
      .replace("$3", query.wsTime),
    wsSecret = encrypt(n),
    host = rawUrl.startsWith("http")
      ? liveUrl.split("/").filter(Boolean)[1]
      : liveUrl.split("/").filter(Boolean).shift();

  const { fm, ...rest } = query,
    searchObj = {
      ...rest,
      wsSecret,
      seqid,
      uuid,
      uid,
      ver: 1,
      sv: 2110211124,
      radio: 2000,
    };
  // console.log(query);
  const hostname = `http://${host}`;
  return `${hostname}/src/${_sStreamName}.${type}${genUrlSearch(searchObj)}`;
};

//获取url和名称
const getHuyaLiveInfo = async (roomId) => {
  const info = await extractLiveLineUrl(roomId, true),
    multiLine = info?.stream?.flv.multiLine || [],
    rawUrl = multiLine.map((item) => item.url).shift(),
    roomLiveInfo = info?.roomInfo?.tLiveInfo || info?.liveData || {},
    name = `【${roomLiveInfo.sNick || roomLiveInfo.nick}】${
      roomLiveInfo.sRoomName || roomLiveInfo.roomName
    }`;
  // console.log(info);
  return { url: await getHuyaRealUrl(roomId, rawUrl), name };
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
    console.log(`获取【一起看】 ${tmpId} 子分区  的房间列表`);
    let resTxt = await fireFetch(genUrl(tmpId), { data: { datas: [] } }, false);
    resTxt = resTxt
      .replace("getLiveListJsonpCallback(", "")
      .replace("}})", "}}");
    const res = JSON.parse(resTxt);
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
  /*  getHuyaLiveInfo("11352944").then((url) => {
       console.log(url);
     }); */

  const jsonList = [],
    rooms = [...(await getYqkRooms())];

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i],
      key = room.roomid;
    console.log(`正在解析${i + 1}第个房间,ID: ${key}, 共${rooms.length}个`);
    const json = await getHuyaLiveInfo(key); //JSON.parse(out.replace(/\'/g, '"'));
    json.name = room.nick
      ? `【${room.nick}】${room.introduction}`
      : json.name || "未知名称";
    console.log("房间解析结果:", json);
    jsonList.push(json);
  }

  fs.writeFileSync(
    path.resolve(__dirname, `../data/huya.json`),
    JSON.stringify(jsonList)
  );
  console.log("当前总数量", jsonList.length);

  const m3u_list = ["#EXTM3U"];
  for (const i in jsonList) {
    const obj = jsonList[i],
      url = obj["url1"] || obj["url2"] || obj["url"];
    if (url) {
      m3u_list.push(`#EXTINF:-1 group-title="虎牙", ${obj.name}`, url);
    }
  }

  fs.writeFileSync(
    path.resolve(__dirname, `../data/huya.m3u`),
    m3u_list.join("\n")
  );
})();
