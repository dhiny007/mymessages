import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector:'app-header',
  templateUrl:'./header.component.html',
  styleUrls:['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{
  private authStatusSubs:Subscription;
  isAuthenticated:boolean;

  constructor(private authService:AuthService){}

  ngOnInit(){
    this.isAuthenticated=this.authService.getAuthenticationStatus();
    this.authStatusSubs=this.authService.getAuthStatus().subscribe((response)=>{
      this.isAuthenticated=response;
      return this.isAuthenticated;
    })
  }

  onLogout(){
    this.authService.logoutUser();
  }

  ngOnDestroy(){
    this.authStatusSubs.unsubscribe();
  }

}
