import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { MatDialog } from "@angular/material/dialog";
import { DrawingAttrs } from 'src/app/Interfaces/Utils';

@Component({
  selector: 'app-main-activity',
  templateUrl: './main-activity.component.html',
  styleUrls: ['./main-activity.component.scss']
})
export class MainActivityComponent implements OnInit, AfterViewInit {
  @ViewChild('drawBoard', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D | null;
  isDrawing: boolean = false;
  message!: string;
  initials = {
    x: 0,
    y: 0,
  };
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

  constructor(private socket: SocketService, private dialog: MatDialog) { }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = (window.innerWidth * 80) / 100;      // 90% of the screen
    this.canvas.nativeElement.height = (window.innerHeight - 80);   // 80% of the screen
    this.context = this.canvas.nativeElement?.getContext("2d");
    this.context!.fillStyle = this.drawingAttributes.bgcolor;
    this.context?.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  openClearBoardConfirmation(ref: TemplateRef<any>) {
    this.dialog.open(ref);
  }

  handleUserMovement(e: any) {
    e.preventDefault();
    if (!this.isDrawing) return
    this.context?.putImageData(this.snapshot, 0, 0);

    switch( this.drawingAttributes.shape ) {
      case 'freeForm':
        this.drawFreeForm(e);
        break;
      case 'circle':
        this.drawCircle(e);
        break;
      case 'square':
        this.drawRectangle(e);
        break;
      case 'triangle':
        this.drawTriangle(e);
        break;
    }
  }

  initDrawing(e: any) {
    e.preventDefault();
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

  drawFreeForm(e: any) {
    e.preventDefault();
    if (!this.isDrawing) return
    this.context?.lineTo(
      e.clientX - this.canvas.nativeElement.offsetLeft,
      e.clientY - this.canvas.nativeElement.offsetTop
    );
    this.context!.strokeStyle = this.drawingAttributes.color;
    this.context!.lineCap = this.drawingAttributes.lineCap;
    this.context!.lineJoin = this.drawingAttributes.lineJoin;
    this.context?.stroke();
  }

  drawRectangle(e: any) {
    if (!this.drawingAttributes.isFillMode) {
      return this.context?.strokeRect(e.offsetX, e.offsetY, this.initials.x - e.offsetX, this.initials.y - e.offsetY);
    }
    this.context?.fillRect(e.offsetX, e.offsetY, this.initials.x - e.offsetX, this.initials.y - e.offsetY);
  }

  drawCircle(e: any) {
    this.context?.beginPath();
    let radius = Math.sqrt(Math.pow((this.initials.x - e.offsetX), 2) +  Math.pow((this.initials.y - e.offsetY), 2));
    this.context?.arc(this.initials.x, this.initials.y, radius, 0, 2 * Math.PI);
    this.drawingAttributes.isFillMode ? this.context?.fill(): this.context?.stroke();
  }

  drawTriangle(e: any) {
    this.context?.beginPath();
    this.context?.moveTo(this.initials.x, this.initials.y);
    this.context?.lineTo(e.offsetX, e.offsetY);
    this.context?.lineTo(this.initials.x * 2 - e.offsetX, e.offsetY);
    this.context?.closePath();
    this.drawingAttributes.isFillMode ? this.context?.fill() : this.context?.stroke();
  }

  stopDrawing(e: any) {
    e.preventDefault();
    this.context?.closePath();
    this.isDrawing = false;
  }

  resetAttributes() {
    this.drawingAttributes.thickness = 1;
    this.drawingAttributes.color = '#000000';
    this.drawingAttributes.bgcolor = '#FFFFFF';
    this.drawingAttributes.shape =  'freeForm',
    this.drawingAttributes.lineCap =  'round',
    this.drawingAttributes.lineJoin =  'round'
  }

  setColor(e: any) {
    e.preventDefault();
    this.drawingAttributes.color = e;
  }

  clearBoard() {
    this.context?.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }
}
