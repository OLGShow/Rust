import React from 'react';
import { Loader2, ImageOff } from 'lucide-react';
import { useLazyImage } from '../../hooks/useLazyImage';

/**
 * Компонент для ленивой загрузки изображений
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  fallback = null,
  placeholderClassName = '',
  options = {},
  onLoad,
  onError,
  ...props 
}) => {
  const { imgRef, imageSrc, isLoaded, isError, isInView } = useLazyImage(src, options);

  React.useEffect(() => {
    if (isLoaded && onLoad) {
      onLoad();
    }
  }, [isLoaded, onLoad]);

  React.useEffect(() => {
    if (isError && onError) {
      onError();
    }
  }, [isError, onError]);

  // Placeholder пока изображение не загружено
  const renderPlaceholder = () => {
    if (isError) {
      return (
        <div className={`flex items-center justify-center bg-gray-800 ${placeholderClassName || className}`}>
          {fallback || (
            <div className="flex flex-col items-center space-y-2 text-gray-500">
              <ImageOff className="h-8 w-8" />
              <span className="text-xs">Ошибка загрузки</span>
            </div>
          )}
        </div>
      );
    }

    if (!isInView || !imageSrc) {
      return (
        <div className={`flex items-center justify-center bg-gray-800/50 ${placeholderClassName || className}`}>
          <div className="flex flex-col items-center space-y-2 text-gray-400">
            <div className="skeleton-loader w-16 h-16 rounded-lg bg-gray-700/50 animate-pulse"></div>
            {isInView && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div ref={imgRef} className="relative overflow-hidden">
      {/* Placeholder */}
      {!isLoaded && renderPlaceholder()}
      
      {/* Изображение */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      )}
      
      {/* Эффект загрузки */}
      {isInView && !isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      )}
    </div>
  );
};

/**
 * Компонент для ленивой загрузки аватаров
 */
export const LazyAvatar = ({ 
  src, 
  alt, 
  size = 'md',
  className = '',
  fallbackIcon = null,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <LazyImage
      src={src}
      alt={alt}
      className={`rounded-full ${sizeClasses[size]} ${className}`}
      placeholderClassName={`rounded-full ${sizeClasses[size]}`}
      fallback={fallbackIcon}
      {...props}
    />
  );
};

/**
 * Компонент для ленивой загрузки изображений товаров
 */
export const LazyProductImage = ({ 
  src, 
  alt, 
  className = '',
  ...props 
}) => {
  return (
    <LazyImage
      src={src}
      alt={alt}
      className={`aspect-square object-cover ${className}`}
      placeholderClassName="aspect-square"
      {...props}
    />
  );
};

/**
 * Компонент для ленивой загрузки изображений в галерее
 */
export const LazyGalleryImage = ({ 
  src, 
  alt, 
  className = '',
  onClick,
  ...props 
}) => {
  return (
    <div 
      className="cursor-pointer hover:scale-105 transition-transform duration-300"
      onClick={onClick}
    >
      <LazyImage
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        {...props}
      />
    </div>
  );
};

export default LazyImage; 