import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

interface HTTPStats {
  totalRequests: number
  httpRequests: number
  httpsRequests: number
  responseTime: number
  uptime: number
  successRate: number
}

const Index = () => {
  const [stats, setStats] = useState<HTTPStats>({
    totalRequests: 38226,
    httpRequests: 15420,
    httpsRequests: 22806,
    responseTime: 125,
    uptime: 99.8,
    successRate: 98.5
  })

  const [isLoading, setIsLoading] = useState(false)

  // Mock data for the graph
  const graphData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    requests: Math.floor(Math.random() * 500) + 1500
  }))

  const maxRequests = Math.max(...graphData.map(d => d.requests))

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
          responseTime: Math.floor(Math.random() * 50) + 100
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Requests */}
          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Icon name="BarChart3" size={16} className="mr-2 text-primary" />
                Общие запросы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {stats.totalRequests.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-accent">+{Math.floor(Math.random() * 500)}</span> за последний час
              </p>
            </CardContent>
          </Card>

          {/* HTTP Requests */}
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

          {/* HTTPS Requests */}
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
              График трафика (24 часа)
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
                    d={`M 0 100 ${graphData.map((d, i) => 
                      `L ${(i / (graphData.length - 1)) * 100} ${100 - (d.requests / maxRequests) * 100}`
                    ).join(' ')} L 100 100 Z`}
                    fill="url(#gradient)"
                    className="animate-pulse"
                  />
                  
                  {/* Main line */}
                  <path
                    d={`M ${graphData.map((d, i) => 
                      `${(i / (graphData.length - 1)) * 100} ${100 - (d.requests / maxRequests) * 100}`
                    ).join(' L ')}`}
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
              >
                <Icon name="Bell" size={16} className="mr-2" />
                Настроить уведомления
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start border-border hover:border-primary/50"
              >
                <Icon name="BarChart2" size={16} className="mr-2" />
                Подробная аналитика
              </Button>

            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  )
}

export default Index