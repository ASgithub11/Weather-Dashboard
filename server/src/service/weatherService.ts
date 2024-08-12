import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  date: string;

  constructor(
    temperature: number,
    humidity: number,
    windSpeed: number,
    description: string,
    icon: string,
    date: string
  ) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.description = description;
    this.icon = icon;
    this.date = date;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {

// TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}';
  private apiKey: string = process.env.WEATHER_API_KEY || '';
  private cityName: string = '';

  constructor(
    baseURL: string,
    apiKey: string,
    cityName: string
  ) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.cityName = cityName;
  }
    
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(`${this.baseURL}geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    const data = await response.json();
    return data;
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates[]): Coordinates {
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.cityName}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
     return await response.json();
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { temp, humidity } = response.main;
    const { speed } = response.wind;
    const { description, icon } = response.weather[0];
    const date = new Date().toDateString();
    return new Weather(temp, humidity, speed, description, icon, date);
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray = weatherData.map(data => {
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      const { description, icon } = data.weather[0];
      const date = new Date(data.dt_txt).toDateString();
      return new Weather(temp, humidity, speed, description, icon, date);
    });
    return [currentWeather, ...forecastArray];
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {}
}

export default new WeatherService();
