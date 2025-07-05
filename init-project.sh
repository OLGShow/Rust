#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎮 RUST Store - Инициализация проекта${NC}"
echo "====================================="
echo

# Проверка наличия Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git не найден! Установите Git и повторите попытку.${NC}"
    exit 1
fi

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js не найден! Установите Node.js 18+ и повторите попытку.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Git и Node.js найдены${NC}"
echo

# Установка зависимостей
echo -e "${YELLOW}📦 Установка зависимостей...${NC}"
if ! npm install; then
    echo -e "${RED}❌ Ошибка при установке зависимостей!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Зависимости установлены${NC}"
echo

# Инициализация Git репозитория
echo -e "${YELLOW}🔧 Инициализация Git репозитория...${NC}"
git init
git branch -M main

# Добавление remote origin
echo -e "${YELLOW}🌐 Добавление remote origin...${NC}"
git remote add origin https://github.com/OLGShow/Rust.git

# Добавление файлов в Git
echo -e "${YELLOW}📁 Добавление файлов в Git...${NC}"
git add .

# Создание коммита
echo -e "${YELLOW}💾 Создание коммита...${NC}"
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

echo
echo -e "${GREEN}✅ Проект готов к загрузке на GitHub!${NC}"
echo
echo -e "${BLUE}📤 Для загрузки на GitHub выполните:${NC}"
echo "   git push -u origin main"
echo
echo -e "${BLUE}🌐 После загрузки проект будет доступен по адресу:${NC}"
echo "   https://olgshow.github.io/Rust/"
echo
echo -e "${BLUE}🚀 Для запуска локального сервера разработки:${NC}"
echo "   npm run dev"
echo
echo -e "${BLUE}📋 Для проверки проекта:${NC}"
echo "   - Откройте http://localhost:3000"
echo "   - Проверьте адаптивность (F12 → Device Toolbar)"
echo "   - Протестируйте все функции магазина"
echo

# Предложение автоматически отправить на GitHub
read -p "🤔 Хотите сразу отправить проект на GitHub? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}📤 Отправка на GitHub...${NC}"
    if git push -u origin main; then
        echo -e "${GREEN}🎉 Проект успешно загружен на GitHub!${NC}"
        echo -e "${BLUE}🌐 Проект доступен по адресу: https://github.com/OLGShow/Rust${NC}"
        echo -e "${BLUE}📱 Live Demo будет доступно через несколько минут: https://olgshow.github.io/Rust/${NC}"
    else
        echo -e "${RED}❌ Ошибка при отправке на GitHub. Проверьте права доступа к репозиторию.${NC}"
    fi
fi

echo -e "${GREEN}🎮 Готово! Добро пожаловать в RUST Store 2025!${NC}" 