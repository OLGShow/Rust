import React, { useState, useEffect } from 'react';
import { 
  Users, 
  LogOut, 
  Shield, 
  Star, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import SteamAuth, { steamUtils } from '../lib/steamAuth';

const SteamAuthComponent = ({ onAuthChange }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Инициализация Steam Auth
  const steamAuth = new SteamAuth(
    process.env.REACT_APP_STEAM_API_KEY || 'demo_key',
    `${window.location.origin}/auth/steam/callback`
  );

  useEffect(() => {
    // Проверяем, авторизован ли пользователь при загрузке
    if (steamAuth.isAuthenticated()) {
      const userData = steamAuth.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      onAuthChange?.(userData);
    }

    // Обрабатываем callback от Steam, если есть
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('openid.mode')) {
      handleSteamCallback(urlParams);
    }
  }, []);

  const handleSteamCallback = async (params) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await steamAuth.handleCallback(params);
      steamAuth.saveUserData(userData);
      
      setUser(userData);
      setIsAuthenticated(true);
      onAuthChange?.(userData);

      // Очищаем URL от параметров Steam
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      setError('Ошибка авторизации через Steam: ' + err.message);
      console.error('Steam auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setLoading(true);
    setError(null);
    
    try {
      steamAuth.login();
    } catch (err) {
      setError('Ошибка при перенаправлении на Steam');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      await steamAuth.logout();
      setUser(null);
      setIsAuthenticated(false);
      onAuthChange?.(null);
    } catch (err) {
      setError('Ошибка при выходе из системы');
    } finally {
      setLoading(false);
    }
  };

  const formatLastOnline = (lastLogoff) => {
    if (!lastLogoff) return 'Неизвестно';
    const date = new Date(lastLogoff * 1000);
    return date.toLocaleDateString('ru-RU');
  };

  const getPersonaStateText = (state) => {
    const states = {
      0: 'Офлайн',
      1: 'Онлайн',
      2: 'Занят',
      3: 'Отошел',
      4: 'Спит',
      5: 'Хочет торговать',
      6: 'Хочет играть'
    };
    return states[state] || 'Неизвестно';
  };

  const getPersonaStateColor = (state) => {
    const colors = {
      0: 'bg-gray-500',
      1: 'bg-green-500',
      2: 'bg-red-500',
      3: 'bg-yellow-500',
      4: 'bg-blue-500',
      5: 'bg-purple-500',
      6: 'bg-orange-500'
    };
    return colors[state] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Подключение к Steam...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <Button 
          onClick={handleLogin}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          disabled={loading}
        >
          <Users className="h-4 w-4 mr-2" />
          Войти через Steam
        </Button>

        {error && (
          <div className="flex items-center space-x-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="text-xs text-gray-400 max-w-sm">
          <Shield className="h-3 w-3 inline mr-1" />
          Безопасная авторизация через Steam. Мы не получаем доступ к вашему паролю.
        </div>
      </div>
    );
  }

  return (
    <Card className="glass-effect border-white/10 max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-white">
          <div className="flex items-center space-x-2">
            <img 
              src={user?.userInfo?.avatar || '/api/placeholder/32/32'} 
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="font-medium">{user?.userInfo?.personaname}</div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <div 
                  className={`w-2 h-2 rounded-full ${getPersonaStateColor(user?.userInfo?.personastate)}`}
                ></div>
                <span>{getPersonaStateText(user?.userInfo?.personastate)}</span>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Steam ID Info */}
        <div className="space-y-2">
          <div className="text-sm text-gray-300">
            <span className="text-gray-500">Steam ID:</span> {user?.steamId}
          </div>
          
          {user?.userInfo?.timecreated && (
            <div className="text-sm text-gray-300">
              <Clock className="h-3 w-3 inline mr-1" />
              Аккаунт создан: {new Date(user.userInfo.timecreated * 1000).toLocaleDateString('ru-RU')}
            </div>
          )}
        </div>

        {/* Game Ownership */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-orange-400" />
            <span className="text-sm">RUST в библиотеке</span>
          </div>
          {user?.ownsRust ? (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Подтверждено
            </Badge>
          ) : (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              <AlertCircle className="h-3 w-3 mr-1" />
              Не найдено
            </Badge>
          )}
        </div>

        {/* Profile Level */}
        {user?.userInfo?.level && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-purple-400" />
              <span className="text-sm">Уровень Steam</span>
            </div>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              {user.userInfo.level}
            </Badge>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(user?.userInfo?.profileurl, '_blank')}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            Профиль Steam
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SteamAuthComponent; 