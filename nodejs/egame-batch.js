/*
# 获取企鹅电竞的真实流媒体地址。
# 默认画质为超清
*/

const { fireFetch } = require("./utils/utils");

//获取直播地址
async function getRoomLiveUrl(rid) {
  const url = "https://share.egame.qq.com/cgi-bin/pgg_async_fcgi",
      param= JSON.stringify({
        0: {
          module: "pgg_live_read_svr",
          method: "get_live_and_profile_info",
          param: {
            anchor_id: rid,
            layout_id: "hot",
            index: 1,
            other_uid: 0,
          },
        },
      })

  const res = await fireFetch(url, {
    method: "post",
    body: `param=${param}`,
  },true);
  if(!(res.ecode===0&&res['data']['0'])){
    console.log('请求错误',JSON.stringify(res.data))
    return ''
  }
  const data=res['data']['0'],videoInfo=data['retBody']['data']['video_info'],pid=videoInfo.pid
  if(!pid){
    console.log('直播间未启用')
    return ''
  }
  const isLive=data['retBody']['data']['profile_info']['is_live']
  if(!isLive){
    console.log('直播间未开播')
    return ''
  }
  const playUrl=videoInfo['stream_infos'][0]['play_url'],
      matches=playUrl.match(/([\w\W]+?)&uid=/)
  return matches[0]||''
}

 //测试
getRoomLiveUrl(540969071).then(res=>{
  console.log(res)
});
(async()=>{

})()
