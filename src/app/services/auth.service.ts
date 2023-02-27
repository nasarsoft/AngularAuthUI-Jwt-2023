import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';

import { JwtModule,JwtHelperService } from "@auth0/angular-jwt";
import { TokenApiModel } from '../models/token-api.model';
//import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "https://localhost:7176/api/User/"
  private userPayload:any;
  constructor(private http: HttpClient,
    private router : Router ) { 
      this.userPayload=this.decodeToken()
    }

  signUp(userObj: any) {
      return this.http.post<any>(`${this.baseUrl}register`,userObj)
  }

  signOut(){
    localStorage.clear();
    this.router.navigate(['login']);
    //localStorage.removeItem('token');
  }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}authenticate`,loginObj)
  }

  storeToken(tokenValue:string){
    localStorage.setItem('token',tokenValue)
  }
  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  storeRefreshToken(tokenValue:string){
    localStorage.setItem('refreshToken',tokenValue)
  }
  
  getToken(){
    return localStorage.getItem('token');
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('token');
  }

  decodeToken(){
    const jwtHelper=new JwtHelperService();
    const Token =this.getToken()!;
    console.log(jwtHelper.decodeToken(Token)) ;
    return jwtHelper.decodeToken(Token); 
  }

   getFullNameFromToken(){
    if(this.userPayload)
    return this.userPayload.name;
   }

   getRoleFromStore(){
    if(this.userPayload)
    return this.userPayload.role;
   }


   rewToken(tokenApi :TokenApiModel){
    return this.http.post<any>(`${this.baseUrl}refresh`,tokenApi);
   }
}
