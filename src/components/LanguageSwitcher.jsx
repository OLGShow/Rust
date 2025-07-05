/**
 * Переключатель языка для RUST Store
 * Стильный компонент для смены языка интерфейса
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const LanguageSwitcher = ({ className = '', variant = 'default' }) => {
  const { currentLang, changeLanguage, getAvailableLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const languages = getAvailableLanguages();
  
  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang);

  // Компактный вариант для мобильных устройств
  if (variant === 'mobile') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
        >
          <span className="text-lg">{currentLanguage?.flag}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 top-12 w-32 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50"
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 text-sm transition-colors
                    ${currentLang === language.code 
                      ? 'bg-amber-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                    ${language.code === languages[0].code ? 'rounded-t-lg' : ''}
                    ${language.code === languages[languages.length - 1].code ? 'rounded-b-lg' : ''}
                  `}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                  {currentLang === language.code && (
                    <Check className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Минималистичный вариант
  if (variant === 'minimal') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 p-1 rounded text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-sm">{currentLanguage?.flag}</span>
          <span className="text-xs font-medium uppercase">{currentLang}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute right-0 top-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50"
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`
                    w-full flex items-center space-x-2 px-3 py-2 text-sm transition-colors
                    ${currentLang === language.code 
                      ? 'bg-amber-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                    ${language.code === languages[0].code ? 'rounded-t-lg' : ''}
                    ${language.code === languages[languages.length - 1].code ? 'rounded-b-lg' : ''}
                  `}
                >
                  <span>{language.flag}</span>
                  <span>{language.code.toUpperCase()}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Стандартный вариант
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200 group"
      >
        <Languages className="w-4 h-4" />
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="font-medium">{currentLanguage?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform group-hover:text-amber-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-48 bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-700 z-50 overflow-hidden"
          >
            <div className="p-2">
              {languages.map((language, index) => (
                <motion.button
                  key={language.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200
                    ${currentLang === language.code 
                      ? 'bg-amber-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }
                  `}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="font-medium">{language.name}</span>
                  {currentLang === language.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher; 