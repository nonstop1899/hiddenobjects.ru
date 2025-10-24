// GigaChat Generate endpoint для Vercel
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
        const { accessToken, prompt, model } = req.body;

        if (!accessToken || !prompt) {
            return res.status(400).json({
                error: 'Не указаны необходимые параметры'
            });
        }

        // Отключаем проверку SSL сертификата
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false
        });

        const response = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model || 'GigaChat',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 512
            }),
            agent: httpsAgent
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: 'Ошибка генерации текста GigaChat',
                details: data
            });
        }

        // Извлекаем текст ответа (совместимость с Node.js 10)
        const generatedText = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';

        res.status(200).json({
            text: generatedText,
            usage: data.usage,
            model: data.model
        });

    } catch (error) {
        console.error('GigaChat generate error:', error);
        res.status(500).json({
            error: 'Ошибка сервера при генерации текста',
            message: error.message
        });
    }
};
