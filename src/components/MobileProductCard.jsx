/**
 * Мобильная карточка товара для RUST Store
 * Оптимизированная для touch устройств
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Zap, Tag, Eye } from 'lucide-react';
import { LazyImage } from './ui/LazyImage';
import { trackEvent } from '../lib/analytics';

const MobileProductCard = ({ 
  product, 
  onAddToCart, 
  onViewDetails, 
  isInCart = false,
  isFavorite = false,
  onToggleFavorite 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    
    // Haptic feedback для мобильных устройств
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    trackEvent('mobile_add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price
    });
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite(product.id);
    
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    
    trackEvent('mobile_toggle_favorite', {
      product_id: product.id,
      action: isFavorite ? 'remove' : 'add'
    });
  };

  const handleCardPress = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onViewDetails(product);
    
    trackEvent('mobile_product_view', {
      product_id: product.id,
      product_name: product.name
    });
  };

  const handleLongPress = () => {
    setShowQuickActions(true);
    
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <motion.div
      className={`
        relative bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 
        overflow-hidden transition-all duration-200 active:scale-[0.98]
        ${isPressed ? 'scale-[0.98] shadow-lg' : 'shadow-md'}
      `}
      whileTap={{ scale: 0.98 }}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      onClick={handleCardPress}
    >
      {/* Product Image */}
      <div className="relative aspect-square">
        <LazyImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          placeholder="blur"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
            -{product.discount}%
          </div>
        )}
        
        {/* New Badge */}
        {product.isNew && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
            NEW
          </div>
        )}
        
        {/* Quick Action Button */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2">
          <button
            onClick={handleToggleFavorite}
            className={`
              w-8 h-8 rounded-full backdrop-blur-sm transition-all duration-200 
              flex items-center justify-center active:scale-90
              ${isFavorite 
                ? 'bg-red-500/80 text-white' 
                : 'bg-black/40 text-gray-300 hover:text-red-400'
              }
            `}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Overlay Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-1 mb-2">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className="text-white text-sm font-medium">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-gray-300 text-xs">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Category */}
        <div className="flex items-center space-x-2 mb-3">
          <Tag className="w-3 h-3 text-gray-400" />
          <span className="text-gray-400 text-xs capitalize">
            {product.category}
          </span>
          
          {product.isPopular && (
            <>
              <span className="text-gray-600">•</span>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-amber-400 text-xs">Популярное</span>
              </div>
            </>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold text-lg">
                {discountedPrice.toLocaleString('ru-RU')} ₽
              </span>
              {product.discount > 0 && (
                <span className="text-gray-400 text-sm line-through">
                  {product.price.toLocaleString('ru-RU')} ₽
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="text-green-400 text-xs">
                Экономия {(product.price - discountedPrice).toLocaleString('ru-RU')} ₽
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg 
              font-medium text-sm transition-all duration-200 active:scale-95
              ${isInCart 
                ? 'bg-green-600 text-white cursor-default' 
                : 'bg-amber-500 hover:bg-amber-600 text-white active:bg-amber-700'
              }
            `}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isInCart ? 'В корзине' : 'В корзину'}</span>
          </button>
          
          <button
            onClick={handleCardPress}
            className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors active:scale-95"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Info */}
        {product.deliveryTime && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Активация:</span>
              <span className="text-green-400">{product.deliveryTime}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Overlay */}
      {showQuickActions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10"
          onClick={() => setShowQuickActions(false)}
        >
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="flex flex-col items-center space-y-2 p-4 bg-amber-500 rounded-xl text-white active:scale-95 transition-transform"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs">В корзину</span>
            </button>
            
            <button
              onClick={handleToggleFavorite}
              className={`
                flex flex-col items-center space-y-2 p-4 rounded-xl transition-all active:scale-95
                ${isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-600 text-gray-300'
                }
              `}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              <span className="text-xs">
                {isFavorite ? 'Убрать' : 'В избранное'}
              </span>
            </button>
            
            <button
              onClick={handleCardPress}
              className="flex flex-col items-center space-y-2 p-4 bg-blue-500 rounded-xl text-white active:scale-95 transition-transform"
            >
              <Eye className="w-6 h-6" />
              <span className="text-xs">Подробнее</span>
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MobileProductCard; 