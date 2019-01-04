import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  socket = io('http://localhost:3220');
  constructor() { 
    this.initSocket()
  }

  initSocket(){
    this.socket.on('hello', (data) => {
      console.log(data)
    })
  }

  newUser(username){
    this.socket.emit('newUser',username)
  }

  getUsers(): Observable <any>{
    let users;
    return this.socket.on('getUsers',data => {
       console.log(data)
      users = data;
      return users;
     })
  }
}
