/**
 * Система мониторинга производительности для RUST Store
 * Оптимизация Core Web Vitals и общей производительности
 */

import { trackEvent } from './analytics';

// Класс для мониторинга производительности
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      FCP: 0,    // First Contentful Paint
      LCP: 0,    // Largest Contentful Paint
      FID: 0,    // First Input Delay
      CLS: 0,    // Cumulative Layout Shift
      TTFB: 0,   // Time to First Byte
      TBT: 0,    // Total Blocking Time
      INP: 0     // Interaction to Next Paint
    };
    
    this.observers = [];
    this.initialized = false;
  }

  // Инициализация мониторинга
  init() {
    if (this.initialized || typeof window === 'undefined') return;
    
    this.initialized = true;
    
    // Мониторинг Web Vitals
    this.observeWebVitals();
    
    // Мониторинг ресурсов
    this.observeResources();
    
    // Мониторинг пользовательских взаимодействий
    this.observeUserInteractions();
    
    // Автоматическая отправка метрик
    this.scheduleMetricsReport();
  }

  // Мониторинг Web Vitals
  observeWebVitals() {
    // First Contentful Paint
    this.observeMetric('first-contentful-paint', (entry) => {
      this.metrics.FCP = entry.value;
      this.reportMetric('FCP', entry.value);
    });

    // Largest Contentful Paint
    this.observeMetric('largest-contentful-paint', (entry) => {
      this.metrics.LCP = entry.value;
      this.reportMetric('LCP', entry.value);
    });

    // First Input Delay
    this.observeMetric('first-input', (entry) => {
      this.metrics.FID = entry.processingStart - entry.startTime;
      this.reportMetric('FID', this.metrics.FID);
    });

    // Cumulative Layout Shift
    this.observeMetric('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        this.metrics.CLS += entry.value;
        this.reportMetric('CLS', this.metrics.CLS);
      }
    });

    // Navigation Timing для TTFB
    this.observeNavigation();
  }

  // Наблюдение за метрикой
  observeMetric(type, callback) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(callback);
      });
      
      observer.observe({ entryTypes: [type] });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  // Мониторинг навигации
  observeNavigation() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.metrics.TTFB = navigation.responseStart - navigation.requestStart;
        this.reportMetric('TTFB', this.metrics.TTFB);
      }
    });
  }

  // Мониторинг ресурсов
  observeResources() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.analyzeResource(entry);
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  // Анализ ресурса
  analyzeResource(entry) {
    const duration = entry.responseEnd - entry.startTime;
    const resourceType = this.getResourceType(entry.name);
    
    // Отслеживание медленных ресурсов
    if (duration > 1000) {
      this.reportSlowResource(entry.name, duration, resourceType);
    }
    
    // Отслеживание больших ресурсов
    if (entry.transferSize > 1000000) { // > 1MB
      this.reportLargeResource(entry.name, entry.transferSize, resourceType);
    }
  }

  // Определение типа ресурса
  getResourceType(url) {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'style';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)/)) return 'font';
    return 'other';
  }

  // Мониторинг пользовательских взаимодействий
  observeUserInteractions() {
    const interactionTypes = ['click', 'keydown', 'scroll'];
    
    interactionTypes.forEach(type => {
      document.addEventListener(type, (event) => {
        this.measureInteraction(event);
      }, { passive: true });
    });
  }

  // Измерение взаимодействия
  measureInteraction(event) {
    const start = performance.now();
    
    // Используем requestIdleCallback для измерения задержки
    requestIdleCallback(() => {
      const duration = performance.now() - start;
      
      if (duration > 100) { // > 100ms считается медленным
        this.reportSlowInteraction(event.type, duration);
      }
    });
  }

  // Отправка метрики
  reportMetric(name, value) {
    const rating = this.getRating(name, value);
    
    trackEvent('web_vital', {
      metric: name,
      value: Math.round(value),
      rating: rating,
      timestamp: Date.now()
    });
    
    // Логирование в консоль для отладки
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name}: ${Math.round(value)}ms (${rating})`);
    }
  }

  // Получение оценки метрики
  getRating(metric, value) {
    const thresholds = {
      FCP: [1800, 3000],
      LCP: [2500, 4000],
      FID: [100, 300],
      CLS: [0.1, 0.25],
      TTFB: [800, 1800],
      TBT: [200, 600],
      INP: [200, 500]
    };
    
    const [good, poor] = thresholds[metric] || [0, 0];
    
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  }

  // Отчет о медленном ресурсе
  reportSlowResource(url, duration, type) {
    trackEvent('slow_resource', {
      url: url,
      duration: Math.round(duration),
      type: type,
      timestamp: Date.now()
    });
  }

  // Отчет о большом ресурсе
  reportLargeResource(url, size, type) {
    trackEvent('large_resource', {
      url: url,
      size: size,
      type: type,
      timestamp: Date.now()
    });
  }

  // Отчет о медленном взаимодействии
  reportSlowInteraction(type, duration) {
    trackEvent('slow_interaction', {
      type: type,
      duration: Math.round(duration),
      timestamp: Date.now()
    });
  }

  // Планирование отправки метрик
  scheduleMetricsReport() {
    // Отправка метрик через 5 секунд после загрузки
    setTimeout(() => {
      this.sendMetricsReport();
    }, 5000);
    
    // Отправка метрик при закрытии страницы
    window.addEventListener('beforeunload', () => {
      this.sendMetricsReport();
    });
  }

  // Отправка полного отчета
  sendMetricsReport() {
    const report = {
      ...this.metrics,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType(),
      deviceMemory: this.getDeviceMemory(),
      pageLoadTime: this.getPageLoadTime()
    };
    
    trackEvent('performance_report', report);
  }

  // Получение типа соединения
  getConnectionType() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection ? connection.effectiveType : 'unknown';
  }

  // Получение информации о памяти устройства
  getDeviceMemory() {
    return navigator.deviceMemory || 'unknown';
  }

  // Получение времени загрузки страницы
  getPageLoadTime() {
    const navigation = performance.getEntriesByType('navigation')[0];
    return navigation ? navigation.loadEventEnd - navigation.fetchStart : 0;
  }

  // Очистка наблюдателей
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.initialized = false;
  }
}

// Создание экземпляра мониторинга
const performanceMonitor = new PerformanceMonitor();

// Система оптимизации ресурсов
class ResourceOptimizer {
  static preloadCriticalResources() {
    // Предзагрузка критических ресурсов
    const criticalResources = [
      '/fonts/inter-var.woff2',
      '/images/logo.webp',
      '/api/products/featured'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      if (resource.includes('.woff2')) link.as = 'font';
      if (resource.includes('.webp')) link.as = 'image';
      if (resource.includes('/api/')) link.as = 'fetch';
      
      document.head.appendChild(link);
    });
  }

  static optimizeImages() {
    // Ленивая загрузка изображений
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }

  static prefetchNextPage() {
    // Предзагрузка следующей страницы при наведении на ссылку
    const links = document.querySelectorAll('a[href^="/"]');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = link.href;
        document.head.appendChild(prefetchLink);
      }, { once: true });
    });
  }

  static enableServiceWorker() {
    // Регистрация Service Worker для кеширования
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
  }
}

// Система мониторинга памяти
class MemoryMonitor {
  static trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      
      trackEvent('memory_usage', {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        timestamp: Date.now()
      });
    }
  }

  static startMemoryMonitoring() {
    // Мониторинг каждые 30 секунд
    setInterval(() => {
      this.trackMemoryUsage();
    }, 30000);
  }
}

// Система оптимизации DOM
class DOMOptimizer {
  static optimizeScrolling() {
    // Виртуализация длинных списков
    const longLists = document.querySelectorAll('[data-virtualize]');
    
    longLists.forEach(list => {
      this.virtualizeList(list);
    });
  }

  static virtualizeList(listElement) {
    const items = Array.from(listElement.children);
    const itemHeight = 100; // Предполагаемая высота элемента
    const containerHeight = listElement.clientHeight;
    const visibleItems = Math.ceil(containerHeight / itemHeight) + 2;
    
    let startIndex = 0;
    
    const updateVisibleItems = () => {
      const scrollTop = listElement.scrollTop;
      const newStartIndex = Math.floor(scrollTop / itemHeight);
      
      if (newStartIndex !== startIndex) {
        startIndex = newStartIndex;
        
        items.forEach((item, index) => {
          const isVisible = index >= startIndex && index < startIndex + visibleItems;
          item.style.display = isVisible ? 'block' : 'none';
        });
      }
    };
    
    listElement.addEventListener('scroll', updateVisibleItems, { passive: true });
    updateVisibleItems();
  }

  static debounceResize() {
    // Оптимизация обработки resize событий
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Обработка resize
        window.dispatchEvent(new Event('optimizedResize'));
      }, 250);
    });
  }
}

// Основная функция инициализации
export const initPerformanceOptimization = () => {
  // Инициализация мониторинга
  performanceMonitor.init();
  
  // Запуск оптимизаций
  ResourceOptimizer.preloadCriticalResources();
  ResourceOptimizer.optimizeImages();
  ResourceOptimizer.prefetchNextPage();
  ResourceOptimizer.enableServiceWorker();
  
  // Мониторинг памяти
  MemoryMonitor.startMemoryMonitoring();
  
  // Оптимизация DOM
  DOMOptimizer.optimizeScrolling();
  DOMOptimizer.debounceResize();
};

// Экспорт для внешнего использования
export {
  performanceMonitor,
  ResourceOptimizer,
  MemoryMonitor,
  DOMOptimizer
};

// Автоматическая инициализация при загрузке
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceOptimization);
  } else {
    initPerformanceOptimization();
  }
} 