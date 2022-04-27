# 自用自改

- 使用`Node.js`动态获取分区房间列表: douyu、bilibili、huya

- 批量获取直播URL，添加房间名称、主播名称
- 生成m3u文件
- 修改部分`python`脚本
- ~~在`Node.js`调用`python`脚本~~
- `douyu、bilibili、huya`使用`js`解析



# 免责声明：本仓库的m3u文件和js代码仅供学习交流使用，不得用于任何商业用途，数据来源于互联网公开内容，没有获取任何私有和有权限的信息（个人信息等）。由此引发的任何法律纠纷与本人无关！。

---

# Real-Url

## 说明

没想到还有这么多朋友发 issue 和邮件咨询问题，感谢大家的支持🎈！因为有时很忙，回复和提交代码的周期会有点长，抱歉哦😋

这个仓库存放的是：获取一些直播平台真实流媒体地址（直播源）和弹幕的 Python 代码实现。获取的地址经测试，均可在 PotPlayer、VLC、DPlayer(flv.js + hls.js)等播放器中播放。

>  🤘👌🤙🙏🐉👉 ：如果该项目能帮助到您，欢迎 star 和 pr；或在您的项目中标注 Real-Url 为参考来源。

目前已实现：

 **59** 个直播平台的直播源获取：斗鱼直播、虎牙直播、哔哩哔哩直播、战旗直播、网易 CC 直播、火猫直播、企鹅电竞、YY 直播、一直播、快手直播、花椒直播、映客直播、西瓜直播、触手直播（已倒闭）、NOW 直播、抖音直播，爱奇艺直播、酷狗直播、龙珠直播、PPS 奇秀直播、六间房、17 直播、来疯直播、优酷轮播台、网易 LOOK 直播、千帆直播、陌陌直播、小米直播、迅雷直播、京东直播、企鹅体育、人人直播、棉花糖直播、九秀直播、羚萌直播、95秀、新浪疯播、红人直播、艾米直播、KK直播、酷我聚星、乐嗨直播、秀色直播、星光直播、我秀直播、热猫直播、艺气山直播、AcFun 直播、猫耳FM、畅秀阁、Twitch、TikTok、央视频、PP体育、zhibotv、腾讯体育直播、爱奇艺体育直播、liveU、bigolive、咪咕视频体育。

 **18** 个直播平台的弹幕获取：斗鱼直播、虎牙直播、哔哩哔哩直播、快手直播、火猫直播、企鹅电竞、花椒直播、映客直播、网易 CC 直播、酷狗直播、龙珠直播、PPS 奇秀、搜狐千帆、战旗直播、来疯直播、网易 LOOK 直播、AcFun 直播、艺气山直播。

## 运行

1. 项目使用了很简单的 Python 代码，仅在 Python 3 环境运行测试。
2. 具体所需模块请查看 requirements.txt
3. 获取斗鱼和爱奇艺的直播源，需 JavaScript 环境，可使用 node.js。爱奇艺直播里有个参数是加盐的 MD5，由仓库中的 iqiyi.js 生成。
4. 每个平台的直播源和弹幕获取功能相互独立，以后再整合。弹幕食用：python main.py

## 反馈

有直播平台失效或新增其他平台解析的，可发 [issue](https://github.com/wbt5/real-url/issues/new)。

## 更新
2021.11.7：:sparkles:新增咪咕体育。

2021.8.15：:sparkles:新增 liveU、bigolive。

2021.7.4：:art:更新哔哩哔哩直播源；:bug:修复Acfun直播弹幕；:bug:修复企鹅电竞弹幕。

2021.6.20：:sparkles:新增爱奇艺体育直播。

2021.6.13：:bug:修复腾讯体育。

2021.6.12：:bug:修复斗鱼直播。

2021.05.22：:sparkles:新增腾讯体育直播。

2021.05.15：:art:更新爱奇艺、:bug:修复战旗直播。

2021.05.13： :sparkles:新增 zhibotv。

2021.05.05：:sparkles:新增 PP体育。

2021.05.03：:sparkles:新增 央视频。

2021.05.02：:sparkles:新增 Twitch、TikTok。

2021.05.01：:sparkles:新增畅秀阁、猫耳FM。

2020.12.20：修复直播源：抖音、艺气山、花椒、快手、来疯、龙珠、PPS、人人直播、17live 可能需要挂代理。

2020.10.17：修复：西瓜直播、YY直播。

2020.09.26：更新：虎牙直播源；注释掉未完成的 YY 直播弹幕功能。

2020.09.12：新增：斗鱼添加一个从PC网页端获取直播源的方法，可选线路和清晰度；新增requirements.txt文件；更新代码。

2020.08.18：更新快手直播源，现在播放链接需要带参数；更新快手直播弹幕，直接用 protobuf 序列化；新增 AcFun、艺气山两个平台的弹幕功能。

2020.08.08：新增 AcFun 直播、艺气山直播；更新：哔哩哔哩直播、虎牙直播、红人直播；优化：斗鱼直播。

2020.07.31：新增 19 个直播平台，详见上面说明；更新YY直播，现在可以获取最高画质；优化战旗直播、优酷直播代码；

2020.07.25：新增网易 LOOK 直播弹幕获取；修复斗鱼直播源；新增陌陌直播源。

2020.07.19：新增来疯直播弹幕获取

2020.07.18：新增酷狗、龙珠、PPS奇秀、搜狐千帆、战旗直播等5个平台的弹幕获取

2020.07.11：新增网易CC直播弹幕获取

2020.07.05：新增花椒直播、映客直播弹幕获取；更新虎牙直播源

2020.06.25：新增🐧企鹅电竞弹幕获取

2020.06.19：新增火猫直播弹幕获取

2020.06.18：新增弹幕功能

- 添加斗鱼、虎牙、哔哩哔哩和快手 4 个平台的弹幕获取。后续添加其他平台。
- 实现弹幕功能的代码和思路主要来自：[danmaku](https://github.com/IsoaSFlus/danmaku) 和 [ks_barrage](https://github.com/py-wuhao/ks_barrage)，感谢两位大佬！

2020.05.30：更新虎牙直播。

2020.05.25：更新哔哩哔哩直播。

- 默认获取最高画质，不同清晰度取决于请求参数中的 qn。
- 增加 .m3u8 格式播放链接的获取方法。

2020.05.23：更新17直播、虎牙直播

2020.05.19：更新火猫、快手、酷狗、PPS

2020.05.08：新增优酷轮播台、look 直播、千帆直播；

- 新增优酷轮播台：优酷轮播台是优酷直播下的一个子栏目，轮播一些经典电影电视剧，个人感觉要比其他直播平台影视区的画质要好，而且没有平台水印和主播自己贴的乱七八糟的字幕遮挡。
- 新增 LOOK 直播：LOOK 直播是网易云音乐旗下的直播平台。
- 新增千帆直播：千帆直播是搜狐旗下的直播平台。

2020.05.01：新增优酷的来疯直播。

2020.04.30：新增17直播。

2020.04.24：修复虎牙、哔哩哔哩、快手、爱奇艺。

2020.02.26：更新一直播。

2020.01.18：更新抖音直播。

2020.01.10：新增酷狗直播、龙珠直播、PPS奇秀直播、六间房。

2020.01.09：新增爱奇艺直播。

2020.01.07：新增抖音直播；删除一个直播平台。

2020.01.03：修复快手直播，请求移动网页版。 

2019.12.31：修复快手直播。 

2019.12.07：修复哔哩哔哩直播。

2019.12.04：更新斗鱼直播，新增一种获取方式。

2019.11.24：新增收米直播。

2019.11.18：新增西瓜直播；触手直播；NOW直播。

2019.11.18：新增一直播；快手直播；花椒直播；映客直播。

2019.11.17：新增火猫直播；新增企鹅电竞；新增YY直播。

2019.11.16：新增战旗tv直播源；新增网易CC直播。

2019.11.09：新增哔哩哔哩直播源。

2019.11.03：新增虎牙直播源。

2019.11.02：修复斗鱼预览地址获取的方法；新增未开播房间的判断。

## 鸣谢

感谢 [JetBrains](https://www.jetbrains.com/?from=real-url) 提供的 free JetBrains Open Source license

[![JetBrains-logo](https://i.loli.net/2020/10/03/E4h5FZmSfnGIgap.png)](https://www.jetbrains.com/?from=real-url)

