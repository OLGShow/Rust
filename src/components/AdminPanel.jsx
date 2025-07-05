import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Package, 
  Server, 
  TrendingUp, 
  Users,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  BarChart3,
  ShoppingCart,
  Crown,
  Shield,
  Sword,
  AlertTriangle,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const AdminPanel = ({ products, servers, onProductUpdate, onServerUpdate, steamUser }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingServer, setEditingServer] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 15420,
    totalOrders: 89,
    totalUsers: 234,
    conversionRate: 3.8
  });

  // Проверка прав администратора
  const isAdmin = steamUser?.steamId === '76561198000000000' || 
                  steamUser?.userInfo?.personaname === 'Admin'; // Демо проверка

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: 'privileges',
    description: '',
    features: [''],
    duration: '',
    popular: false,
    discount: 0
  });

  const categoryIcons = {
    privileges: Crown,
    items: Package,
    weapons: Sword,
    armor: Shield
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    } else {
      const product = {
        ...newProduct,
        id: Date.now(),
        features: newProduct.features.filter(f => f.trim() !== '')
      };
      onProductUpdate(product);
      setIsAddingProduct(false);
      setNewProduct({
        name: '',
        price: 0,
        category: 'privileges',
        description: '',
        features: [''],
        duration: '',
        popular: false,
        discount: 0
      });
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      onProductUpdate({ id: productId, deleted: true });
    }
  };

  const addFeature = (features, setFeatures) => {
    setFeatures([...features, '']);
  };

  const removeFeature = (features, setFeatures, index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (features, setFeatures, index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  if (!isAdmin) {
    return (
      <Card className="glass-effect border-white/10 max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Доступ запрещен</h3>
          <p className="text-gray-400">
            У вас нет прав администратора для доступа к панели управления.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Settings className="h-6 w-6 text-orange-400" />
            <span>Панель администратора</span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-effect border-white/10 hover:border-orange-500/30 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Общие продажи</p>
                <p className="text-2xl font-bold text-orange-400">{stats.totalSales}₽</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10 hover:border-green-500/30 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Заказы</p>
                <p className="text-2xl font-bold text-green-400">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10 hover:border-blue-500/30 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Пользователи</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10 hover:border-purple-500/30 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Конверсия</p>
                <p className="text-2xl font-bold text-purple-400">{stats.conversionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
          <TabsTrigger 
            value="products" 
            className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Package className="h-4 w-4" />
            <span>Товары</span>
          </TabsTrigger>
          <TabsTrigger 
            value="servers" 
            className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Server className="h-4 w-4" />
            <span>Серверы</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Аналитика</span>
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Управление товарами</h3>
            <Button 
              onClick={() => setIsAddingProduct(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить товар
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => {
              const Icon = categoryIcons[product.category] || Package;
              return (
                <Card key={product.id} className="glass-effect border-white/10 hover:border-orange-500/30 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-orange-400" />
                        <div>
                          <CardTitle className="text-white text-sm">{product.name}</CardTitle>
                          <p className="text-gray-400 text-xs">{product.category}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingProduct(product)}
                          className="h-6 w-6 p-0 hover:bg-blue-500/20"
                        >
                          <Edit3 className="h-3 w-3 text-blue-400" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="h-6 w-6 p-0 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3 w-3 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-orange-400 font-bold">{product.price}₽</span>
                        {product.popular && (
                          <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                            Популярный
                          </Badge>
                        )}
                      </div>
                      {product.discount > 0 && (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">
                          -{product.discount}% скидка
                        </Badge>
                      )}
                      <p className="text-gray-400 text-xs">{product.description}</p>
                      <div className="text-xs text-gray-500">
                        Длительность: {product.duration}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Servers Tab */}
        <TabsContent value="servers" className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Управление серверами</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servers.map((server) => (
              <Card key={server.id} className="glass-effect border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        server.status === 'online' ? 'bg-green-500' : 
                        server.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <h4 className="font-medium text-white">{server.name}</h4>
                        <p className="text-sm text-gray-400">
                          {server.players}/{server.maxPlayers} игроков
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Пинг: {server.ping}ms</div>
                      <Badge className={`text-xs ${
                        server.status === 'online' ? 'bg-green-500/20 text-green-400' :
                        server.status === 'maintenance' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {server.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Аналитика продаж</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-sm">Популярные товары</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {products
                  .filter(p => p.popular)
                  .slice(0, 5)
                  .map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-400 text-sm">#{index + 1}</span>
                        <span className="text-white text-sm">{product.name}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{product.price}₽</span>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-sm">Статистика по категориям</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['privileges', 'items', 'weapons', 'armor'].map((category) => {
                  const count = products.filter(p => p.category === category).length;
                  const Icon = categoryIcons[category];
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4 text-orange-400" />
                        <span className="text-white text-sm capitalize">{category}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{count} товаров</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Product Modal */}
      <Dialog open={isAddingProduct || !!editingProduct} onOpenChange={(open) => {
        if (!open) {
          setIsAddingProduct(false);
          setEditingProduct(null);
        }
      }}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Редактировать товар' : 'Добавить новый товар'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Product Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Название</label>
                <input
                  type="text"
                  className="w-full p-2 bg-white/5 border border-white/20 rounded text-white"
                  value={editingProduct?.name || newProduct.name}
                  onChange={(e) => {
                    if (editingProduct) {
                      setEditingProduct({...editingProduct, name: e.target.value});
                    } else {
                      setNewProduct({...newProduct, name: e.target.value});
                    }
                  }}
                  placeholder="Название товара"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Цена (₽)</label>
                <input
                  type="number"
                  className="w-full p-2 bg-white/5 border border-white/20 rounded text-white"
                  value={editingProduct?.price || newProduct.price}
                  onChange={(e) => {
                    const price = parseFloat(e.target.value) || 0;
                    if (editingProduct) {
                      setEditingProduct({...editingProduct, price});
                    } else {
                      setNewProduct({...newProduct, price});
                    }
                  }}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Категория</label>
                <select
                  className="w-full p-2 bg-white/5 border border-white/20 rounded text-white"
                  value={editingProduct?.category || newProduct.category}
                  onChange={(e) => {
                    if (editingProduct) {
                      setEditingProduct({...editingProduct, category: e.target.value});
                    } else {
                      setNewProduct({...newProduct, category: e.target.value});
                    }
                  }}
                >
                  <option value="privileges">Привилегии</option>
                  <option value="items">Предметы</option>
                  <option value="weapons">Оружие</option>
                  <option value="armor">Броня</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Длительность</label>
                <input
                  type="text"
                  className="w-full p-2 bg-white/5 border border-white/20 rounded text-white"
                  value={editingProduct?.duration || newProduct.duration}
                  onChange={(e) => {
                    if (editingProduct) {
                      setEditingProduct({...editingProduct, duration: e.target.value});
                    } else {
                      setNewProduct({...newProduct, duration: e.target.value});
                    }
                  }}
                  placeholder="6 days, Permanent, 1 use"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Описание</label>
              <textarea
                className="w-full p-2 bg-white/5 border border-white/20 rounded text-white h-20"
                value={editingProduct?.description || newProduct.description}
                onChange={(e) => {
                  if (editingProduct) {
                    setEditingProduct({...editingProduct, description: e.target.value});
                  } else {
                    setNewProduct({...newProduct, description: e.target.value});
                  }
                }}
                placeholder="Описание товара"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Особенности</label>
              {(editingProduct?.features || newProduct.features).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 p-2 bg-white/5 border border-white/20 rounded text-white"
                    value={feature}
                    onChange={(e) => {
                      if (editingProduct) {
                        updateFeature(editingProduct.features, 
                          (features) => setEditingProduct({...editingProduct, features}), 
                          index, e.target.value);
                      } else {
                        updateFeature(newProduct.features, 
                          (features) => setNewProduct({...newProduct, features}), 
                          index, e.target.value);
                      }
                    }}
                    placeholder="Особенность товара"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (editingProduct) {
                        removeFeature(editingProduct.features, 
                          (features) => setEditingProduct({...editingProduct, features}), 
                          index);
                      } else {
                        removeFeature(newProduct.features, 
                          (features) => setNewProduct({...newProduct, features}), 
                          index);
                      }
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-500/20"
                  >
                    <X className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (editingProduct) {
                    addFeature(editingProduct.features, 
                      (features) => setEditingProduct({...editingProduct, features}));
                  } else {
                    addFeature(newProduct.features, 
                      (features) => setNewProduct({...newProduct, features}));
                  }
                }}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Plus className="h-4 w-4 mr-1" />
                Добавить особенность
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Скидка (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full p-2 bg-white/5 border border-white/20 rounded text-white"
                  value={editingProduct?.discount || newProduct.discount}
                  onChange={(e) => {
                    const discount = parseInt(e.target.value) || 0;
                    if (editingProduct) {
                      setEditingProduct({...editingProduct, discount});
                    } else {
                      setNewProduct({...newProduct, discount});
                    }
                  }}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="popular"
                  className="w-4 h-4"
                  checked={editingProduct?.popular || newProduct.popular}
                  onChange={(e) => {
                    if (editingProduct) {
                      setEditingProduct({...editingProduct, popular: e.target.checked});
                    } else {
                      setNewProduct({...newProduct, popular: e.target.checked});
                    }
                  }}
                />
                <label htmlFor="popular" className="text-sm text-gray-400">
                  Популярный товар
                </label>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                onClick={handleSaveProduct}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                }}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <X className="h-4 w-4 mr-2" />
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel; 