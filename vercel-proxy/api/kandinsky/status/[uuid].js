// Kandinsky Status endpoint для Vercel (динамический роутинг)
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { uuid } = req.query;
        const { apiKey, apiSecret } = req.query;

        if (!apiKey || !apiSecret || !uuid) {
            return res.status(400).json({
                error: 'Не указаны ключи API или UUID'
            });
        }

        const response = await fetch(
            'https://api-key.fusionbrain.ai/key/api/v1/pipeline/status/' + uuid,
            {
                headers: {
                    'X-Key': 'Key ' + apiKey,
                    'X-Secret': 'Secret ' + apiSecret
                }
            }
        );

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Kandinsky status error:', error);
        res.status(500).json({
            error: 'Ошибка проверки статуса',
            message: error.message
        });
    }
};
