import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) { }

  bindCanvas(data: any) {
    this.socket.emit('bind-canvas', data);
  }

  clearCanvas() {
    this.socket.emit('clear-canvas');
    console.log("clear");
  }

  onBindCanvas() {
    return this.socket.fromEvent('bind-canvas');
  }

  onClearCanvas() {
    return this.socket.fromEvent('clear-canvas');
  }
}
