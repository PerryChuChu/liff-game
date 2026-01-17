<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>尾牙互動遊戲</title>
  <style>
    #participantContainer {
      position: relative;
      width: 100%;
      height: 500px;
      border: 1px solid #ccc;
      overflow: hidden;
      background-color: #fff;
    }
    .participantBox {
      position: absolute;
      padding: 8px 12px;
      background-color: #f0f0f0;
      border: 2px solid #4caf50;
      border-radius: 8px;
      font-weight: bold;
      box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
      transition: all 0.5s;
    }
    button {
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <h2>尾牙互動遊戲</h2>
  <div id="participantContainer">載入中...</div>
  <button onclick="submitAnswer('A')">答案 A</button>
  <button onclick="submitAnswer('B')">答案 B</button>
  <button onclick="submitAnswer('C')">答案 C</button>

  <script src="https://static.line-scdn.net/liff/edge/2.1/liff.js"></script>
  <script>
    const liffId = "2008908429-W2uPP3vx";
    const sheetUrl = "https://script.google.com/macros/s/AKfycbzt9wj3lG1qxShY774B-B__GQXNVpQ1nQY6c0XYIlWgYXlRiBOGI0zrSmzAyO6aoS6HqA/exec";

    async function loadParticipants() {
      try {
        const res = await fetch(sheetUrl);
        const list = await res.json();

        const container = document.getElementById("participantContainer");
        container.innerHTML = "";

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        list.forEach(p => {
          const div = document.createElement("div");
          div.className = "participantBox";
          div.textContent = p.name;

          const x = Math.random() * (containerWidth - 100);
          const y = Math.random() * (containerHeight - 50);
          div.style.left = x + "px";
          div.style.top = y + "px";

          container.appendChild(div);
        });
      } catch (err) {
        console.error(err);
      }
    }

    async function submitAnswer(answer) {
      try {
        const profile = await liff.getProfile();
        const payload = {
          userId: profile.userId,
          name: profile.displayName,
          answer: answer
        };
        await fetch(sheetUrl, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        alert("已送出，請看大螢幕！");
        loadParticipants();
      } catch (err) {
        console.error(err);
        alert("送出失敗，請稍後再試！");
      }
    }

    liff.init({ liffId }).then(() => {
      loadParticipants();
    });
  </script>
</body>
</html>
