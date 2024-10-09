'use client'

import { useState } from 'react'
import { Search, Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Sunrise, Sunset } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock weather data (replace with actual API call in a real application)
const fetchWeatherData = async (city: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
  if (city.toLowerCase() === 'error') throw new Error('City not found')
  
  const conditions = ['Sunny', 'Cloudy', 'Rainy']
  const forecast = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    temperature: Math.floor(Math.random() * 20) + 10,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
  }))

  return {
    city,
    current: {
      temperature: Math.floor(Math.random() * 30) + 10,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: Math.floor(Math.random() * 60) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      feelsLike: Math.floor(Math.random() * 30) + 10,
      uvIndex: Math.floor(Math.random() * 11),
      sunrise: '6:30 AM',
      sunset: '8:15 PM',
    },
    forecast,
  }
}

export default function EnhancedWeatherAPI() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const data = await fetchWeatherData(city)
      setWeather(data)
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getBackgroundClass = (condition) => {
    switch (condition) {
      case 'Sunny':
        return 'bg-gradient-to-br from-yellow-300 via-orange-300 to-red-400'
      case 'Cloudy':
        return 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400'
      case 'Rainy':
        return 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500'
      default:
        return 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400'
    }
  }

  const getWeatherIcon = (condition, className = "h-8 w-8") => {
    switch (condition) {
      case 'Sunny':
        return <Sun className={`${className} text-yellow-500`} />
      case 'Cloudy':
        return <Cloud className={`${className} text-gray-600`} />
      case 'Rainy':
        return <CloudRain className={`${className} text-blue-600`} />
      default:
        return <Cloud className={`${className} text-gray-600`} />
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${weather ? getBackgroundClass(weather.current.condition) : 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300'}`}>
      <Card className="w-full max-w-3xl bg-white/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Weather API</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Loading...' : <Search className="h-4 w-4" />}
            </Button>
          </form>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {weather && (
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current">Current Weather</TabsTrigger>
                <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
              </TabsList>
              <TabsContent value="current">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-3xl font-bold mb-4">{weather.city}</h2>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-5xl font-bold">{weather.current.temperature}°C</span>
                      {getWeatherIcon(weather.current.condition, "h-16 w-16")}
                    </div>
                    <p className="text-xl mb-4">{weather.current.condition}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Thermometer className="h-5 w-5 mr-2" />
                        <span>Feels like: {weather.current.feelsLike}°C</span>
                      </div>
                      <div className="flex items-center">
                        <Droplets className="h-5 w-5 mr-2" />
                        <span>Humidity: {weather.current.humidity}%</span>
                      </div>
                      <div className="flex items-center">
                        <Wind className="h-5 w-5 mr-2" />
                        <span>Wind: {weather.current.windSpeed} km/h</span>
                      </div>
                      <div className="flex items-center">
                        <Sun className="h-5 w-5 mr-2" />
                        <span>UV Index: {weather.current.uvIndex}</span>
                      </div>
                      <div className="flex items-center">
                        <Sunrise className="h-5 w-5 mr-2" />
                        <span>Sunrise: {weather.current.sunrise}</span>
                      </div>
                      <div className="flex items-center">
                        <Sunset className="h-5 w-5 mr-2" />
                        <span>Sunset: {weather.current.sunset}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="forecast">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">7-Day Forecast</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {weather.forecast.map((day, index) => (
                        <Card key={index} className="bg-white/50 backdrop-blur-sm">
                          <CardContent className="p-4">
                            <h3 className="font-semibold">{day.date}</h3>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-2xl font-bold">{day.temperature}°C</span>
                              {getWeatherIcon(day.condition)}
                            </div>
                            <p className="mt-2">{day.condition}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}