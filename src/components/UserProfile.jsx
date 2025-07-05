/**
 * Профиль пользователя для RUST Store
 * Полнофункциональная страница с историей покупок и настройками
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Settings, ShoppingBag, Clock, Award, Star, 
  Download, Eye, Edit3, Save, X, Trash2, Gift,
  TrendingUp, Calendar, CreditCard, Package
} from 'lucide-react';
import { LazyImage } from './ui/LazyImage';
import { trackEvent } from '../lib/analytics';

const UserProfile = ({ user, onClose, isOpen }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Инициализация данных профиля
  useEffect(() => {
    if (user && isOpen) {
      loadUserData();
      trackEvent('profile_opened', { user_id: user.steamid });
    }
  }, [user, isOpen]);

  const loadUserData = async () => {
    try {
      // Загружаем историю покупок из localStorage (в реальном приложении - с сервера)
      const storedPurchases = JSON.parse(localStorage.getItem('purchase_history') || '[]');
      setPurchaseHistory(storedPurchases);

      // Загружаем избранное
      const storedFavorites = JSON.parse(localStorage.getItem('user_favorites') || '[]');
      setFavorites(storedFavorites);

      // Загружаем список желаний
      const storedWishlist = JSON.parse(localStorage.getItem('user_wishlist') || '[]');
      setWishlist(storedWishlist);

      // Рассчитываем статистику
      const stats = calculateUserStats(storedPurchases);
      setUserStats(stats);

      // Инициализируем редактируемый профиль
      setEditedProfile({
        displayName: user.personaname,
        bio: localStorage.getItem('user_bio') || '',
        favoriteServer: localStorage.getItem('user_favorite_server') || 'red',
        notifications: JSON.parse(localStorage.getItem('user_notifications') || '{"email": true, "push": false}')
      });

    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const calculateUserStats = (purchases) => {
    const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const totalItems = purchases.reduce((sum, purchase) => sum + purchase.items.length, 0);
    const totalPurchases = purchases.length;
    
    // Определяем самый частый сервер
    const serverCounts = {};
    purchases.forEach(purchase => {
      const server = purchase.customer?.selectedServer || 'unknown';
      serverCounts[server] = (serverCounts[server] || 0) + 1;
    });
    
    const favoriteServer = Object.keys(serverCounts).reduce((a, b) => 
      serverCounts[a] > serverCounts[b] ? a : b, 'none'
    );

    // Определяем уровень пользователя на основе трат
    let userLevel = 'Новичок';
    let levelProgress = 0;
    
    if (totalSpent >= 50000) {
      userLevel = 'Легенда';
      levelProgress = 100;
    } else if (totalSpent >= 25000) {
      userLevel = 'Мастер';
      levelProgress = ((totalSpent - 25000) / 25000) * 100;
    } else if (totalSpent >= 10000) {
      userLevel = 'Эксперт';
      levelProgress = ((totalSpent - 10000) / 15000) * 100;
    } else if (totalSpent >= 5000) {
      userLevel = 'Продвинутый';
      levelProgress = ((totalSpent - 5000) / 5000) * 100;
    } else if (totalSpent >= 1000) {
      userLevel = 'Игрок';
      levelProgress = ((totalSpent - 1000) / 4000) * 100;
    } else {
      levelProgress = (totalSpent / 1000) * 100;
    }

    return {
      totalSpent,
      totalItems,
      totalPurchases,
      favoriteServer,
      userLevel,
      levelProgress: Math.min(levelProgress, 100),
      joinDate: localStorage.getItem('user_join_date') || new Date().toISOString(),
      lastPurchase: purchases.length > 0 ? purchases[0].timestamp : null
    };
  };

  const handleSaveProfile = () => {
    try {
      localStorage.setItem('user_bio', editedProfile.bio);
      localStorage.setItem('user_favorite_server', editedProfile.favoriteServer);
      localStorage.setItem('user_notifications', JSON.stringify(editedProfile.notifications));
      
      setIsEditing(false);
      trackEvent('profile_updated', { user_id: user.steamid });
      
      // Показываем уведомление об успешном сохранении
      // В реальном приложении здесь был бы toast notification
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: User },
    { id: 'purchases', label: 'Покупки', icon: ShoppingBag },
    { id: 'favorites', label: 'Избранное', icon: Star },
    { id: 'settings', label: 'Настройки', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* User Level & Progress */}
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-xl p-6 border border-amber-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{userStats.userLevel}</h3>
            <p className="text-amber-200">Уровень игрока</p>
          </div>
          <Award className="w-8 h-8 text-amber-400" />
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${userStats.levelProgress}%` }}
          />
        </div>
        <p className="text-sm text-gray-300">
          {userStats.levelProgress < 100 ? `${userStats.levelProgress.toFixed(1)}% до следующего уровня` : 'Максимальный уровень достигнут!'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatPrice(userStats.totalSpent)}</p>
              <p className="text-sm text-gray-400">Потрачено всего</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{userStats.totalItems}</p>
              <p className="text-sm text-gray-400">Товаров куплено</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <CreditCard className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{userStats.totalPurchases}</p>
              <p className="text-sm text-gray-400">Заказов</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {Math.floor((Date.now() - new Date(userStats.joinDate)) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-sm text-gray-400">Дней с нами</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Последняя активность
        </h3>
        
        {purchaseHistory.slice(0, 3).map((purchase, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
            <div>
              <p className="text-white font-medium">
                Заказ #{purchase.transactionId.slice(-8)}
              </p>
              <p className="text-gray-400 text-sm">
                {formatDate(purchase.timestamp)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-medium">{formatPrice(purchase.amount)}</p>
              <p className="text-gray-400 text-sm">{purchase.items.length} товаров</p>
            </div>
          </div>
        ))}
        
        {purchaseHistory.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            Пока нет покупок. Время начать шоппинг! 🛒
          </p>
        )}
      </div>
    </div>
  );

  const renderPurchases = () => (
    <div className="space-y-4">
      {purchaseHistory.map((purchase, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-medium">
                Заказ #{purchase.transactionId.slice(-8)}
              </h3>
              <p className="text-gray-400 text-sm">{formatDate(purchase.timestamp)}</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-bold text-lg">{formatPrice(purchase.amount)}</p>
              <p className="text-gray-400 text-sm">
                Сервер: {purchase.customer?.selectedServer || 'Неизвестно'}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            {purchase.items?.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <LazyImage
                  src={item.image || '/api/placeholder/40/40'}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-gray-400 text-sm">Количество: {item.quantity}</p>
                </div>
                <p className="text-amber-400 font-medium">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            )) || (
              <p className="text-gray-400 text-sm">Детали товаров недоступны</p>
            )}
          </div>
          
          <div className="mt-4 flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Скачать чек</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
              <Eye className="w-4 h-4" />
              <span>Подробнее</span>
            </button>
          </div>
        </motion.div>
      ))}
      
      {purchaseHistory.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">Нет покупок</h3>
          <p className="text-gray-400 mb-6">
            Вы еще ничего не покупали. Откройте для себя наши товары!
          </p>
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            Перейти к покупкам
          </button>
        </div>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-4">
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((item, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center space-x-3">
                <LazyImage
                  src={item.image || '/api/placeholder/60/60'}
                  alt={item.name}
                  className="w-15 h-15 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-white font-medium">{item.name}</h3>
                  <p className="text-gray-400 text-sm">{item.category}</p>
                  <p className="text-amber-400 font-bold">{formatPrice(item.price)}</p>
                </div>
                <button className="p-2 text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">Нет избранных товаров</h3>
          <p className="text-gray-400">
            Добавляйте товары в избранное, чтобы быстро их находить
          </p>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Информация профиля</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditing ? 'Сохранить' : 'Редактировать'}</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Отображаемое имя
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.displayName}
                onChange={(e) => setEditedProfile({...editedProfile, displayName: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            ) : (
              <p className="text-white">{editedProfile.displayName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              О себе
            </label>
            {isEditing ? (
              <textarea
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Расскажите о себе..."
              />
            ) : (
              <p className="text-white">{editedProfile.bio || 'Не указано'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Любимый сервер
            </label>
            {isEditing ? (
              <select
                value={editedProfile.favoriteServer}
                onChange={(e) => setEditedProfile({...editedProfile, favoriteServer: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="red">🔴 Red Server</option>
                <option value="blue">🔵 Blue Server</option>
                <option value="green">🟢 Green Server</option>
              </select>
            ) : (
              <p className="text-white capitalize">
                {editedProfile.favoriteServer === 'red' && '🔴 Red Server'}
                {editedProfile.favoriteServer === 'blue' && '🔵 Blue Server'}
                {editedProfile.favoriteServer === 'green' && '🟢 Green Server'}
              </p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Сохранить изменения
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Отмена
            </button>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Уведомления</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Email уведомления</p>
              <p className="text-gray-400 text-sm">Получать уведомления о заказах на email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={editedProfile.notifications?.email || false}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  notifications: {
                    ...editedProfile.notifications,
                    email: e.target.checked
                  }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Push уведомления</p>
              <p className="text-gray-400 text-sm">Мгновенные уведомления в браузере</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={editedProfile.notifications?.push || false}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  notifications: {
                    ...editedProfile.notifications,
                    push: e.target.checked
                  }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <LazyImage
                  src={user.avatar}
                  alt={user.personaname}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.personaname}</h2>
                  <p className="text-gray-400">Steam ID: {user.steamid}</p>
                  <p className="text-amber-400 font-medium">{userStats.userLevel}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-800">
            <div className="flex space-x-0 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors flex-1
                      ${activeTab === tab.id 
                        ? 'bg-amber-500 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'purchases' && renderPurchases()}
            {activeTab === 'favorites' && renderFavorites()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserProfile; 