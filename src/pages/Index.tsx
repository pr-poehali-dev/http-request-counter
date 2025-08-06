import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Icon from '@/components/ui/icon'
import TelegramNotifications from '@/components/TelegramNotifications'

interface HTTPStats {
  totalRequests: number
  httpRequests: number
  httpsRequests: number
  responseTime: number
  uptime: number
  successRate: number
  methodStats: {
    GET: number
    POST: number
    PUT: number
    DELETE: number
  }
}

const Index = () => {
  const [stats, setStats] = useState<HTTPStats>({
    totalRequests: 38226,
    httpRequests: 15420,
    httpsRequests: 22806,
    responseTime: 125,
    uptime: 99.8,
    successRate: 98.5,
    methodStats: {
      GET: 18500,
      POST: 12400,
      PUT: 4826,
      DELETE: 2500
    }
  })

  const [selectedMethod, setSelectedMethod] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analytics' | 'notifications'>('dashboard')
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for the graph
  const graphData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    requests: Math.floor(Math.random() * 500) + 1500,
    methods: {
      GET: Math.floor(Math.random() * 200) + 400,
      POST: Math.floor(Math.random() * 150) + 300,
      PUT: Math.floor(Math.random() * 100) + 150,
      DELETE: Math.floor(Math.random() * 50) + 50
    }
  }))

  const maxRequests = Math.max(...graphData.map(d => d.requests))

  // Filter data based on selected method
  const filteredStats = selectedMethod === 'ALL' ? stats : {
    ...stats,
    totalRequests: stats.methodStats[selectedMethod as keyof typeof stats.methodStats]
  }

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      // In production, this would fetch from 179.43.155.85
      // const response = await fetch('http://179.43.155.85/api/stats')
      // const data = await response.json()
      
      // Mock update for demo
      setTimeout(() => {
        setStats(prev => ({
          ...prev,
          totalRequests: prev.totalRequests + Math.floor(Math.random() * 100),
          httpRequests: prev.httpRequests + Math.floor(Math.random() * 50),
          httpsRequests: prev.httpsRequests + Math.floor(Math.random() * 50),
          responseTime: Math.floor(Math.random() * 50) + 100,
          methodStats: {
            GET: prev.methodStats.GET + Math.floor(Math.random() * 30),
            POST: prev.methodStats.POST + Math.floor(Math.random() * 25),
            PUT: prev.methodStats.PUT + Math.floor(Math.random() * 15),
            DELETE: prev.methodStats.DELETE + Math.floor(Math.random() * 10)
          }
        }))
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // Analytics page component
  const AnalyticsPage = () => (
    <div className="space-y-8">
      {/* Detailed Method Breakdown */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="PieChart" size={20} className="mr-2 text-primary" />
            Детальная статистика по методам
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(stats.methodStats).map(([method, count]) => {
              const colors = {
                GET: 'text-blue-500 bg-blue-500/20 border-blue-500',
                POST: 'text-green-500 bg-green-500/20 border-green-500',
                PUT: 'text-orange-500 bg-orange-500/20 border-orange-500',
                DELETE: 'text-red-500 bg-red-500/20 border-red-500'
              }
              const percentage = Math.round((count / stats.totalRequests) * 100)
              
              return (
                <div key={method} className="text-center space-y-2">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${colors[method as keyof typeof colors]}`}>
                    {method}
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {count.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {percentage}% от общего
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${colors[method as keyof typeof colors].includes('blue') ? 'bg-blue-500' : 
                        colors[method as keyof typeof colors].includes('green') ? 'bg-green-500' :
                        colors[method as keyof typeof colors].includes('orange') ? 'bg-orange-500' : 'bg-red-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Response Time Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="Clock" size={20} className="mr-2 text-primary" />
              Время отклика по методам
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.methodStats).map(([method, count]) => {
              const avgTime = Math.floor(Math.random() * 100) + 50
              const colors = {
                GET: 'bg-blue-500',
                POST: 'bg-green-500',
                PUT: 'bg-orange-500',
                DELETE: 'bg-red-500'
              }
              
              return (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded ${colors[method as keyof typeof colors]}`} />
                    <span className="font-medium">{method}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-foreground font-medium">{avgTime}ms</span>
                    <span className="text-muted-foreground ml-2">среднее</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="AlertTriangle" size={20} className="mr-2 text-primary" />
              Статус коды
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="font-medium">2xx Success</span>
              </div>
              <div className="text-sm">
                <span className="text-green-500 font-medium">89.2%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-orange-500" />
                <span className="font-medium">4xx Client Error</span>
              </div>
              <div className="text-sm">
                <span className="text-orange-500 font-medium">8.1%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="font-medium">5xx Server Error</span>
              </div>
              <div className="text-sm">
                <span className="text-red-500 font-medium">2.7%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="Globe2" size={20} className="mr-2 text-primary" />
            Географическое распределение запросов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { country: 'Россия', requests: 15420, percentage: 40.3 },
              { country: 'США', requests: 9567, percentage: 25.0 },
              { country: 'Германия', requests: 6834, percentage: 17.9 },
              { country: 'Китай', requests: 4205, percentage: 11.0 },
              { country: 'Другие', requests: 2200, percentage: 5.8 }
            ].map((country) => (
              <div key={country.country} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{country.country}</span>
                  <span className="text-sm text-muted-foreground">{country.percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${country.percentage}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {country.requests.toLocaleString()} запросов
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              HTTP Monitoring Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Professional Layer 4 & Layer 7 Data Monitoring
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-accent/20 text-accent border-accent">
              <Icon name="Wifi" size={16} className="mr-2" />
              Backend: 179.43.155.85
            </Badge>
            
            <Button 
              onClick={fetchStats}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Icon name="RefreshCw" size={16} className="mr-2 animate-spin" />
              ) : (
                <Icon name="RefreshCw" size={16} className="mr-2" />
              )}
              Обновить
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Tabs value={currentPage} onValueChange={(value) => setCurrentPage(value as 'dashboard' | 'analytics' | 'notifications')}>
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Icon name="BarChart3" size={16} className="mr-2" />
                Обзор
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Icon name="TrendingUp" size={16} className="mr-2" />
                Аналитика
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Icon name="Bell" size={16} className="mr-2" />
                Уведомления
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* HTTP Method Filter */}
          <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="ALL" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                Все
              </TabsTrigger>
              <TabsTrigger value="GET" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                GET
              </TabsTrigger>
              <TabsTrigger value="POST" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                POST
              </TabsTrigger>
              <TabsTrigger value="PUT" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                PUT
              </TabsTrigger>
              <TabsTrigger value="DELETE" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                DELETE
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Conditional Page Rendering */}
        {currentPage === 'analytics' ? <AnalyticsPage /> : 
         currentPage === 'notifications' ? <TelegramNotifications /> : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total/Filtered Requests */}
              <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Icon name="BarChart3" size={16} className="mr-2 text-primary" />
                    {selectedMethod === 'ALL' ? 'Общие запросы' : `${selectedMethod} запросы`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {filteredStats.totalRequests.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-accent">+{Math.floor(Math.random() * 500)}</span> за последний час
                  </p>
                </CardContent>
              </Card>

              {/* HTTP Methods Breakdown (only show when ALL is selected) */}
              {selectedMethod === 'ALL' && (
                <>
                  <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                        <Icon name="Globe" size={16} className="mr-2 text-orange-500" />
                        HTTP запросы
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-500">
                        {stats.httpRequests.toLocaleString()}
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="bg-orange-500/20 text-orange-500 px-2 py-1 rounded text-xs">
                          {Math.round((stats.httpRequests / stats.totalRequests) * 100)}%
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                        <Icon name="Shield" size={16} className="mr-2 text-accent" />
                        HTTPS запросы
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-accent">
                        {stats.httpsRequests.toLocaleString()}
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="bg-accent/20 text-accent px-2 py-1 rounded text-xs">
                          {Math.round((stats.httpsRequests / stats.totalRequests) * 100)}%
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Method-specific cards when filter is applied */}
              {selectedMethod !== 'ALL' && (
                <>
                  <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                        <Icon name="Percent" size={16} className="mr-2 text-blue-500" />
                        Доля от общих
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-500">
                        {Math.round((stats.methodStats[selectedMethod as keyof typeof stats.methodStats] / stats.totalRequests) * 100)}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Процент {selectedMethod} запросов
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                        <Icon name="Activity" size={16} className="mr-2 text-purple-500" />
                        Средняя нагрузка
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-500">
                        {Math.floor(stats.methodStats[selectedMethod as keyof typeof stats.methodStats] / 24)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        запросов в час
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Response Time */}
              <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Icon name="Zap" size={16} className="mr-2 text-yellow-500" />
                    Время отклика
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-500">
                    {stats.responseTime}ms
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Среднее время ответа
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* Traffic Graph */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="TrendingUp" size={20} className="mr-2 text-primary" />
                  График трафика (24 часа) {selectedMethod !== 'ALL' && `- ${selectedMethod}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full relative">
                  
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground py-4">
                    <span>{maxRequests}</span>
                    <span>{Math.floor(maxRequests * 0.75)}</span>
                    <span>{Math.floor(maxRequests * 0.5)}</span>
                    <span>{Math.floor(maxRequests * 0.25)}</span>
                    <span>0</span>
                  </div>

                  {/* Graph area */}
                  <div className="ml-12 h-full relative">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      
                      {/* Grid lines */}
                      <defs>
                        <pattern id="grid" width="4.17" height="25" patternUnits="userSpaceOnUse">
                          <path d="M 4.17 0 L 0 0 0 25" fill="none" stroke="hsl(var(--border))" strokeWidth="0.1"/>
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#grid)" />
                      
                      {/* Area under curve */}
                      <path
                        d={`M 0 100 ${graphData.map((d, i) => {
                          const value = selectedMethod === 'ALL' ? d.requests : d.methods[selectedMethod as keyof typeof d.methods]
                          return `L ${(i / (graphData.length - 1)) * 100} ${100 - (value / maxRequests) * 100}`
                        }).join(' ')} L 100 100 Z`}
                        fill="url(#gradient)"
                        className="animate-pulse"
                      />
                      
                      {/* Main line */}
                      <path
                        d={`M ${graphData.map((d, i) => {
                          const value = selectedMethod === 'ALL' ? d.requests : d.methods[selectedMethod as keyof typeof d.methods]
                          return `${(i / (graphData.length - 1)) * 100} ${100 - (value / maxRequests) * 100}`
                        }).join(' L ')}`}
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="0.5"
                        className="animate-pulse"
                      />

                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-12 right-0 flex justify-between text-xs text-muted-foreground">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>24:00</span>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Server Status */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="Server" size={20} className="mr-2 text-primary" />
                    Статус сервера
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Аптайм</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                      <span className="font-medium text-accent">{stats.uptime}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Успешные запросы</span>
                    <span className="font-medium text-accent">{stats.successRate}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Статус</span>
                    <Badge className="bg-accent/20 text-accent border-accent">
                      <Icon name="CheckCircle" size={14} className="mr-1" />
                      Онлайн
                    </Badge>
                  </div>

                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="Settings" size={20} className="mr-2 text-primary" />
                    Быстрые действия
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-border hover:border-primary/50"
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Экспорт данных
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-border hover:border-primary/50"
                    onClick={() => setCurrentPage('notifications')}
                  >
                    <Icon name="Bell" size={16} className="mr-2" />
                    Настроить уведомления
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-border hover:border-primary/50"
                    onClick={() => setCurrentPage('analytics')}
                  >
                    <Icon name="BarChart2" size={16} className="mr-2" />
                    Подробная аналитика
                  </Button>

                </CardContent>
              </Card>

            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default Index