const liffId = "2008908429-W2uPP3vx";
const sheetUrl = "https://script.google.com/macros/s/AKfycbxspLnlznifdhNcZI2bejFe1jeVPHH3qh5PFSuyOuSYMhzSMama3xwhiN6L9VePaCDB/exec";


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
