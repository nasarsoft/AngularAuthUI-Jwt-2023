import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { TokenApiModel } from '../models/token-api.model';

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
       if(err instanceof HttpErrorResponse ){ 
        if(err.status==401){
          // this.toast.warning({detail:"Warning",summary:"Toekn is expired , login again"})
          // this.router.navigate(['login']);
          console.log('inside hte 401');
          return  this.handleUnAuthorizedError(request,next);
        }  
       } 
      //  return throwError(()=>{
      //   this.toast.warning({detail:"Warning",summary:"some other error"})
         
      // })
       return throwError(()=>new Error("some other error"));
      })
    );
  }

  handleUnAuthorizedError(req: HttpRequest<any>,next : HttpHandler){ 
    let tokenApiMode= new TokenApiModel();
    tokenApiMode.accessToken=this.auth.getToken()!;
    tokenApiMode.rereshToken=this.auth.getRefreshToken()!;
    console.log('inside hte handleUnAuthorizedError');
    return this.auth.rewToken(tokenApiMode)
    .pipe(
      switchMap((data:TokenApiModel)=>{
          this.auth.storeRefreshToken(data.rereshToken);
          this.auth.storeToken(data.accessToken);
          req= req.clone({
            setHeaders:{Authorization:`Bearer ${data.accessToken}`}
          })
          return next.handle(req);
      }),catchError((error)=>{
        return throwError(()=>{
          this.toast.warning({detail:"Warning",summary:"Toekn is expired , login again"})
           this.router.navigate(['login']);
        })
      })
    )

  }
}
