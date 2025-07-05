/**
 * Hook для определения типа устройства и мобильной оптимизации
 */

import { useState, useEffect } from 'react';

export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouchDevice: false,
    isIOS: false,
    isAndroid: false,
    orientation: 'portrait',
    screenWidth: 0,
    screenHeight: 0,
    hasNotch: false,
    isStandalone: false,
    connection: null
  });

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Определение типа устройства
      const isMobile = width <= 768;
      const isTablet = width > 768 && width <= 1024;
      const isDesktop = width > 1024;
      
      // Определение touch устройства
      const isTouchDevice = 'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        navigator.msMaxTouchPoints > 0;
      
      // Определение ОС
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
      const isAndroid = /android/i.test(userAgent);
      
      // Определение ориентации
      const orientation = width > height ? 'landscape' : 'portrait';
      
      // Определение notch (для iPhone X и новее)
      const hasNotch = isIOS && (
        (width === 375 && height === 812) || // iPhone X, XS
        (width === 414 && height === 896) || // iPhone XR, XS Max
        (width === 390 && height === 844) || // iPhone 12, 12 Pro
        (width === 428 && height === 926) || // iPhone 12 Pro Max
        window.screen.height / window.screen.width > 2 // Общий случай для высоких экранов
      );
      
      // Определение PWA режима
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      
      // Информация о соединении
      const connection = navigator.connection || 
        navigator.mozConnection || 
        navigator.webkitConnection;
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        isIOS,
        isAndroid,
        orientation,
        screenWidth: width,
        screenHeight: height,
        hasNotch,
        isStandalone,
        connection
      });
    };

    // Первоначальное определение
    detectDevice();

    // Слушаем изменения размера окна и ориентации
    const handleResize = () => detectDevice();
    const handleOrientationChange = () => {
      // Задержка для iOS Safari
      setTimeout(detectDevice, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Дополнительные утилиты
  const utils = {
    // Определение скорости соединения
    getConnectionSpeed: () => {
      if (!deviceInfo.connection) return 'unknown';
      
      const effectiveType = deviceInfo.connection.effectiveType;
      switch (effectiveType) {
        case 'slow-2g': return 'very-slow';
        case '2g': return 'slow';
        case '3g': return 'medium';
        case '4g': return 'fast';
        default: return 'unknown';
      }
    },

    // Проверка, нужно ли использовать упрощенный интерфейс
    shouldUseSimplifiedUI: () => {
      const speed = utils.getConnectionSpeed();
      return deviceInfo.isMobile && (speed === 'very-slow' || speed === 'slow');
    },

    // Определение оптимального размера изображений
    getOptimalImageSize: () => {
      if (deviceInfo.isMobile) {
        return deviceInfo.screenWidth <= 375 ? 'small' : 'medium';
      }
      if (deviceInfo.isTablet) return 'large';
      return 'xlarge';
    },

    // Проверка поддержки современных CSS функций
    supportsModernCSS: () => {
      return CSS.supports('backdrop-filter', 'blur(10px)') &&
        CSS.supports('display', 'grid');
    },

    // Haptic feedback для поддерживаемых устройств
    triggerHapticFeedback: (type = 'light') => {
      if (navigator.vibrate) {
        const patterns = {
          light: 50,
          medium: 100,
          heavy: 200,
          success: [100, 50, 100],
          error: [200, 100, 200],
          warning: [100, 50, 50, 50, 100]
        };
        navigator.vibrate(patterns[type] || patterns.light);
      }
    },

    // Проверка поддержки Web Share API
    canShare: () => {
      return !!navigator.share;
    },

    // Определение безопасных зон
    getSafeAreaInsets: () => {
      const style = getComputedStyle(document.documentElement);
      return {
        top: parseInt(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
        right: parseInt(style.getPropertyValue('env(safe-area-inset-right)')) || 0,
        bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
        left: parseInt(style.getPropertyValue('env(safe-area-inset-left)')) || 0
      };
    },

    // Оптимальная высота touch элементов
    getTouchTargetSize: () => {
      if (deviceInfo.isTouchDevice) {
        return deviceInfo.isMobile ? 44 : 48; // Apple/Google рекомендации
      }
      return 32; // Обычные кнопки для мыши
    },

    // Определение нужно ли показывать onboarding для жестов
    shouldShowGestureOnboarding: () => {
      const hasSeenOnboarding = localStorage.getItem('gesture_onboarding_seen');
      return deviceInfo.isTouchDevice && !hasSeenOnboarding;
    },

    // Сохранение факта показа onboarding
    markGestureOnboardingAsSeen: () => {
      localStorage.setItem('gesture_onboarding_seen', 'true');
    },

    // Определение поддержки camera API
    supportsCameraAPI: () => {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    },

    // Проверка поддержки геолокации
    supportsGeolocation: () => {
      return !!navigator.geolocation;
    },

    // Определение поддержки Push уведомлений
    supportsPushNotifications: () => {
      return 'serviceWorker' in navigator && 'PushManager' in window;
    },

    // Проверка поддержки Web Workers
    supportsWebWorkers: () => {
      return !!window.Worker;
    },

    // Определение, нужно ли использовать lazy loading
    shouldUseLazyLoading: () => {
      const speed = utils.getConnectionSpeed();
      return speed === 'slow' || speed === 'very-slow' || deviceInfo.isMobile;
    },

    // Получение рекомендуемого качества изображений
    getRecommendedImageQuality: () => {
      const speed = utils.getConnectionSpeed();
      const pixelRatio = window.devicePixelRatio || 1;
      
      if (speed === 'very-slow') return 'low';
      if (speed === 'slow') return 'medium';
      if (pixelRatio > 2) return 'high';
      return 'medium';
    }
  };

  return {
    ...deviceInfo,
    utils
  };
};

// Дополнительный hook для адаптивных breakpoints
export const useBreakpoints = () => {
  const [breakpoint, setBreakpoint] = useState('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else if (width < 1280) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    is2Xl: breakpoint === '2xl',
    isMobile: ['sm', 'md'].includes(breakpoint),
    isDesktop: ['lg', 'xl', '2xl'].includes(breakpoint)
  };
};

// Hook для определения предпочтений пользователя
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    reducedData: false,
    colorScheme: 'dark'
  });

  useEffect(() => {
    const updatePreferences = () => {
      setPreferences({
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        highContrast: window.matchMedia('(prefers-contrast: high)').matches,
        reducedData: window.matchMedia('(prefers-reduced-data: reduce)').matches,
        colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      });
    };

    updatePreferences();

    // Слушаем изменения предпочтений
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-reduced-data: reduce)'),
      window.matchMedia('(prefers-color-scheme: dark)')
    ];

    mediaQueries.forEach(mq => mq.addEventListener('change', updatePreferences));

    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', updatePreferences));
    };
  }, []);

  return preferences;
}; 