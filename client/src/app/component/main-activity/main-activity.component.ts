import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { SocketService } from 'src/app/services/SocketService/socket.service';
import { MatDialog } from "@angular/material/dialog";
import { DrawingAttrs } from 'src/app/Utils/Interface';
import { DrawService } from 'src/app/services/DrawService/draw.service';
import { changeDrawingState, updateCanvasContext, updateCurrentShape, updateDrawingAttributes, updateSnapShot } from 'src/app/app-state/app.action';
import { contextSelector, currShapeSelector, drawingAttributesSelector, drawingStateSelector, snapshotSelector } from 'src/app/app-state/app.reducer';

@Component({
  selector: 'app-main-activity',
  templateUrl: './main-activity.component.html',
  styleUrls: ['./main-activity.component.scss']
})
export class MainActivityComponent implements AfterViewInit {
  @ViewChild('drawBoard', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  drawingAttributes!: DrawingAttrs;
  context!: CanvasRenderingContext2D | null;
  isDrawing!: boolean;
  snapshot!: ImageData | null;
  currentShape!: "freeForm" | "circle" | "square" | "triangle";
  initials = {
    x: 0,
    y: 0,
  };

  constructor(private store: Store, private socket: SocketService, private dialog: MatDialog, private drawingService: DrawService) { }

  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = (window.innerWidth * 80) / 100;      // 90% of the screen
    this.canvas.nativeElement.height = (window.innerHeight - 80);   // 80% of the screen


    this.store.select(contextSelector).subscribe(context => {
      this.context = context;
    })
    this.store.select(drawingAttributesSelector).subscribe(drawingAttributes => {
      this.drawingAttributes = drawingAttributes
    })
    this.store.select(currShapeSelector).subscribe(currShape => {
      this.currentShape = currShape
    })
    this.store.select(snapshotSelector).subscribe(snapshot => {
      this.snapshot = snapshot
    })

    this.initCanvas();

    // this.socket.onBindCanvas().subscribe((shapeDrawableVariables: any) => {
    //   console.log(shapeDrawableVariables);
    //   this.handleIncomingSocket(shapeDrawableVariables);
    // })

    // this.socket.onClearCanvas().subscribe(() => {
    //   this.clearBoard(true)
    // })
  }

  initCanvas() {
    this.store.dispatch(updateCanvasContext({context: this.canvas.nativeElement?.getContext("2d")}));

    if(this.context) {
      this.context!.fillStyle = this.drawingAttributes.boardColor;
      this.context?.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
  }

  openClearBoardConfirmation(ref: TemplateRef<any>) {
    this.dialog.open(ref);
  }

  initDrawing(e: any) {
    this.store.dispatch(changeDrawingState({isDrawing: true}));

    this.initials.x = e.offsetX;
    this.initials.y = e.offsetY;
    this.context?.beginPath();

    this.context!.lineWidth = this.drawingAttributes.thickness;
    this.context!.fillStyle = this.drawingAttributes.brushColor;
    this.context!.strokeStyle = this.drawingAttributes.brushColor;
    this.context!.lineJoin = this.drawingAttributes.joinStyle;
    this.context!.lineCap = this.drawingAttributes.capStyle;

    this.store.dispatch(updateSnapShot({snapshot: this.context!.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)}))
  }

  handleUserMovement(e: any) {
    if (!this.isDrawing) return

    this.context?.putImageData(this.snapshot!, 0, 0);

    var shapeDrawableVariables;
    switch (this.currentShape) {
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
    this.context?.putImageData(this.snapshot!, 0, 0);
    switch (this.currentShape) {
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
    this.store.dispatch(changeDrawingState({isDrawing: false}))
  }

  resetAttributes() {
    let reset: DrawingAttrs = {
      brushColor: '#000000',
      boardColor: '#FFFFFF',
      thickness: 1,
      capStyle: 'round',
      joinStyle: 'round',
      isFillMode: false
    }
    this.store.dispatch(updateDrawingAttributes({drawingAttributes: reset}));
    this.store.dispatch(updateCurrentShape({currShape: 'freeForm'}));
  }

  setColor(e: any) {
    this.drawingAttributes.brushColor = e;
  }

  clearBoard(isServer: boolean = false) {
    this.context?.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.initCanvas();
    // if (!isServer) this.socket.clearCanvas();
  }
}
