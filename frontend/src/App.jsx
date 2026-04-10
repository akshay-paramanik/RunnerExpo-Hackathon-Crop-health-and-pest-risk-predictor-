import { useEffect, useState, useCallback } from 'react'
import { Thermometer, Droplets, CloudRain, Leaf, RefreshCw } from 'lucide-react'
import { MetricCard } from './components/MetricCard'
import { ActionPlan } from './components/ActionPlan'
import { AlertsPanel } from './components/AlertsPanel'
import { UploadImage } from './components/UploadImage'
import { MapPin } from "lucide-react";
import { Droplet } from "lucide-react"
import API from './api/api'
import axios from 'axios'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [ndviData, setNdviData] = useState(null)
  const [history, setHistory] = useState([])
  const [currentTime, setCurrentTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const [locationName, setLocationName] = useState("Loading...")
  const [coords, setCoords] = useState(null)
  const [timezone, setTimezone] = useState("")
  const [mode, setMode] = useState("hourly");
  const [forecastData, setForecastData] = useState([]);
  const [sensorData, setSensorData] = useState([])

  const fetchData = useCallback(async () => {
    try {
      if (!coords) return

      const { lat, lon } = coords

      const weatherRes = await API.get(`/api/weather?lat=${lat}&lon=${lon}`)

      const weather = Array.isArray(weatherRes.data)
        ? weatherRes.data[0]
        : weatherRes.data

      setWeatherData(weather)

      setHistory(prev => [
        ...prev.slice(-9),
        {
          day: new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          temp: weather.temperature,
          humidity: weather.humidity,
          rainfall: weather.rainfall
        }
      ])

      const forecastRes = await API.get(`/api/weather/${mode}?lat=${lat}&lon=${lon}`)
      setForecastData(forecastRes.data)

      const ndviRes = await API.get(
        `/api/ndvi?temp=${weather.temperature}&humidity=${weather.humidity}&rainfall=${weather.rainfall}`
      )
      setNdviData(ndviRes.data)

      // FIXED SENSOR FETCH
      const sensorRes = await axios.get("http://localhost:5000/api/sensor")
      setSensorData(sensorRes.data)

      setIsLoading(false)

    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }, [coords, mode])

  useEffect(() => {
    setIsMounted(true)

    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      )
    }

    updateTime()
    const clockInterval = setInterval(updateTime, 1000)

    return () => clearInterval(clockInterval)
  }, [])

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords

        setCoords({
          lat: latitude,
          lon: longitude,
        })

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          )
          const data = await res.json()

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.hamlet ||
            data.address.suburb ||
            data.address.county ||
            "Unknown"

          setLocationName(city)
        } catch {
          setLocationName("Location error")
        }
      },
      () => {
        setLocationName("Permission denied")
      }
    )
  }, [])

  useEffect(() => {
    if (!isMounted) return
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData, isMounted])

  const getTemperatureStatus = (temp) => {
    if (temp >= 35) return { text: 'Very Hot', color: 'bg-red-600 text-white' }
    if (temp >= 30) return { text: 'Hot', color: 'bg-orange-500 text-white' }
    if (temp >= 25) return { text: 'Warm', color: 'bg-yellow-500 text-slate-800' }
    if (temp >= 20) return { text: 'Moderate', color: 'bg-emerald-500 text-white' }
    return { text: 'Cool', color: 'bg-blue-500 text-white' }
  }

  const getHumidityStatus = (humidity) => {
    if (humidity >= 80) return { text: 'Very High', color: 'bg-blue-600 text-white' }
    if (humidity >= 60) return { text: 'High', color: 'bg-cyan-500 text-white' }
    if (humidity >= 40) return { text: 'Moderate', color: 'bg-emerald-500 text-white' }
    return { text: 'Low', color: 'bg-amber-500 text-white' }
  }

  const getNDVIStatus = (ndvi) => {
    if (ndvi >= 0.7) return { text: 'Healthy', color: 'bg-emerald-600 text-white' }
    if (ndvi >= 0.5) return { text: 'Moderate', color: 'bg-yellow-500 text-slate-800' }
    if (ndvi >= 0.3) return { text: 'Stressed', color: 'bg-orange-500 text-white' }
    return { text: 'Critical', color: 'bg-red-600 text-white' }
  }

  const tempStatus = weatherData ? getTemperatureStatus(weatherData.temperature) : null
  const humidityStatus = weatherData ? getHumidityStatus(weatherData.humidity) : null
  const ndviStatus = ndviData ? getNDVIStatus(ndviData.currentNDVI) : null

  if (!isMounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-12 w-12 animate-spin text-emerald-600" />
          <p className="text-lg font-medium text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* <header className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 shadow-lg">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <Leaf className="h-8 w-8 text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  Crop Health & Pest Risk Predictor
                </h1>
                <p className="text-sm text-emerald-100">
                  AI-powered agricultural monitoring system (Live data)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-lg font-bold text-emerald-100">

              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>Live: {currentTime}</span>
              </div>

              <div className='flex items-center gap-1'>
                <MapPin className="h-4 w-4 " />
                <a
                  href={`https://www.google.com/maps?q=${coords?.lat},${coords?.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{locationName}</span>
                </a>
              </div>

              {coords && (
                <div>
                  {coords.lat.toFixed(2)}°N, {coords.lon.toFixed(2)}°E
                </div>
              )}

              <div>{timezone}</div>

            </div>
          </div>
        </div>
      </header> */}


      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 py-4 shadow-lg">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <Leaf className="h-8 w-8 text-white" />
              </div>

              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">
                  Crop Health & Pest Risk Predictor
                </h1>

                <p className="text-xs sm:text-sm text-emerald-100">
                  AI-powered agricultural monitoring system (Live data)
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-wrap items-center gap-3 md:text-xl lg:text-xl sm:gap-6 text-sm sm:text-sm font-medium text-emerald-100">

              {/* Time */}
              <div className="flex items-center gap-1 sm:gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>{currentTime}</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{locationName}</span>
              </div>

              {/* Coordinates */}
              {coords && (
                <div>
                  {coords.lat.toFixed(2)}°N, {coords.lon.toFixed(2)}°E
                </div>
              )}

              {/* Timezone */}
              <div>
                {timezone}
              </div>

            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">

          <MetricCard title="Temperature" value={weatherData?.temperature} unit="°C" status={tempStatus?.text} statusColor={tempStatus?.color} icon={Thermometer} bgColor="bg-gradient-to-br from-orange-400 to-orange-500" textColor="text-white" />
          <MetricCard title="Humidity" value={weatherData?.humidity} unit="%" status={humidityStatus?.text} statusColor={humidityStatus?.color} icon={Droplets} bgColor="bg-gradient-to-br from-cyan-400 to-cyan-500" textColor="text-white" />
          <MetricCard title="Rainfall" value={weatherData?.rainfall} unit="mm" status="Last 24h" statusColor="bg-blue-600 text-white" icon={CloudRain} bgColor="bg-gradient-to-br from-blue-400 to-blue-500" textColor="text-white" />
          <MetricCard title="Crop Health (NDVI)" value={ndviData?.currentNDVI} unit="" status={ndviStatus?.text} statusColor={ndviStatus?.color} icon={Leaf} bgColor="bg-gradient-to-br from-emerald-400 to-emerald-500" textColor="text-white" />
          <MetricCard
            title="Soil Moisture"
            value={sensorData?.[0]?.soilMoisture}
            unit="%"
            status={ndviStatus?.text}
            statusColor={ndviStatus?.color}
            icon={Droplet}
            bgColor="bg-gradient-to-br from-yellow-800 to-orange-900"
            textColor="text-white"
          />

        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UploadImage />
          <ActionPlan />
        </div>

        <div className="mt-6">
          <AlertsPanel alerts={ndviData?.alerts} />
        </div>

      </main>
    </div>
  )
}

export default App