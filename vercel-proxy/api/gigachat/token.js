// GigaChat Token endpoint для Vercel
const https = require('https');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { authorizationKey } = req.body;

        if (!authorizationKey) {
            return res.status(400).json({
                error: 'Не указан Authorization ключ'
            });
        }

        // Отключаем проверку SSL сертификата (как в оригинальном коде)
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false
        });

        const response = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + authorizationKey,
                'RqUID': Date.now().toString(),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'scope=GIGACHAT_API_PERS',
            agent: httpsAgent
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: 'Ошибка получения токена GigaChat',
                details: data
            });
        }

        res.status(200).json(data);

    } catch (error) {
        console.error('GigaChat token error:', error);
        res.status(500).json({
            error: 'Ошибка сервера при получении токена',
            message: error.message
        });
    }
};
