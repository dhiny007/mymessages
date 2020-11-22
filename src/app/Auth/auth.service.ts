import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthUser } from './authUser.model';
import { BehaviorSubject, Observable} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token:string;
  private isAuthenticated:boolean;
  private tokenTimer:any;
  private userId:string;
  //private authenticationStatus=new Subject<boolean>();
  private authenticationStatus=new BehaviorSubject<boolean>(false);

  constructor(private http:HttpClient,private router:Router) { }

  getToken(){
    return this.token;
  }

  getAuthStatus(){
    //console.log(this.authenticationStatus);
    return this.authenticationStatus.asObservable();
  }

  getUserId(){
    return this.userId;
  }

  getAuthenticationStatus(){
    return this.isAuthenticated;
  }

  createUser(email:string,password:string){
    const authData:AuthUser={email:email,password:password};
    this.http.post('http://localhost:3000/api/user/signup',authData)
    .subscribe(()=>{
      this.router.navigate(['/']);
    },error => {
      this.authenticationStatus.next(false);
      console.log(error);
    })
  }

  loginUser(email:string,password:string){
    const authData={email:email,password:password};
    this.http.post<{token:string,expiresIn:number,userId:string}>('http://localhost:3000/api/user/login',authData)
    .subscribe(result=>{
      const token=result.token;
      this.token=token;
      if(token){
        const expiresInDuration=result.expiresIn;
        console.log(this.token);
        this.userId=result.userId;
        this.authenticationStatus.next(true);
        this.isAuthenticated=true;
        const now=new Date();
        const expirationDate=new Date(now.getTime() + expiresInDuration*1000 );
        console.log(expirationDate);
        this.saveAuthData(token,expirationDate,this.userId);
        this.router.navigate(['/postlist']);
      }
    },error => {
      this.authenticationStatus.next(false);
      console.log(error);
    })
  }

  logoutUser(){
    this.token=null;
    this.authenticationStatus.next(false);
    this.isAuthenticated=false;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId=null;
    this.router.navigate(['/login']);
  }

  private saveAuthData(token:string,expirationDate:Date,userId:string){
    localStorage.setItem('token',token);
    localStorage.setItem('expirationDate',expirationDate.toISOString());
    localStorage.setItem('userId',userId);
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

  private getAuthData(){
    const token=localStorage.getItem('token');
    const expirationDate=localStorage.getItem('expirationDate');
    const userId=localStorage.getItem('userId');
    if(!token || !expirationDate){
      return;
    }
    return {
      token:token,
      expirationDate:new Date(expirationDate),
      userId:userId
    }
  }

  private setAuthTimer(duration:number){
    console.log(duration);
    this.tokenTimer=setTimeout(()=>{
      this.logoutUser();
    },duration*1000);
  }

  autoAuthUser(){
    const authInformation=this.getAuthData();
    if(!authInformation){
      return;
    }
    const now=new Date();
    this.userId=authInformation.userId;
    const expiresIn=authInformation.expirationDate.getTime() - now.getTime();
    console.log(authInformation,expiresIn);
    if(expiresIn>0){
      this.token=authInformation.token;
      this.isAuthenticated=true;
      this.setAuthTimer(expiresIn/1000);
      this.authenticationStatus.next(true);
    }
  }
}
