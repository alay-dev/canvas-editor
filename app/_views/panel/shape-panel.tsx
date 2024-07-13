import { drawArrowLine, drawLine } from "@/app/_objects/line";
import createRect from "@/app/_objects/rect";
import createShape from "@/app/_objects/shape";
import { useContext } from "react";
import { GloablStateContext } from "@/context/global-context";
import { createPathFromSvg } from "@/app/_objects/path";
import { fabric } from "fabric";

const degree2Radian = (d) => {
  return (Math.PI * d) / 180;
};

// The center is [0,0] point
const getRightPolygonPoints = (num, radius = 100) => {
  const d = 360 / num;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < num; i++) {
    const y = radius * Math.cos(degree2Radian(i * d));
    const x = radius * Math.sin(degree2Radian(i * d));
    points.push({ x: -x, y: -y });
  }
  return points;
};

export const shapes = [
  {
    key: "rect",
    elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M42 6H6V42H42V6Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2"/></svg>',
    shape: fabric.Rect,
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "rect-r",
    elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M39 6H9C7.34315 6 6 7.34315 6 9V39C6 40.6569 7.34315 42 9 42H39C40.6569 42 42 40.6569 42 39V9C42 7.34315 40.6569 6 39 6Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2"/></svg>',
    shape: fabric.Rect,
    options: { width: 200, height: 200, rx: 20, ry: 20, fill: "#BBDEFB" },
  },
  {
    key: "circle",
    elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2"/></svg>',
    shape: fabric.Circle,
    options: { radius: 100, fill: "#BBDEFB" },
  },
  {
    key: "ellipse",
    elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="24" rx="14" ry="20" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2"/></svg>',
    shape: fabric.Ellipse,
    options: { rx: 120, ry: 200, fill: "#BBDEFB" },
  },
  {
    key: "triangle",
    elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.2692 6.98965C23.0395 5.65908 24.9565 5.65908 25.7309 6.98965L44.262 38.9979C45.0339 40.3313 44.0718 42 42.5311 42H5.4689C3.92823 42 2.96611 40.3313 3.73804 38.9979L22.2692 6.98965Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    shape: fabric.Triangle,
    options: { width: 200, height: 180, fill: "#BBDEFB" },
  },
  {
    key: "right-angle",
    elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 9.1153C8 7.29468 10.2347 6.42094 11.4696 7.75874L40.9016 39.6434C42.0842 40.9246 41.1755 43 39.432 43H10C8.89543 43 8 42.1046 8 41V9.1153Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/></svg>',
    shape: fabric.Polygon,
    options: {
      points: [
        { x: 0, y: 0 },
        { x: 0, y: 200 },
        { x: 200, y: 200 },
      ],
      fill: "#BBDEFB",
    },
  },
  {
    key: "diamond",
    elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.41421 22.5858L22.5858 5.41421C23.3668 4.63317 24.6332 4.63316 25.4142 5.41421L42.5858 22.5858C43.3668 23.3668 43.3668 24.6332 42.5858 25.4142L25.4142 42.5858C24.6332 43.3668 23.3668 43.3668 22.5858 42.5858L5.41421 25.4142C4.63317 24.6332 4.63316 23.3668 5.41421 22.5858Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2"/></svg>',
    shape: fabric.Polygon,
    options: {
      points: [
        { x: 0, y: 100 },
        { x: 100, y: 200 },
        { x: 200, y: 100 },
        { x: 100, y: 0 },
      ],
      fill: "#BBDEFB",
    },
  },
  {
    key: "parallelgram",
    elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M41.2796 8H15.4704C14.5956 8 13.8223 8.5685 13.5614 9.40345L4.81142 37.4035C4.40897 38.6913 5.3711 40 6.72038 40H32.5296C33.4044 40 34.1777 39.4315 34.4386 38.5965L43.1886 10.5965C43.591 9.30869 42.6289 8 41.2796 8Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2"/></svg>',
    shape: fabric.Polygon,
    options: {
      points: [
        { x: 50, y: 0 },
        { x: 0, y: 100 },
        { x: 200, y: 100 },
        { x: 250, y: 0 },
      ],
      fill: "#BBDEFB",
    },
  },
  {
    key: "pentagon",
    elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.2296 4.95843L42.8601 18.7012C43.5405 19.2316 43.8041 20.1385 43.5141 20.951L36.4739 40.6724C36.1897 41.4685 35.4357 42 34.5903 42H13.4097C12.5643 42 11.8103 41.4685 11.5261 40.6724L4.48593 20.951C4.19588 20.1385 4.45953 19.2315 5.13995 18.7012L22.7704 4.95843C23.4933 4.39496 24.5067 4.39496 25.2296 4.95843Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2"/></svg>',
    shape: fabric.Polygon,
    options: { points: getRightPolygonPoints(5), fill: "#BBDEFB" },
  },
  {
    key: "hexagon",
    elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.0287 43.4604L7.02871 34.5715C6.39378 34.2188 6 33.5495 6 32.8232V15.1768C6 14.4505 6.39378 13.7812 7.02872 13.4285L23.0287 4.5396C23.6328 4.20402 24.3672 4.20402 24.9713 4.5396L40.9713 13.4285C41.6062 13.7812 42 14.4505 42 15.1768V32.8232C42 33.5495 41.6062 34.2188 40.9713 34.5715L24.9713 43.4604C24.3672 43.796 23.6328 43.796 23.0287 43.4604Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2"/></svg>',
    shape: fabric.Polygon,
    options: { points: getRightPolygonPoints(6), fill: "#BBDEFB" },
  },
  {
    key: "star",
    elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.9986 5L17.8856 17.4776L4 19.4911L14.0589 29.3251L11.6544 43L23.9986 36.4192L36.3454 43L33.9586 29.3251L44 19.4911L30.1913 17.4776L23.9986 5Z" fill="#ffffff" stroke="#64B5F6" stroke-width="2" stroke-linejoin="round"/></svg>',
  },
  {
    key: "heart",
    elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z" fill="#ffffff" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
];

const lines = [
  {
    key: "line",
    type: "f-line",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" stroke="#BBDEFB" fill="#BBDEFB" viewBox="0 -0.5 33 1"><line x1="0.5" x2="32.5" stroke-linecap="butt" fill="none"></line></svg>',
  },
  {
    key: "dash-line",
    type: "f-line",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" stroke="#BBDEFB" fill="#BBDEFB" viewBox="0 -0.5 33 1"><line x1="0.5" x2="32.5" stroke-dasharray="3,1" stroke-linecap="butt" fill="none"></line></svg>`,
    options: {
      strokeDashArray: [8, 8],
    },
  },
  {
    key: "arrow-line-1",
    type: "f-arrow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 40" stroke="#BBDEFB" fill="#BBDEFB">
      <line x1="0" x2="51" y1="20" y2="20" stroke-linecap="butt" fill="none" strokeWidth="4" />
      <path d="M 51 20 V 23 L 56 20 L 51 17 Z"></path></svg>`,
  },
];

export default function ShapePanel() {
  const { editor } = useContext(GloablStateContext);

  const addLine = (item: any) => {
    const { type, options = {} } = item;
    const canvas = editor?.canvas;
    switch (type) {
      case "f-line":
        drawLine({ ...options, canvas });
        break;
      case "f-arrow":
        drawArrowLine({ ...options, canvas });
        break;
      default:
        break;
    }
  };

  const addShape = (item: any) => {
    const { key, elem, options } = item;
    const canvas = editor?.canvas;
    switch (key) {
      case "rect":
      case "rect-r":
        createRect({ ...options, canvas });
        break;
      case "star":
      case "heart":
        createPathFromSvg({
          svgString: elem,
          canvas,
          sub_type: key,
          strokeWidth: 20,
        });
        break;
      default:
        createShape(item.shape, { ...options, canvas });
        break;
    }
  };

  return (
    <div className="p-4 w-full">
      <h2 className="text-gray-300 text-sm">Lines</h2>
      <div className="h-px bg-gray-500" />
      <div className="grid grid-cols-3 gap-4">
        {lines.map((item) => (
          <div
            key={item.key}
            onClick={() => {
              addLine(item);
            }}
            className="fabritor-panel-shape-item"
          >
            <img
              src={`data:image/svg+xml,${encodeURIComponent(item.svg)}`}
              alt=""
              style={{ width: 48, height: 48 }}
            />
          </div>
        ))}
      </div>
      <h2 className="text-gray-300 text-sm mt-3">Shape</h2>
      <div className="h-px bg-gray-500 " />
      <div className="grid grid-cols-3 gap-4 items-center justify-center mt-5 place-items-center">
        {shapes.map((item) => (
          <div
            key={item.key}
            onClick={() => {
              addShape(item);
            }}
            className="fabritor-panel-shape-item"
          >
            <img
              src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                item.elem
              )}`}
              style={{ width: 64, height: 64 }}
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}
