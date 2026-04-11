Here’s your **updated README.md** with the change: instead of providing the `ai_model` folder, you give a **Google Drive link** (clean + professional).

---

```markdown
# 🌱 AI-Based Crop Health & Pest Risk Predictor

A complete AI + IoT based system that helps farmers monitor crop health, predict future conditions, detect diseases, and take smart decisions.

---

## ⚙️ Setup Guide

This project consists of:

- 🧠 AI Backend (Python - Flask + LSTM + CNN + Google Earth Engine)
- 🌐 Backend (Node.js + Express + MongoDB Atlas)
- 💻 Frontend (React.js + Vite + Tailwind CSS)
- 📡 IoT Device (ESP32 + Sensors (Soil Moisture Sensor + DHT11))

---

## 🧠 1. Python AI Server Setup (Google Colab)

We use **Google Colab** to run the AI models and APIs.

### 📥 Download AI Model Files

Due to large file sizes, AI models are provided via Google Drive:

👉 **Download from here:**  
[https://drive.google.com/drive/folders/1ooA4hvqtgbMB4Kexky-e2Ct9kusaBbzZ?usp=sharing]

---

### 📂 Upload Required Files

After downloading, upload these files into **Colab root directory (`/content/`)**:

```

lstm_model.h5
scaler.save
plant_disease_recog_model_pwp.keras
plant_disease.json
key.json
app.py

````

Upload using:
```python
from google.colab import files
files.upload()
````

---

### 🔐 Google Earth Engine Setup

⚠️ We cannot provide our private key. You must create your own.

#### Steps:

1. Go to Google Cloud Console
2. Create a Service Account
3. Enable Earth Engine API
4. Generate JSON Key
5. Upload as `key.json`

Update in code:

```python
SERVICE_ACCOUNT = "your-service-account@project.iam.gserviceaccount.com"
KEY_PATH = "key.json"
```

---

### 🔓 Ngrok Setup

Replace:

```python
ngrok.set_auth_token("YOUR_NGROK_TOKEN")
```

Get token from: [https://dashboard.ngrok.com/](https://dashboard.ngrok.com/)

---

### ▶️ Run Server

```bash
!python app.py
```

You will get:

```
🔥 Live API: https://xxxx.ngrok-free.dev
```

---

## 🔌 API Endpoints

### 🔮 LSTM Prediction

**POST** `/predict/lstm`

---

### 🌿 NDVI API

**POST** `/ndvi`

---

### 🌱 CNN Disease Detection

**POST** `/predict/cnn`

---

### 📥 Store IoT Data

**POST** `/store`

---

### 📤 Fetch Latest Data

**GET** `/fetch`

---

## 🌐 2. Backend (Node.js + MongoDB)

### Setup

```bash
npm install
node index.js
```

Create `.env`:

```
MONGODB_URI=your_mongodb_connection
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API

CLOUD_NAME=YOUR_CLOUDINARY_NAME
CLOUD_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUD_API_SECRET=YOUR_CLOUDINARY_SECRET_KEY
AI_BASE_URL=https://xxxx.ngrok-free.app
```

---

## 💻 3. Frontend (React + Vite + Tailwind)

### Setup

```bash
npm install
npm run dev
```

---

## 📡 4. IoT Setup (ESP32)

### 📂 File

```
iot/esp32_code.ino
```

---

### 🔧 Setup Steps

1. Open Arduino IDE

2. Install:

   * ESP32 Board
   * DHT Library
   * LiquidCrystal_I2C

3. Update WiFi:

```cpp
const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";
```

4. Update API URL:

```cpp
const char* serverName = "https://your-ngrok-url/store";
```

---

### ⏱️ Data Flow

* Sensor Read → every 2 sec
* API Send → ~50 sec

---

## 🔄 System Workflow

### 📡 Data Collection

ESP32 sends:

* Temperature 🌡️
* Humidity 💧
* Soil Moisture 🌱

---

### 📊 Processing Timeline

| Feature         | Frequency       |
| --------------- | --------------- |
| IoT Data        | Every 5 min     |
| Rainfall Data   | Every 1 hour    |
| NDVI            | Every 1 week    |
| LSTM Prediction | Every 2 hours   |
| CNN Analysis    | On image upload |

---

### 🤖 Decision System

* LSTM → Future NDVI prediction
* NDVI → Crop health monitoring
* Weather → Rainfall impact
* CNN → Disease detection

Final Output:

* Risk Level
* Disease Detection
* Suggested Action

---

## 📦 Project Structure

```
project/
│── backend/
│── frontend/

│── iot/
│   └── esp32_code.ino
```

---

## 🛠️ Tools and Libraries Used

* External tools and technologies:

  * Google Earth Engine
  * Ngrok
  * TensorFlow / Keras
  * MongoDB Atlas

* AI Assistance:

  * ChatGPT – code writing, debugging, logic building
  * Claude AI – code refinement and debugging

---

## 🚀 Tech Stack

* Python (Flask, TensorFlow, NumPy)
* Google Earth Engine
* Node.js + Express
* MongoDB Atlas
* React + Vite + Tailwind CSS
* ESP32 + Sensors

---

## 👨‍💻 Authors

**Team Name:** RunnerExpo

**Team Members:**

* Akshay Paramanik (Group Leader)
* Bishwajit Gorai
* Rupak Chakraborty
* Subham Singh

---

```