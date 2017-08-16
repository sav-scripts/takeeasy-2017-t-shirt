/*
* 使用者上傳作品, 如果成功立案的話, 傳回該筆資料的唯一ID
*
* * 須檢查 fb_token 是否有效
* ** 圖片上傳後, 除了原圖 (7086 x 3543) 之外, 須另生成一張縮圖 (456 x 228), 一張facebook分享圖 (1200 x 600)  供日後調用
*/


/* 前端送出 */
var send =
{
    "school_name": "xx 高中", // 使用者真實姓名
    "class_name": "xx 班", // 使用者真實姓名
    "user_name": "John Tester", // 使用者真實姓名
    "phone": "0987654321", // 使用者手機
    "email": "someone@some.where", // 使用者email

    "fb_uid": "231356646542", // facebook uid
    "fb_token": "asdf89f79asfsdf678asf0sadfasf", // facebook access token

    "image_data": "somebase64string", // image data, base 64 string, jpeg 格式, 已去除開頭 "data:image/jpeg;base64," 字串,
    "description": "這作品的精神是....balabalabala" // 作品創作概念
};


/* 後端回應 */
var response =
{
    "error": "some error",  // 正常執行的話傳回空值, 有錯傳回錯誤訊息 (除非我們協定過的特殊錯誤, 不然此訊息會直接 alert 給使用者)
    "serial": "0001" // 如果作品成功立案, 傳回該案的唯一ID
};