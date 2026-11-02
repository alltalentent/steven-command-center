# STEVEN COMMAND CENTER

個人工作總控台，GitHub Pages 靜態網頁 + Firebase Authentication / Cloud Firestore。預設本機模式，可選擇登入同步。

## 已實作
- 台北時間與 Open-Meteo 天氣
- 依單位管理待辦、優先級、完成狀態
- 月曆 / 行程編輯與專案進度
- 匯出 / 匯入 JSON 備份
- Firebase Google 登入與個人 Firestore 儲存（完成 Firebase Console 步驟後啟用）

**尚未實作**：Google Calendar 官方同步、Apple Reminders Mac Bridge、即時多人協作、可靠的多裝置衝突合併。此版從 Firestore 讀取資料時會在登入時載入；若在另一裝置修改，請重新整理前確認沒有未同步的編輯。請勿同時在多裝置編輯同一份資料。

## Firebase Console 必做
1. [Firebase 專案](https://console.firebase.google.com/project/steven-command-center-513b5/overview) → Project settings → General → Your apps → Add app → Web（網頁圖示）。註冊名稱 Steven Dashboard，無需 Firebase Hosting。
2. 複製 Firebase 產生的 **firebaseConfig 物件內的 JSON 欄位**（包含 apiKey、authDomain、projectId、appId），不需要也不可貼任何 Service Account 私鑰。Dashboard → Settings → 設定 Firebase，貼入合法 JSON 物件（鍵名和字串需有雙引號）。
3. Authentication → Sign-in method → **Google** → Enable → Save。
4. Authentication → Settings → Authorized domains → Add domain → `alltalentent.github.io`（不要含 https:// 或路徑）。
5. Build → Firestore Database → Create database。選擇合適區域；區域建立後不能任意更改。接著開啟 Rules，將 repository 的 [firestore.rules](./firestore.rules) **完整貼上並按 Publish**。不要留在 test mode。
6. 開啟 Dashboard → Settings → Google 登入。首次載入會詢問保留本機或雲端資料，務必先匯出 JSON 備份。

### 登入後的資料路徑
`users/{firebaseAuthUid}/dashboard/main`

Firestore Rules 限制讀寫屬於認證者自己的 UID；實際安全性取決於你是否已在 Firebase Console 發布規則。請勿把待辦或私人資料直接提交到公開 GitHub Repo。

## GitHub Pages
Repository → Settings → Pages → Deploy from branch → main /(root)。
https://alltalentent.github.io/steven-command-center/

## 注意
- Firebase Web App config 是公開識別資訊而非 Service Account 私鑰；資料安全由 Firestore 規則和驗證提供。
- GitHub Pages 網站是公開可讀，登入前不會在伺服器保有個人資料。
- 目前瀏覽器 localStorage 仍保留本機資料，公用電腦上不要操作私人內容。
- 雲端網路中斷時資料會先留在本機，請留意同步狀態。此版不提供完善離線佇列或衝突解決。
