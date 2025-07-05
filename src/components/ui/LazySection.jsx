import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Компонент для ленивой загрузки секций контента
 */
const LazySection = ({ 
  children, 
  fallback = null,
  className = '',
  threshold = 0.1,
  rootMargin = '100px',
  onIntersect,
  ...props 
}) => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          onIntersect?.();
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [threshold, rootMargin, onIntersect]);

  const defaultFallback = (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center space-y-4 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm">Загрузка контента...</span>
      </div>
    </div>
  );

  return (
    <div ref={sectionRef} className={className} {...props}>
      {isInView ? children : (fallback || defaultFallback)}
    </div>
  );
};

/**
 * Компонент для ленивой загрузки карточек товаров
 */
export const LazyProductGrid = ({ 
  products, 
  renderProduct,
  className = '',
  itemsPerBatch = 6,
  loadMoreThreshold = 2
}) => {
  const [visibleCount, setVisibleCount] = useState(itemsPerBatch);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < products.length) {
          setIsLoading(true);
          
          // Имитация загрузки
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + itemsPerBatch, products.length));
            setIsLoading(false);
          }, 500);
        }
      },
      {
        threshold: 0.5,
        rootMargin: '100px'
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [visibleCount, products.length, itemsPerBatch]);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <div className={className}>
      {/* Видимые товары */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProducts.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-in"
            style={{
              animationDelay: `${(index % itemsPerBatch) * 100}ms`
            }}
          >
            {renderProduct(product)}
          </div>
        ))}
      </div>

      {/* Индикатор загрузки */}
      {hasMore && (
        <div 
          ref={loaderRef}
          className="flex items-center justify-center py-8 mt-6"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Загрузка товаров...</span>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              Прокрутите вниз для загрузки еще товаров
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Компонент для ленивой загрузки списков
 */
export const LazyList = ({ 
  items, 
  renderItem,
  className = '',
  itemHeight = 80,
  containerHeight = 400,
  overscan = 5
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef();

  const itemsPerView = Math.ceil(containerHeight / itemHeight);
  const totalItems = items.length;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(totalItems, startIndex + itemsPerView + overscan * 2);

  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div 
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {/* Виртуальная высота для скролла */}
      <div style={{ height: totalItems * itemHeight, position: 'relative' }}>
        {/* Видимые элементы */}
        <div 
          style={{ 
            transform: `translateY(${startIndex * itemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div 
              key={startIndex + index}
              style={{ height: itemHeight }}
              className="flex items-center"
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LazySection; 