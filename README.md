# promptbase
# PromptBase

Простое веб-приложение для хранения и совместного использования промптов.

## Установка локально

1. **Бэкенд**:
   - Перейдите в `backend/`
   - Установите зависимости: `pip install -r requirements.txt`
   - Запустите: `uvicorn main:app --reload --port 8000`

2. **Фронтенд**:
   - Перейдите в `frontend/`
   - Установите зависимости: `npm install`
   - Запустите: `npm start` (по умолчанию на http://localhost:3000)

3. **База данных**:
   - SQLite создастся автоматически при первом запуске бэкенда.

## Деплой на Vercel

- Фронтенд: Укажите root dir `frontend`, build: npm run build.
- Бэкенд: Добавьте vercel.json, deploy как Python serverless.
- Измените API URL в frontend на deployed backend URL.

## Использование

- Зарегистрируйтесь/залогиньтесь.
- Добавляйте/просматривайте промпты.

## Развитие

- Для PostgreSQL: Измените URL в database.py.
