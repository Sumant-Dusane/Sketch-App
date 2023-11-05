import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) { }

  sendMsg(message: string) {
    this.socket.emit('new-msg', message);
  }

  onGetMsg() {
    return this.socket.fromEvent('new-msg');
  }
}
