import { CloudSun } from 'lucide-react';

type WeatherProps = {
  temperature: number;
  weather: string;
  location: string;
};

export const Weather = ({ temperature, weather, location }: WeatherProps) => {
  // Basic mapping from weather string to icon - expand as needed
  const WeatherIcon = CloudSun; // Default icon
  // TODO: Add logic here to choose icon based on weather string (e.g., if (weather.toLowerCase().includes('sun')) WeatherIcon = Sun;)

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
      <div className="flex items-center space-x-3 mb-2">
        <WeatherIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Weather in {location}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Condition: {weather}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{temperature}°C</p>
      </div>
    </div>
  );
};