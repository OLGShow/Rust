# 🎮 RUST Store - Премиальный магазин внутриигровых покупок

> **Современный интернет-магазин 2025 года** для внутриигровых покупок в RUST с передовыми технологиями и трендами веб-разработки.

[![🚀 Deploy Status](https://github.com/OLGShow/Rust/workflows/Deploy%20RUST%20Store%20to%20GitHub%20Pages/badge.svg)](https://github.com/OLGShow/Rust/actions)
[![📱 PWA Ready](https://img.shields.io/badge/PWA-Ready-green.svg)](https://github.com/OLGShow/Rust)
[![⚡ Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF.svg)](https://vitejs.dev/)
[![🎨 Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)

## 🌟 Соответствие технологиям интернет-магазинов 2025 года

### 🚀 **Frontend Technologies**
- ✅ **React 18** - современный JavaScript фреймворк для SPA
- ✅ **Vite** - сверхбыстрая сборка и hot reload
- ✅ **Tailwind CSS** - utility-first CSS фреймворк
- ✅ **TypeScript Ready** - готовность к строгой типизации

### 📱 **PWA & Mobile-First**
- ✅ **Progressive Web App** - работа как мобильное приложение
- ✅ **Offline Support Ready** - поддержка автономной работы
- ✅ **Push Notifications Ready** - готовность к уведомлениям
- ✅ **Mobile-First Design** - приоритет мобильных устройств
- ✅ **Touch-Friendly Interface** - оптимизация для касаний

### 🎨 **Design Trends 2025**
- ✅ **Glassmorphism Effects** - стеклянные поверхности с размытием
- ✅ **Micro-interactions** - плавные анимации и переходы
- ✅ **Dynamic Gradients** - анимированные градиенты
- ✅ **Interactive Elements** - отзывчивые компоненты
- ✅ **Dark Mode Ready** - поддержка темной темы

### 💳 **Modern Payment Integration Ready**
- 🔮 **Mobile Payments** - Apple Pay, Google Pay (интеграция)
- 🔮 **Digital Ruble** - поддержка цифрового рубля (планируется)
- 🔮 **Cryptocurrency** - поддержка криптовалют (планируется)
- 🔮 **Buy Now, Pay Later** - отложенные платежи (планируется)

### 🔧 **Modern Architecture**
- ✅ **Component-Based** - модульная архитектура
- ✅ **Serverless Ready** - готовность к serverless
- ✅ **Microservices Ready** - поддержка микросервисов
- ✅ **API-First** - готовность к REST/GraphQL API

### 🛡️ **Security & Performance**
- ✅ **Content Security Policy** - защита от XSS
- ✅ **HTTPS Ready** - готовность к безопасным соединениям
- ✅ **Code Splitting** - оптимизация загрузки
- ✅ **Lazy Loading Ready** - отложенная загрузка контента
- ✅ **CDN Optimized** - оптимизация для CDN

### 🔗 **Integration Capabilities**
- 🔮 **CRM Integration** - 1С, Битрикс24 (планируется)
- 🔮 **ERP Integration** - автоматизация бизнес-процессов
- 🔮 **Steam API** - авторизация и проверка владения игрой
- 🔮 **Analytics** - Google Analytics 4, Яндекс.Метрика

## ✨ Особенности

### 🎨 **Современный дизайн 2025**
- **Glassmorphism эффекты** - стеклянные поверхности с размытием
- **Интерактивные анимации** - плавные переходы и микроинтеракции
- **Градиентная типографика** - современные заголовки с анимацией
- **Адаптивный дизайн** - оптимизация для всех устройств

### 🛒 **Функциональность магазина**
- **Авторизация Steam** - быстрый вход через Steam аккаунт
- **Выбор серверов** - отображение онлайна и пинга
- **Категории товаров** - привилегии, предметы, оружие, броня
- **Детальные карточки** - всплывающие окна с описанием товаров
- **Корзина покупок** - подсчет общей стоимости
- **Система бонусов** - скидки при пополнении на сумму

### 🚀 **Технические особенности**
- **React 18** с Hooks
- **Framer Motion** для анимаций
- **Tailwind CSS** для стилизации
- **Lucide React** для иконок
- **Современный CSS** с переменными и анимациями

## 🚀 Быстрый старт

### Требования
- Node.js 18+ 
- npm или yarn

### Установка и запуск
```bash
# Клонировать репозиторий
git clone https://github.com/OLGShow/Rust.git
cd Rust

# Установить зависимости
npm install

# Запустить сервер разработки
npm run dev

# Открыть http://localhost:3000
```

### Сборка для продакшена
```bash
# Создать оптимизированную сборку
npm run build

# Предварительный просмотр сборки
npm run preview
```

## 🌐 Деплой на GitHub Pages

Проект настроен для автоматического деплоя через GitHub Actions:

1. **Push в main** - автоматический деплой
2. **Pull Request** - проверка сборки
3. **Live Demo**: https://olgshow.github.io/Rust/

### Ручной деплой
```bash
# Сборка и деплой
npm run build
npm run preview

# Или используйте GitHub Pages через Settings → Pages
```

## 📁 Структура проекта

```
rust-store/
├── .github/workflows/   # GitHub Actions для CI/CD
├── src/
│   ├── components/ui/   # UI компоненты (Button, Card, Dialog, etc.)
│   ├── lib/             # Утилиты (cn функция)
│   ├── App.jsx          # Главный компонент
│   ├── App.css          # Стили с glassmorphism
│   └── main.jsx         # Точка входа
├── public/              # Статические файлы и PWA манифест
├── README.md           # Документация
├── deploy.md           # Инструкции по деплою
├── TODO.md             # План развития
└── конфигурационные файлы
```

## 🎯 Продукты и функции

### 📦 **Типы товаров**
- **VIP Пакеты** - привилегии с длительностью действия
- **Предметы** - верстаки, карточки доступа
- **Оружие** - автоматы, снайперские винтовки
- **Броня** - защитные наборы

### 🎮 **Игровые серверы**
- **Выбор сервера** - Red, Green, Yellow, Purple, Blue, Black
- **Мониторинг** - онлайн игроков и пинг
- **Предупреждения** - активация привилегий на выбранном сервере

### 💳 **Система платежей**
- **Бонусная система** - от 10% до 40% при пополнении
- **Корзина покупок** - добавление множественных товаров
- **Быстрая покупка** - мгновенная покупка одного товара

## 🎨 Дизайн-система

### 🌈 **Цветовая палитра**
- **Основной** - Оранжевый (`#f97316`)
- **Акцент** - Красный (`#ef4444`)
- **Фон** - Градиент темно-серых тонов
- **Текст** - Белый с различной прозрачностью

### 🔤 **Типографика**
- **Шрифт** - Inter (Google Fonts)
- **Заголовки** - Жирные с градиентными эффектами
- **Подзаголовки** - Средний вес с увеличенным межстрочным интервалом

## 🔧 Настройка

### 🎯 **Конфигурация продуктов**
Товары настраиваются в файле `src/App.jsx` в массиве `products`:

```javascript
{
  id: 1,
  name: "VIP Package",
  price: 540,
  category: "privileges",
  description: "Premium VIP access with exclusive benefits",
  features: ["3 daily kits", "Queue bypass", "..."],
  duration: "6 days",
  popular: true,
  discount: 15
}
```

### 🖥️ **Настройка серверов**
Серверы настраиваются в массиве `servers`:

```javascript
{
  id: 'red',
  name: 'Red',
  players: 14,
  maxPlayers: 200,
  status: 'online',
  ping: 45
}
```

## 🌐 SEO оптимизация

### 📊 **Мета-теги**
- Описание и ключевые слова
- Open Graph для социальных сетей
- Twitter Cards для Twitter
- Structured Data для Google

### 🚀 **Производительность**
- Предзагрузка шрифтов
- Оптимизированные изображения
- Сжатие и минификация
- Code splitting и lazy loading

## 📱 Адаптивность

Дизайн оптимизирован для:
- 📱 **Мобильные устройства** (320px+)
- 📱 **Планшеты** (768px+)
- 💻 **Настольные компьютеры** (1024px+)
- 🖥️ **Большие экраны** (1920px+)

## 🔐 Безопасность

- Content Security Policy
- HTTPS готовность для продакшена
- Валидация на клиенте
- Защита от XSS атак

## 🎯 Roadmap 2025

### 🔮 **Q1 2025**
- [ ] Интеграция с реальными платежными системами
- [ ] Steam API авторизация
- [ ] Мобильные платежи (Apple Pay, Google Pay)

### 🔮 **Q2 2025**
- [ ] Admin панель управления
- [ ] CRM интеграция (1С, Битрикс24)
- [ ] Система аналитики и метрик

### 🔮 **Q3 2025**
- [ ] Мультиязычность
- [ ] Криптовалютные платежи
- [ ] AI-powered рекомендации

### 🔮 **Q4 2025**
- [ ] Мобильное приложение
- [ ] Blockchain интеграция
- [ ] VR/AR features

## 📞 Поддержка

Для вопросов и предложений:
- 📧 Email: support@ruststore.ru
- 💬 Discord: [Ссылка на Discord]
- 🌐 Сайт: [Ссылка на сайт]
- 🐙 GitHub: [@OLGShow](https://github.com/OLGShow)

---

## 📊 Статистика проекта

![GitHub repo size](https://img.shields.io/github/repo-size/OLGShow/Rust)
![GitHub last commit](https://img.shields.io/github/last-commit/OLGShow/Rust)
![GitHub issues](https://img.shields.io/github/issues/OLGShow/Rust)

© 2025 RUST Store. Все права защищены. 