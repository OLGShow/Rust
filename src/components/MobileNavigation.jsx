/**
 * Мобильная навигация для RUST Store
 * Оптимизированная для touch устройств
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Home, Package, User, Settings, ShoppingCart, 
  Search, Filter, Heart, Star, TrendingUp 
} from 'lucide-react';
import { trackEvent } from '../lib/analytics';

const MobileNavigation = ({ 
  user, 
  cartItems = [], 
  onCategoryChange, 
  currentCategory, 
  onSearchChange,
  searchQuery,
  onCartClick,
  onProfileClick 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Категории товаров
  const categories = [
    { id: 'all', name: 'Все товары', icon: Package },
    { id: 'weapons', name: 'Оружие', icon: '🔫' },
    { id: 'armor', name: 'Броня', icon: '🛡️' },
    { id: 'tools', name: 'Инструменты', icon: '🔨' },
    { id: 'resources', name: 'Ресурсы', icon: '💎' },
    { id: 'skins', name: 'Скины', icon: '🎨' }
  ];

  // Быстрые фильтры
  const quickFilters = [
    { id: 'popular', name: 'Популярное', icon: TrendingUp },
    { id: 'new', name: 'Новинки', icon: Star },
    { id: 'sale', name: 'Скидки', icon: '🔥' },
    { id: 'favorites', name: 'Избранное', icon: Heart }
  ];

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    trackEvent('mobile_menu_toggle', { action: !isMenuOpen ? 'open' : 'close' });
  };

  const handleCategorySelect = (categoryId) => {
    onCategoryChange(categoryId);
    setIsMenuOpen(false);
    trackEvent('mobile_category_change', { category: categoryId });
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      onSearchChange('');
    }
  };

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
      if (isFilterOpen) setIsFilterOpen(false);
    };

    if (isMenuOpen || isFilterOpen) {
      document.addEventListener('touchstart', handleClickOutside);
      return () => document.removeEventListener('touchstart', handleClickOutside);
    }
  }, [isMenuOpen, isFilterOpen]);

  return (
    <>
      {/* Top Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-white font-bold">RUST Store</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Toggle */}
            <button
              onClick={handleSearchToggle}
              className="p-2 rounded-lg bg-gray-800 text-gray-300 active:bg-gray-700 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-lg bg-gray-800 text-gray-300 active:bg-gray-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </button>

            {/* Menu Toggle */}
            <button
              onClick={handleMenuToggle}
              className="p-2 rounded-lg bg-gray-800 text-gray-300 active:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-800 px-4 py-3"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-900 z-50 overflow-y-auto"
            >
              {/* User Profile Section */}
              <div className="p-6 border-b border-gray-800">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.personaname}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="text-white font-medium">{user.personaname}</p>
                      <p className="text-gray-400 text-sm">Steam ID: {user.steamid.slice(-8)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-400 mb-3">Войдите через Steam</p>
                    <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      Войти
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="p-6">
                <h3 className="text-white font-medium mb-4">Навигация</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => { onCategoryChange('all'); setIsMenuOpen(false); }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 active:bg-gray-700 transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    <span>Главная</span>
                  </button>
                  
                  {user && (
                    <button
                      onClick={() => { onProfileClick(); setIsMenuOpen(false); }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 active:bg-gray-700 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>Профиль</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="px-6 pb-6">
                <h3 className="text-white font-medium mb-4">Категории</h3>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    const isActive = currentCategory === category.id;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`
                          w-full flex items-center space-x-3 p-3 rounded-lg transition-colors
                          ${isActive 
                            ? 'bg-amber-500 text-white' 
                            : 'text-gray-300 hover:bg-gray-800 active:bg-gray-700'
                          }
                        `}
                      >
                        {typeof category.icon === 'string' ? (
                          <span className="text-lg">{category.icon}</span>
                        ) : (
                          <IconComponent className="w-5 h-5" />
                        )}
                        <span>{category.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Filters */}
              <div className="px-6 pb-6">
                <h3 className="text-white font-medium mb-4">Быстрые фильтры</h3>
                <div className="space-y-2">
                  {quickFilters.map((filter) => {
                    const IconComponent = filter.icon;
                    
                    return (
                      <button
                        key={filter.id}
                        onClick={() => {
                          trackEvent('mobile_filter_select', { filter: filter.id });
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 active:bg-gray-700 transition-colors"
                      >
                        {typeof filter.icon === 'string' ? (
                          <span className="text-lg">{filter.icon}</span>
                        ) : (
                          <IconComponent className="w-5 h-5" />
                        )}
                        <span>{filter.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
        <div className="flex items-center justify-around py-2">
          {/* Home */}
          <button
            onClick={() => onCategoryChange('all')}
            className={`
              flex flex-col items-center p-2 rounded-lg transition-colors
              ${currentCategory === 'all' 
                ? 'text-amber-500' 
                : 'text-gray-400 active:text-white'
              }
            `}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Главная</span>
          </button>

          {/* Categories */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex flex-col items-center p-2 rounded-lg text-gray-400 active:text-white transition-colors"
          >
            <Filter className="w-5 h-5 mb-1" />
            <span className="text-xs">Фильтры</span>
          </button>

          {/* Search */}
          <button
            onClick={handleSearchToggle}
            className={`
              flex flex-col items-center p-2 rounded-lg transition-colors
              ${isSearchOpen 
                ? 'text-amber-500' 
                : 'text-gray-400 active:text-white'
              }
            `}
          >
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs">Поиск</span>
          </button>

          {/* Cart */}
          <button
            onClick={onCartClick}
            className="relative flex flex-col items-center p-2 rounded-lg text-gray-400 active:text-white transition-colors"
          >
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">Корзина</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 right-1 w-4 h-4 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                {cartItemsCount > 9 ? '9+' : cartItemsCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={user ? onProfileClick : () => {}}
            className="flex flex-col items-center p-2 rounded-lg text-gray-400 active:text-white transition-colors"
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Профиль</span>
          </button>
        </div>
      </div>

      {/* Mobile Category Filter Popup */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsFilterOpen(false)}
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl z-50 max-h-[70vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white text-lg font-medium">Фильтры и категории</h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    const isActive = currentCategory === category.id;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          handleCategorySelect(category.id);
                          setIsFilterOpen(false);
                        }}
                        className={`
                          flex items-center space-x-2 p-3 rounded-lg transition-colors
                          ${isActive 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-gray-800 text-gray-300 active:bg-gray-700'
                          }
                        `}
                      >
                        {typeof category.icon === 'string' ? (
                          <span>{category.icon}</span>
                        ) : (
                          <IconComponent className="w-4 h-4" />
                        )}
                        <span className="text-sm">{category.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Filters */}
                <h4 className="text-white font-medium mb-3">Быстрые фильтры</h4>
                <div className="grid grid-cols-2 gap-3">
                  {quickFilters.map((filter) => {
                    const IconComponent = filter.icon;
                    
                    return (
                      <button
                        key={filter.id}
                        onClick={() => {
                          trackEvent('mobile_filter_select', { filter: filter.id });
                          setIsFilterOpen(false);
                        }}
                        className="flex items-center space-x-2 p-3 rounded-lg bg-gray-800 text-gray-300 active:bg-gray-700 transition-colors"
                      >
                        {typeof filter.icon === 'string' ? (
                          <span>{filter.icon}</span>
                        ) : (
                          <IconComponent className="w-4 h-4" />
                        )}
                        <span className="text-sm">{filter.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation; 