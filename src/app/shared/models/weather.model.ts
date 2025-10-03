export interface IWeather {
  temperature: number;
  time: string;
}

export interface IWeatherApi {
  hourly: {
    temperature_2m: number[];
    time: string[];
  }
}
