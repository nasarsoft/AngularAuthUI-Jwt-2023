import { Component } from '@angular/core';

import {FormBuilder,FormGroup,Validators} from '@angular/forms'
import { Router } from '@angular/router';
import validateAllForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  type : string ="password";
  isText : boolean =false;
  eyeIcon :string ="fa-eye-slash"; 

  loginForm!: FormGroup;
  constructor(private fb: FormBuilder,
    private auth :AuthService,
    private router :Router,
    private toast: NgToastService,
    private  userStore: UserStoreService){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
    this.loginForm=this.fb.group({
       username:['',Validators.required],
       password:['', Validators.required]
    });
  }

  hideShowPass(){
    this.isText =!this.isText;
    this.isText? this.eyeIcon="fa-eye":this.eyeIcon="fa-eye-slash";
    this.isText? this.type="text":this.type="password"; 
  }


  onSignIn(){
    if(this.loginForm.valid){

      console.log(this.loginForm.value);

      this.auth.login(this.loginForm.value).subscribe({
        next:(res=>{
         // alert(res.message)
         this.loginForm.reset;
         this.auth.storeToken(res.accessToken);
         this.auth.storeRefreshToken(res.refreshToken);
         const tokenPayload=this.auth.decodeToken();
         this.userStore.setfullNameForStore(tokenPayload.name);
         this.userStore.setRoleForStore(tokenPayload.role);
          this.toast.success({detail:"SUCCESS",summary:res.message,duration:5000})
         
          this.router.navigate(['dashboard']);

        }),
        error:(err=>{
          //alert(err?.error.message)
          console.log(err);
          this.toast.error({detail:"ERROR",summary:err?.message,duration:5000})
        })
      })
    }else{
      validateAllForm.validateAllFormFields(this.loginForm)
    }
  }
  
}
