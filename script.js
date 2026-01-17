<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>尾牙互動遊戲</title>
  <style>
    /* 名單容器 */
    #participantContainer { 
      position: relative; 
      width: 100%; 
      height: 500px; 
      border: 1px solid #ccc; 
      overflow: hidden; 
      background-color: #fff; 
    }

    /* 每個參加者的框框 */
    .participantBox { 
      position: absolute; 
      padding: 8px 12px; 
      background-color: #f0f0f0; 
      border: 2px solid #4caf50; 
      border-radius: 8px; 
      font-weight: bold; 
      box-shadow: 2px 2px 5px rgba(0,0,0,0.2); 
      transition: all 0.5s; /* 動畫效果 */
    }

    /* 答案按鈕 */
    button { 
      margin-top: 20px; 
      padding: 10px 20px; 
      font-size: 16px; 
    }
  </style>
</head>
<body>
  <h2>尾牙互動遊戲</h2>

  <!-- 名單顯示區 -->
  <div id="participantContainer">載入中...</div>

  <!-- 答案按鈕 -->
  <button onclick="submitAnswer('A')">答案 A</button>
  <button onclick="submitAnswer('B')">答案 B</button>
  <button onclick="submitAnswer('C')">答案 C</button>

  <!-- LIFF SDK -->
  <script src="https://static.line-scdn.net/liff/edge/2.1/liff.js"></script>
  <script>
    // ================== 設定區 ==================
    const liffId = "2008908429-W2uPP3vx"; // LIFF ID
    const sheetUrl = "https://script.google.com/macros/s/AKfycby629YTe4g98WRQ7amXcyDK6EkJvufUC-q9NGRLEtuPaeBxolUy-21Ci_g-y92EhuHILg/exec"; // Apps Script /exec URL
    // ===========================================

    // ----------------- 載入名單 -----------------
    async function loadParticipants() {
      try {
        // GET 請求取得已加入的參加者名單
        const res = await fetch(sheetUrl);  
        const list = await res.json(); // 解析 JSON 資料

        const container = document.getElementById("participantContainer");
        container.innerHTML = ""; // 清空容器

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // 將每個參加者加上框框隨意排版
        list.forEach(p => {
          const div = document.createElement("div");
          div.className = "participantBox";
          div.textContent = p.name; // 顯示暱稱

          // 隨機位置
          const x = Math.random() * (containerWidth - 100);
          const y = Math.random() * (containerHeight - 50);
          div.style.left = x + "px";
          div.style.top = y + "px";

          container.appendChild(div);
        });
      } catch (err) {
        console.error(err);
        document.getElementById("participantContainer").textContent = "載入名單失敗";
      }
    }

    // ----------------- 點按送資料 -----------------
    async function submitAnswer(answer) {
      try {
        // 取得使用者 LINE Profile
        const profile = await liff.getProfile();

        // 組成要送到 Google Sheet 的資料
        const payload = { 
          userId: profile.userId, 
          name: profile.displayName, 
          answer 
        };

        // POST 請求送到 Apps Script
        await fetch(sheetUrl, { 
          method: 'POST', 
          body: JSON.stringify(payload) 
        });

        alert("已送出，請看大螢幕！");
        loadParticipants(); // 送出後刷新名單
      } catch (err) {
        console.error(err);
        alert("送出失敗，請稍後再試！");
      }
    }

    // ----------------- LIFF 初始化 -----------------
    liff.init({ liffId }).then(() => { 
      loadParticipants(); // 初始化成功後載入名單
    });
  </script>
</body>
</html>
