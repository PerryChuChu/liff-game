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
      transition: 0.3s;
      cursor: pointer;
    }

    /* 按鈕送出後變色 */
    button.sent {
      background-color: #ccc;
      color: #666;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <h2>今年尾牙最大獎："現金" "旅遊" "神秘禮"</h2>

  <!-- 名單顯示區 -->
  <div id="participantContainer">載入中...</div>

  <!-- 答案按鈕 -->
  <button id="btnA" onclick="submitAnswer('A', this)">答案 A</button>
  <button id="btnB" onclick="submitAnswer('B', this)">答案 B</button>
  <button id="btnC" onclick="submitAnswer('C', this)">答案 C</button>

  <!-- LIFF SDK -->
  <script src="https://static.line-scdn.net/liff/edge/2.1/liff.js"></script>
  <script>
    // ================== 設定區 ==================
    const liffId = "2008908429-W2uPP3vx"; // LIFF App ID
    const sheetUrl = "https://script.google.com/macros/s/AKfycbxMPVFWYI5MB533YO6IuL4MaOcgOrtpG4zNl33lsORv7mN5d8z1pQH4uMKYeOs68wFdiw/exec"; // Apps Script /exec URL
    // ===========================================

    // ----------------- 載入名單 (GET) -----------------
    async function loadParticipants() {
      try {
        const res = await fetch(sheetUrl);  
        const list = await res.json(); // 解析 JSON 資料

        const container = document.getElementById("participantContainer");
        container.innerHTML = ""; // 清空容器

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        list.forEach(p => {
          const div = document.createElement("div");
          div.className = "participantBox";
          div.textContent = p.name;

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

    // ----------------- 點按送資料 (POST) -----------------
    async function submitAnswer(answer, btn) {
      try {
        // 按鈕鎖定，避免重複送
        btn.disabled = true;
        btn.classList.add('sent');

        // 取得使用者 LINE Profile
        const profile = await liff.getProfile();

        const payload = { 
          userId: profile.userId, 
          name: profile.displayName, 
          answer 
        };

        // POST 送到 Apps Script
        await fetch(sheetUrl, { 
          method: 'POST', 
          body: JSON.stringify(payload)
        });

        alert("已送出，請看大螢幕！");

        // 送出後刷新名單
        loadParticipants();
      } catch (err) {
        console.error(err);
        alert("送出失敗，請稍後再試！");
        // 失敗解鎖按鈕
        btn.disabled = false;
        btn.classList.remove('sent');
      }
    }

    // ----------------- LIFF 初始化 -----------------
    liff.init({ liffId }).then(() => { 
      loadParticipants(); // 初始化成功後載入名單
    }).catch(err => {
      console.error("LIFF 初始化失敗", err);
    });
  </script>
</body>
</html>
