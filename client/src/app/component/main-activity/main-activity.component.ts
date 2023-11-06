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

    this.socket.onBindCanvas().subscribe((shapeDrawableVariables: any) => {
      console.log(shapeDrawableVariables);
      this.handleIncomingSocket(shapeDrawableVariables);
    })

    this.socket.onClearCanvas().subscribe(() => {
      this.clearBoard(true)
    })
  }

  initCanvas() {
    this.context = this.canvas.nativeElement?.getContext("2d");
    this.context!.fillStyle = this.drawingAttributes.bgcolor;
    this.context?.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  openClearBoardConfirmation(ref: TemplateRef<any>) {
    this.dialog.open(ref);
  }

  initDrawing(e: any) {
    this.isDrawing = true;
    this.initials.x = e.offsetX;
    this.initials.y = e.offsetY;
    this.context?.beginPath();

    this.context!.lineWidth = this.drawingAttributes.thickness;
    this.context!.fillStyle = this.drawingAttributes.color;
    this.context!.strokeStyle = this.drawingAttributes.color;
    this.context!.lineJoin = this.drawingAttributes.lineJoin;
    this.context!.lineCap = this.drawingAttributes.lineCap;

    this.snapshot = this.context?.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  handleUserMovement(e: any) {
    if (!this.isDrawing) return

    this.context?.putImageData(this.snapshot, 0, 0);
    var shapeDrawableVariables;
    switch (this.drawingAttributes.shape) {
      case 'freeForm':
        shapeDrawableVariables = {
          lineFrom: e.clientX - this.canvas.nativeElement.offsetLeft,
          lineTo: e.clientY - this.canvas.nativeElement.offsetTop
        }
        this.drawingService.drawFreeForm(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
      case 'circle':
        shapeDrawableVariables = {
          offsetX: e.offsetX,
          offsetY: e.offsetY,
          initX: this.initials.x,
          initY: this.initials.y
        }
        this.drawingService.drawCircle(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
      case 'square':
        shapeDrawableVariables = {
          offsetX: e.offsetX,
          offsetY: e.offsetY,
          initX: this.initials.x,
          initY: this.initials.y
        }
        this.drawingService.drawRectangle(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
      case 'triangle':
        shapeDrawableVariables = {
          offsetX: e.offsetX,
          offsetY: e.offsetY,
          initX: this.initials.x,
          initY: this.initials.y
        }
        this.drawingService.drawTriangle(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
    }
  }

  handleIncomingSocket(shapeDrawableVariables: any) {
    if (!this.isDrawing) return
    this.context?.putImageData(this.snapshot, 0, 0);
    switch (this.drawingAttributes.shape) {
      case 'freeForm':
        this.drawingService.drawFreeForm(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
      case 'circle':
        this.drawingService.drawCircle(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
      case 'square':
        this.drawingService.drawRectangle(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
      case 'triangle':
        this.drawingService.drawTriangle(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
    }
  }

  stopDrawing(e: any) {
    this.context?.closePath();
    this.isDrawing = false;
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
