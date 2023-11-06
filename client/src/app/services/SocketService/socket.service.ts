import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) { }

  initBoard(data: any) {
    this.socket.emit('init-board', data);
  }

  bindCanvas(data: any) {
    this.socket.emit('bind-canvas', data);
  }

  stopDrawing(context: any) {
    this.socket.emit('stop-drawing', context);
  }

  clearCanvas() {
    this.socket.emit('clear-canvas');
    console.log("clear");
  }

  onInitBoard() {
    return this.socket.fromEvent('init-board');
  }

  onBindCanvas() {
    return this.socket.fromEvent('bind-canvas');
  }

  onStopDrawing() {
    return this.socket.fromEvent('stop-drawing');
  }

  onClearCanvas() {
    return this.socket.fromEvent('clear-canvas');
  }
}
