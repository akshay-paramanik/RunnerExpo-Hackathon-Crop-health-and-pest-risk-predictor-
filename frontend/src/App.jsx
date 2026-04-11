import { useEffect, useState, useCallback } from 'react'
import { Thermometer, Droplets, CloudRain, Leaf, RefreshCw, MapPin, Droplet } from 'lucide-react'
import { MetricCard } from './components/MetricCard'
import { ActionPlan } from './components/ActionPlan'
import { AlertsPanel } from './components/AlertsPanel'
import { UploadImage } from './components/UploadImage'
import { PestRiskPanel } from './components/PestRiskPanel'
import API from './api/api'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [ndviData, setNdviData] = useState(null)
  const [sensorData, setSensorData] = useState([])
  const [pestData, setPestData] = useState(null)
  const [history, setHistory] = useState([])
  const [currentTime, setCurrentTime] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const [locationName, setLocationName] = useState("Loading...")
  const [locationMessage, setLocationMessage] = useState("")
  const [coords, setCoords] = useState(null)
  const [timezone, setTimezone] = useState("")
  const [mode, setMode] = useState("hourly")
  const [forecastData, setForecastData] = useState([])
  const [locationStatus, setLocationStatus] = useState("requesting") // "requesting", "granted", "denied", "error"

  const fetchData = useCallback(async () => {
    try {
      // 1. Weather — use only rainfall
      const weatherRes = await API.get('/api/weather/')
      const weather = Array.isArray(weatherRes.data) ? weatherRes.data[0] : weatherRes.data
      setWeatherData(weather)

      setHistory(prev => [
        ...prev.slice(-9),
        {
          day: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          rainfall: weather.rainfall,
        }
      ])

      // 2. NDVI
      const ndviRes = await API.get('/api/ndvi')
      setNdviData(ndviRes.data)

      // 3. Sensor — humidity, temperature, soilMoisture
      const sensorRes = await API.get('/api/sensor/')
      setSensorData(sensorRes.data)

      // 4. Pest risk
      const pestRes = await API.get('/api/pest/')
      const pest = Array.isArray(pestRes.data) ? pestRes.data[0] : pestRes.data
      setPestData(pest)

      setIsLoading(false)
    } catch (error) {
      console.error('Fetch error:', error)
      setIsLoading(false)
    }
  }, [coords, mode])

  useEffect(() => {
    setIsMounted(true)
    
    // Request location permission and store location
    const requestLocation = async () => {
      setLocationStatus("requesting");
      
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000 // 5 minutes
            });
          });
          
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lon: longitude });
          setLocationStatus("granted");
          
          // Store location in backend
          try {
            await API.post('/api/location/', {
              lat: latitude,
              lon: longitude
            });
            console.log('Location stored successfully');
            setLocationMessage("Location stored successfully");
            setTimeout(() => setLocationMessage(""), 3000); // Clear message after 3 seconds
          } catch (error) {
            console.error('Failed to store location:', error);
            setLocationMessage("Failed to store location");
            setTimeout(() => setLocationMessage(""), 3000);
          }
          
          // Get location name using reverse geocoding
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            setLocationName(data.city || data.locality || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`);
          } catch (error) {
            console.error('Failed to get location name:', error);
            setLocationName(`${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`);
          }
          
        } catch (error) {
          console.error('Geolocation error:', error);
          setLocationStatus(error.code === 1 ? "denied" : "error");
          setLocationName(error.code === 1 ? 'Location access denied' : 'Location unavailable');
          // Set default coordinates for testing
          setCoords({ lat: 23.52, lon: 87.38 }); // Default to some location
        }
      } else {
        console.error('Geolocation is not supported by this browser');
        setLocationStatus("error");
        setLocationName('Geolocation not supported');
        setCoords({ lat: 23.52, lon: 87.38 }); // Default coordinates
      }
    };
    
    requestLocation();
    
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        })
      )
    }
    updateTime()
    const clockInterval = setInterval(updateTime, 1000)
    return () => clearInterval(clockInterval)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [isMounted])

  // Status helpers
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

  const getSoilMoistureStatus = (moisture) => {
    if (moisture >= 70) return { text: 'Saturated', color: 'bg-blue-600 text-white' }
    if (moisture >= 50) return { text: 'Optimal', color: 'bg-emerald-500 text-white' }
    if (moisture >= 30) return { text: 'Low', color: 'bg-yellow-500 text-slate-800' }
    return { text: 'Critical', color: 'bg-red-600 text-white' }
  }

  // Use ONLY sensor data for temp, humidity, and soil moisture (no weather fallback)
  const sensor = Array.isArray(sensorData) ? sensorData[0] : sensorData
  const displayTemp = sensor?.temperature
  const displayHumidity = sensor?.humidity
  const displaySoilMoisture = sensor?.soilMoisture ?? sensor?.soil_moisture ?? sensor?.soil
  const ndviValue = ndviData?.ndvi ?? ndviData?.currentNDVI

  const tempStatus = displayTemp != null ? getTemperatureStatus(displayTemp) : null
  const humidityStatus = displayHumidity != null ? getHumidityStatus(displayHumidity) : null
  const ndviStatus = ndviValue != null ? getNDVIStatus(ndviValue) : null
  const soilStatus = displaySoilMoisture != null ? getSoilMoistureStatus(displaySoilMoisture) : null

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
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 py-4 shadow-lg">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm font-medium text-emerald-100">
              <div className="flex items-center gap-1 sm:gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>{currentTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className={`h-4 w-4 ${
                  locationStatus === 'granted' ? 'text-green-400' :
                  locationStatus === 'denied' ? 'text-red-400' :
                  locationStatus === 'error' ? 'text-yellow-400' :
                  'text-blue-400 animate-pulse'
                }`} />
                <span className={
                  locationStatus === 'granted' ? 'text-green-200' :
                  locationStatus === 'denied' ? 'text-red-200' :
                  locationStatus === 'error' ? 'text-yellow-200' :
                  'text-blue-200'
                }>
                  {locationName}
                </span>
                {locationMessage && (
                  <div className={`text-sm mt-1 ${
                    locationMessage.includes('successfully') ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {locationMessage}
                  </div>
                )}
              </div>
              {coords && (
                <div>{coords.lat.toFixed(2)}°N, {coords.lon.toFixed(2)}°E</div>
              )}
              <div>{timezone}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        {/* Metric Cards — sensor-first for temp/humidity, weather for rainfall */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard
            title="Temperature"
            value={displayTemp}
            unit="°C"
            status={tempStatus?.text}
            statusColor={tempStatus?.color}
            icon={Thermometer}
            bgColor="bg-gradient-to-br from-orange-400 to-orange-500"
            textColor="text-white"
            source="sensor"
          />
          <MetricCard
            title="Humidity"
            value={displayHumidity}
            unit="%"
            status={humidityStatus?.text}
            statusColor={humidityStatus?.color}
            icon={Droplets}
            bgColor="bg-gradient-to-br from-cyan-400 to-cyan-500"
            textColor="text-white"
            source="sensor"
          />
          <MetricCard
            title="Rainfall"
            value={weatherData?.rainfall}
            unit="mm"
            status="Last 24h"
            statusColor="bg-blue-600 text-white"
            icon={CloudRain}
            bgColor="bg-gradient-to-br from-blue-400 to-blue-500"
            textColor="text-white"
            source="weather"
          />
          <MetricCard
            title="Crop Health (NDVI)"
            value={ndviValue}
            unit=""
            status={ndviStatus?.text}
            statusColor={ndviStatus?.color}
            icon={Leaf}
            bgColor="bg-gradient-to-br from-emerald-400 to-emerald-500"
            textColor="text-white"
            source="ndvi"
          />
          <MetricCard
            title="Soil Moisture"
            value={displaySoilMoisture}
            unit="%"
            status={soilStatus?.text}
            statusColor={soilStatus?.color}
            icon={Droplet}
            bgColor="bg-gradient-to-br from-yellow-800 to-orange-900"
            textColor="text-white"
            source="sensor"
          />
        </div>

        {/* Pest Risk Panel — full width, prominent */}
        <div className="mt-6">
          <PestRiskPanel pestData={pestData} />
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