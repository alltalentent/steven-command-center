# STEVEN COMMAND CENTER
個人工作 Dashboard V1.0。

## 目前可用
- 日期、台北時間、台北天氣
- 本機待辦、優先級、工作分類、完成狀態
- 月曆與行程編輯
- 專案進度
- JSON 匯出與匯入

**注意**：資料只在此瀏覽器 localStorage；尚未連接 Firebase、Google Calendar 或 Apple 提醒事項，不可當成雲端同步系統。

## GitHub Pages 部署
Repository > Settings > Pages > Build and deployment > Deploy from a branch > main / (root) > Save。
網站通常會位於 https://alltalentent.github.io/steven-command-center/ 。

## 後續
1. Firebase Authentication + Firestore (存取規則限制僅個人帳戶)
2. Google Calendar OAuth
3. Mac EventKit Bridge 連接 Apple 提醒事項

請勿將 API secrets 或私人資料 commit 至公開 Repository。
