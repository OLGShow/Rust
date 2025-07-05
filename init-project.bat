@echo off
chcp 65001 >nul
echo 🎮 RUST Store - Инициализация проекта
echo =====================================
echo.

REM Проверка наличия Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git не найден! Установите Git и повторите попытку.
    pause
    exit /b 1
)

REM Проверка наличия Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не найден! Установите Node.js 18+ и повторите попытку.
    pause
    exit /b 1
)

echo ✅ Git и Node.js найдены
echo.

REM Установка зависимостей
echo 📦 Установка зависимостей...
call npm install
if errorlevel 1 (
    echo ❌ Ошибка при установке зависимостей!
    pause
    exit /b 1
)
echo ✅ Зависимости установлены
echo.

REM Инициализация Git репозитория
echo 🔧 Инициализация Git репозитория...
git init
git branch -M main

REM Добавление remote origin
echo 🌐 Добавление remote origin...
git remote add origin https://github.com/OLGShow/Rust.git

REM Добавление файлов в Git
echo 📁 Добавление файлов в Git...
git add .

REM Создание коммита
echo 💾 Создание коммита...
git commit -m "🎮 Initial commit: RUST Store - Современный магазин внутриигровых покупок

✨ Особенности:
- Современный дизайн 2025 с Glassmorphism эффектами  
- React 18 + Vite + Tailwind CSS
- Система корзины и детальные карточки товаров
- Авторизация Steam (готова к интеграции)
- PWA поддержка и мобильная оптимизация
- SEO оптимизация и производительность

🛒 Функциональность:
- Выбор серверов с мониторингом онлайна
- Категории товаров (привилегии, предметы, оружие, броня)  
- Система бонусов при пополнении
- Интерактивные анимации и современный UX

🚀 Технологии 2025:
- React 18, Vite, Tailwind CSS
- Framer Motion для анимаций
- Lucide React для иконок
- PWA готовность
- GitHub Actions CI/CD
- Современная архитектура"

echo.
echo ✅ Проект готов к загрузке на GitHub!
echo.
echo 📤 Для загрузки на GitHub выполните:
echo    git push -u origin main
echo.
echo 🌐 После загрузки проект будет доступен по адресу:
echo    https://olgshow.github.io/Rust/
echo.
echo 🚀 Для запуска локального сервера разработки:
echo    npm run dev
echo.
echo 📋 Для проверки проекта:
echo    - Откройте http://localhost:3000
echo    - Проверьте адаптивность (F12 → Device Toolbar)
echo    - Протестируйте все функции магазина
echo.
pause 