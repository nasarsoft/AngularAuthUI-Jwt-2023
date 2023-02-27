import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private auth :AuthService,
    private toast: NgToastService,
    private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken=this.auth.getToken();
    console.log(myToken);
    if(myToken){
      request=request.clone({
        setHeaders:{Authorization:`Bearer ${myToken}`}
      })
    }
    return next.handle(request).pipe(
      catchError((err:any)=>{
        console.log(err.error.message);
       if(err instanceof HttpResponse){
        if(err.status==401){
          this.toast.warning({detail:"Warning",summary:"Toekn is expired , login again"})
          this.router.navigate(['login']);
        }else if(err.status==404){
          this.toast.warning({detail:"Warning",summary:"404"})
        }
        
       } 
       return throwError(()=>new Error(err.error.message));
      })
    );
  }
}
