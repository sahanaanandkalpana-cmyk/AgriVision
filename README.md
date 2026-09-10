# 🌱 AgriVision

### 🚀 Live Demo
👉 [Visit AgriVision](https://agrivisionaipoweredagriculturalsite.netlify.app/)

AgriVision is a smart agriculture platform with a React frontend and a Node.js/Express backend. It brings farm management, weather information, crop health, soil moisture, irrigation, drone monitoring, and related agriculture tools into one application.

## Project Structure

- `frontend/` - React and Vite web application
- `backend/` - Node.js and Express API with MongoDB integration

## Features

- Farmer registration and authentication
- Farm management
- Weather data
- Crop health and disease detection views
- Crop recommendations
- Soil moisture and smart irrigation tools
- Drone monitoring
- Profit estimation
- AI assistant interface

## Requirements

- Node.js 18 or newer
- MongoDB database

## Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will print the local URL in the terminal.

## Run the Backend

Create `backend/.env` with your MongoDB connection string:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
OPENWEATHER_API_KEY=your_openweather_api_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

Then run:

```bash
cd backend
npm install
npm start
```

The API runs on port `5000` by default.

The AI Assistant uses the OpenAI API from the backend. Keep `OPENAI_API_KEY` in `backend/.env`; never expose it in frontend code or commit it to Git.

## API Routes

- `/api/auth` - authentication
- `/api/weather` - weather data
- `/api/farms` - farm management

## Development

Run the frontend and backend in separate terminals while developing. Do not commit secrets from `.env` files.
