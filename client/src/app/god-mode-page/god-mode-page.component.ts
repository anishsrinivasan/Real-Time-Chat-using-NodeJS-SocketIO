import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import * as io from 'socket.io-client';
import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-god-mode-page',
  templateUrl: './god-mode-page.component.html',
  styleUrls: ['./god-mode-page.component.scss']
})
export class GodModePageComponent implements OnInit {
  @ViewChild('messagePadding') public messagePadding: ElementRef;
  socket = io('http://localhost:3220');
  messages:any;
  readBy = []
  typingBy = [];
  colors = ['','#000000','#f39c12','#8e44ad']
  avatarList;
  constructor(public snackBar: MatSnackBar,private http:HttpClient) { }

  ngOnInit() {
    this.getData();
    
    this.messageRead();
    this.onTyping();
    this.getAvatarList()
  }


  getAvatarList(){
    this.avatarList = [
      {id:'1',path:'../../assets/images/avatars/boy.png'},
      {id:'2',path:'../../assets/images/avatars/man-1.png'},
      {id:'3',path:'../../assets/images/avatars/girl.png'},
      {id:'4',path:'../../assets/images/avatars/girl-1.png'},
    ]
  }


  getAvatarPath(image){
    console.log(image)
    const index = this.avatarList.findIndex(avatar => avatar.id == image)
    return this.avatarList[index].path
  }


  getData(){
    this.http.get('http://localhost:3000/getMessages').subscribe(res => {
      this.messages = res;
      this.newMessage()
    })
  }


  newMessage() {
    this.socket.on('newMessage', (data) => {
      if (data != 'hello friends!') {
        data.timestamp = new Date()
        this.messages.push(data)
        this.readBy = [];
        this.goToMessagePadding()
        if (data.senderId)
          this.openSnackBar('New Message from ' + data.senderId + '')
      }

    })
  }


  messageRead() {
    this.socket.on('messageRead', (data) => {
      console.log(data)
      if (!this.readBy.includes(data.username))
        this.readBy.push(data.username)
    })
  }

  openSnackBar(message) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 2000,
    });
  }

  onTyping() {
    this.socket.on('onTyping', data => {

      if (!this.typingBy.includes(data.username)) {
        this.typingBy.push(data.username)
        console.log(this.typingBy)
        setTimeout(() => {
          this.typingBy = [];
          console.log('Typing Done', this.typingBy)
        }, 1000)
      }

    })
  }

  goToMessagePadding() {
    this.messagePadding.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });

  }

  getColor(){
    const index = Math.floor(Math.random() * 3) + 1 
    return this.colors[index]
  }

}
