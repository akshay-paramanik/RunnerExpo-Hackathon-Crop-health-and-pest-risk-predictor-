import SensorData from "../models/sensorSchema.js";
import axios from "axios";

// 🔥 Add sensor data (ESP32 will hit this)
export const addSensorData = async (req, res) => {
  try {
    const response = await axios.get("https://unprevalent-jettie-unseductive.ngrok-free.dev/fetch");
    
    const { soilMoisture, temperature, humidity } = response.data.data;
    const data = await SensorData.create({
      soilMoisture,
      temperature,
      humidity,
    });

    res.json(data);
    console.log(soilMoisture,temperature,humidity);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔥 Get latest sensor data
export const getSensorData = async (req, res) => {
  try {
    const data = await SensorData.find()
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

