import { Injectable } from '@angular/core';
import { SocketService } from '../SocketService/socket.service';
import { DrawingAttrs } from 'src/app/Utils/Interface';

@Injectable({
  providedIn: 'root'
})
export class DrawService {

  constructor(private socket: SocketService) { }

  drawFreeForm(shapeDrawableVariables: any, drawAttrs: DrawingAttrs, context: CanvasRenderingContext2D | null) {
    const { lineFrom, lineTo } = shapeDrawableVariables;
    context?.lineTo( lineFrom, lineTo );
    context!.strokeStyle = drawAttrs.color;
    context!.lineCap = drawAttrs.lineCap;
    context!.lineJoin = drawAttrs.lineJoin;
    context?.stroke();

    this.socket.bindCanvas(shapeDrawableVariables);
  }

  drawRectangle(shapeDrawableVariables: any, drawAttrs: any, context: CanvasRenderingContext2D | null) {
    const { offsetX, offsetY, initX, initY } = shapeDrawableVariables;

    if (!drawAttrs.isFillMode) {
      context?.strokeRect(offsetX, offsetY, initX - offsetX, initY - offsetY);
    } else {
      context?.fillRect(offsetX, offsetY, initX - offsetX, initY - offsetY);
    }
    this.socket.bindCanvas(shapeDrawableVariables);
  }

  drawCircle(shapeDrawableVariables: any, drawAttrs: any, context: CanvasRenderingContext2D | null) {
    const { offsetX, offsetY, initX, initY } = shapeDrawableVariables;

    context?.beginPath();
    let radius = Math.sqrt(Math.pow((initX - offsetX), 2) + Math.pow((initY - offsetY), 2));
    context?.arc(initX, initY, radius, 0, 2 * Math.PI);
    drawAttrs.isFillMode ? context?.fill() : context?.stroke();

    this.socket.bindCanvas(shapeDrawableVariables);
  }

  drawTriangle(shapeDrawableVariables: any, drawAttrs: any, context: CanvasRenderingContext2D | null) {
    const { offsetX, offsetY, initX, initY } = shapeDrawableVariables;
    context?.beginPath();
    context?.moveTo(initX, initY);
    context?.lineTo(offsetX, offsetY);
    context?.lineTo(initX * 2 - offsetX, offsetY);
    context?.closePath();
    drawAttrs.isFillMode ? context?.fill() : context?.stroke();

    this.socket.bindCanvas(shapeDrawableVariables);
  }
}


