import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthUser } from './authUser.model';
import { BehaviorSubject} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token:string;
  //private authenticationStatus=new Subject<boolean>();
  private authenticationStatus=new BehaviorSubject<boolean>(false);

  constructor(private http:HttpClient,private router:Router) { }

  getToken(){
    return this.token;
  }

  getAuthStatus(){
    return this.authenticationStatus.asObservable();
  }

  createUser(email:string,password:string){
    const authData:AuthUser={email:email,password:password};
    this.http.post('http://localhost:3000/api/user/signup',authData)
    .subscribe(response=>{
      console.log(response);
    })
  }

  loginUser(email:string,password:string){
    const authData={email:email,password:password};
    this.http.post<{token:string}>('http://localhost:3000/api/user/login',authData)
    .subscribe(result=>{
      const token=result.token;
      this.token=token;
      console.log(this.token);
      this.authenticationStatus.next(true);
      this.router.navigate(['/']);
    })
  }

  logoutUser(){
    this.token=null;
    this.authenticationStatus.next(false);
    this.router.navigate(['/']);
  }
}
