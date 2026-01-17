// ================== 設定區 ==================
const liffId = "2008908429-W2uPP3vx"; 
const sheetUrl = "https://script.google.com/macros/s/AKfycbxMPVFWYI5MB533YO6IuL4MaOcgOrtpG4zNl33lsORv7mN5d8z1pQH4uMKYeOs68wFdiw/exec"; 
const defaultAvatar = "default.png"; // 放在 GitHub Pages 的預設頭像
// ===========================================

let timeLeft = 120;
const timerEl = document.getElementById("timer");

// ----------------- 倒數計時器 -----------------
const countdown = setInterval(() => {
  if(timeLeft <= 0){
    clearInterval(countdown);
    alert("時間到！抽獎開始！");
  } else {
    timerEl.textContent = timeLeft;
    timeLeft--;
  }
}, 1000);

// ----------------- 載入名單 -----------------
async function loadParticipants() {
  try {
    const res = await fetch(sheetUrl);
    const list = await res.json();
    document.getElementById("playerCount").textContent = "人數: " + list.length;

    const container = document.getElementById("redPacket");
    container.innerHTML = "";

    list.forEach(p => {
      const div = document.createElement("div");
      div.className = "participantBox";

      // 顯示頭像 + 名字
      const img = document.createElement("img");
      img.src = p.avatar || defaultAvatar; // 預設頭像
      img.onerror = () => { img.src = defaultAvatar; }; // 如果載入失敗換成預設
      div.appendChild(img);

      const span = document.createElement("span");
      span.textContent = p.name;
      div.appendChild(span);

      // 隨機位置
      const x = Math.random() * (container.offsetWidth - 60);
      const y = Math.random() * (container.offsetHeight - 40);
      div.style.left = x + "px";
      div.style.top = y + "px";

      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    document.getElementById("redPacket").textContent = "名單載入失敗";
  }
}

// ----------------- 一進頁面就加入名單 -----------------
async function joinGame() {
  try {
    const profile = await liff.getProfile();
    const payload = {
      userId: profile.userId,
      name: profile.displayName,
      avatar: profile.pictureUrl || defaultAvatar, // 確保有頭像
      answer: "" // 尚未選答案
    };

    await fetch(sheetUrl, { method: 'POST', body: JSON.stringify(payload) });
    loadParticipants();
  } catch (err) {
    console.error(err);
  }
}

// ----------------- 點按送資料 -----------------
async function submitAnswer(answer, btn) {
  try {
    btn.disabled = true;
    btn.classList.add('sent');

    const profile = await liff.getProfile();
    const payload = { 
      userId: profile.userId, 
      name: profile.displayName, 
      avatar: profile.pictureUrl || defaultAvatar,
      answer 
    };

    await fetch(sheetUrl, { method: 'POST', body: JSON.stringify(payload) });
    alert("已送出，請看大螢幕！");
    loadParticipants();
  } catch (err) {
    console.error(err);
    alert("送出失敗，請稍後再試！");
    btn.disabled = false;
    btn.classList.remove('sent');
  }
}

// ----------------- LIFF 初始化 -----------------
liff.init({ liffId }).then(() => { 
  joinGame(); // 一進頁面自動加入名單
}).catch(err => {
  console.error("LIFF 初始化失敗", err);
});
