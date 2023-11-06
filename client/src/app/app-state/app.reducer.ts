import { state } from "@angular/animations";
import { createReducer, createFeatureSelector, createSelector, on } from '@ngrx/store';
import * as appAction from "./app.action";
import { DrawingAttrs } from "../Utils/Interface";

interface AppState {
  // users: any[],
  context: CanvasRenderingContext2D | null,
  isDrawing: boolean,
  currShape: "freeForm" | "circle" | "square" | "triangle",
  snapshot: ImageData | null,
  drawingAttributes: DrawingAttrs
}

const initialState: AppState = {
  context: null,
  isDrawing: false,
  currShape: 'freeForm',
  snapshot: null,
  // users: [],
  drawingAttributes: {
    brushColor: '#000000',
    boardColor: '#FFFFFF',
    thickness: 1,
    capStyle: 'round',
    joinStyle: 'round',
    isFillMode: false
  }
}

const appFeatureSelector = createFeatureSelector<AppState>('app');

export const contextSelector = createSelector (
  appFeatureSelector,
  (state) => state?.context
);

export const drawingStateSelector = createSelector (
  appFeatureSelector,
  (state) => state?.isDrawing
);

export const currShapeSelector = createSelector (
  appFeatureSelector,
  (state) => state?.currShape
);

export const drawingAttributesSelector = createSelector (
  appFeatureSelector,
  (state) => state?.drawingAttributes
);

export const snapshotSelector = createSelector (
  appFeatureSelector,
  (state) => state?.snapshot
);

// export const usersSelector = createSelector (
//   appFeatureSelector,
//   (state) => state?.users
// )


export const appReducer = createReducer(
  initialState,
  on(appAction.updateCanvasContext, (state, action): AppState => {
    return {
      ...state,
      context: action.context
    }
  }),
  on(appAction.changeDrawingState, (state, action): AppState => {
    return {
      ...state,
      isDrawing: action.isDrawing
    }
  }),
  on(appAction.updateCurrentShape, (state, action): AppState => {
    return {
      ...state,
      currShape: action.currShape
    }
  }),
  on(appAction.updateDrawingAttributes, (state, action): AppState  => {
    return {
      ...state,
      drawingAttributes: action.drawingAttributes
    }
  }),
  on(appAction.updateSnapShot, (state, action): AppState => {
    return {
      ...state,
      snapshot: action.snapshot
    }
  })
);
