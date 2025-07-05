import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Star, 
  Users, 
  Server, 
  Shield, 
  Sword, 
  Package,
  CheckCircle,
  TrendingUp,
  Gamepad2,
  X,
  Plus,
  Minus,
  Crown,
  Zap,
  Gift,
  Settings
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import SteamAuthComponent from './components/SteamAuth';
import AdminPanel from './components/AdminPanel';
import { LazyAvatar } from './components/ui/LazyImage';
import LazySection from './components/ui/LazySection';
import CookieConsent from './components/CookieConsent';
import { trackAddToCart, trackLogin, trackPageView, trackEvent } from './lib/analytics';
import './App.css';

const App = () => {
  const [selectedServer, setSelectedServer] = useState('red');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [steamUser, setSteamUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [allProducts, setAllProducts] = useState(products);

  // Данные серверов
  const servers = [
    { id: 'red', name: 'Red', players: 14, maxPlayers: 200, status: 'online', ping: 45 },
    { id: 'green', name: 'Green', players: 156, maxPlayers: 200, status: 'online', ping: 23 },
    { id: 'yellow', name: 'Yellow', players: 89, maxPlayers: 200, status: 'online', ping: 67 },
    { id: 'purple', name: 'Purple', players: 134, maxPlayers: 200, status: 'online', ping: 34 },
    { id: 'blue', name: 'Blue', players: 178, maxPlayers: 200, status: 'online', ping: 56 },
    { id: 'black', name: 'Black', players: 12, maxPlayers: 200, status: 'maintenance', ping: 999 }
  ];

  // Данные товаров
  const products = [
    {
      id: 1,
      name: "VIP Package",
      price: 540,
      category: "privileges",
      description: "Premium VIP access with exclusive benefits",
      features: [
        "3 daily kits with premium items",
        "Queue bypass priority",
        "Exclusive VIP chat access",
        "Monthly subscriber rewards",
        "Premium support"
      ],
      duration: "6 days",
      popular: true,
      discount: 15
    },
    {
      id: 2,
      name: "Premium Package",
      price: 340,
      category: "privileges",
      description: "Advanced privileges for dedicated players",
      features: [
        "2 daily kits",
        "Priority queue access",
        "Special commands",
        "Monthly rewards"
      ],
      duration: "6 days",
      popular: false,
      discount: 10
    },
    {
      id: 3,
      name: "Workbench Level 3",
      price: 45,
      category: "items",
      description: "Advanced crafting station",
      features: [
        "Craft advanced items",
        "Permanent access",
        "Exclusive recipes",
        "Instant deployment"
      ],
      duration: "Permanent",
      popular: false,
      discount: 0
    },
    {
      id: 4,
      name: "Blue Keycard",
      price: 25,
      category: "items",
      description: "Access to restricted areas",
      features: [
        "Blue keycard access",
        "Monument entry",
        "Loot privileges",
        "Instant delivery"
      ],
      duration: "1 use",
      popular: false,
      discount: 0
    },
    {
      id: 5,
      name: "AK-47 Assault Rifle",
      price: 85,
      category: "weapons",
      description: "High-damage assault rifle",
      features: [
        "High damage output",
        "Customizable attachments",
        "Instant delivery",
        "Ammunition included"
      ],
      duration: "Permanent",
      popular: true,
      discount: 20
    },
    {
      id: 6,
      name: "Bolt Action Rifle",
      price: 120,
      category: "weapons",
      description: "Precision sniper rifle",
      features: [
        "Long-range precision",
        "One-shot potential",
        "Scope included",
        "Instant delivery"
      ],
      duration: "Permanent",
      popular: false,
      discount: 0
    },
    {
      id: 7,
      name: "Heavy Plate Armor",
      price: 65,
      category: "armor",
      description: "Maximum protection gear",
      features: [
        "Maximum protection",
        "Durability bonus",
        "Instant deployment",
        "Repair kit included"
      ],
      duration: "Permanent",
      popular: false,
      discount: 0
    },
    {
      id: 8,
      name: "Tactical Gear Set",
      price: 95,
      category: "armor",
      description: "Complete tactical equipment",
      features: [
        "Full armor set",
        "Tactical advantages",
        "Enhanced mobility",
        "Instant deployment"
      ],
      duration: "Permanent",
      popular: true,
      discount: 15
    }
  ];

  const categories = [
    { id: 'all', name: 'Все товары', icon: Package },
    { id: 'privileges', name: 'Привилегии', icon: Crown },
    { id: 'items', name: 'Предметы', icon: Package },
    { id: 'weapons', name: 'Оружие', icon: Sword },
    { id: 'armor', name: 'Броня', icon: Shield }
  ];

  const bonusRates = [
    { min: 500, max: 999, bonus: 10 },
    { min: 1000, max: 2499, bonus: 20 },
    { min: 2500, max: 4999, bonus: 30 },
    { min: 5000, max: Infinity, bonus: 40 }
  ];

  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter(product => product.category === activeCategory));
    }
    
    // Отслеживаем смену категории
    if (activeCategory !== 'all') {
      trackEvent('category_filter', {
        category: activeCategory,
        products_count: allProducts.filter(product => product.category === activeCategory).length
      });
    }
  }, [activeCategory, allProducts]);

  // Отслеживание загрузки страницы
  useEffect(() => {
    trackPageView('/', 'RUST Store - Главная страница');
  }, []);

  // Обработчик изменения авторизации Steam
  const handleAuthChange = (userData) => {
    setSteamUser(userData);
    if (userData) {
      setIsAuthModalOpen(false);
      // Отслеживаем авторизацию
      trackLogin('steam');
      trackEvent('user_login', {
        steam_id: userData.steamId,
        username: userData.userInfo?.personaname,
        owns_rust: userData.ownsRust
      });
    }
  };

  // Обработчик обновления товаров
  const handleProductUpdate = (product) => {
    if (product.deleted) {
      setAllProducts(prev => prev.filter(p => p.id !== product.id));
    } else if (product.id && allProducts.find(p => p.id === product.id)) {
      setAllProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setAllProducts(prev => [...prev, product]);
    }
  };

  // Обработчик обновления серверов
  const handleServerUpdate = (server) => {
    // Здесь будет логика обновления серверов
    console.log('Server update:', server);
  };

  // Проверка прав администратора
  const isAdmin = steamUser?.steamId === '76561198000000000' || 
                  steamUser?.userInfo?.personaname === 'Admin';

    const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Отслеживаем увеличение количества
        trackEvent('add_to_cart', {
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          price: product.price,
          quantity: existing.quantity + 1
        });
        
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Отслеживаем добавление нового товара
      trackAddToCart(product);
      
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const discountedPrice = item.price * (1 - item.discount / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getBonusInfo = (total) => {
    const bonusRate = bonusRates.find(rate => total >= rate.min && total <= rate.max);
    return bonusRate ? bonusRate.bonus : 0;
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : Package;
  };

  const getServerColor = (serverId) => {
    const colors = {
      red: 'bg-red-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      blue: 'bg-blue-500',
      black: 'bg-gray-800'
    };
    return colors[serverId] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  RUST Store
                </h1>
                <p className="text-gray-300 text-sm">Premium Gaming Experience</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Steam авторизация */}
              {steamUser ? (
                                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <LazyAvatar 
                        src={steamUser.userInfo?.avatar} 
                        alt="Steam Avatar"
                        size="sm"
                        className="border-2 border-orange-500/30"
                      />
                      <div className="text-sm">
                        <div className="text-white font-medium">{steamUser.userInfo?.personaname}</div>
                        <div className="text-gray-400 text-xs">Steam ID: {steamUser.steamId?.slice(-4)}</div>
                      </div>
                    </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                        Профиль
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-white/20 text-white max-w-md">
                      <DialogHeader>
                        <DialogTitle>Steam профиль</DialogTitle>
                      </DialogHeader>
                      <SteamAuthComponent onAuthChange={handleAuthChange} />
                    </DialogContent>
                  </Dialog>
                  
                  {/* Кнопка админ-панели */}
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdminPanel(true)}
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Админ
                    </Button>
                  )}
                </div>
              ) : (
                <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Users className="h-4 w-4 mr-2" />
                      Войти через Steam
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-white/20 text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle>Авторизация Steam</DialogTitle>
                    </DialogHeader>
                    <SteamAuthComponent onAuthChange={handleAuthChange} />
                  </DialogContent>
                </Dialog>
              )}
              
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Корзина
                {getCartCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5">
                    {getCartCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            Премиум магазин RUST
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Получите преимущества в игре с нашими эксклюзивными товарами и привилегиями
          </p>
          
          {/* Bonus Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {bonusRates.map((rate, index) => (
              <Card key={index} className="glass-effect border-white/10 hover:border-orange-500/30 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-4 text-center">
                  <Gift className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-orange-400">+{rate.bonus}%</div>
                  <div className="text-sm text-gray-300">
                    от {rate.min}₽ {rate.max !== Infinity ? `до ${rate.max}₽` : 'и выше'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Server Selection */}
        <Card className="glass-effect border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Server className="h-5 w-5 mr-2" />
              Выберите сервер
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {servers.map((server) => (
                <Button
                  key={server.id}
                  variant={selectedServer === server.id ? "default" : "outline"}
                  className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                    selectedServer === server.id 
                      ? 'bg-orange-500 text-white' 
                      : 'border-white/20 text-white hover:bg-white/10'
                  }`}
                  onClick={() => {
                    setSelectedServer(server.id);
                    // Отслеживаем выбор сервера
                    trackEvent('server_select', {
                      server_id: server.id,
                      server_name: server.name,
                      server_players: server.players,
                      server_ping: server.ping
                    });
                  }}
                  disabled={server.status === 'maintenance'}
                >
                  <div className={`w-4 h-4 rounded-full ${getServerColor(server.id)}`}></div>
                  <div className="text-sm font-medium">{server.name}</div>
                  <div className="text-xs text-gray-400">
                    {server.players}/{server.maxPlayers}
                  </div>
                  <div className="text-xs">
                    {server.status === 'maintenance' ? 'Maintenance' : `${server.ping}ms`}
                  </div>
                </Button>
              ))}
            </div>
            {selectedServer && (
              <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center text-orange-400">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Привилегии будут активированы на сервере {servers.find(s => s.id === selectedServer)?.name}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/5 border border-white/10">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Products Grid */}
        <LazySection 
          rootMargin="100px"
          className="lazy-container"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
            const Icon = getCategoryIcon(product.category);
            const discountedPrice = product.price * (1 - product.discount / 100);
            
            return (
              <Card key={product.id} className="glass-effect border-white/10 hover:border-orange-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-orange-400" />
                    <div className="flex items-center space-x-2">
                      {product.popular && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      {product.discount > 0 && (
                        <Badge className="bg-green-500 text-white">
                          -{product.discount}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-white group-hover:text-orange-400 transition-colors">
                    {product.name}
                  </CardTitle>
                  <p className="text-gray-400 text-sm">{product.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {product.discount > 0 ? (
                        <>
                          <span className="text-2xl font-bold text-orange-400">{discountedPrice}₽</span>
                          <span className="text-lg text-gray-500 line-through">{product.price}₽</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-orange-400">{product.price}₽</span>
                      )}
                    </div>
                    <Badge variant="outline" className="border-white/20 text-white">
                      {product.duration}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-white/20 text-white hover:bg-white/10"
                          onClick={() => setSelectedProduct(product)}
                        >
                          Подробнее
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-white/20 text-white max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <Icon className="h-6 w-6 text-orange-400" />
                            <span>{product.name}</span>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-gray-300">{product.description}</p>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Что включено:</h4>
                            <ul className="space-y-1">
                              {product.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-300">
                                  <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <div className="text-sm text-gray-400">Цена:</div>
                              {product.discount > 0 ? (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xl font-bold text-orange-400">{discountedPrice}₽</span>
                                  <span className="text-sm text-gray-500 line-through">{product.price}₽</span>
                                </div>
                              ) : (
                                <div className="text-xl font-bold text-orange-400">{product.price}₽</div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-400">Длительность:</div>
                              <div className="text-sm font-medium">{product.duration}</div>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            onClick={() => addToCart(product)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Добавить в корзину
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        </LazySection>
      </section>

      {/* Floating Cart */}
      {getCartCount() > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg rounded-full h-16 w-16 p-0 animate-pulse"
            onClick={() => setIsCartOpen(true)}
          >
            <div className="text-center">
              <ShoppingCart className="h-6 w-6 mx-auto" />
              <div className="text-xs">{getCartTotal().toFixed(0)}₽</div>
            </div>
          </Button>
        </div>
      )}

      {/* Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6" />
              <span>Корзина ({getCartCount()})</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Корзина пуста
              </div>
            ) : (
              cart.map((item) => {
                const discountedPrice = item.price * (1 - item.discount / 100);
                const itemTotal = discountedPrice * item.quantity;
                
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-400">{item.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {item.discount > 0 ? (
                          <>
                            <span className="text-orange-400 font-bold">{discountedPrice}₽</span>
                            <span className="text-gray-500 line-through text-sm">{item.price}₽</span>
                          </>
                        ) : (
                          <span className="text-orange-400 font-bold">{item.price}₽</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-white/20"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-white/20"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right min-w-[60px]">
                        <div className="font-bold text-orange-400">{itemTotal.toFixed(0)}₽</div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-400"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="border-t border-white/10 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span>Итого:</span>
                  <span className="font-bold text-orange-400">{getCartTotal().toFixed(0)}₽</span>
                </div>
                
                {getBonusInfo(getCartTotal()) > 0 && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Бонус при пополнении:</span>
                    <span>+{getBonusInfo(getCartTotal())}%</span>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                onClick={() => {
                  // Здесь будет логика оформления заказа
                  alert('Функция оформления заказа будет реализована в следующей версии');
                }}
              >
                <Zap className="h-4 w-4 mr-2" />
                Оформить заказ
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Админ-панель */}
      <Dialog open={showAdminPanel} onOpenChange={setShowAdminPanel}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-orange-400" />
              <span>Панель администратора</span>
            </DialogTitle>
          </DialogHeader>
          <AdminPanel 
            products={allProducts}
            servers={servers}
            onProductUpdate={handleProductUpdate}
            onServerUpdate={handleServerUpdate}
            steamUser={steamUser}
          />
        </DialogContent>
      </Dialog>

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
};

export default App;

