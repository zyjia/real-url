/**
 *
 * 新版虎牙解析
 */
const fetch = require("node-fetch");
const { createHash } = require("crypto");
const fs = require("fs");
const CONFIG = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Linux; U; Android 4.0.3; zh-CN; vivo X9i Build/N2G47H) AppleWebKit/537.36 (KHTML,like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.9.3.973 Mobile Safari/537.36",
  },
  HOST: "https://m.huya.com",
  UID: "1463962478092", //可能随时变化
};

const fireFetch = async (url, opts = {}, isJson = false) => {
  try {
    const res = await fetch(opts.fullUrl ? url : CONFIG.HOST + url, {
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
const extractLiveLineUrl = async (roomId) => {
  const html = await fireFetch("/" + roomId);
  const text = matchHtmlText(html, /{"roomProfile.*"welcomeText":/) + '""}';
  let liveInfo = {};
  if (isJSONValid(text)) {
    liveInfo = JSON.parse(text);
  }

  return atob(liveInfo?.roomProfile?.liveLineUrl);
};

//解析
const getHuyaRealUrl = async (roomId) => {
  const liveUrl = await extractLiveLineUrl(roomId),
    query = parseUrlSearch(liveUrl);

  const uuid = Number(
      ((Date.now() % 1e10) * 1e3 + ((1e3 * Math.random()) | 0)) % 4294967295
    ),
    seqid = parseInt(CONFIG.UID) + Date.now();
  const s = encrypt("md5", `${seqid}|${query.ctype}|${query.t}`),
    pathname = liveUrl.split("?").shift().split("/").pop(),
    _sStreamName = pathname.replace(".m3u8", ""),
    n = query.fm
      .replace("$0", CONFIG.UID)
      .replace("$1", _sStreamName)
      .replace("$2", s)
      .replace("$3", query.wsTime),
    wsSecret = encrypt("md5", n),
    host = liveUrl.split("/").filter(Boolean).shift();

  const { fm, ...rest } = query,
    searchObj = {
      ...rest,
      wsSecret,
      seqid,uuid,
      uid: CONFIG.UID,
      ver: 1,
      sv: 2110211124,
    };
  console.log(query);
  return `https://${host.replace(
    "hls",
    "flv"
  )}/src/${_sStreamName}.flv${genUrlSearch(searchObj)}`;
};

getHuyaRealUrl("11352944").then((url) => {
  console.log(url);
});
/* const url = `https://mp.huya.com/cache.php?m=Live&do=profileRoom&roomid=11342388`;
fireFetch(url, {fullUrl:true}, true).then((res) => {
  console.log(JSON.stringify(res));
  fs.writeFileSync('nodejs/huya-info.json',JSON.stringify(res))
});
  */
