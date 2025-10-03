import {Component} from '@angular/core';
import {LoaderService} from '../../services/loader.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [
    AsyncPipe
  ],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  loading$;

  constructor(private loaderService: LoaderService) {
    this.loading$ = this.loaderService.loading$;
  }
}
