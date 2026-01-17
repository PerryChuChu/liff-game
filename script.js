const liffId = "165xxxxxxxxx-xxxxxx";
const sheetUrl = "https://script.google.com/macros/s/xxxx/exec";


liff.init({ liffId }).then(() => {
  if (!liff.isLoggedIn()) liff.login();
});

function send(answer) {
  liff.getProfile().then(p => {
    fetch(sheetUrl, {
      method: "POST",
      body: JSON.stringify({
        userId: p.userId,
        name: p.displayName,
        answer
      })
    });
    alert("已送出，請看大螢幕！");
  });
}
