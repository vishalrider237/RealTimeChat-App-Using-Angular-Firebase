import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth:AngularFireAuth,private firedb:AngularFireDatabase,private router:Router
    ,private toastr:ToastrService) { 

  }
  register(user:User){
    this.fireauth.createUserWithEmailAndPassword(user.email,user.password).then(result=>{
      console.log(result);
      this.toastr.success('Saving User data...',"Registered Successfully....")
      // save user data
      user.uid=result.user?.uid || '';
      user.displayName = result.user?.displayName || user.name.toUpperCase();
      user.emailVerified=result.user?.emailVerified || false
      user.password=''
     user.imageURL=result.user?.photoURL || 'https://img.icons8.com/?size=512&id=tZuAOUGm9AuS&format=png'
      this.saveUserData(user).then((data)=>{
        console.log(data);
        this.toastr.success("User  data Saved!!")
        this.setUserToLocalStorage(user)
      }).catch(error=>{
        console.log(error);
        this.toastr.error("Error in Saving Data!!")
      })
    }).catch(error=>{
      console.log(error);
      this.toastr.error("Error in signup!!")
    });
    
  }
  saveUserData(user: User) {
    // store in object ,it is basically a nosql
    const userObjectRef:AngularFireObject<User>=this.firedb.object(`users/${user.uid}`)
    return userObjectRef.set(user)
  }
  setUserToLocalStorage(user:User|null){
    localStorage.setItem('user',JSON.stringify(user))
  }
  get loggedInStatus(){
    const userString=localStorage.getItem('user')
    if(userString===null){
      return false
    }
    else{
      return JSON.parse(userString)
    }
  }
  logoutFromLocalStorage(){
    localStorage.removeItem('user')
  }
  signoutFromFirebase(){
    this.fireauth.signOut().then(()=>{
      this.logoutFromLocalStorage()
      this.router.navigate(['/login'])
    }).catch(error=>{
      console.log(error);
      
      this.toastr.error("Error in Logging out!!")
    })
  }
  // login user
  login(email:string,password:string){
   return this.fireauth.signInWithEmailAndPassword(email,password)
         
  }
  getUserByUserId(uid:string | undefined):Observable<User | null>{
    const objectRef:AngularFireObject<User>=this.firedb.object(`users/${uid}`)
   return objectRef.valueChanges()
  }
}
