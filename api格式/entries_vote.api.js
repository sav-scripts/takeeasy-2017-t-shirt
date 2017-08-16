/*
 * 投票
 */


/* 前端送出 */
var send =
{
    "name": "John Tester", // 投票者真實姓名
    "phone": "0987654321", // 投票者手機
    "email": "someone@some.where", // 投票者email

    "fb_uid": "231356646542", // facebook uid
    "fb_token": "asdf89f79asfsdf678asf0sadfasf", // facebook access token

    "serial": "321" // 要投的作品流水號
};


/* 後端回應 */
var response =
{
    "error": "some error",  // 正常執行的話傳回空值, 有錯傳回錯誤訊息
    "share_url": "http://xxx.xxx/xx.jpg" // 傳回作品分享圖片網址, 由後端生成
};