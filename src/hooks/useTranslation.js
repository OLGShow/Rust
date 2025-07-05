/**
 * Система локализации для RUST Store
 * Поддержка русского и английского языков
 */

import { useState, useEffect, createContext, useContext } from 'react';
import { trackEvent } from '../lib/analytics';

// Переводы
const translations = {
  ru: {
    // Навигация
    'nav.home': 'Главная',
    'nav.catalog': 'Каталог',
    'nav.servers': 'Серверы',
    'nav.profile': 'Профиль',
    'nav.cart': 'Корзина',
    'nav.admin': 'Админ-панель',
    
    // Категории товаров
    'category.all': 'Все товары',
    'category.weapons': 'Оружие',
    'category.armor': 'Броня',
    'category.tools': 'Инструменты',
    'category.resources': 'Ресурсы',
    'category.skins': 'Скины',
    
    // Общие элементы
    'common.search': 'Поиск',
    'common.filter': 'Фильтр',
    'common.price': 'Цена',
    'common.add_to_cart': 'В корзину',
    'common.in_cart': 'В корзине',
    'common.buy_now': 'Купить сейчас',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.close': 'Закрыть',
    'common.edit': 'Редактировать',
    'common.delete': 'Удалить',
    'common.confirm': 'Подтвердить',
    'common.back': 'Назад',
    'common.next': 'Далее',
    'common.previous': 'Предыдущий',
    'common.view_details': 'Подробнее',
    'common.discount': 'Скидка',
    'common.new': 'Новинка',
    'common.popular': 'Популярное',
    'common.instant_delivery': 'Мгновенная доставка',
    
    // Steam авторизация
    'auth.login_steam': 'Войти через Steam',
    'auth.logout': 'Выйти',
    'auth.welcome': 'Добро пожаловать',
    'auth.login_required': 'Необходима авторизация',
    'auth.steam_required': 'Требуется Steam аккаунт с игрой RUST',
    
    // Корзина
    'cart.title': 'Корзина покупок',
    'cart.empty': 'Корзина пуста',
    'cart.empty_desc': 'Добавьте товары для продолжения',
    'cart.total': 'Итого',
    'cart.subtotal': 'Подытог',
    'cart.checkout': 'Оформить заказ',
    'cart.clear': 'Очистить корзину',
    'cart.remove_item': 'Удалить товар',
    'cart.quantity': 'Количество',
    'cart.server_selection': 'Выбор сервера',
    'cart.select_server': 'Выберите сервер для активации',
    
    // Серверы
    'server.red': 'Красный сервер',
    'server.blue': 'Синий сервер',
    'server.green': 'Зеленый сервер',
    'server.online': 'Онлайн',
    'server.offline': 'Оффлайн',
    'server.players': 'игроков',
    'server.select': 'Выбрать сервер',
    
    // Профиль пользователя
    'profile.title': 'Профиль пользователя',
    'profile.overview': 'Обзор',
    'profile.purchases': 'Покупки',
    'profile.favorites': 'Избранное',
    'profile.settings': 'Настройки',
    'profile.level': 'Уровень',
    'profile.total_spent': 'Потрачено всего',
    'profile.total_items': 'Товаров куплено',
    'profile.total_orders': 'Заказов',
    'profile.member_since': 'Дней с нами',
    'profile.last_activity': 'Последняя активность',
    'profile.no_purchases': 'Нет покупок',
    'profile.no_purchases_desc': 'Вы еще ничего не покупали. Откройте для себя наши товары!',
    'profile.no_favorites': 'Нет избранных товаров',
    'profile.no_favorites_desc': 'Добавляйте товары в избранное, чтобы быстро их находить',
    'profile.edit_profile': 'Редактировать профиль',
    'profile.display_name': 'Отображаемое имя',
    'profile.bio': 'О себе',
    'profile.bio_placeholder': 'Расскажите о себе...',
    'profile.favorite_server': 'Любимый сервер',
    'profile.notifications': 'Уведомления',
    'profile.email_notifications': 'Email уведомления',
    'profile.email_notifications_desc': 'Получать уведомления о заказах на email',
    'profile.push_notifications': 'Push уведомления',
    'profile.push_notifications_desc': 'Мгновенные уведомления в браузере',
    
    // Админ-панель
    'admin.title': 'Панель администратора',
    'admin.products': 'Товары',
    'admin.servers': 'Серверы',
    'admin.analytics': 'Аналитика',
    'admin.add_product': 'Добавить товар',
    'admin.edit_product': 'Редактировать товар',
    'admin.product_name': 'Название товара',
    'admin.product_description': 'Описание',
    'admin.product_price': 'Цена',
    'admin.product_category': 'Категория',
    'admin.product_image': 'Изображение',
    'admin.server_status': 'Статус сервера',
    'admin.sales_analytics': 'Аналитика продаж',
    'admin.total_sales': 'Общие продажи',
    'admin.total_revenue': 'Общий доход',
    'admin.active_users': 'Активные пользователи',
    
    // Мобильная навигация
    'mobile.menu': 'Меню',
    'mobile.search': 'Поиск',
    'mobile.filters': 'Фильтры',
    'mobile.categories': 'Категории',
    'mobile.quick_filters': 'Быстрые фильтры',
    'mobile.home': 'Главная',
    'mobile.profile': 'Профиль',
    'mobile.cart': 'Корзина',
    
    // Уровни пользователей
    'level.newbie': 'Новичок',
    'level.player': 'Игрок',
    'level.advanced': 'Продвинутый',
    'level.expert': 'Эксперт',
    'level.master': 'Мастер',
    'level.legend': 'Легенда',
    
    // Фильтры
    'filter.popular': 'Популярное',
    'filter.new': 'Новинки',
    'filter.sale': 'Скидки',
    'filter.favorites': 'Избранное',
    
    // Сообщения
    'message.item_added_to_cart': 'Товар добавлен в корзину',
    'message.item_removed_from_cart': 'Товар удален из корзины',
    'message.cart_cleared': 'Корзина очищена',
    'message.profile_updated': 'Профиль обновлен',
    'message.server_selected': 'Сервер выбран',
    'message.copied_to_clipboard': 'Скопировано в буфер обмена',
    
    // Ошибки
    'error.network': 'Ошибка сети',
    'error.server': 'Ошибка сервера',
    'error.not_found': 'Не найдено',
    'error.unauthorized': 'Не авторизован',
    'error.forbidden': 'Доступ запрещен',
    'error.generic': 'Произошла ошибка',
    
    // Cookie consent
    'cookie.title': 'Мы используем cookie',
    'cookie.description': 'Мы используем cookie для улучшения вашего опыта. Продолжая использовать сайт, вы соглашаетесь с нашей',
    'cookie.privacy_policy': 'политикой конфиденциальности',
    'cookie.accept': 'Принять',
    'cookie.decline': 'Отклонить',
    'cookie.customize': 'Настроить',
    
    // Валюта
    'currency.rub': '₽',
    'currency.usd': '$',
    'currency.eur': '€'
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.catalog': 'Catalog',
    'nav.servers': 'Servers',
    'nav.profile': 'Profile',
    'nav.cart': 'Cart',
    'nav.admin': 'Admin Panel',
    
    // Product categories
    'category.all': 'All Items',
    'category.weapons': 'Weapons',
    'category.armor': 'Armor',
    'category.tools': 'Tools',
    'category.resources': 'Resources',
    'category.skins': 'Skins',
    
    // Common elements
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.price': 'Price',
    'common.add_to_cart': 'Add to Cart',
    'common.in_cart': 'In Cart',
    'common.buy_now': 'Buy Now',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.view_details': 'View Details',
    'common.discount': 'Discount',
    'common.new': 'New',
    'common.popular': 'Popular',
    'common.instant_delivery': 'Instant Delivery',
    
    // Steam authentication
    'auth.login_steam': 'Login with Steam',
    'auth.logout': 'Logout',
    'auth.welcome': 'Welcome',
    'auth.login_required': 'Login Required',
    'auth.steam_required': 'Steam account with RUST game required',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Cart is Empty',
    'cart.empty_desc': 'Add items to continue',
    'cart.total': 'Total',
    'cart.subtotal': 'Subtotal',
    'cart.checkout': 'Checkout',
    'cart.clear': 'Clear Cart',
    'cart.remove_item': 'Remove Item',
    'cart.quantity': 'Quantity',
    'cart.server_selection': 'Server Selection',
    'cart.select_server': 'Select server for activation',
    
    // Servers
    'server.red': 'Red Server',
    'server.blue': 'Blue Server',
    'server.green': 'Green Server',
    'server.online': 'Online',
    'server.offline': 'Offline',
    'server.players': 'players',
    'server.select': 'Select Server',
    
    // User profile
    'profile.title': 'User Profile',
    'profile.overview': 'Overview',
    'profile.purchases': 'Purchases',
    'profile.favorites': 'Favorites',
    'profile.settings': 'Settings',
    'profile.level': 'Level',
    'profile.total_spent': 'Total Spent',
    'profile.total_items': 'Items Purchased',
    'profile.total_orders': 'Orders',
    'profile.member_since': 'Days with us',
    'profile.last_activity': 'Last Activity',
    'profile.no_purchases': 'No Purchases',
    'profile.no_purchases_desc': 'You haven\'t made any purchases yet. Discover our products!',
    'profile.no_favorites': 'No Favorite Items',
    'profile.no_favorites_desc': 'Add items to favorites to find them quickly',
    'profile.edit_profile': 'Edit Profile',
    'profile.display_name': 'Display Name',
    'profile.bio': 'About Me',
    'profile.bio_placeholder': 'Tell us about yourself...',
    'profile.favorite_server': 'Favorite Server',
    'profile.notifications': 'Notifications',
    'profile.email_notifications': 'Email Notifications',
    'profile.email_notifications_desc': 'Receive order notifications via email',
    'profile.push_notifications': 'Push Notifications',
    'profile.push_notifications_desc': 'Instant browser notifications',
    
    // Admin panel
    'admin.title': 'Admin Panel',
    'admin.products': 'Products',
    'admin.servers': 'Servers',
    'admin.analytics': 'Analytics',
    'admin.add_product': 'Add Product',
    'admin.edit_product': 'Edit Product',
    'admin.product_name': 'Product Name',
    'admin.product_description': 'Description',
    'admin.product_price': 'Price',
    'admin.product_category': 'Category',
    'admin.product_image': 'Image',
    'admin.server_status': 'Server Status',
    'admin.sales_analytics': 'Sales Analytics',
    'admin.total_sales': 'Total Sales',
    'admin.total_revenue': 'Total Revenue',
    'admin.active_users': 'Active Users',
    
    // Mobile navigation
    'mobile.menu': 'Menu',
    'mobile.search': 'Search',
    'mobile.filters': 'Filters',
    'mobile.categories': 'Categories',
    'mobile.quick_filters': 'Quick Filters',
    'mobile.home': 'Home',
    'mobile.profile': 'Profile',
    'mobile.cart': 'Cart',
    
    // User levels
    'level.newbie': 'Newbie',
    'level.player': 'Player',
    'level.advanced': 'Advanced',
    'level.expert': 'Expert',
    'level.master': 'Master',
    'level.legend': 'Legend',
    
    // Filters
    'filter.popular': 'Popular',
    'filter.new': 'New',
    'filter.sale': 'Sale',
    'filter.favorites': 'Favorites',
    
    // Messages
    'message.item_added_to_cart': 'Item added to cart',
    'message.item_removed_from_cart': 'Item removed from cart',
    'message.cart_cleared': 'Cart cleared',
    'message.profile_updated': 'Profile updated',
    'message.server_selected': 'Server selected',
    'message.copied_to_clipboard': 'Copied to clipboard',
    
    // Errors
    'error.network': 'Network Error',
    'error.server': 'Server Error',
    'error.not_found': 'Not Found',
    'error.unauthorized': 'Unauthorized',
    'error.forbidden': 'Forbidden',
    'error.generic': 'An error occurred',
    
    // Cookie consent
    'cookie.title': 'We use cookies',
    'cookie.description': 'We use cookies to improve your experience. By continuing to use the site, you agree to our',
    'cookie.privacy_policy': 'privacy policy',
    'cookie.accept': 'Accept',
    'cookie.decline': 'Decline',
    'cookie.customize': 'Customize',
    
    // Currency
    'currency.rub': '₽',
    'currency.usd': '$',
    'currency.eur': '€'
  }
};

// Контекст для локализации
const TranslationContext = createContext();

// Hook для использования переводов
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};

// Провайдер переводов
export const TranslationProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    // Определяем язык из localStorage или браузера
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang && ['ru', 'en'].includes(savedLang)) {
      return savedLang;
    }
    
    // Определяем по языку браузера
    const browserLang = navigator.language.split('-')[0];
    return ['ru', 'en'].includes(browserLang) ? browserLang : 'ru';
  });

  // Функция перевода
  const t = (key, params = {}) => {
    const translation = translations[currentLang]?.[key] || translations.ru[key] || key;
    
    // Простая интерполяция параметров
    return Object.keys(params).reduce((str, param) => {
      return str.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
    }, translation);
  };

  // Смена языка
  const changeLanguage = (lang) => {
    if (['ru', 'en'].includes(lang)) {
      setCurrentLang(lang);
      localStorage.setItem('preferred_language', lang);
      
      // Отслеживаем смену языка
      trackEvent('language_changed', {
        from: currentLang,
        to: lang
      });
      
      // Обновляем HTML атрибут lang
      document.documentElement.lang = lang;
    }
  };

  // Получение списка доступных языков
  const getAvailableLanguages = () => [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  // Определение направления текста (RTL/LTR)
  const getTextDirection = () => {
    return ['ar', 'he', 'fa'].includes(currentLang) ? 'rtl' : 'ltr';
  };

  // Форматирование чисел с учетом локали
  const formatNumber = (number, options = {}) => {
    const locale = currentLang === 'ru' ? 'ru-RU' : 'en-US';
    return new Intl.NumberFormat(locale, options).format(number);
  };

  // Форматирование валюты
  const formatCurrency = (amount, currency = 'RUB') => {
    const locale = currentLang === 'ru' ? 'ru-RU' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Форматирование даты
  const formatDate = (date, options = {}) => {
    const locale = currentLang === 'ru' ? 'ru-RU' : 'en-US';
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(date));
  };

  // Форматирование времени
  const formatTime = (date, options = {}) => {
    const locale = currentLang === 'ru' ? 'ru-RU' : 'en-US';
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(date));
  };

  // Плюрализация для русского языка
  const pluralize = (count, forms) => {
    if (currentLang !== 'ru') {
      return count === 1 ? forms[0] : forms[1];
    }
    
    const cases = [2, 0, 1, 1, 1, 2];
    return forms[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[Math.min(count % 10, 5)]];
  };

  // Получение переводов для определенного namespace
  const getNamespaceTranslations = (namespace) => {
    const nsTranslations = {};
    const prefix = `${namespace}.`;
    
    Object.keys(translations[currentLang]).forEach(key => {
      if (key.startsWith(prefix)) {
        const shortKey = key.replace(prefix, '');
        nsTranslations[shortKey] = translations[currentLang][key];
      }
    });
    
    return nsTranslations;
  };

  // Проверка наличия перевода
  const hasTranslation = (key) => {
    return translations[currentLang]?.[key] || translations.ru[key];
  };

  // Установка языка при монтировании
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = getTextDirection();
  }, [currentLang]);

  const value = {
    currentLang,
    t,
    changeLanguage,
    getAvailableLanguages,
    getTextDirection,
    formatNumber,
    formatCurrency,
    formatDate,
    formatTime,
    pluralize,
    getNamespaceTranslations,
    hasTranslation
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// Дополнительный hook для определения предпочитаемого языка
export const useLanguageDetection = () => {
  const [detectedLang, setDetectedLang] = useState('ru');

  useEffect(() => {
    // Определяем язык по различным источникам
    const sources = [
      () => localStorage.getItem('preferred_language'),
      () => navigator.language.split('-')[0],
      () => navigator.languages?.[0]?.split('-')[0],
      () => document.documentElement.lang,
      () => 'ru' // fallback
    ];

    for (const source of sources) {
      const lang = source();
      if (lang && ['ru', 'en'].includes(lang)) {
        setDetectedLang(lang);
        break;
      }
    }
  }, []);

  return detectedLang;
};

export default useTranslation; 