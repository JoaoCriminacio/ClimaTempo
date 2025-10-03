import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ICityApi} from '../models/city.model';


@Injectable({
  providedIn: 'root'
})
export class CitiesService {
    private baseUrl: string = 'https://geocoding-api.open-meteo.com/v1/';

    constructor(private http: HttpClient) {}

    public getCityInfo(name: string) {
      return this.http.get<ICityApi>(`${this.baseUrl}search?name=${name}&count=1&language=pt`);
    }
}
