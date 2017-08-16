/*
 * 搜尋作品資料
 */


/*** 前端送出 ***/
var send =
{
    "keyword": "John Tester", // 搜尋關鍵字, 依據 search_type 做不同搜尋, 空值的話就當搜尋所有作品處理
    "search_type": "user_name", // 搜尋方式, 有兩種: user_name => 投稿者名稱, serial => 作品流水號
    "sort_type": "date", // 排序方式, 有兩種: date => 依投稿日期, votes => 投票數量
    "status": "approved",   // 搜尋資料的審核狀態, 依需求應該有 3 種狀態 =>
                            // approved: 已通過審核
                            // reviewing: 審核中
                            // unapproved: 未通過審核
                            // 如果給空值或 'all' 的話, 則搜尋所有的狀態
    "page_index": 0,
    "page_size": 10 // 搜尋的結果如果有多筆的話, 依據 page_size 分頁, 然後傳回 page_index 指定的的分頁的內容
};


/*** 後端回應 ***/
var response =
{
    "error": "",    // 正常執行的話傳回空值, 有錯傳回錯誤訊息
    "data": // 搜尋結果 (如果是搜尋流水號的話, 資料最多只會有一筆)
    [
        {
            "serial": "0088", // 作品流水號
            "status": "approved", // 審核狀態, 如果 request 的 status 有值, 所有資料的這個值應該都相同
            "school_name": "John", // 學校名稱
            "class_name": "John", // 班級名稱
            "user_name": "John", // 作者名稱
            "num_votes": "31231", // 得票數
            "thumb_url": "http://xxxx.xx/thumbxxx.jpg", // 作品縮圖 url (尺寸 456 x 228)
            "description": "bablalalala" // 作品創作概念
        }
        // ...以下多筆資料
    ],
    "num_pages": 12, // 搜尋結果的頁數
    "page_index": 0, // 所回應的資料的分頁索引
    "page_size": 10, // request 的 page_size, 原樣傳回
    "search_type:": "user_name", // request 的 search_type, 原樣傳回
    "sort_type": "date" // request 的 sort_type, 原樣傳回
};




/*** 以下是搜尋 serial 模式的參考樣本
/*** 前端送出 ***/
var send_serial =
{
    "keyword": "123",
    "search_type": "serial",
    "sort_type": "date",
    "status": "all",
    "page_index": 0,
    "page_size": 1
};

/*** 後端回應 ***/
var response_serial =
{
    "error": "",
    "data":
        [
            {
                "serial": "0088", // 作品流水號
                "status": "approved", // 審核狀態, 如果 request 的 status 有值, 所有資料的這個值應該都相同
                "school_name": "John", // 學校名稱
                "class_name": "John", // 班級名稱
                "user_name": "John", // 作者名稱
                "num_votes": "31231", // 得票數
                "thumb_url": "http://xxxx.xx/thumbxxx.jpg", // 作品縮圖 url (尺寸 456 x 228)
                "description": "bablalalala" // 作品創作概念
            }
        ],
    "num_pages": 1,
    "page_index": 0,
    "page_size": 1,
    "search_type:": "serial",
    "sort_type": "date"
};