import  { createAction, props } from "@ngrx/store";
import { DrawingAttrs } from "../Utils/Interface";

export const updateCanvasContext = createAction (
  '[conText] Update Canvas Context',
  props<{ context: CanvasRenderingContext2D | null }>()
)

export const changeDrawingState = createAction (
  '[isDrawing] Change State',
  props<{ isDrawing: boolean }>()
);

export const updateCurrentShape = createAction (
  '[currShape] Change Current Drawing Shape',
  props<{ currShape: "freeForm" | "circle" | "square" | "triangle" }>()
);

export const updateDrawingAttributes = createAction (
  '[drawingAttributes] Update Drawing Attributes',
  props<{ drawingAttributes: DrawingAttrs }>()
)

export const updateSnapShot = createAction (
  '[snapShot] Update Canvas Latest Image Ref',
  props<{ snapshot: ImageData | null }>()
)
