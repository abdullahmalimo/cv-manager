import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import routeConfig from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';


bootstrapApplication(App, {
  providers: [
     provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routeConfig)
  ]
}).catch(err => console.error(err));
