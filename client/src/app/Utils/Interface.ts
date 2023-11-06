export interface DrawingAttrs {
  thickness: number,
  color: string,
  bgcolor: string,
  shape: "freeForm" | "circle" | "square" | "triangle",
  lineCap: CanvasLineCap,
  lineJoin: CanvasLineJoin,
  isFillMode: boolean
}
