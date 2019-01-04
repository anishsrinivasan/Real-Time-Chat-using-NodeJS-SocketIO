import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../chat.service'
import * as io from 'socket.io-client';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})

export class HomePageComponent implements OnInit {
  @ViewChild('messagePadding') public messagePadding: ElementRef;

  username: any;
  socket = io('http://localhost:3220');
  users: any = [];
  usersList: any = [];
  usernameFlag = false;
  conversations = [];
  message: any;
  messages: any = [];
  readBy = [];
  checkUserNotifications = true;
  checkBrowserActiveFlag = true;
  checkReadBy = true;
  typingBy = [];
  constructor(private chat: ChatService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    // this.initSocket()
    this.getUsers();
    this.socket.on('hey', data => {
      console.log(data)
    })
    this.newMessage();
    this.messageRead();
    this.onTyping();
  }

  setUsername() {
    if (this.usersList.includes(this.username)) {
      this.openSnackBar('Please Select Another User Name')
    } else {
      this.chat.newUser(this.username)
      this.usernameFlag = true;

      if (this.checkBrowserActiveFlag) {
        this.checkBrowserActive();
      }
    }

  }

  getUsers() {
    this.socket.on('getUsers', data => {
      data.forEach(doc => {
        if (!this.usersList.includes(doc)) {
          this.setUsers(doc)
          this.usersList.push(doc)
        }

      })
      console.log(this.users)
    })


  }

  setUsers(doc) {
    this.users.push({
      username: doc,
      userCount: 0
    })
  }


  sendMessage() {
    this.socket.emit('sendMessage', {
      senderId: this.username,
      msg: this.message
    })
    this.message = '';
  }

  newMessage() {
    this.socket.on('newMessage', (data) => {
      if (data != 'hello friends!') {
        this.updateNotification(data)
        this.messages.push(data)
        this.readBy = [];
        this.goToMessagePadding()
        if (data.senderId != this.username)
          this.openSnackBar('New Message from ' + data.senderId + '')
      }

    })
  }


  updateNotification(data) {
    console.log(data)
    const userIndex = this.users.findIndex(item => item.username === data.senderId);
    let userCount = this.users[userIndex].userCount;
    userCount = userCount + 1;
    this.users[userIndex].userCount = userCount;
    console.log('userIndex', userIndex, this.users[userIndex], userCount, this.users)
  }

  clearUserCount(data) {
    const userIndex = this.users.findIndex(item => item.username === data.username);
    this.users[userIndex].userCount = 0;
    this.socket.emit('setMessageRead', {
      username: this.username
    })
  }

  messageRead() {
    this.socket.on('messageRead', (data) => {
      console.log(data)
      if (!this.readBy.includes(data.username))
        this.readBy.push(data.username)
    })
  }

  checkBrowserActive() {
    document.addEventListener('visibilitychange', (e) => {
      console.log(document.hidden)
      if (!document.hidden) {
        this.socket.emit('setMessageRead', {
          username: this.username
        })
        this.clearUserCountAll();
      }
    })
  }

  clearUserCountAll() {
    this.users.map(doc => {
      doc.userCount = 0;
    })
    console.log(this.users)
  }

  openSnackBar(message) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 2000,
    });
  }

  emitTyping() {
    this.socket.emit('emitTyping', {
      username: this.username
    })
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


}


