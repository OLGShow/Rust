/**
 * Аналитическая система для RUST Store
 * Интеграция с Google Analytics 4 и Яндекс.Метрикой
 */

// Конфигурация аналитики
const ANALYTICS_CONFIG = {
  googleAnalytics: {
    measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
    enabled: process.env.NODE_ENV === 'production'
  },
  yandexMetrica: {
    counterId: process.env.REACT_APP_YM_COUNTER_ID || '12345678',
    enabled: process.env.NODE_ENV === 'production'
  },
  debug: process.env.NODE_ENV === 'development'
};

class Analytics {
  constructor() {
    this.isInitialized = false;
    this.gaInitialized = false;
    this.ymInitialized = false;
    this.eventQueue = [];
    
    // Инициализация при создании экземпляра
    this.init();
  }

  /**
   * Инициализация всех аналитических систем
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Проверяем согласие пользователя на использование cookies
      const consent = this.getConsentStatus();
      
      if (consent.analytics) {
        await Promise.all([
          this.initGoogleAnalytics(),
          this.initYandexMetrica()
        ]);
      }

      this.isInitialized = true;
      
      // Обрабатываем очередь событий
      this.processEventQueue();
      
      if (ANALYTICS_CONFIG.debug) {
        console.log('Analytics initialized successfully');
      }
    } catch (error) {
      console.error('Analytics initialization failed:', error);
    }
  }

  /**
   * Инициализация Google Analytics 4
   */
  async initGoogleAnalytics() {
    if (!ANALYTICS_CONFIG.googleAnalytics.enabled || this.gaInitialized) return;

    try {
      // Загружаем gtag скрипт
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.googleAnalytics.measurementId}`;
      document.head.appendChild(script);

      // Ждем загрузки скрипта
      await new Promise((resolve) => {
        script.onload = resolve;
      });

      // Инициализируем gtag
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', ANALYTICS_CONFIG.googleAnalytics.measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true,
        anonymize_ip: true
      });

      this.gaInitialized = true;
      
      if (ANALYTICS_CONFIG.debug) {
        console.log('Google Analytics 4 initialized');
      }
    } catch (error) {
      console.error('Google Analytics initialization failed:', error);
    }
  }

  /**
   * Инициализация Яндекс.Метрики
   */
  async initYandexMetrica() {
    if (!ANALYTICS_CONFIG.yandexMetrica.enabled || this.ymInitialized) return;

    try {
      // Создаем Яндекс.Метрику
      (function(m, e, t, r, i, k, a) {
        m[i] = m[i] || function() { (m[i].a = m[i].a || []).push(arguments) };
        m[i].l = 1 * new Date();
        k = e.createElement(t), a = e.getElementsByTagName(t)[0];
        k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
      })
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      window.ym(ANALYTICS_CONFIG.yandexMetrica.counterId, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        ecommerce: "dataLayer"
      });

      this.ymInitialized = true;
      
      if (ANALYTICS_CONFIG.debug) {
        console.log('Yandex Metrica initialized');
      }
    } catch (error) {
      console.error('Yandex Metrica initialization failed:', error);
    }
  }

  /**
   * Отправка события
   */
  trackEvent(eventName, eventParams = {}) {
    if (!this.isInitialized) {
      this.eventQueue.push({ type: 'event', eventName, eventParams });
      return;
    }

    // Google Analytics 4
    if (this.gaInitialized && window.gtag) {
      window.gtag('event', eventName, {
        ...eventParams,
        timestamp: Date.now()
      });
    }

    // Яндекс.Метрика
    if (this.ymInitialized && window.ym) {
      window.ym(ANALYTICS_CONFIG.yandexMetrica.counterId, 'reachGoal', eventName, eventParams);
    }

    if (ANALYTICS_CONFIG.debug) {
      console.log('Event tracked:', eventName, eventParams);
    }
  }

  /**
   * Отслеживание просмотра страницы
   */
  trackPageView(pagePath, pageTitle) {
    if (!this.isInitialized) {
      this.eventQueue.push({ type: 'pageview', pagePath, pageTitle });
      return;
    }

    // Google Analytics 4
    if (this.gaInitialized && window.gtag) {
      window.gtag('config', ANALYTICS_CONFIG.googleAnalytics.measurementId, {
        page_path: pagePath,
        page_title: pageTitle
      });
    }

    // Яндекс.Метрика
    if (this.ymInitialized && window.ym) {
      window.ym(ANALYTICS_CONFIG.yandexMetrica.counterId, 'hit', pagePath, {
        title: pageTitle
      });
    }

    if (ANALYTICS_CONFIG.debug) {
      console.log('Page view tracked:', pagePath, pageTitle);
    }
  }

  /**
   * Отслеживание пользователя
   */
  trackUser(userId, userProperties = {}) {
    // Google Analytics 4
    if (this.gaInitialized && window.gtag) {
      window.gtag('config', ANALYTICS_CONFIG.googleAnalytics.measurementId, {
        user_id: userId,
        custom_map: userProperties
      });
    }

    // Яндекс.Метрика
    if (this.ymInitialized && window.ym) {
      window.ym(ANALYTICS_CONFIG.yandexMetrica.counterId, 'userParams', userProperties);
    }

    if (ANALYTICS_CONFIG.debug) {
      console.log('User tracked:', userId, userProperties);
    }
  }

  /**
   * Отслеживание покупки (Enhanced Ecommerce)
   */
  trackPurchase(transactionId, items, value, currency = 'RUB') {
    const purchaseData = {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price
      }))
    };

    // Google Analytics 4
    if (this.gaInitialized && window.gtag) {
      window.gtag('event', 'purchase', purchaseData);
    }

    // Яндекс.Метрика
    if (this.ymInitialized && window.ym) {
      window.ym(ANALYTICS_CONFIG.yandexMetrica.counterId, 'reachGoal', 'purchase', {
        order_price: value,
        currency: currency
      });
    }

    if (ANALYTICS_CONFIG.debug) {
      console.log('Purchase tracked:', purchaseData);
    }
  }

  /**
   * Отслеживание добавления в корзину
   */
  trackAddToCart(item) {
    const eventData = {
      currency: 'RUB',
      value: item.price,
      items: [{
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        price: item.price,
        quantity: 1
      }]
    };

    this.trackEvent('add_to_cart', eventData);
  }

  /**
   * Отслеживание начала оформления заказа
   */
  trackBeginCheckout(items, value) {
    const eventData = {
      currency: 'RUB',
      value: value,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity
      }))
    };

    this.trackEvent('begin_checkout', eventData);
  }

  /**
   * Отслеживание поиска
   */
  trackSearch(searchTerm, category = null) {
    this.trackEvent('search', {
      search_term: searchTerm,
      category: category
    });
  }

  /**
   * Отслеживание авторизации
   */
  trackLogin(method = 'steam') {
    this.trackEvent('login', {
      method: method
    });
  }

  /**
   * Отслеживание ошибок
   */
  trackError(errorMessage, errorLocation) {
    this.trackEvent('exception', {
      description: errorMessage,
      fatal: false,
      location: errorLocation
    });
  }

  /**
   * Получение статуса согласия пользователя
   */
  getConsentStatus() {
    const consent = localStorage.getItem('user_consent');
    return consent ? JSON.parse(consent) : {
      analytics: false,
      marketing: false,
      functional: true
    };
  }

  /**
   * Установка согласия пользователя
   */
  setConsent(consentData) {
    localStorage.setItem('user_consent', JSON.stringify(consentData));
    
    if (consentData.analytics && !this.isInitialized) {
      this.init();
    }
  }

  /**
   * Обработка очереди событий
   */
  processEventQueue() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      
      switch (event.type) {
        case 'event':
          this.trackEvent(event.eventName, event.eventParams);
          break;
        case 'pageview':
          this.trackPageView(event.pagePath, event.pageTitle);
          break;
      }
    }
  }

  /**
   * Получение отчетов (для админ-панели)
   */
  async getAnalyticsData(dateRange = '7daysAgo') {
    // Здесь будет интеграция с Google Analytics Reporting API
    // Для демонстрации возвращаем моковые данные
    return {
      pageViews: Math.floor(Math.random() * 10000),
      users: Math.floor(Math.random() * 1000),
      sessions: Math.floor(Math.random() * 2000),
      bounceRate: (Math.random() * 100).toFixed(2),
      avgSessionDuration: Math.floor(Math.random() * 300),
      conversions: Math.floor(Math.random() * 50),
      revenue: Math.floor(Math.random() * 100000)
    };
  }
}

// Создаем глобальный экземпляр
const analytics = new Analytics();

// Экспортируем методы для удобства использования
export const {
  trackEvent,
  trackPageView,
  trackUser,
  trackPurchase,
  trackAddToCart,
  trackBeginCheckout,
  trackSearch,
  trackLogin,
  trackError,
  setConsent,
  getConsentStatus,
  getAnalyticsData
} = analytics;

export default analytics; 