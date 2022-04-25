/**
 *
 * 新版虎牙解析
 */
const fetch = require("node-fetch");
const { createHash } = require("crypto");
const fs = require("fs");
const { hostname } = require("os");
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}
const CONFIG = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Linux; U; Android 4.0.3; zh-CN; vivo X9i Build/N2G47H) AppleWebKit/537.36 (KHTML,like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.9.3.973 Mobile Safari/537.36",
  },
  M_HOST: "https://m.huya.com",
  UID: "1463962478092",
};

const fireFetch = async (url, opts = {}, isJson = false) => {
  try {
    const res = await fetch(opts.fullUrl ? url : CONFIG.M_HOST + url, {
      ...opts,
      headers: opts.headers || CONFIG.headers,
    }).then((res) => (isJson ? res.json() : res.text()));
    //  console.log(res);
    return res;
  } catch (e) {
    console.error(e);
    return isJson ? {} : "";
  }
};
/**
 * @param {string} algorithm
 * @param {any} content
 *  @return {string}
 */
const encrypt = (algorithm, content) => {
  let hash = createHash(algorithm);
  hash.update(content);
  return hash.digest("hex");
};
//判断json是否有效
const isJSONValid = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};
const matchHtmlText = (html, reg, defData = "") => {
  if (!reg) {
    return defData;
  }
  const matches = html.match(reg) || [];

  if (matches.length < 1) {
    return defData;
  }
  return matches[0];
};
/**
 * 解析 url 的 search 参数
 * @param qs {string} url search
 * @return object
 * {key:value}
 * */
const parseUrlSearch = (qs) => {
  if (qs && qs.indexOf("?") > -1) {
    const newQS = qs.substring(qs.indexOf("?")).replace("?", "");
    const tmpArr = newQS.split("&");
    let finalObj = {};
    tmpArr.forEach((item) => {
      const itemSplit = item.split("=");
      if (itemSplit.length === 2) {
        finalObj[decodeURIComponent(itemSplit[0])] = decodeURIComponent(
          decodeURIComponent(itemSplit[1])
        );
      }
    });
    return finalObj;
  }
  return {};
};

/**
 * 把对象拼接成 url search 参数
 * @param obj {Object}
 *
 * @return string
 * */
const genUrlSearch = (obj) => {
  let urlQs = "";
  const keys = Object.keys(obj);
  if (obj instanceof Object && keys.length > 0) {
    keys.forEach((s, i) => {
      if (s && obj[s]) {
        const value = encodeURIComponent(obj[s]);
        const key = encodeURIComponent(s);
        urlQs += `${urlQs.length === 0 ? "?" : "&"}${key}=${value}`;
      }
    });
  }

  return urlQs;
};
//提取初始直播url
const extractLiveLineUrl = async (roomId, all = false) => {
  const url = `https://mp.huya.com/cache.php?m=Live&do=profileRoom&roomid=${roomId}`;
  const res = await fireFetch(url, { fullUrl: true }, true);
  if (res.status !== 200) {
    return all ? {} : "";
  }
  const { data } = res,
    multiLine = data?.stream?.hls.multiLine || [],
    liveUrl = multiLine
      .map((item) => item.url)
      .filter(Boolean)
      .pop();
  /* const html = await fireFetch("/" + roomId);
  const text = matchHtmlText(html, /{"roomProfile.*"welcomeText":/) + '""}';
  let liveInfo = {};
  if (isJSONValid(text)) {
    liveInfo = JSON.parse(text);
  } */

  return all ? data : liveUrl; // atob(liveInfo?.roomProfile?.liveLineUrl);
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
  const s = encrypt("md5", `${seqid}|${query.ctype}|${query.t}`),
    pathname = liveUrl.split("?").shift().split("/").pop(),
    _sStreamName = pathname.replace("." + type, ""),
    _fm = atob(query.fm),
    n = _fm
      .replace("$0", uid + "")
      .replace("$1", _sStreamName)
      .replace("$2", s)
      .replace("$3", query.wsTime),
    wsSecret = encrypt("md5", n),
    host = rawUrl.startsWith("http")
      ? liveUrl.split("/").filter(Boolean)[1]
      : liveUrl.split("/").filter(Boolean).shift();

  const { fm, ...rest } = query,
    searchObj = {
      ...rest,
      wsSecret,
      seqid,
      uuid,
      uid: CONFIG.UID,
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
    //rawUrl = atob(info?.roomProfile?.liveLineUrl),

    multiLine = info?.stream?.flv.multiLine || [],
    rawUrl = multiLine.map((item) => item.url).shift(),
    roomLiveInfo = info?.roomInfo?.tLiveInfo || info?.liveData || {},
    name = `【${roomLiveInfo.sNick || roomLiveInfo.nick}】${
      roomLiveInfo.sRoomName || roomLiveInfo.roomName
    }`;
  // console.log(info);
  return { url: await getHuyaRealUrl(roomId, rawUrl), name };
};
/*   getHuyaLiveInfo("11352944").then((url) => {
  console.log(url);
});   */
module.exports = { getHuyaLiveInfo };
