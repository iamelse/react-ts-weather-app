# Weather App

A modern weather app built with React 19, TypeScript, and Vite. Features real-time weather data, dynamic glass-morphism UI, and automatic location detection — no API keys required.

## Features

- **Current Weather** — Temperature, feels-like, condition description, high/low
- **Hourly Forecast** — 24-hour scrollable strip with temperature and precipitation probability
- **Weekly Forecast** — 7-day (expandable to 16-day) forecast with high/low and precipitation
- **Detail Cards** — UV index, humidity, wind speed + direction compass, sunrise/sunset, air quality index (AQI)
- **Dynamic Background** — HSL gradient adapts to weather condition and time of day (night/dawn/day/dusk)
- **Automatic Location Detection** — On first run, uses Geolocation API + Nominatim reverse geocode
- **Location Management** — Search and save cities, mark favorite, add/drop cities
- **Temperature Units** — Toggle Celsius/Fahrenheit, persisted to localStorage
- **Pull to Refresh** — Touch gesture to refresh weather data
- **Share Weather** — Floating button to share via native share sheet or clipboard
- **Responsive** — Layout adapts from mobile to tablet with Samsung Weather–inspired hierarchy

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript 5.9 | Type safety |
| Vite 7 | Build tool & dev server |
| Tailwind CSS v4 | Styling with glass-morphism |
| Lucide React | Icon library |

### APIs (all free, no keys)

- [Open-Meteo](https://open-meteo.com) — Weather forecast (current, hourly, daily) + air quality
- [Nominatim](https://nominatim.openstreetmap.org) — Geocoding and reverse geocoding

### Icons

Weather icons in `public/icons/meteocons/` (16 static SVGs) mapped from WMO weather codes.

## Getting Started

```bash
# Install
npm install

# Dev server
npm run dev

# Build (type-check + production bundle)
npm run build

# Preview production
npm run preview

# Lint
npm run lint
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_BASE_URL` | `https://api.open-meteo.com/v1/forecast` | Open-Meteo API base URL |
| `VITE_TIMEZONE` | `Asia/Bangkok` | IANA timezone for weather data |
| `VITE_LOCATION_BASE_URL` | `https://nominatim.openstreetmap.org/search` | Nominatim search endpoint |

## Project Structure

```
src/
├── api/               # Fetch wrappers (weather, location, air quality)
├── components/        # UI components
│   ├── HourlyChart/   # 24-hour forecast strip
│   ├── InfoCards/     # UV, humidity, wind, AQI, sunrise/sunset
│   ├── Modal/         # Settings, manage locations, favorite info
│   ├── Sidebar/       # Favorite location, city list, add-location
│   ├── Skeleton/      # Reusable loading skeleton
│   ├── WeatherHeader/ # Current conditions (temp, icon, description)
│   └── WeeklyForecast/# 7/16-day forecast
├── context/           # Settings context (temp unit, localStorage)
├── hooks/             # Custom hooks
│   ├── useWeather.ts          # Fetch weather + AQI
│   ├── useCitiesStorage.ts    # City state with localStorage
│   ├── useInitialLocation.ts  # Auto-detect on first run
│   ├── usePullToRefresh.ts    # Touch gesture handler
│   ├── useDayPhase.ts         # Night/dawn/day/dusk
│   ├── useLocationSearch.ts   # Debounced search with AbortController
│   └── ...
├── types/             # TypeScript interfaces
├── utils/             # Helpers (weather codes, colors, location formatting)
└── App.tsx            # Root — composes hooks + layout
```

## Data Flow

```
App.tsx
├── useInitialLocation()     → auto-detect city on first launch
├── useCitiesStorage()       → cities[], activeCity (localStorage)
├── useWeather(activeCity)   → current + hourly + weekly + AQI
├── useDayPhase()            → "night" | "dawn" | "day" | "dusk"
├── usePullToRefresh(refresh)→ touch gesture for re-fetch
└── getBackgroundByWeather() → dynamic HSL gradient
```

## UI Hierarchy

1. **Current conditions** — Big temperature, icon, description, high/low, feels-like
2. **Hourly** — 24-hour scrollable strip with precipitation %
3. **Weekly** — 7-day (toggle to 16-day) forecast
4. **Details** — UV, humidity, wind direction, AQI, sunrise/sunset

## Local Storage

| Key | Purpose |
|---|---|
| `weather_cities` | Saved cities list (with active/favorite flags) |
| `temp_unit` | Temperature unit preference (`celsius` / `fahrenheit`) |

## Docs

- [Open-Meteo API](.docs/open-meteo/README.md) — API reference for weather and air quality endpoints
