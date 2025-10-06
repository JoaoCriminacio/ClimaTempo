import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IWeatherApi} from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
    private baseUrl: string = 'https://api.open-meteo.com/v1/forecast';

    constructor(private http: HttpClient) {}

    public getWeatherInfo(latitude: number, longitude: number) {
      return this.http.get<IWeatherApi>(`${this.baseUrl}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability`);
    }
}
