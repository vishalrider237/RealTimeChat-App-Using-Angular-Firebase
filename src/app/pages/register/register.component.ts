import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(private toaster:ToastrService,private authservice:AuthService){

  }
    user:User=new User();
    formSubmit(event:SubmitEvent){
      event.preventDefault();
      console.log(this.user);
      // validate data
      // blank name is not allowed
      if(this.user.name.trim()===''){
       this.toaster.error('Name is Required')
        return;
      }
      if(this.user.email.trim()===''){
        this.toaster.error('Email is Required')
         return;
       }
       if(this.user.password.trim()===''){
        this.toaster.error('Password is Required')
         return;
       }
       if(this.user.about.trim()===''){
        this.toaster.error('About is Required')
         return;
       }
       // register code here
       this.authservice.register(this.user)
    }
}
