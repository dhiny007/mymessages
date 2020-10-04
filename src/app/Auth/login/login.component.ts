import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  isLoading=false;
  private authSubs:Subscription;

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.authSubs=this.authService.getAuthStatus().subscribe(
      (authStatus) => {
        this.isLoading=false;
      }
    )
  }

  onLogin(form:NgForm){
    this.isLoading=true;
    if (form.invalid) {
      return;
    }
    this.authService.loginUser(form.value.email,form.value.password);
  }

  ngOnDestroy(){
    this.authSubs.unsubscribe();
  }
}
