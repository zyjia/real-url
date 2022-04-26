const { fireFetch, genUrlSearch } = require("./utils/utils.js");
const path = require("path");
const fs = require("fs");
/*
# 获取哔哩哔哩直播的真实流媒体地址，默认获取直播间提供的最高画质
# qn=150高清
# qn=250超清
# qn=400蓝光
# qn=10000原画
*/
//单个url解析
//有些地址无法在PotPlayer播放，建议换个播放器试试

/**
 * 房间的真实id
 */
async function getRoomRealId(rid) {
  const url = `https://api.live.bilibili.com/room/v1/Room/room_init?id=${rid}`;
  const res = await fireFetch(url, {}, true);
  if (res.code !== 0) {
    console.log(rid, res.msg);
    return 0;
  }

  const data = res.data || {},
    { live_status, room_id } = data;
  if (live_status !== 1) {
    console.log(rid, "未开播");
    return 0;
  }

  return room_id;
}

/**
 * 房间的直播信息 url列表
 */
async function getRoomLiveUrl(rid, currentQn = 10000) {
  const realId = await getRoomRealId(rid);
  if (!realId) {
    return {};
  }
  const getStreamData = async (maxQn) => {
    const url =
        "https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo",
      param = {
        room_id: realId,
        protocol: "0,1",
        format: "0,1,2",
        codec: "0,1",
        qn: maxQn,
        platform: "h5",
        ptype: 8,
      };
    const res = await fireFetch(url + genUrlSearch(param), {}, true);
    if (res.code !== 0) {
      console.log(rid, res.msg, "获取房间直播信息失败");
      return {};
    }
    return res.data || {};
  };
  let data = await getStreamData(currentQn),
    qn_max = 0,
    streamInfo = data?.playurl_info?.playurl?.stream || [];
  for (let i = 0; i < streamInfo.length; i++) {
    const item = streamInfo[i],
      accept_qn = item["format"][0]["codec"][0]["accept_qn"] || [];
    qn_max = accept_qn.sort((a, b) => a - b).pop();
  }
  if (qn_max !== currentQn) {
    data = await getStreamData(currentQn);
    streamInfo = data?.playurl_info?.playurl?.stream || [];
  }
  const streamUrls = {};
  // flv流无法播放，暂修改成获取hls格式的流
  for (let i = 0; i < streamInfo.length; i++) {
    const item = streamInfo[i],
      format_name = item["format"][0]["format_name"];

    if (format_name === "ts") {
      const codecItem = item["format"][0].codec[0] || {},
        base_url = codecItem["base_url"],
        url_info = codecItem["url_info"] || [];
      for (let j = 0; j < url_info.length; j++) {
        const info = url_info[j],
          host = info["host"],
          extra = info["extra"];
        streamUrls[`url${j + 1}`] = `${host}${base_url}${extra}`;
      }
    }
  }
  streamUrls["uid"] = data.uid || "";
  console.log(JSON.stringify(streamUrls));
  return streamUrls;
}

//getRoomLiveUrl(22621344)

//批量
const BILI_ROOM_IDS = [22621344, 23150921, 21715386, 23169468, 23285297];
const BILI_ROOM_IDS1 = [22621344];

//获取影音馆的所有房间
const getYygRooms = async () => {
  const baseUrl =
      "https://api.live.bilibili.com/xlive/web-interface/v1/second/getList",
    genUrl = (p = 1) =>
      `${baseUrl}?platform=web&parent_area_id=10&area_id=33&sort_type=online&page=${p}`;
  let page = 1,
    hasMore = true;
  const rooms = [];
  while (page < 50 && hasMore) {
    console.log(`获取影音馆-分页 ${page} 的房间列表`);
    const res = await fireFetch(genUrl(page), { data: { list: [] } }, true);
    const { data, code } = res;
    if (code === 0) {
      const list = data.list || [];
      const ids = list.map(({ roomid, title, uname, uid }) => ({
        roomid,
        title,
        uname,
        uid,
      }));
      rooms.push(...ids);
    }
    hasMore = !!data.has_more;
    page++;
  }

  return rooms;
};

(async () => {
  const jsonList = [],
    rooms = await getYygRooms();
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i],
      key = room.roomid;
    console.log(`正在解析${i + 1}第个房间, ID: ${key}, 共${rooms.length}个`);

    const json = await getRoomLiveUrl(key); // JSON.parse(out.replace(/\'/g, "\""))

    const user =
      room.uname && room.title
        ? { ...room }
        : await fireFetch(
            `https://api.bilibili.com/x/space/acc/info?mid=${json.uid}`
          );

    const uname = room.uname || user.data?.name,
      rname = room.title || user?.data?.live_room?.title;

    json.name = `【${uname}】${rname}` || "未知名称";
    console.log("房间解析结果:", json);
    jsonList.push(json);
  }
  fs.writeFileSync(
    path.resolve(__dirname, `../data/bilibili.json`),
    JSON.stringify(jsonList)
  );
  console.log("当前总数量", jsonList.length);

  const m3u_list = ["#EXTM3U"];
  for (const i in jsonList) {
    const obj = jsonList[i],
      url = obj["url1"];
    if (url) {
      m3u_list.push(`#EXTINF:-1 group-title="B站", ${obj.name}`, url);
    }
  }
  fs.writeFileSync(
    path.resolve(__dirname, `../data/bilibili.m3u`),
    m3u_list.join("\n")
  );
})();
