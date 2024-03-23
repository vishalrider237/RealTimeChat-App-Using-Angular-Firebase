import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
     public userList:User[]=[]
  @Output() startChatEmitter:EventEmitter<string>=new EventEmitter()
     constructor(private fireDb:AngularFireDatabase){
     const userListRef:AngularFireList<User>= this.fireDb.list("users")
      userListRef.valueChanges().subscribe(users=>{
        this.userList=users
      })
     }
     StartChatChild(uid:string){
        this.startChatEmitter.next(uid)
     }
}
