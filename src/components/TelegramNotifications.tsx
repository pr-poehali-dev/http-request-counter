import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Icon from '@/components/ui/icon'

interface TelegramConfig {
  botToken: string
  chatId: string
  isEnabled: boolean
  isConnected: boolean
}

interface AlertConfig {
  responseTimeLimit: number
  requestsPerMinuteLimit: number
  errorRateLimit: number
  uptimeThreshold: number
  enabledAlerts: {
    responseTime: boolean
    highTraffic: boolean
    errorRate: boolean
    downtime: boolean
    methodAnomalies: boolean
  }
}

const TelegramNotifications = () => {
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>({
    botToken: '',
    chatId: '',
    isEnabled: false,
    isConnected: false
  })

  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    responseTimeLimit: 1000,
    requestsPerMinuteLimit: 10000,
    errorRateLimit: 5,
    uptimeThreshold: 95,
    enabledAlerts: {
      responseTime: true,
      highTraffic: true,
      errorRate: true,
      downtime: true,
      methodAnomalies: false
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  // Test Telegram bot connection
  const testTelegramConnection = async () => {
    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      setStatusMessage('Заполните токен бота и Chat ID')
      setTestStatus('error')
      return
    }

    setIsLoading(true)
    setTestStatus('idle')

    try {
      // In production, this would test the actual Telegram API
      // const response = await fetch(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     chat_id: telegramConfig.chatId,
      //     text: '🚀 Тестовое сообщение от HTTP Monitoring Dashboard'
      //   })
      // })

      // Mock success for demo
      setTimeout(() => {
        setTelegramConfig(prev => ({ ...prev, isConnected: true }))
        setTestStatus('success')
        setStatusMessage('Соединение с Telegram установлено успешно!')
        setIsLoading(false)
      }, 2000)

    } catch (error) {
      setTestStatus('error')
      setStatusMessage('Ошибка подключения к Telegram API')
      setIsLoading(false)
    }
  }

  // Send notification function (would be called by monitoring logic)
  const sendNotification = async (message: string, type: 'warning' | 'critical' | 'info') => {
    if (!telegramConfig.isEnabled || !telegramConfig.isConnected) return

    const emojis = {
      warning: '⚠️',
      critical: '🚨',
      info: 'ℹ️'
    }

    const fullMessage = `${emojis[type]} HTTP Monitor Alert\n\n${message}\n\n📊 Dashboard: ${window.location.origin}`

    try {
      // In production:
      // await fetch(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     chat_id: telegramConfig.chatId,
      //     text: fullMessage,
      //     parse_mode: 'Markdown'
      //   })
      // })
      console.log('Notification sent:', fullMessage)
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  // Mock alert checks (in production, this would be called by monitoring service)
  useEffect(() => {
    if (!telegramConfig.isEnabled) return

    const checkAlerts = () => {
      // Mock some alert conditions for demo
      const mockStats = {
        responseTime: Math.floor(Math.random() * 2000) + 100,
        requestsPerMinute: Math.floor(Math.random() * 15000) + 5000,
        errorRate: Math.random() * 10,
        uptime: 99.8
      }

      // Check response time
      if (alertConfig.enabledAlerts.responseTime && mockStats.responseTime > alertConfig.responseTimeLimit) {
        sendNotification(
          `Превышено время отклика: ${mockStats.responseTime}ms (лимит: ${alertConfig.responseTimeLimit}ms)`,
          'warning'
        )
      }

      // Check high traffic
      if (alertConfig.enabledAlerts.highTraffic && mockStats.requestsPerMinute > alertConfig.requestsPerMinuteLimit) {
        sendNotification(
          `Высокая нагрузка: ${mockStats.requestsPerMinute} запросов/мин (лимит: ${alertConfig.requestsPerMinuteLimit})`,
          'warning'
        )
      }

      // Check error rate
      if (alertConfig.enabledAlerts.errorRate && mockStats.errorRate > alertConfig.errorRateLimit) {
        sendNotification(
          `Высокий уровень ошибок: ${mockStats.errorRate.toFixed(1)}% (лимит: ${alertConfig.errorRateLimit}%)`,
          'critical'
        )
      }
    }

    const interval = setInterval(checkAlerts, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [telegramConfig.isEnabled, alertConfig])

  return (
    <div className="space-y-6">
      
      {/* Telegram Bot Configuration */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="MessageCircle" size={20} className="text-blue-500" />
            Настройка Telegram бота
            {telegramConfig.isConnected && (
              <Badge className="bg-green-500/20 text-green-500 border-green-500">
                <Icon name="CheckCircle" size={14} className="mr-1" />
                Подключен
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <Alert className="bg-blue-500/10 border-blue-500/20">
            <Icon name="Info" size={16} />
            <AlertDescription className="text-sm">
              <strong>Как настроить:</strong><br />
              1. Создайте бота через @BotFather в Telegram<br />
              2. Получите токен бота и добавьте его ниже<br />
              3. Найдите ваш Chat ID через @userinfobot<br />
              4. Протестируйте соединение
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="botToken">Токен бота</Label>
              <Input
                id="botToken"
                type="password"
                placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                value={telegramConfig.botToken}
                onChange={(e) => setTelegramConfig(prev => ({ ...prev, botToken: e.target.value }))}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chatId">Chat ID</Label>
              <Input
                id="chatId"
                placeholder="123456789"
                value={telegramConfig.chatId}
                onChange={(e) => setTelegramConfig(prev => ({ ...prev, chatId: e.target.value }))}
                className="font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableTelegram"
                checked={telegramConfig.isEnabled}
                onCheckedChange={(checked) => setTelegramConfig(prev => ({ ...prev, isEnabled: checked }))}
              />
              <Label htmlFor="enableTelegram">Включить уведомления</Label>
            </div>
            
            <Button 
              onClick={testTelegramConnection}
              disabled={isLoading || !telegramConfig.botToken || !telegramConfig.chatId}
              variant="outline"
              className="border-border hover:border-primary/50"
            >
              {isLoading ? (
                <Icon name="RefreshCw" size={16} className="mr-2 animate-spin" />
              ) : (
                <Icon name="Send" size={16} className="mr-2" />
              )}
              Тест соединения
            </Button>
          </div>

          {testStatus !== 'idle' && (
            <Alert className={testStatus === 'success' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}>
              <Icon name={testStatus === 'success' ? 'CheckCircle' : 'AlertCircle'} size={16} />
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>

      {/* Alert Configuration */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Bell" size={20} className="text-orange-500" />
            Настройка алертов
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Alert Types */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Типы уведомлений</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="Zap" size={16} className="text-yellow-500" />
                  <div>
                    <p className="font-medium">Время отклика</p>
                    <p className="text-sm text-muted-foreground">При превышении лимита</p>
                  </div>
                </div>
                <Switch
                  checked={alertConfig.enabledAlerts.responseTime}
                  onCheckedChange={(checked) => setAlertConfig(prev => ({
                    ...prev,
                    enabledAlerts: { ...prev.enabledAlerts, responseTime: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="TrendingUp" size={16} className="text-blue-500" />
                  <div>
                    <p className="font-medium">Высокий трафик</p>
                    <p className="text-sm text-muted-foreground">При превышении нагрузки</p>
                  </div>
                </div>
                <Switch
                  checked={alertConfig.enabledAlerts.highTraffic}
                  onCheckedChange={(checked) => setAlertConfig(prev => ({
                    ...prev,
                    enabledAlerts: { ...prev.enabledAlerts, highTraffic: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="AlertTriangle" size={16} className="text-red-500" />
                  <div>
                    <p className="font-medium">Уровень ошибок</p>
                    <p className="text-sm text-muted-foreground">При росте ошибок 4xx/5xx</p>
                  </div>
                </div>
                <Switch
                  checked={alertConfig.enabledAlerts.errorRate}
                  onCheckedChange={(checked) => setAlertConfig(prev => ({
                    ...prev,
                    enabledAlerts: { ...prev.enabledAlerts, errorRate: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="WifiOff" size={16} className="text-purple-500" />
                  <div>
                    <p className="font-medium">Недоступность</p>
                    <p className="text-sm text-muted-foreground">При падении аптайма</p>
                  </div>
                </div>
                <Switch
                  checked={alertConfig.enabledAlerts.downtime}
                  onCheckedChange={(checked) => setAlertConfig(prev => ({
                    ...prev,
                    enabledAlerts: { ...prev.enabledAlerts, downtime: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between md:col-span-2">
                <div className="flex items-center space-x-3">
                  <Icon name="Activity" size={16} className="text-green-500" />
                  <div>
                    <p className="font-medium">Аномалии методов</p>
                    <p className="text-sm text-muted-foreground">При резких изменениях HTTP методов</p>
                  </div>
                </div>
                <Switch
                  checked={alertConfig.enabledAlerts.methodAnomalies}
                  onCheckedChange={(checked) => setAlertConfig(prev => ({
                    ...prev,
                    enabledAlerts: { ...prev.enabledAlerts, methodAnomalies: checked }
                  }))}
                />
              </div>

            </div>
          </div>

          <Separator />

          {/* Alert Thresholds */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Пороговые значения</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <Label htmlFor="responseTimeLimit">Время отклика (мс)</Label>
                <Input
                  id="responseTimeLimit"
                  type="number"
                  value={alertConfig.responseTimeLimit}
                  onChange={(e) => setAlertConfig(prev => ({ ...prev, responseTimeLimit: parseInt(e.target.value) || 0 }))}
                  className="text-center"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestsLimit">Запросов в минуту</Label>
                <Input
                  id="requestsLimit"
                  type="number"
                  value={alertConfig.requestsPerMinuteLimit}
                  onChange={(e) => setAlertConfig(prev => ({ ...prev, requestsPerMinuteLimit: parseInt(e.target.value) || 0 }))}
                  className="text-center"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="errorRateLimit">Уровень ошибок (%)</Label>
                <Input
                  id="errorRateLimit"
                  type="number"
                  step="0.1"
                  value={alertConfig.errorRateLimit}
                  onChange={(e) => setAlertConfig(prev => ({ ...prev, errorRateLimit: parseFloat(e.target.value) || 0 }))}
                  className="text-center"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uptimeThreshold">Минимальный аптайм (%)</Label>
                <Input
                  id="uptimeThreshold"
                  type="number"
                  step="0.1"
                  value={alertConfig.uptimeThreshold}
                  onChange={(e) => setAlertConfig(prev => ({ ...prev, uptimeThreshold: parseFloat(e.target.value) || 0 }))}
                  className="text-center"
                />
              </div>

            </div>
          </div>

          <Separator />

          {/* Test Notification */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Тестовое уведомление</h4>
              <p className="text-sm text-muted-foreground">Отправить пробное сообщение в Telegram</p>
            </div>
            
            <Button 
              onClick={() => sendNotification('Это тестовое уведомление от HTTP Monitoring Dashboard', 'info')}
              disabled={!telegramConfig.isEnabled || !telegramConfig.isConnected}
              variant="outline"
              className="border-border hover:border-primary/50"
            >
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Отправить тест
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="History" size={20} className="text-green-500" />
            Последние уведомления
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            
            {/* Mock recent notifications */}
            {[
              { time: '2 мин назад', message: 'Превышено время отклика: 1250ms', type: 'warning' },
              { time: '15 мин назад', message: 'Сервер восстановлен. Аптайм: 99.8%', type: 'info' },
              { time: '1 час назад', message: 'Высокая нагрузка: 12000 запросов/мин', type: 'warning' },
              { time: '3 часа назад', message: 'Тест соединения с Telegram успешен', type: 'info' }
            ].map((notification, index) => {
              const colors = {
                warning: 'text-orange-500 bg-orange-500/10',
                info: 'text-blue-500 bg-blue-500/10',
                critical: 'text-red-500 bg-red-500/10'
              }
              
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${colors[notification.type as keyof typeof colors]}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              )
            })}

            <div className="text-center pt-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Icon name="MoreHorizontal" size={16} className="mr-2" />
                Показать все
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default TelegramNotifications