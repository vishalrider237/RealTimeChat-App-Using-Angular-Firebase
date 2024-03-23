import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.scss']
})
export class ChatDashboardComponent {
  currentUser!:User|null
  toUser!:User|null
  message:string=''
  chatRefNode:string=''
  oppChatRefNode:string=''
  chatSubscription!:Subscription
  chats:Message[]=[]
  @ViewChild("messageBox",{static:false})messageBox!:ElementRef
   constructor(public authhservice:AuthService,private fireAuth:AngularFireAuth,private angularFireDb:AngularFireDatabase,private toastr:ToastrService){
    // Current LoggedIn User
    this.fireAuth.authState.subscribe((user)=>{
      console.log(user);
      this.authhservice.getUserByUserId(user?.uid).subscribe((user)=>{
        this.currentUser=user
        console.log(this.currentUser);
        
      })
    })
   }
   StartChatParent(uid:string){
    if(this.chatSubscription){
      this.chatSubscription.unsubscribe()
    }
    this.chats=[]
    this.chatRefNode=`chats/${this.currentUser?.uid}****${uid}`
    this.oppChatRefNode=`chats/${uid}****${this.currentUser?.uid}`
      console.log('Parent '+uid);
      this.authhservice.getUserByUserId(uid).subscribe(
        {
          next:(user)=>{
            this.toUser=user
            console.log(this.toUser);
            document.title=user?.name || 'Chat App'
            this.loadChat()
          },
          error:(error)=>{
             this.toastr.error("Error in Starting Chat")
             console.log(error);
             
          }
          
        }
      )
   }
  loadChat() {
   this.chatSubscription=this.angularFireDb.list(this.chatRefNode).valueChanges().subscribe((chatList:any[])=>{
     this.chats=chatList
     if(this.chats.length<=0){
      this.chatSubscription.unsubscribe()
          this.chatSubscription=  this.angularFireDb.list(this.oppChatRefNode).valueChanges().subscribe((chatList:any[])=>{
           this.chats=chatList
           this.chatRefNode=this.oppChatRefNode
           this.ScrollBottom()
           })
     }
     else{
      this.ScrollBottom()
     }
   })
  }
   SendMessage(event:SubmitEvent){
      event.preventDefault()
      if(this.message.trim()===''){
        return
      }
      console.log(this.message);
      // send the message
      const message:Message=new Message()
      message.message=this.message
      message.from=this.currentUser?.uid ||''
      message.to=this.toUser?.uid || ''
      const chatRef:AngularFireObject<Message>=this.angularFireDb.object(
        `${this.chatRefNode}/${new Date()}`)
      chatRef.set(message).then(data=>{
        this.toastr.success("Message Send Successfully")
        this.ScrollBottom()
        this.message=''
      }).catch(error=>{
          console.log(error);
          this.toastr.error("Error in Sending Message!!")
      })
     
      
   }
   ScrollBottom(){
         this.messageBox.nativeElement.scrollTo({
            left:0,
            top:this.messageBox.nativeElement.scrollHeight,
            behaviour:'smooth'
         })
   }


}
