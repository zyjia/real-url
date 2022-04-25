const { createHash } = require("crypto");
const fetch = require("node-fetch");


const COMM_CONF = {
  MOBILE_USER_AGENT:
    "Mozilla/5.0 (Linux; U; Android 4.0.3; zh-CN; vivo X9i Build/N2G47H) AppleWebKit/537.36 (KHTML,like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.9.3.973 Mobile Safari/537.36",
};

//统一请求发送
const fireFetch = async (url, opts = {}, isJson = false) => {
  try {
    const res = await fetch(url, {
      ...opts,
      headers: opts.headers || {
        headers: { "User-Agent": COMM_CONF.MOBILE_USER_AGENT },
      },
    }).then((res) => (isJson ? res.json() : res.text()));
    //  console.log(res);
    return res;
  } catch (e) {
    console.error(e);
    return isJson ? {} : "";
  }
};
//随机整数
function getRandomInt(min = 1, max = 100000000) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}
//判断json是否有效
const isJSONValid = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

//提取html文本的目标字符串
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
 * @desc: 加密
 * @param {string} algorithm
 * @param {any} content
 *  @return {string}
 */
const encrypt = (content, algorithm = "md5") => {
  let hash = createHash(algorithm);
  hash.update(content);
  return hash.digest("hex");
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

module.exports = {
  COMM_CONF,
  getRandomInt,
  encrypt,
  isJSONValid,
  parseUrlSearch,
  genUrlSearch,
  fireFetch,
};
