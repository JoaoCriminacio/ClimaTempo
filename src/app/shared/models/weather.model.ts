export interface IWeather {
  temperature: number;
  time: string;
  precipitation: number;
}

export interface IWeatherApi {
  hourly: {
    precipitation_probability: number[];
    temperature_2m: number[];
    time: string[];
  }
}
