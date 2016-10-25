import 'bootstrap/dist/css/bootstrap.css'

import 'babel-polyfill';
import 'zone.js/dist/zone';
import 'reflect-metadata';
import 'rxjs/Rx'; // needed for http.get(...).toPromise()
import './logging.aspect';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
