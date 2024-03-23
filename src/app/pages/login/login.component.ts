import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private toastr:ToastrService,private authservice:AuthService,private router:Router){}
  loginData={
    email:'',
    password:''
  }
  loginFormSubmitted(event:SubmitEvent){
    event.preventDefault()
     console.log(this.loginData);
     if(this.loginData.email.trim()===''){
       this.toastr.warning("Email is Required!!")
       return

     }
     if(this.loginData.password.trim()===''){
      this.toastr.warning("Password is Required!!")
      return
    }
    this.authservice.login(this.loginData.email,this.loginData.password).then((result)=>{
      console.log(result);
      
      // fetch userinfo with userid
      this.authservice.getUserByUserId(result.user?.uid).subscribe(user=>{
        console.log(user);
        this.authservice.setUserToLocalStorage(user)
        this.router.navigate(['/chat-dashboard'])
      })
    }).catch((error)=>{
      this.toastr.error("Error in SignIn")
      console.log(error);
      
    })
  }
  
    
}
