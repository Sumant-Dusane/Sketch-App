import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SocketService } from 'src/app/services/SocketService/socket.service';
import { MatDialog } from "@angular/material/dialog";
import { DrawingAttrs } from 'src/app/Utils/Interface';
import { DrawService } from 'src/app/services/DrawService/draw.service';

@Component({
  selector: 'app-main-activity',
  templateUrl: './main-activity.component.html',
  styleUrls: ['./main-activity.component.scss']
})
export class MainActivityComponent implements AfterViewInit {
  @ViewChild('drawBoard', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D | null;
  isDrawing: boolean = false;
  snapshot: any;
  drawingAttributes: DrawingAttrs = {
    thickness: 1,
    color: '#000000',
    bgcolor: '#FFFFFF',
    shape: 'freeForm',
    lineCap: 'round',
    lineJoin: 'round',
    isFillMode: false
  };
  initials = {
    x: 0,
    y: 0,
  };

  constructor(private socket: SocketService, private dialog: MatDialog, private drawingService: DrawService) { }

  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = (window.innerWidth * 80) / 100;      // 90% of the screen
    this.canvas.nativeElement.height = (window.innerHeight - 80);   // 80% of the screen
    this.initCanvas();

    this.socket.onInitBoard().subscribe((e: any) => {
      // this.initDrawing(e);
      this.onDown();
    })

    this.socket.onBindCanvas().subscribe((shapeDrawableVariables: any) => {
      this.onMove(shapeDrawableVariables)
      // this.handleIncomingSocket(shapeDrawableVariables, true);
    })

    this.socket.onStopDrawing().subscribe((data: any) => {
      this.onUp(data.x, data.y)
      // this.stopDrawing(context, true);
    })

    this.socket.onClearCanvas().subscribe(() => {
      // this.clearBoard(true)
    })
  }

  initCanvas() {
    this.context = this.canvas.nativeElement?.getContext("2d");
    this.context!.fillStyle = this.drawingAttributes.bgcolor;
    this.context?.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.snapshot = this.context?.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }


  onDown() {
    this.context?.beginPath();
  }

  onMove(shapeDrawableVariables: any) {
    switch (this.drawingAttributes.shape) {
      case 'freeForm':
        this.drawingService.drawFreeForm(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
      case 'circle':
        this.context?.putImageData(this.snapshot, 0, 0);
        this.drawingService.drawCircle(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
      case 'square':
        this.context?.putImageData(this.snapshot, 0, 0);
        this.drawingService.drawRectangle(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
      case 'triangle':
        this.context?.putImageData(this.snapshot, 0, 0);
        this.drawingService.drawTriangle(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
    }
  }

  onUp(x: any, y: any) {
    this.context?.moveTo(x, y);
  }

  mouseDownListener(e: any) {
    this.socket.initBoard(e);
    this.isDrawing = true;
    this.context?.beginPath();

    this.initials.x = e.offsetX;
    this.initials.y = e.offsetY;
    this.context!.lineWidth = this.drawingAttributes.thickness;
    this.context!.fillStyle = this.drawingAttributes.color;
    this.context!.strokeStyle = this.drawingAttributes.color;
    this.context!.lineJoin = this.drawingAttributes.lineJoin;
    this.context!.lineCap = this.drawingAttributes.lineCap;
    this.snapshot = this.context?.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  mouseMoveListener(e: any) {
    var shapeDrawableVariables;
    if (!this.isDrawing) return
    switch (this.drawingAttributes.shape) {
      case 'freeForm':
        shapeDrawableVariables = {
          lineFrom: e.clientX - this.canvas.nativeElement.offsetLeft,
          lineTo: e.clientY - this.canvas.nativeElement.offsetTop
        }
        this.socket.bindCanvas(shapeDrawableVariables);
        this.drawingService.drawFreeForm(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
      case 'circle':
        this.context?.putImageData(this.snapshot, 0, 0);
        shapeDrawableVariables = {
          offsetX: e.offsetX,
          offsetY: e.offsetY,
          initX: this.initials.x,
          initY: this.initials.y
        }
        this.socket.bindCanvas(shapeDrawableVariables);
        this.drawingService.drawCircle(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
      case 'square':
        this.context?.putImageData(this.snapshot, 0, 0);
        shapeDrawableVariables = {
          offsetX: e.offsetX,
          offsetY: e.offsetY,
          initX: this.initials.x,
          initY: this.initials.y
        }
        this.socket.bindCanvas(shapeDrawableVariables);
        this.drawingService.drawRectangle(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
      case 'triangle':
        this.context?.putImageData(this.snapshot, 0, 0);
        shapeDrawableVariables = {
          offsetX: e.offsetX,
          offsetY: e.offsetY,
          initX: this.initials.x,
          initY: this.initials.y
        }
        this.socket.bindCanvas(shapeDrawableVariables);
        this.drawingService.drawTriangle(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
    }
  }

  mouseUpListener(e: any) {
    let data = {
      x: e.clientX - this.canvas.nativeElement.offsetLeft,
      y: e.clientY - this.canvas.nativeElement.offsetTop
    }
    this.socket.stopDrawing(data);
    this.isDrawing = false;
    this.context?.stroke();
    this.context?.closePath();
  }

  openClearBoardConfirmation(ref: TemplateRef<any>) {
    this.dialog.open(ref);
  }

  resetAttributes() {
    this.drawingAttributes.thickness = 1;
    this.drawingAttributes.color = '#000000';
    this.drawingAttributes.bgcolor = '#FFFFFF';
    this.drawingAttributes.shape = 'freeForm',
      this.drawingAttributes.lineCap = 'round',
      this.drawingAttributes.lineJoin = 'round'
  }

  setColor(e: any) {
    this.drawingAttributes.color = e;
  }

  clearBoard(isServer: boolean = false) {
    this.context?.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.initCanvas();
    if (!isServer) this.socket.clearCanvas();
  }
}
