import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ICity} from '../models/city.model';


@Injectable({
  providedIn: 'root'
})
export class CitiesService {
    private baseUrl: string = 'https://geocoding-api.open-meteo.com/v1/';

    constructor(private http: HttpClient) {}

    public getCityInfo(name: string) {
      return this.http.get<ICity>(`${this.baseUrl}search?name=${name}&count=1&language=pt`);
    }

    public getCitySuggestions(name: string) {
    return this.http.get<ICity>(`${this.baseUrl}search?name=${name}&count=5&language=pt`);
  }

}
