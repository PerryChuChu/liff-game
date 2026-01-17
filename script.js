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
