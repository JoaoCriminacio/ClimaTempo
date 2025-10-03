import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {ISnackBar} from '../models/snack-bar.model';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
    private _snackBar$ = new Subject<ISnackBar>();
    snackBar$ = this._snackBar$.asObservable();

    show(message: string, type: 'success' | 'error') {
      this._snackBar$.next({ message, type });
    }
}
