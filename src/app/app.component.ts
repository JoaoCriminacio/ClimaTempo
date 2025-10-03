import { Component } from '@angular/core';
import {CitiesService} from './shared/services/cities.service';
import {SnackBarComponent} from './shared/components/snack-bar/snack-bar.component';
import {LoaderComponent} from './shared/components/loader/loader.component';
import {LoaderService} from './shared/services/loader.service';
import {SnackBarService} from './shared/services/snack-bar.service';
import {WeatherService} from './shared/services/weather.service';
import {IWeather} from './shared/models/weather.model';
import {DatePipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    SnackBarComponent,
    LoaderComponent,
    DatePipe,
    NgClass
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
    protected latitude!: number;
    protected longitude!: number;
    protected city!: string;
    protected state!: string;
    protected country!: string;
    protected weathers: IWeather[] = [];

    constructor(private citiesService: CitiesService,
                private weatherService: WeatherService,
                private loaderService: LoaderService,
                private snackBarService: SnackBarService) {}

    protected searchCity(input: HTMLInputElement) {
      const city = input.value.trim();
      input.value = '';
      if (!city) return;

      this.loaderService.show();

      this.citiesService.getCityInfo(city).subscribe({
        next: async (response) => {
          if (!response?.results || response.results.length === 0) {
            this.weathers = [];
            this.snackBarService.show('Cidade não encontrada', 'error');
            this.loaderService.hide();
            return;
          }

          console.log(response)

          this.latitude = response?.results[0]?.latitude;
          this.longitude = response?.results[0]?.longitude;
          this.city = response?.results[0]?.name;
          this.state = response?.results[0]?.admin1;
          this.country = response?.results[0]?.country;

          if (this.latitude && this.longitude){
            await this.getWeatherInfo(this.latitude, this.longitude);
          }

          this.loaderService.hide();
        },
        error: (err) => {
          this.snackBarService.show('Erro ao buscar cidade', 'error');
          this.loaderService.hide();
        }
      });
    }

    protected async getWeatherInfo(latitude: number, longitude: number) {
      this.weatherService.getWeatherInfo(latitude, longitude).subscribe({
        next: (response) => {
          const times = response?.hourly?.time.slice(0, 24) || [];
          const temps = response?.hourly?.temperature_2m.slice(0, 24) || [];

          this.weathers = times.map((t: string, i: number) => ({
            temperature: temps[i],
            time: t
          }));
        },
        error: (err) => {
          this.snackBarService.show('Erro ao buscar clima', 'error');
          this.loaderService.hide();
        }
      })
    }
}
