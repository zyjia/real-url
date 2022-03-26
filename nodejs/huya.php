<?php
$url = 'https://m.huya.com/cxldb';
$header[] = 'User-Agent: Mozilla/5.0 (Linux; U; Android 4.0.3; zh-CN; vivo X9i Build/N2G47H) AppleWebKit/537.36 (KHTML,like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.9.3.973 Mobile Safari/537.36';
$header[] = 'CLIENT-IP: '.get_ip();
$header[] = 'X-FORWARDED-FOR: '.get_ip();
$header[] = 'Cookie: '.$Cookie='';

$data = doCurl($url,$header,$url);

$liveurl = inter($data,'"liveLineUrl":"','","isFace');

$baseurl = base64_decode($liveurl);
//echo $baseurl."<br>";

$uid="1461688433250";

$_seqid = $uid + getMillisecond();

$_ctype = inter($baseurl,'&ctype=','&');

$_t = inter($baseurl,'&t=','');

$s = md5($_seqid.'|'.$_ctype.'|'.$_t);

$_fm = inter($baseurl,'&fm=','&');
$_sStreamName = inter($baseurl,'src/','imgplus').'imgplus';
$_wsTime = inter($baseurl,'&wsTime=','&');

$_fm =urldecode($_fm);
$_fm =base64_decode($_fm);

$_fm = str_replace('$0',$uid,$_fm);
$_fm = str_replace('$1',$_sStreamName,$_fm);
$_fm = str_replace('$2',$s,$_fm);
$n = str_replace('$3',$_wsTime,$_fm);

$wsSecret = md5($n);

$o = "wsSecret=$wsSecret&wsTime=$_wsTime&seqid=$_seqid&ctype=$_ctype&ver=1";

$_params = inter($baseurl,'&txyp=','');

$newparam = $o.'&txyp='.$_params.'&ratio=2000';

$newurl = 'https://al.flv.huya.com/src/'.$_sStreamName.'.flv?'.$newparam.'&uid='.$uid.'&uuid='.uuid().'&t=103&sv=2110211124';

//m3u8貌似不能用
//$newurl = explode('?',$baseurl)[0];
//$newurl = 'https:'.$newurl.'?'.$newparam.'&uid='.$uid.'&uuid='.uuid().'&t=103&sv=2110211124';

echo $newurl;
exit;

function doCurl($url, $header=array(), $referer='', $timeout=30){
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
  curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
  curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,false);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($ch, CURLOPT_REFERER, $referer);
  $response = curl_exec($ch);
  if($error=curl_error($ch)){
    die($error);
  }
  curl_close($ch);
  return $response;
}

//获取当前时间13位时间戳
function getMillisecond() {
	list($t1, $t2) = explode(' ', microtime()); 
	return (float)sprintf('%.0f',(floatval($t1)+floatval($t2))*1000);
}
//随机返回0到1之间的数字
function random($min = 0, $max = 1) {
	$num = $min + mt_rand()/mt_getrandmax()*($max-$min);
	return round($num*10000);
}
//获取随机码
function uuid(){
	return (getMillisecond() % 1e10 * 1e3 + (1e3 * random())) % 4294967295;
}
//获取IP地址
function get_ip() {
	if (@$_SERVER["HTTP_X_FORWARDED_FOR"]) $ip = explode(",", $_SERVER["HTTP_X_FORWARDED_FOR"]) [0];
	else if (@$_SERVER["HTTP_CLIENT_IP"]) $ip = $_SERVER["HTTP_CLIENT_IP"];
	else if (@$_SERVER["REMOTE_ADDR"]) $ip = $_SERVER["REMOTE_ADDR"];
	else if (@getenv("HTTP_X_FORWARDED_FOR")) $ip = explode(",", getenv("HTTP_X_FORWARDED_FOR")) [0];
	else if (@getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
	else if (@getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
	else $ip = "Unknown IP";
	return $ip;
}
//截取字串符
function inter($str, $start, $end){
    $wd2 = '';
    if ($str && $start) {
        $arr = explode($start, $str);
        if (count($arr) > 1) {
            $wd = $arr[1];
            if ($end) {
                $arr2 = explode($end, $wd);
                if (count($arr2) > 1) {
                    $wd2 = $arr2[0];
                } else {
                    $wd2 = $wd;
                }
            } else {
                $wd2 = $wd;
            }
        }
    }
    return $wd2;
}
?>
