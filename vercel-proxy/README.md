# 🚀 HOG AI Proxy для Vercel

Прокси-сервер для обхода CORS при работе с Kandinsky и GigaChat API.

## 📋 Структура проекта

```
vercel-proxy/
├── api/
│   ├── health.js                          # Health check
│   ├── kandinsky/
│   │   ├── generate.js                    # Генерация изображения
│   │   └── status/
│   │       └── [uuid].js                  # Проверка статуса
│   └── gigachat/
│       ├── token.js                       # Получение токена
│       └── generate.js                    # Генерация текста
├── package.json                           # Зависимости
├── vercel.json                            # Конфигурация Vercel
└── README.md                              # Этот файл
```

## 🌐 Endpoints

После деплоя на Vercel будут доступны:

- `GET  /health` - Проверка работоспособности
- `POST /api/kandinsky/generate` - Запуск генерации изображения
- `GET  /api/kandinsky/status/:uuid` - Проверка статуса генерации
- `POST /api/gigachat/token` - Получение access token
- `POST /api/gigachat/generate` - Генерация текста

## 🚀 Деплой на Vercel

### Вариант 1: Через веб-интерфейс

1. Зарегистрируйтесь на https://vercel.com (можно через GitHub)
2. Нажмите **"Add New Project"**
3. Выберите **"Import Git Repository"** или загрузите папку `vercel-proxy`
4. Vercel автоматически развернёт проект
5. Получите URL вида: `https://ваш-проект.vercel.app`

### Вариант 2: Через Vercel CLI

```bash
# Установите Vercel CLI
npm install -g vercel

# Войдите в аккаунт
vercel login

# Разверните проект
cd vercel-proxy
vercel

# При первом деплое ответьте на вопросы:
# Set up and deploy? Y
# Which scope? (ваш аккаунт)
# Link to existing project? N
# Project name? hog-ai-proxy
# Directory? ./
# Override settings? N

# Проект развернут! Получите URL
```

## ✅ Проверка работы

После деплоя проверьте health endpoint:

```bash
curl https://ваш-проект.vercel.app/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "timestamp": "2025-10-24T...",
  "platform": "Vercel Serverless"
}
```

## 🔧 Использование в игре

После деплоя обновите `generator/api-integrations.js`:

```javascript
constructor() {
    // ...
    this.proxyServerUrl = 'https://ваш-проект.vercel.app';
    // ...
}
```

Или автоматически:

```javascript
// Для production - использует Vercel proxy
// Для локальной разработки - localhost:3000
this.proxyServerUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://ваш-проект.vercel.app';
```

## 📝 Примечания

- Vercel бесплатный план: 100GB bandwidth/месяц (достаточно для начала)
- Автоматический HTTPS
- Автоматический деплой при push в Git (если настроите)
- Логи доступны в dashboard Vercel

## 🆘 Поддержка

Если возникли проблемы:
1. Проверьте логи в Vercel Dashboard
2. Проверьте что все зависимости установлены (`package.json`)
3. Проверьте CORS headers в `vercel.json`

Готово! 🎉
