import { Component, EventEmitter, Output, TemplateRef } from '@angular/core';
import { DrawingAttrs } from 'src/app/Utils/Interface';
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() drawingAttributesEmitter = new EventEmitter<DrawingAttrs>();
  @Output() clearBoardSignal  = new EventEmitter<void>();
  drawingAttributes: DrawingAttrs = {
    thickness: 1,
    color: '#000000',
    bgcolor: '#FFFFFF',
    shape: 'freeForm',
    lineCap: 'round',
    lineJoin: 'round',
    isFillMode: false
  };

  constructor (private dialog: MatDialog) { }

  emitDrawingAttributes() {
    this.drawingAttributesEmitter.emit(this.drawingAttributes);
  }

  openClearBoardConfirmation(ref: TemplateRef<any>) {
    this.dialog.open(ref);
  }

  clearBoard() {
    this.clearBoardSignal.emit();
  }

  resetAttributes() {
    this.drawingAttributes.thickness = 1;
    this.drawingAttributes.color = '#000000';
    this.drawingAttributes.bgcolor = '#FFFFFF';
    this.drawingAttributes.shape = 'freeForm',
    this.drawingAttributes.lineCap = 'round',
    this.drawingAttributes.lineJoin = 'round'

    this.drawingAttributesEmitter.emit(this.drawingAttributes);
  }

}
