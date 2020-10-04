import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {
  isLoading=false;
  private authSubs:Subscription;

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.authSubs=this.authService.getAuthStatus().subscribe((authStatus)=>{
      this.isLoading=false;
    })
  }

  onSignup(form:NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading=true;
    this.authService.createUser(form.value.email,form.value.password);
  }

  ngOnDestroy(){
    this.authSubs.unsubscribe();
  }
}
