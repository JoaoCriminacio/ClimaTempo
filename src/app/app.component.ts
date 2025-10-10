import { Component } from '@angular/core';
import {CitiesService} from './shared/services/cities.service';
import {SnackBarComponent} from './shared/components/snack-bar/snack-bar.component';
import {LoaderComponent} from './shared/components/loader/loader.component';
import {LoaderService} from './shared/services/loader.service';
import {SnackBarService} from './shared/services/snack-bar.service';
import {WeatherService} from './shared/services/weather.service';
import {IWeather} from './shared/models/weather.model';
import {DatePipe, NgClass, TitleCasePipe} from '@angular/common';
import {distinctUntilChanged, Subject} from 'rxjs';
import {ICityResults} from './shared/models/city.model';

@Component({
  selector: 'app-root',
  imports: [
    SnackBarComponent,
    LoaderComponent,
    DatePipe,
    NgClass,
    TitleCasePipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
    protected latitude!: number;
    protected longitude!: number;
    protected cityInfo!: string;
    protected allWeathers: IWeather[] = [];
    protected showingWeathers: IWeather[] = [];
    protected avarageTemperature: number = 0;
    protected initialSlice: number = 0;
    protected finalSlice: number = 24;
    protected citySuggestions: ICityResults[] = [];
    private searchSubject = new Subject<string>();

    constructor(private citiesService: CitiesService,
                private weatherService: WeatherService,
                private loaderService: LoaderService,
                private snackBarService: SnackBarService) {
      this.searchSubject.pipe(
        distinctUntilChanged()
      ).subscribe((value) => this.loadCitySuggestions(value));
    }

    protected onCityInput(event: Event) {
      const value = (event.target as HTMLInputElement).value.trim();

      if (!value || value.length < 2) {
        this.citySuggestions = [];
        return;
      }

      this.searchSubject.next(value);
    }

    protected onCityBlur() {
      setTimeout(() => {
        this.citySuggestions = [];
      }, 150);
    }

    protected selectCity(city: ICityResults, input: HTMLInputElement) {
      input.value = '';
      this.getWeatherInfo(city.latitude, city.longitude);
      this.cityInfo = `${city.name} - ${city.admin1 || ''} - ${city.country || ''}`;
    }

    protected manageWeather(offset: number) {
      if (this.initialSlice + offset < 0 || this.finalSlice + offset > this.allWeathers.length) return;

      this.showingWeathers = this.allWeathers.slice(this.initialSlice + offset, this.finalSlice + offset);
      this.avarageTemperature = this.calculateAverageTemperature(this.showingWeathers);
      this.initialSlice += offset;
      this.finalSlice += offset;
    }

    protected searchCity(input: HTMLInputElement) {
      const city = input.value.trim();
      input.value = '';
      if (!city) return;

      this.loaderService.show();

      this.citiesService.getCityInfo(city).subscribe({
        next: (response) => {
          this.citySuggestions = [];

          if (!response?.results || response.results.length === 0) {
            this.showingWeathers = [];
            this.snackBarService.show('Cidade não encontrada', 'error');
            this.loaderService.hide();
            return;
          }

          this.latitude = response?.results[0]?.latitude;
          this.longitude = response?.results[0]?.longitude;
          this.cityInfo = response?.results[0]?.name;

          if (response?.results[0]?.admin1) this.cityInfo += ` - ${response?.results[0]?.admin1}`;

          if (response?.results[0]?.country) this.cityInfo += ` - ${response?.results[0]?.country}`;

          if (this.latitude && this.longitude) {
            this.getWeatherInfo(this.latitude, this.longitude);
          } else {
            this.loaderService.hide();
          }
        },
        error: (err) => {
          this.snackBarService.show('Erro ao buscar cidade', 'error');
          this.loaderService.hide();
        }
      });
    }

    private getWeatherInfo(latitude: number, longitude: number) {
      this.loaderService.show();
      this.weatherService.getWeatherInfo(latitude, longitude).subscribe({
        next: (response) => {
          this.initialSlice = 0;
          this.finalSlice = 24;

          const times = response?.hourly?.time || [];
          const temps = response?.hourly?.temperature_2m || [];
          const precipitation = response?.hourly?.precipitation_probability || [];

          this.allWeathers = times.map((t: string, i: number) => ({
            temperature: temps[i],
            time: t,
            precipitation: precipitation[i]
          }));

          this.showingWeathers = this.allWeathers.slice(this.initialSlice, this.finalSlice);
          this.avarageTemperature = this.calculateAverageTemperature(this.showingWeathers);
          this.loaderService.hide();
        },
        error: (err) => {
          this.snackBarService.show('Erro ao buscar clima', 'error');
          this.loaderService.hide();
        }
      })
    }

    private calculateAverageTemperature(weathers: IWeather[]) {
      if (!weathers.length) return 0;
      const weatherTemperatures = weathers.map((w) => w.temperature);
      const total = weatherTemperatures.reduce((accTemperature, temperature) => accTemperature + temperature, 0);
      return Math.round(total / weatherTemperatures.length);
    }

    private loadCitySuggestions(value: string) {
      this.citiesService.getCitySuggestions(value).subscribe({
        next: (response) => {
          this.citySuggestions = response?.results || [];
        },
        error: () => {
          this.citySuggestions = [];
        }
      });
    }
}
