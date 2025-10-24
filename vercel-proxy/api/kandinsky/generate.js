// Kandinsky Generate endpoint для Vercel
const fetch = require('node-fetch');
const FormData = require('form-data');

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
        const { apiKey, apiSecret, prompt, style } = req.body;

        if (!apiKey || !apiSecret || !prompt) {
            return res.status(400).json({
                error: 'Не указаны необходимые параметры'
            });
        }

        console.log('🎨 Kandinsky: Запрос на генерацию изображения');

        // Шаг 1: Получаем pipeline_id
        const pipelinesResponse = await fetch('https://api-key.fusionbrain.ai/key/api/v1/pipelines', {
            method: 'GET',
            headers: {
                'X-Key': 'Key ' + apiKey,
                'X-Secret': 'Secret ' + apiSecret
            }
        });

        if (!pipelinesResponse.ok) {
            const errorText = await pipelinesResponse.text();
            return res.status(pipelinesResponse.status).json({
                error: 'Ошибка получения списка pipelines',
                details: errorText
            });
        }

        const pipelines = await pipelinesResponse.json();
        const pipelineId = (pipelines && pipelines[0] && pipelines[0].id) || null;

        if (!pipelineId) {
            return res.status(500).json({
                error: 'Не удалось получить pipeline_id',
                details: pipelines
            });
        }

        console.log('   ✅ Pipeline ID получен:', pipelineId);

        // Шаг 2: Запускаем генерацию
        const params = {
            type: 'GENERATE',
            numImages: 1,
            width: 1024,
            height: 1024,
            generateParams: {
                query: prompt
            }
        };

        if (style && style !== 'DEFAULT') {
            params.style = style;
        }

        const formData = new FormData();
        formData.append('pipeline_id', pipelineId);
        formData.append('params', JSON.stringify(params), {
            contentType: 'application/json'
        });

        const generateResponse = await fetch('https://api-key.fusionbrain.ai/key/api/v1/pipeline/run', {
            method: 'POST',
            headers: Object.assign({
                'X-Key': 'Key ' + apiKey,
                'X-Secret': 'Secret ' + apiSecret
            }, formData.getHeaders()),
            body: formData
        });

        if (!generateResponse.ok) {
            const errorText = await generateResponse.text();
            return res.status(generateResponse.status).json({
                error: 'Ошибка запуска генерации',
                details: errorText
            });
        }

        const generateData = await generateResponse.json();
        const uuid = generateData.uuid;

        if (!uuid) {
            return res.status(500).json({
                error: 'Не удалось запустить генерацию',
                details: generateData
            });
        }

        console.log('   ✅ Генерация запущена, UUID:', uuid);

        res.status(200).json({ uuid, status: 'started' });

    } catch (error) {
        console.error('Kandinsky generate error:', error);
        res.status(500).json({
            error: 'Ошибка сервера при генерации изображения',
            message: error.message
        });
    }
};
