# 🚀 RUST Store - Быстрый старт

## 📋 Краткие инструкции

### 🔧 Исправление ошибки с Tailwind CSS
**Проблема решена!** Исправлен неправильный импорт в `src/App.css`:
```css
// ❌ Было:
@import "tailwindcss";

// ✅ Исправлено:
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 🚀 Запуск проекта (3 шага)

1. **Установите зависимости:**
   ```bash
   npm install
   ```

2. **Запустите сервер разработки:**
   ```bash
   npm run dev
   ```

3. **Откройте в браузере:**
   ```
   http://localhost:3000
   ```

### 📤 Загрузка на GitHub

#### Windows:
```bash
init-project.bat
```

#### Linux/Mac:
```bash
./init-project.sh
```

#### Или вручную:
```bash
git init
git remote add origin https://github.com/OLGShow/Rust.git
git add .
git commit -m "🎮 Initial commit: RUST Store"
git branch -M main
git push -u origin main
```

### 🌐 После загрузки

- **Репозиторий**: https://github.com/OLGShow/Rust
- **Live Demo**: https://olgshow.github.io/Rust/
- **Автоматический деплой**: настроен через GitHub Actions

### 🎯 Что реализовано

#### ✅ **Современные технологии 2025:**
- React 18 + Vite + Tailwind CSS
- PWA готовность
- Glassmorphism дизайн
- Микроанимации
- Mobile-first подход

#### ✅ **Функциональность магазина:**
- Авторизация Steam (UI готов)
- Выбор серверов с мониторингом
- Категории товаров
- Корзина покупок
- Система бонусов

#### ✅ **Производительность:**
- Code splitting
- Lazy loading готовность
- SEO оптимизация
- PWA манифест

### 🔮 Планы развития

1. **Интеграция платежей** - Stripe, ЮMoney, СБП
2. **Steam API** - реальная авторизация
3. **Backend API** - обработка заказов
4. **Admin панель** - управление товарами
5. **Мобильное приложение** - React Native

### 📊 Соответствие трендам 2025

| Технология | Статус | Описание |
|------------|--------|----------|
| **React 18** | ✅ | Современный фреймворк |
| **PWA** | ✅ | Прогрессивное веб-приложение |
| **Glassmorphism** | ✅ | Стеклянные эффекты |
| **Mobile Payments** | 🔮 | Apple Pay, Google Pay |
| **Микрофронтенды** | ✅ | Компонентная архитектура |
| **Serverless** | ✅ | Готовность к деплою |

### 🛠️ Настройка

#### Товары (`src/App.jsx`):
```javascript
const products = [
  {
    id: 1,
    name: "VIP Package",
    price: 540,
    category: "privileges",
    // ... остальные свойства
  }
];
```

#### Серверы:
```javascript
const servers = [
  {
    id: 'red',
    name: 'Red',
    players: 14,
    maxPlayers: 200,
    // ... остальные свойства
  }
];
```

### 🎨 Кастомизация

#### Цвета (tailwind.config.js):
```javascript
colors: {
  primary: '#f97316',  // Оранжевый
  accent: '#ef4444',   // Красный
  // ... остальные цвета
}
```

#### Анимации (App.css):
```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### 🔧 Команды разработки

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Предпросмотр
npm run preview

# Линтинг
npm run lint

# Форматирование
npm run format
```

### 📱 Проверка адаптивности

1. Откройте DevTools (F12)
2. Включите Device Toolbar
3. Протестируйте размеры:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1024px+

### 🚀 Готово!

Ваш современный интернет-магазин готов к использованию с технологиями 2025 года!

---

**© 2025 RUST Store** - Современный магазин внутриигровых покупок 