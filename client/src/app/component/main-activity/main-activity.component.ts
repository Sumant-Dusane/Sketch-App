import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SocketService } from 'src/app/services/SocketService/socket.service';
import { DrawingAttrs } from 'src/app/Utils/Interface';
import { DrawService } from 'src/app/services/DrawService/draw.service';

@Component({
  selector: 'app-main-activity',
  templateUrl: './main-activity.component.html',
  styleUrls: ['./main-activity.component.scss']
})
export class MainActivityComponent implements AfterViewInit {

  // Decelaring/Initializing Variables
  @ViewChild('drawBoard', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D | null;
  isDrawing: boolean = false;
  snapshot!: ImageData;
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

  // Instantiate service file classes
  constructor(private socket: SocketService, private drawingService: DrawService) { }

  // Initializing Canvas as soon as Angular Lifecycle fully initialized component's view
  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = (window.innerWidth * 80) / 100;      // 90% of the screen
    this.canvas.nativeElement.height = (window.innerHeight * 85) / 100;   // 80% of the screen
    this.initCanvas();

    this.socket.onInitBoard().subscribe((drawingAttributes: any) => {
      this.onDown(drawingAttributes);
    })

    this.socket.onBindCanvas().subscribe((data: any) => {
      this.onMove(data)
    })

    this.socket.onStopDrawing().subscribe((data: any) => {
      this.onUp(data.x, data.y)
    })

    this.socket.onClearCanvas().subscribe(() => {
      this.clearBoard(true);
    })
  }

  // Instantiate canvas context and assign snapshot
  initCanvas() {
    this.context = this.canvas.nativeElement?.getContext("2d");
    this.context!.fillStyle = this.drawingAttributes.bgcolor;
    this.context?.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.snapshot = this.context!.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  // Triggers when another client tries to trigger mousedown listener
  onDown(drawingAttributes: any) {
    this.context?.beginPath();

    this.context!.lineWidth = drawingAttributes.thickness;
    this.context!.fillStyle = drawingAttributes.color;
    this.context!.strokeStyle = drawingAttributes.color;
    this.context!.lineJoin = drawingAttributes.lineJoin;
    this.context!.lineCap = drawingAttributes.lineCap;
  }

  // Triggers when another client is drawing on his board
  onMove(data: any) {
    const { shapeDrawableVariables, drawingAttributes } = data;
    switch (this.drawingAttributes.shape) {
      case 'freeForm':
        this.drawingService.drawFreeForm(shapeDrawableVariables, drawingAttributes, this.context);
        break;
      case 'circle':
        this.context?.putImageData(this.snapshot, 0, 0);
        this.drawingService.drawCircle(shapeDrawableVariables, drawingAttributes, this.context);
        break;
      case 'square':
        this.context?.putImageData(this.snapshot, 0, 0);
        this.drawingService.drawRectangle(shapeDrawableVariables, drawingAttributes, this.context);
        break;
      case 'triangle':
        this.context?.putImageData(this.snapshot, 0, 0);
        this.drawingService.drawTriangle(shapeDrawableVariables, drawingAttributes, this.context);
        break;
    }
  }

  // Triggers when another client ends up drawing
  onUp(x: any, y: any) {
    this.context?.moveTo(x, y);
  }

  // Triggers when self device notices mousedown listener
  mouseDownListener(e: any) {
    this.isDrawing = true;
    this.context?.beginPath();

    this.initials.x = e.offsetX;
    this.initials.y = e.offsetY;

    this.context!.lineWidth = this.drawingAttributes.thickness;
    this.context!.fillStyle = this.drawingAttributes.color;
    this.context!.strokeStyle = this.drawingAttributes.color;
    this.context!.lineJoin = this.drawingAttributes.lineJoin;
    this.context!.lineCap = this.drawingAttributes.lineCap;

    this.socket.initBoard(this.drawingAttributes);            // call Service file to bind the user mousedown to all connected clients

    // this.snapshot = this.context?.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  // Triggers when self device notices mousemove listener
  mouseMoveListener(e: any) {
    var shapeDrawableVariables;
    if (!this.isDrawing) return
    switch (this.drawingAttributes.shape) {
      case 'freeForm':
        shapeDrawableVariables = {
          lineFrom: e.clientX - this.canvas.nativeElement.offsetLeft,
          lineTo: e.clientY - this.canvas.nativeElement.offsetTop
        }

        let data = {
          shapeDrawableVariables,
          drawingAttributes: this.drawingAttributes
        }
        this.socket.bindCanvas(data);                             // call Service file to bind the user mousemove to all connected clients
        this.drawingService.drawFreeForm(shapeDrawableVariables, this.drawingAttributes, this.context);
        break;
      case 'circle':
        // this.context?.putImageData(this.snapshot, 0, 0);
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
        // this.context?.putImageData(this.snapshot, 0, 0);
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
        // this.context?.putImageData(this.snapshot, 0, 0);
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

  // Triggers when self device notices mouseup listener
  mouseUpListener(e: any) {
    let data = {
      x: e.clientX - this.canvas.nativeElement.offsetLeft,
      y: e.clientY - this.canvas.nativeElement.offsetTop
    }
    this.socket.stopDrawing(data);              // call Service file to bind the user mouseup to all connected clients
    this.isDrawing = false;
    this.context?.stroke();
    this.context?.closePath();
  }

  // Get emitted value from sidebar (child) component and upates accordingly
  updateDrawingAttributes(drawingAttributes: DrawingAttrs) {
    this.drawingAttributes = drawingAttributes;
  }

  // Get emitted value from sidebar (child) component and clear the board
  clearBoard(isServer: boolean = false) {
    this.context?.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.initCanvas();
    if (!isServer) this.socket.clearCanvas();               // call Service file to clear the board from all clients
  }

  // Get emitted value from header (child) component and generated download link
  downloadLink() {
    const url = this.canvas.nativeElement.toDataURL('image/png');
    const anchor = document.createElement('a');
    //  Functionality is it programatically creates anchor tag and triggest onclick
    anchor.href = url;
    anchor.download = 'image.png'
    anchor.click();
  }
}
