import React, { useState, useEffect } from 'react';
import { Cookie, Settings, X, Shield, BarChart3, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { setConsent, getConsentStatus } from '../lib/analytics';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsentState] = useState({
    analytics: false,
    marketing: false,
    functional: true
  });

  useEffect(() => {
    // Проверяем, показывали ли уже баннер
    const currentConsent = getConsentStatus();
    const hasConsented = localStorage.getItem('cookie_consent_shown');
    
    if (!hasConsented) {
      // Показываем баннер через 2 секунды после загрузки
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    setConsentState(currentConsent);
  }, []);

  const handleAcceptAll = () => {
    const fullConsent = {
      analytics: true,
      marketing: true,
      functional: true
    };
    
    setConsent(fullConsent);
    setConsentState(fullConsent);
    setShowBanner(false);
    localStorage.setItem('cookie_consent_shown', 'true');
  };

  const handleAcceptNecessary = () => {
    const necessaryConsent = {
      analytics: false,
      marketing: false,
      functional: true
    };
    
    setConsent(necessaryConsent);
    setConsentState(necessaryConsent);
    setShowBanner(false);
    localStorage.setItem('cookie_consent_shown', 'true');
  };

  const handleCustomConsent = () => {
    setConsent(consent);
    setShowBanner(false);
    setShowSettings(false);
    localStorage.setItem('cookie_consent_shown', 'true');
  };

  const toggleConsent = (type) => {
    if (type === 'functional') return; // Функциональные cookies обязательны
    
    setConsentState(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <Card className="glass-effect border-white/20 max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Cookie className="h-8 w-8 text-orange-400 flex-shrink-0 mt-1" />
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Мы используем cookies
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Мы используем cookies для улучшения вашего опыта использования сайта, 
                  анализа трафика и персонализации контента. Вы можете выбрать, 
                  какие типы cookies разрешить.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    Принять все
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleAcceptNecessary}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Только необходимые
                  </Button>
                  
                  <Dialog open={showSettings} onOpenChange={setShowSettings}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Настроить
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="bg-gray-900 border-white/20 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Settings className="h-5 w-5 text-orange-400" />
                          <span>Настройки cookies</span>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        <p className="text-gray-300 text-sm">
                          Управляйте настройками cookies и выберите, какие данные мы можем собирать.
                        </p>
                        
                        {/* Functional Cookies */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Shield className="h-5 w-5 text-green-400" />
                              <div>
                                <h4 className="font-medium">Функциональные cookies</h4>
                                <p className="text-sm text-gray-400">
                                  Необходимы для работы сайта (корзина, авторизация)
                                </p>
                              </div>
                            </div>
                            <div className="text-green-400 text-sm font-medium">
                              Всегда активны
                            </div>
                          </div>
                          
                          {/* Analytics Cookies */}
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <BarChart3 className="h-5 w-5 text-blue-400" />
                              <div>
                                <h4 className="font-medium">Аналитические cookies</h4>
                                <p className="text-sm text-gray-400">
                                  Помогают понять, как посетители используют сайт
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={consent.analytics ? "default" : "outline"}
                              onClick={() => toggleConsent('analytics')}
                              className={consent.analytics 
                                ? "bg-blue-500 hover:bg-blue-600" 
                                : "border-white/20 text-white hover:bg-white/10"
                              }
                            >
                              {consent.analytics ? 'Включено' : 'Отключено'}
                            </Button>
                          </div>
                          
                          {/* Marketing Cookies */}
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Target className="h-5 w-5 text-purple-400" />
                              <div>
                                <h4 className="font-medium">Маркетинговые cookies</h4>
                                <p className="text-sm text-gray-400">
                                  Используются для персонализации рекламы
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={consent.marketing ? "default" : "outline"}
                              onClick={() => toggleConsent('marketing')}
                              className={consent.marketing 
                                ? "bg-purple-500 hover:bg-purple-600" 
                                : "border-white/20 text-white hover:bg-white/10"
                              }
                            >
                              {consent.marketing ? 'Включено' : 'Отключено'}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button
                            onClick={handleCustomConsent}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          >
                            Сохранить настройки
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowSettings(false)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            Отмена
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowBanner(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Privacy Policy Link */}
      <div className="fixed bottom-4 left-4 z-40">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white text-xs"
          onClick={() => {
            // Здесь можно открыть политику конфиденциальности
            window.open('/privacy-policy', '_blank');
          }}
        >
          Политика конфиденциальности
        </Button>
      </div>
    </>
  );
};

export default CookieConsent; 