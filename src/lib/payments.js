/**
 * Платежная система для RUST Store
 * Интеграция с Stripe Payment Intent API
 */

import { trackPurchase, trackBeginCheckout, trackEvent } from './analytics';

// Конфигурация Stripe
const STRIPE_CONFIG = {
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51xxxxx',
  apiVersion: '2023-10-16',
  locale: 'ru',
  appearance: {
    theme: 'night',
    variables: {
      colorPrimary: '#f59e0b',
      colorBackground: '#1f2937',
      colorText: '#ffffff',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px'
    }
  }
};

class PaymentService {
  constructor() {
    this.stripe = null;
    this.elements = null;
    this.isInitialized = false;
    this.currentPaymentIntent = null;
    
    this.init();
  }

  /**
   * Инициализация Stripe
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Загружаем Stripe.js
      if (!window.Stripe) {
        await this.loadStripeScript();
      }

      this.stripe = window.Stripe(STRIPE_CONFIG.publishableKey, {
        apiVersion: STRIPE_CONFIG.apiVersion,
        locale: STRIPE_CONFIG.locale
      });

      this.isInitialized = true;
      console.log('Stripe initialized successfully');
    } catch (error) {
      console.error('Stripe initialization failed:', error);
      throw error;
    }
  }

  /**
   * Загрузка Stripe.js скрипта
   */
  loadStripeScript() {
    return new Promise((resolve, reject) => {
      if (window.Stripe) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Stripe.js'));
      
      document.head.appendChild(script);
    });
  }

  /**
   * Создание Payment Intent
   */
  async createPaymentIntent(items, customerInfo = {}) {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      const total = this.calculateTotal(items);
      const orderData = {
        amount: Math.round(total * 100), // Stripe работает в копейках
        currency: 'rub',
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount || 0
        })),
        customer: customerInfo,
        metadata: {
          source: 'rust_store',
          server_id: customerInfo.selectedServer || 'red',
          steam_id: customerInfo.steamId || 'unknown'
        }
      };

      // В реальном приложении этот запрос идет на ваш backend
      const response = await this.mockBackendRequest('/api/create-payment-intent', orderData);
      
      this.currentPaymentIntent = response.payment_intent;
      
      // Отслеживаем начало оформления заказа
      trackBeginCheckout(items, total);
      
      return {
        clientSecret: response.client_secret,
        paymentIntentId: response.payment_intent.id,
        amount: total
      };
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  /**
   * Создание Elements для формы платежа
   */
  createElements(clientSecret) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    this.elements = this.stripe.elements({
      clientSecret,
      appearance: STRIPE_CONFIG.appearance
    });

    return this.elements;
  }

  /**
   * Создание Payment Element
   */
  createPaymentElement(elements, options = {}) {
    const defaultOptions = {
      layout: 'tabs',
      paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
      fields: {
        billingDetails: {
          name: 'auto',
          email: 'auto',
          phone: 'never',
          address: 'never'
        }
      }
    };

    return elements.create('payment', { ...defaultOptions, ...options });
  }

  /**
   * Подтверждение платежа
   */
  async confirmPayment(elements, returnUrl, customerInfo = {}) {
    if (!this.stripe || !elements) {
      throw new Error('Stripe or Elements not initialized');
    }

    try {
      const { error, paymentIntent } = await this.stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
          payment_method_data: {
            billing_details: {
              name: customerInfo.name || 'RUST Player',
              email: customerInfo.email || ''
            }
          }
        },
        redirect: 'if_required'
      });

      if (error) {
        throw error;
      }

      // Обрабатываем успешный платеж
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        await this.handleSuccessfulPayment(paymentIntent, customerInfo);
      }

      return { paymentIntent, error: null };
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      
      // Отслеживаем ошибки платежа
      trackEvent('payment_error', {
        error_type: error.type || 'unknown',
        error_code: error.code || 'unknown',
        error_message: error.message || 'Unknown error'
      });
      
      return { paymentIntent: null, error };
    }
  }

  /**
   * Обработка успешного платежа
   */
  async handleSuccessfulPayment(paymentIntent, customerInfo) {
    try {
      const orderDetails = {
        transactionId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        items: this.extractItemsFromMetadata(paymentIntent.metadata),
        customer: customerInfo,
        timestamp: new Date().toISOString()
      };

      // Отслеживаем покупку
      trackPurchase(
        orderDetails.transactionId,
        orderDetails.items,
        orderDetails.amount,
        orderDetails.currency
      );

      // Отправляем данные о покупке на backend для активации товаров
      await this.activatePurchasedItems(orderDetails);

      // Сохраняем покупку в localStorage для истории
      this.savePurchaseHistory(orderDetails);

      return orderDetails;
    } catch (error) {
      console.error('Failed to handle successful payment:', error);
      throw error;
    }
  }

  /**
   * Активация купленных товаров на сервере
   */
  async activatePurchasedItems(orderDetails) {
    try {
      // В реальном приложении здесь идет запрос к вашему game server API
      const response = await this.mockBackendRequest('/api/activate-items', {
        steam_id: orderDetails.customer.steamId,
        server_id: orderDetails.customer.selectedServer,
        items: orderDetails.items,
        transaction_id: orderDetails.transactionId
      });

      console.log('Items activated successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to activate items:', error);
      throw error;
    }
  }

  /**
   * Сохранение истории покупок
   */
  savePurchaseHistory(orderDetails) {
    try {
      const history = JSON.parse(localStorage.getItem('purchase_history') || '[]');
      history.unshift(orderDetails);
      
      // Ограничиваем историю 50 записями
      if (history.length > 50) {
        history.splice(50);
      }
      
      localStorage.setItem('purchase_history', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save purchase history:', error);
    }
  }

  /**
   * Получение истории покупок
   */
  getPurchaseHistory() {
    try {
      return JSON.parse(localStorage.getItem('purchase_history') || '[]');
    } catch (error) {
      console.error('Failed to get purchase history:', error);
      return [];
    }
  }

  /**
   * Проверка статуса платежа
   */
  async checkPaymentStatus(paymentIntentId) {
    try {
      // В реальном приложении запрос идет на ваш backend
      const response = await this.mockBackendRequest(`/api/payment-status/${paymentIntentId}`);
      return response.payment_intent;
    } catch (error) {
      console.error('Failed to check payment status:', error);
      throw error;
    }
  }

  /**
   * Возврат платежа (только для админов)
   */
  async refundPayment(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const response = await this.mockBackendRequest('/api/refund', {
        payment_intent_id: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : null,
        reason
      });

      trackEvent('payment_refunded', {
        payment_intent_id: paymentIntentId,
        amount: amount || 'full',
        reason
      });

      return response;
    } catch (error) {
      console.error('Failed to refund payment:', error);
      throw error;
    }
  }

  /**
   * Вспомогательные методы
   */
  calculateTotal(items) {
    return items.reduce((total, item) => {
      const discountedPrice = item.price * (1 - (item.discount || 0) / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  }

  extractItemsFromMetadata(metadata) {
    // В реальном приложении данные о товарах хранятся в базе данных
    // Здесь упрощенная версия для демонстрации
    return [];
  }

  /**
   * Мок backend запросов для демонстрации
   */
  async mockBackendRequest(endpoint, data = null) {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Мок ответы для разных endpoint'ов
    switch (endpoint) {
      case '/api/create-payment-intent':
        return {
          client_secret: `pi_mock_${Date.now()}_secret_mock`,
          payment_intent: {
            id: `pi_mock_${Date.now()}`,
            amount: data.amount,
            currency: data.currency,
            status: 'requires_payment_method',
            metadata: data.metadata
          }
        };

      case '/api/activate-items':
        return {
          success: true,
          activated_items: data.items,
          message: 'Items successfully activated on server'
        };

      case '/api/refund':
        return {
          id: `re_mock_${Date.now()}`,
          amount: data.amount,
          status: 'succeeded'
        };

      default:
        if (endpoint.startsWith('/api/payment-status/')) {
          return {
            payment_intent: {
              id: endpoint.split('/').pop(),
              status: 'succeeded',
              amount: 29900,
              currency: 'rub'
            }
          };
        }
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
  }

  /**
   * Получение поддерживаемых валют
   */
  getSupportedCurrencies() {
    return [
      { code: 'RUB', symbol: '₽', name: 'Российский рубль' },
      { code: 'USD', symbol: '$', name: 'Доллар США' },
      { code: 'EUR', symbol: '€', name: 'Евро' }
    ];
  }

  /**
   * Форматирование суммы
   */
  formatAmount(amount, currency = 'RUB') {
    const formatter = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return formatter.format(amount);
  }

  /**
   * Очистка ресурсов
   */
  cleanup() {
    if (this.elements) {
      this.elements = null;
    }
    this.currentPaymentIntent = null;
  }
}

// Создаем глобальный экземпляр
const paymentService = new PaymentService();

// Экспортируем методы для удобства использования
export const {
  createPaymentIntent,
  createElements,
  createPaymentElement,
  confirmPayment,
  checkPaymentStatus,
  refundPayment,
  getPurchaseHistory,
  formatAmount,
  getSupportedCurrencies,
  cleanup
} = paymentService;

export default paymentService; 