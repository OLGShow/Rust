import { useState, useEffect, useRef } from 'react';

/**
 * Hook для ленивой загрузки изображений
 * @param {string} src - URL изображения
 * @param {object} options - Опции для Intersection Observer
 */
export const useLazyImage = (src, options = {}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [options]);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        setIsError(false);
      };
      
      img.onerror = () => {
        setIsError(true);
        setIsLoaded(false);
      };
      
      img.src = src;
    }
  }, [isInView, src]);

  return {
    imgRef,
    imageSrc,
    isLoaded,
    isError,
    isInView
  };
};

/**
 * Hook для ленивой загрузки компонентов
 * @param {function} importFunc - Функция динамического импорта
 */
export const useLazyComponent = (importFunc) => {
  const [Component, setComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadComponent = async () => {
    if (Component || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const module = await importFunc();
      setComponent(() => module.default || module);
    } catch (err) {
      setError(err);
      console.error('Error loading component:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    Component,
    isLoading,
    error,
    loadComponent
  };
};

export default useLazyImage; 