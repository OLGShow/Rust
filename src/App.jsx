import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { ShoppingCart, User, Package, Zap, Shield, Star, Clock, Gift, CheckCircle, Users, Server, TrendingUp, Gamepad2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// Placeholder images for demonstration
const rustItems = "https://images.unsplash.com/photo-1628348068343-c6a848d2d097?w=400&h=400&fit=crop"
const rustItemList = "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=400&fit=crop"

// Mock data for products
const products = [
  {
    id: 1,
    name: "VIP Package",
    price: 540,
    category: "privileges",
    image: rustItems,
    description: "Premium VIP access with exclusive benefits",
    features: [
      "3 daily kits - command /kit",
      "2 additional teleport points",
      "Queue bypass - instant entry",
      "Pocket recycler",
      "Trade cooldown 5 min",
      "Prefixes and colors - command /chat",
      "Participation in giveaways"
    ],
    duration: "6 days",
    popular: true,
    discount: 15
  },
  {
    id: 2,
    name: "Workbench Tier 1",
    price: 60,
    category: "items",
    image: rustItemList,
    description: "Essential crafting station for basic items",
    features: ["Craft basic items", "Durable construction", "Easy placement"],
    popular: false
  },
  {
    id: 3,
    name: "Workbench Tier 2",
    price: 100,
    category: "items",
    image: rustItemList,
    description: "Advanced crafting station for intermediate items",
    features: ["Craft intermediate items", "Enhanced durability", "Faster crafting speed"],
    popular: false
  },
  {
    id: 4,
    name: "Workbench Tier 3",
    price: 180,
    category: "items",
    image: rustItemList,
    description: "Top-tier crafting station for advanced items",
    features: ["Craft advanced items", "Maximum durability", "Fastest crafting speed"],
    popular: true
  },
  {
    id: 5,
    name: "Green Keycard",
    price: 20,
    category: "items",
    image: rustItems,
    description: "Access card for low-security areas",
    features: ["Access to green puzzle rooms", "Single use", "Essential for progression"],
    popular: false
  },
  {
    id: 6,
    name: "Red Keycard",
    price: 60,
    category: "items",
    image: rustItems,
    description: "Access card for high-security areas",
    features: ["Access to red puzzle rooms", "Single use", "Highest tier access"],
    popular: true
  },
  {
    id: 7,
    name: "Assault Rifle",
    price: 100,
    category: "weapons",
    image: rustItemList,
    description: "High-damage automatic weapon",
    features: ["High damage output", "Automatic fire", "Medium range"],
    popular: false
  },
  {
    id: 8,
    name: "Metal Armor Set",
    price: 80,
    category: "armor",
    image: rustItems,
    description: "Complete metal protection set",
    features: ["High protection", "Durable materials", "Full body coverage"],
    popular: false
  }
]

const servers = [
  { id: 'red', name: 'Red', players: 14, maxPlayers: 200, status: 'online', ping: 45 },
  { id: 'green', name: 'Green', players: 3, maxPlayers: 200, status: 'online', ping: 32 },
  { id: 'yellow', name: 'Yellow', players: 12, maxPlayers: 200, status: 'online', ping: 67 },
  { id: 'purple', name: 'Purple', players: 18, maxPlayers: 200, status: 'online', ping: 28 },
  { id: 'blue', name: 'Blue', players: 15, maxPlayers: 200, status: 'online', ping: 55 },
  { id: 'black', name: 'Black', players: 8, maxPlayers: 200, status: 'online', ping: 72 }
]

function App() {
  const [selectedServer, setSelectedServer] = useState('red')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const addToCart = (product) => {
    setCart(prev => [...prev, product])
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0)
  }

  const getServerColor = (serverId) => {
    const colors = {
      red: 'bg-red-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      blue: 'bg-blue-500',
      black: 'bg-gray-800'
    }
    return colors[serverId] || 'bg-gray-500'
  }

  const getServerGradient = (serverId) => {
    const gradients = {
      red: 'from-red-500/20 to-red-600/10',
      green: 'from-green-500/20 to-green-600/10',
      yellow: 'from-yellow-500/20 to-yellow-600/10',
      purple: 'from-purple-500/20 to-purple-600/10',
      blue: 'from-blue-500/20 to-blue-600/10',
      black: 'from-gray-500/20 to-gray-600/10'
    }
    return gradients[serverId] || 'from-gray-500/20 to-gray-600/10'
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="border-b border-gray-700/50 bg-black/30 backdrop-blur-xl sticky top-0 z-50 glassmorphism">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Gamepad2 className="inline-block w-8 h-8 mr-2 text-orange-500" />
                RUST Store
              </motion.h1>
              <nav className="hidden md:flex space-x-6">
                <motion.a 
                  href="#" 
                  className="hover:text-orange-400 transition-colors flex items-center space-x-1"
                  whileHover={{ y: -2 }}
                >
                  <Package className="w-4 h-4" />
                  <span>Products</span>
                </motion.a>
                <motion.a 
                  href="#" 
                  className="hover:text-orange-400 transition-colors flex items-center space-x-1"
                  whileHover={{ y: -2 }}
                >
                  <Server className="w-4 h-4" />
                  <span>Servers</span>
                </motion.a>
                <motion.a 
                  href="#" 
                  className="hover:text-orange-400 transition-colors flex items-center space-x-1"
                  whileHover={{ y: -2 }}
                >
                  <Users className="w-4 h-4" />
                  <span>Contacts</span>
                </motion.a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  className="border-orange-500/50 bg-orange-500/10 backdrop-blur-sm text-orange-400 hover:bg-orange-500 hover:text-black transition-all duration-300"
                  onClick={() => setIsAuthenticated(!isAuthenticated)}
                >
                  <User className="w-4 h-4 mr-2" />
                  {isAuthenticated ? 'Logged In' : 'Login via Steam'}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="relative bg-white/5 backdrop-blur-sm">
                  <ShoppingCart className="w-5 h-5" />
                  {cart.length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2"
                    >
                      <Badge className="bg-orange-500 text-black animate-pulse">
                        {cart.length}
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-orange-600/20 to-red-600/20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/60"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Premium RUST Store
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Получите лучшие внутриигровые предметы и привилегии
          </motion.p>
          
          <motion.div 
            className="glassmorphism rounded-xl p-6 mb-8 bg-white/5 backdrop-blur-md border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-sm text-orange-400 mb-4 flex items-center justify-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Бонусы при пополнении:</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { amount: "500₽", bonus: "+10%" },
                { amount: "1000₽", bonus: "+20%" },
                { amount: "2000₽", bonus: "+30%" },
                { amount: "5000₽", bonus: "+40%" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="glassmorphism rounded-lg p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-white font-semibold">от {item.amount}</div>
                  <div className="text-orange-400 font-bold">{item.bonus}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Server Selection */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Server className="w-6 h-6 text-orange-500" />
            <span>Выберите сервер:</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {servers.map(server => (
              <motion.div
                key={server.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  variant={selectedServer === server.id ? "default" : "outline"}
                  className={`w-full h-auto p-4 glassmorphism border-2 transition-all duration-300 ${
                    selectedServer === server.id 
                      ? `${getServerColor(server.id)} border-white/30 shadow-lg` 
                      : 'border-gray-600/50 bg-white/5 backdrop-blur-md hover:border-orange-500/50'
                  }`}
                  onClick={() => setSelectedServer(server.id)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="font-bold text-lg">{server.name}</div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        {server.players}/{server.maxPlayers}
                      </Badge>
                      <Badge variant="outline" className="border-gray-500/50 text-gray-400">
                        {server.ping}ms
                      </Badge>
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="mt-6 p-4 glassmorphism bg-yellow-900/20 backdrop-blur-md border border-yellow-600/30 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <p className="text-yellow-400 text-sm flex items-start space-x-2">
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                ⚠️ Внимание! Перед покупкой привилегий необходимо выбрать сервер, на котором вы играете. 
                Помните, что купленная привилегия будет активирована на выбранном сервере сразу после покупки.
              </span>
            </p>
          </motion.div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { id: 'all', name: 'Все', icon: Package },
              { id: 'privileges', name: 'Привилегии', icon: Star },
              { id: 'items', name: 'Предметы', icon: Package },
              { id: 'weapons', name: 'Оружие', icon: Zap },
              { id: 'armor', name: 'Броня', icon: Shield }
            ].map(category => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`glassmorphism border-2 transition-all duration-300 ${
                    selectedCategory === category.id 
                      ? 'bg-orange-500 text-black border-orange-400 shadow-lg' 
                      : 'border-gray-600/50 bg-white/5 backdrop-blur-md text-white hover:border-orange-500/50'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="wait">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glassmorphism bg-gray-800/30 backdrop-blur-md border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 group relative overflow-hidden">
                  {product.popular && (
                    <motion.div
                      className="absolute top-2 right-2 z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-black font-bold">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Популярный
                      </Badge>
                    </motion.div>
                  )}
                  {product.discount && (
                    <motion.div
                      className="absolute top-2 left-2 z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-black font-bold">
                        -{product.discount}%
                      </Badge>
                    </motion.div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-3 overflow-hidden relative">
                      <motion.img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-orange-400 transition-colors">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-orange-500">
                          {product.price} RUB
                        </span>
                        {product.discount && (
                          <span className="text-sm text-gray-500 line-through">
                            {Math.round(product.price * (1 + product.discount / 100))} RUB
                          </span>
                        )}
                      </div>
                      {product.category === 'privileges' && (
                        <Badge variant="secondary" className="bg-purple-600/20 text-purple-400 border-purple-500/30">
                          <Clock className="w-3 h-3 mr-1" />
                          {product.duration}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="outline" className="w-full glassmorphism border-orange-500/50 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-black transition-all duration-300">
                              <Package className="w-4 h-4 mr-2" />
                              Подробнее
                            </Button>
                          </motion.div>
                        </DialogTrigger>
                        <DialogContent className="glassmorphism bg-gray-900/90 backdrop-blur-xl border-gray-700/50 text-white max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                              {product.name}
                            </DialogTitle>
                            <DialogDescription className="text-gray-400 text-base">
                              {product.description}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="glassmorphism bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
                              <h4 className="font-semibold mb-3 text-orange-400 flex items-center space-x-2">
                                <Gift className="w-4 h-4" />
                                <span>Содержимое пакета:</span>
                              </h4>
                              <ul className="space-y-2 text-sm">
                                {product.features.map((feature, idx) => (
                                  <motion.li 
                                    key={idx} 
                                    className="flex items-center space-x-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                  >
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                              <div className="flex flex-col">
                                <span className="text-2xl font-bold text-orange-500">
                                  {product.price} RUB
                                </span>
                                {product.discount && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {Math.round(product.price * (1 + product.discount / 100))} RUB
                                  </span>
                                )}
                              </div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg"
                                  onClick={() => addToCart(product)}
                                >
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Купить сейчас
                                </Button>
                              </motion.div>
                            </div>
                            <p className="text-xs text-yellow-400 text-center glassmorphism bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                              <Shield className="w-4 h-4 inline mr-1" />
                              ⚠️ Активация на выбранном сервере сразу после покупки!
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg"
                          onClick={() => addToCart(product)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          В корзину
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show message when no products match filter */}
        {filteredProducts.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400 text-lg">Товары в данной категории не найдены.</p>
          </motion.div>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <motion.div
            className="fixed bottom-4 right-4 z-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="glassmorphism bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-lg p-4 shadow-2xl">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold">{cart.length} товаров</span>
                </div>
                <div className="text-xl font-bold text-orange-500">
                  {getTotalPrice()} RUB
                </div>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold">
                  Оформить заказ
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="glassmorphism bg-black/30 backdrop-blur-xl border-t border-gray-700/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p>Информация, размещенная на данном сайте, носит информационный характер и ни при каких условиях не является публичной офертой, определяемой положениями части 2 статьи 437 Гражданского кодекса Российской Федерации.</p>
            <p className="mt-2">© 2025 RUST Store. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

