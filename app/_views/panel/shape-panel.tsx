import { drawArrowLine, drawLine } from "@/app/_objects/line";
import createRect from "@/app/_objects/rect";
import createShape from "@/app/_objects/shape";
import { useContext } from "react";
import { GlobalStateContext } from "@/context/global-context";
import { createPathFromSvg } from "@/app/_objects/path";
import { fabric } from "fabric";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const degree2Radian = (d: number) => {
  return (Math.PI * d) / 180;
};

// The center is [0,0] point
const getRightPolygonPoints = (num: number, radius = 100) => {
  const d = 360 / num;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < num; i++) {
    const y = radius * Math.cos(degree2Radian(i * d));
    const x = radius * Math.sin(degree2Radian(i * d));
    points.push({ x: -x, y: -y });
  }
  return points;
};

export const basicShapes = [
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
];

const commonShapes = [
  {
    key: "star",
    elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.9986 5L17.8856 17.4776L4 19.4911L14.0589 29.3251L11.6544 43L23.9986 36.4192L36.3454 43L33.9586 29.3251L44 19.4911L30.1913 17.4776L23.9986 5Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linejoin="round"/></svg>',
    options: { fill: "#BBDEFB" },
  },
  {
    key: "heart",
    elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    options: { fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 150 L 0 0 L 150 0 L 200 50 L 200 200 L 50 200 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 200 L 0 0 L 150 0 L 200 50 L 200 200 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 50 L 50 0 L 150 0 L 200 50 L 200 200 L 0 200 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 0 L 150 0 Q 200 0 200 50 L 200 200 L 50 200 Q 0 200 0 150 L 0 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 0 L 150 0 Q 200 0 200 50 L 200 200 L 0 200 L 0 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 50 Q 0 0 50 0 L 150 0 Q 200 0 200 50 L 200 200 L 0 200 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 50 0 L 150 0 L 200 200 L 0 200 L 50 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 100 0 L 0 100 L 100 200 L 200 100 L 100 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 100 0 L 0 50 L 0 200 L 200 200 L 200 50 L 100 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 200 100 L 150 0 L 0 0 L 50 100 L 0 200 L 150 200 L 200 100 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 200 A 50 100 0 1 1 200 200 L 0 200 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 40 20 A 100 100 0 1 0 200 100 L 100 100 L 40 20 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 100 0 A 100 100 102 1 0 200 100 L 100 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 100 0 A 100 100 102 1 0 200 100 L 200 0 L 100 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 0 L 200 0 Q 200 200 0 200 L 0 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 100 0 L 0 60 L 0 140 L 100 200 L 200 140 L 200 60 L 100 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 60 0 L 140 0 L 200 60 L 200 140 L 140 200 L 60 200 L 0 140 L 0 60 L 60 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 75 0 L 125 0 L 175 25 L 200 75 L 200 125 L 175 175 L 125 200 L 75 200 L 25 175 L 0 125 L 0 75 L 25 25 L 75 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 150 0 A 50 100 0 1 1 150 200 L 0 200 L 0 0 L 150 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 50 0 A 25 50 0 1 0 50 200 L 150 200 A 25 50 0 1 0 150 0 L 50 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 150 0 A 50 100 0 1 1 150 200 L 0 200 A 50 100 0 0 0 0 0 L 150 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 200 0 L 200 200 L 0 200 L 0 100 L 200 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 0 L 200 100 L 200 200 L 0 200 L 0 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 200 0 L 100 0 L 0 100 L 0 200 L 200 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 50 0 L 150 0 L 150 50 L 200 50 L 200 150 L 150 150 L 150 200 L 50 200 L 50 150 L 0 150 L 0 50 L 50 50 L 50 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 0 L 0 200 L 200 200 L 200 140 L 60 140 L 60 0 L 0 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L200 0 L200 200 L0 200 L0 0 Z M50 50 L50 150 L150 150 L150 50 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 100 A100 100 0 1 1 0 101 Z M150 100 A50 50 0 1 0 150 101 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 70 0 L 70 70 L 0 70 L 0 130 L 70 130 L 70 200 L 130 200 L 130 130 L 200 130 L 200 70 L 130 70 L 130 0 L 70 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 40 0 L 0 40 L 60 100 L 0 160 L 40 200 L 100 140 L 160 200 L 200 160 L 140 100 L 200 40 L 160 0 L 100 60 L 40 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 0 L 200 0 L 200 160 L 100 160 L 60 200 L 60 160 L 0 160 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 40 Q 0 0 40 0 L 160 0 Q 200 0 200 40 L 200 120 Q 200 160 160 160 L 100 160 L 60 200 L 60 160 L 40 160 Q 0 160 0 120 L 0 40 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 180 160 A 100 100 0 1 0 100 200 L 200 200 L 200 160 L 180 160 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 200 0 L 0 0 L 200 200 L 0 200 L 200 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 20 C 60 60 140 -40 200 20 L 200 180 C 140 140 60 240 0 180 L 0 20 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 20 C 40 -40 60 60 100 20 C 140 -40 160 60 200 20 L 200 180 C 140 240 160 140 100 180 C 40 240 60 140 0 180 L 0 20 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 100 0 Q 0 50 0 175 Q 100 225 200 175 Q 200 50 100 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 100 A 50 50 0 1 1 200 100 L 100 200 L 0 100 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 100 0 L 60 60 L 0 100 L 60 140 L 100 200 L 140 140 L 200 100 L 140 60 L 100 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 100 0 L 80 40 L 20 20 L 40 80 L 0 100 L 40 120 L 20 180 L 80 160 L 100 200 L 120 160 L 180 180 L 160 120 L 200 100 L 160 80 L 180 20 L 120 40 L 100 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
];

const arrowShapes = [
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 100 0 L 0 100 L 50 100 L 50 200 L 150 200 L 150 100 L 200 100 L 100 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 100 200 L 200 100 L 150 100 L 150 0 L 50 0 L 50 100 L 0 100 L 100 200 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 100 L 100 0 L 100 50 L 200 50 L 200 150 L 100 150 L 100 200 L 0 100 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 200 100 L 100 0 L 100 50 L 0 50 L 0 150 L 100 150 L 100 200 L 200 100 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 100 0 L 0 60 L 60 60 L 60 140 L 0 140 L 100 200 L 200 140 L 140 140 L 140 60 L 200 60 L 100 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 100 L 60 0 L 60 60 L 140 60 L 140 0 L 200 100 L 140 200 L 140 140 L 60 140 L 60 200 L 0 100 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 100 0 L 60 40 L 80 40 L 80 80 L 40 80 L 40 60 L 0 100 L 40 140 L 40 120 L 80 120 L 80 160 L 60 160 L 100 200 L 140 160 L 120 160 L 120 120 L 160 120 L 160 140 L 200 100 L 160 60 L 160 80 L 120 80 L 120 40 L 140 40 L 100 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 100 L 100 0 L 100 50 L 200 50 L 150 100 L 200 150 L 100 150 L 100 200 L 0 100 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 200 100 L 100 0 L 100 50 L 0 50 L 50 100 L 0 150 L 100 150 L 100 200 L 200 100 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 100 L 80 20 L 80 80 L 120 80 L 120 0 L 200 0 L 200 200 L 120 200 L 120 120 L 80 120 L 80 180 L 0 100 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 200 100 L 120 20 L 120 80 L 80 80 L 80 0 L 0 0 L 0 200 L 80 200 L 80 120 L 120 120 L 120 180 L 200 100 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 0 L 120 0 L 200 100 L 120 200 L 0 200 L 80 100 L 0 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 80 0 L 200 0 L 120 100 L 200 200 L 80 200 L 0 100 L 80 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 0 L 140 0 L 200 100 L 140 200 L 0 200 L 0 100 L 0 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 60 0 L 200 0 L 200 100 L 200 200 L 60 200 L 0 100 L 60 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 0 L 200 100 L 0 200 L 60 100 L 0 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 200 0 L 0 100 L 200 200 L 140 100 L 200 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 0 L 80 0 L 200 100 L 80 200 L 0 200 L 120 100 L 0 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 200 0 L 120 0 L 0 100 L 120 200 L 200 200 L 80 100 L 200 0 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 200 L 180 200 L 180 40 L 200 40 L 160 0 L 120 40 L 140 40 L 140 160 L 0 160 L 0 200 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 200 L 0 20 L 160 20 L 160 0 L 200 40 L 160 80 L 160 60 L 40 60 L 40 200 L 0 200 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 40 180 L 180 180 L 180 40 L 200 40 L 160 0 L 120 40 L 140 40 L 140 140 L 40 140 L 40 120 L 0 160 L 40 200 L 40 180 Z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M398.208 302.912V64L0 482.112l398.208 418.176V655.36c284.48 0 483.584 95.552 625.792 304.64-56.896-298.688-227.584-597.312-625.792-657.088z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M625.792 302.912V64L1024 482.112l-398.208 418.176V655.36C341.312 655.36 142.208 750.912 0 960c56.896-298.688 227.584-597.312 625.792-657.088z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
];

const specialShapes = [
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M985.20746667 343.50079998l-303.32586667-44.08319999L546.28693333 24.5248c-3.70346666-7.5264-9.79626667-13.6192-17.32266665-17.32266668-18.87573334-9.3184-41.81333333-1.55306667-51.25120001 17.32266668L342.1184 299.41759999l-303.32586667 44.08319999c-8.36266667 1.19466667-16.00853333 5.13706667-21.8624 11.11040001-14.69440001 15.17226667-14.45546667 39.30453334 0.71679999 54.1184l219.46026668 213.9648-51.84853333 302.1312c-1.43359999 8.24320001-0.11946667 16.8448 3.82293333 24.25173333 9.79626667 18.6368 32.9728 25.92426667 51.6096 16.00853334L512 822.44266665l271.3088 142.64320001c7.40693333 3.9424 16.00853333 5.25653333 24.25173333 3.82293333 20.78719999-3.584 34.7648-23.296 31.1808-44.0832l-51.84853333-302.1312 219.46026668-213.9648c5.97333334-5.85386666 9.91573333-13.49973334 11.11039999-21.8624 3.2256-20.90666667-11.34933333-40.26026667-32.256-43.36640001z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M852.65066667 405.84533333C800.54044445 268.40177778 667.76177778 170.66666667 512.22755555 170.66666667S223.91466667 268.288 171.80444445 405.73155555C74.29688889 431.33155555 2.27555555 520.07822222 2.27555555 625.77777778c0 125.72444445 101.83111111 227.55555555 227.44177778 227.55555555h564.56533334C919.89333333 853.33333333 1021.72444445 751.50222222 1021.72444445 625.77777778c0-105.472-71.79377778-194.21866667-169.07377778-219.93244445z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M926.25224691 323.7371485H654.6457886L898.88200917 15.14388241c5.05486373-6.53433603 0.49315743-16.02761669-7.76722963-16.02761668H418.30008701c-3.45210206 0-6.78091476 1.84934039-8.50696579 4.93157436L90.35039154 555.76772251c-3.82197013 6.53433603 0.86302552 14.7947231 8.50696578 14.79472311h215.01664245l-110.22068713 440.88274851c-2.34249783 9.61657002 9.24670194 16.39748478 16.39748477 9.49328065L933.03316167 340.62779071c6.41104668-6.0411786 2.09591911-16.8906422-6.78091476-16.89064221z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M878.47822222 463.30311111c-22.18666667-49.83466667-53.93066667-93.98044445-94.32177777-131.072l-33.10933334-30.37866666c-4.89244445-4.32355555-12.62933333-2.38933333-14.79111111 3.75466666l-14.79111111 42.43911111c-9.216 26.624-26.16888889 53.81688889-50.176 80.55466667-1.59288889 1.70666667-3.41333333 2.16177778-4.66488889 2.27555556-1.25155555 0.11377778-3.18577778-0.11377778-4.89244445-1.70666667-1.59288889-1.36533333-2.38933333-3.41333333-2.27555555-5.46133333 4.20977778-68.49422222-16.27022222-145.74933333-61.09866667-229.83111112C561.26577778 124.01777778 509.72444445 69.51822222 445.32622222 31.51644445l-46.99022222-27.648c-6.144-3.64088889-13.99466667 1.13777778-13.65333333 8.30577777l2.50311111 54.61333333c1.70666667 37.31911111-2.61688889 70.31466667-12.85688889 97.73511112-12.51555555 33.56444445-30.49244445 64.73955555-53.47555556 92.72888888-16.15644445 19.56977778-34.24711111 37.20533333-54.04444444 52.45155556-47.90044445 36.75022222-87.38133333 84.65066667-114.11911111 138.24C125.72444445 502.10133333 111.50222222 562.74488889 111.50222222 623.50222222c0 53.70311111 10.58133333 105.69955555 31.51644445 154.73777778 20.25244445 47.21777778 49.152 89.77066667 85.90222222 126.17955555 36.864 36.40888889 79.64444445 65.08088889 127.31733333 84.992C405.61777778 1010.11911111 457.95555555 1020.58666667 512 1020.58666667s106.38222222-10.46755555 155.76177778-31.06133334c47.67288889-19.91111111 90.56711111-48.46933333 127.31733333-84.992 36.864-36.40888889 65.76355555-78.96177778 85.90222222-126.17955555 20.93511111-49.03822222 31.51644445-101.03466667 31.51644445-154.73777778 0-55.52355555-11.37777778-109.45422222-34.01955556-160.31288889z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },

  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M968.20337778 20.11591112H705.44042667c-22.17301333 0-41.92483556 15.16430222-47.14951111 37.33731555C642.36202666 124.73685332 582.08711111 173.03324444 512 173.03324444s-130.36202666-48.29639112-146.29091556-115.58001777c-5.22467555-22.17301333-24.84906667-37.33731556-47.14951111-37.33731555H55.79662222c-30.96576 0-56.06968889 25.10392889-56.06968888 56.06968888v321.12639999c0 30.96576 25.10392889 56.06968889 56.06968888 56.06968889h95.57333334v494.43271112c0 30.96576 25.10392889 56.06968889 56.06968889 56.06968888h609.1207111c30.96576 0 56.06968889-25.10392889 56.06968889-56.06968888V453.38168888h95.57333334c30.96576 0 56.06968889-25.10392889 56.06968888-56.06968889V76.1856c0-30.96576-25.10392889-56.06968889-56.06968888-56.06968888z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M980.94648889 239.80714666H523.46880001L373.99210666 96.82944c-1.91146667-1.78403556-4.46008889-2.80348444-7.00871111-2.80348445H43.05351111c-22.55530667 0-40.77795555 18.22264888-40.77795555 40.77795557v754.39217776c0 22.55530667 18.22264888 40.77795555 40.77795555 40.77795557h937.89297778c22.55530667 0 40.77795555-18.22264888 40.77795555-40.77795557V280.58510222c0-22.55530667-18.22264888-40.77795555-40.77795555-40.77795556z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M972.60904597 164.57058577L841.30587843 33.39070759c-18.86327195-18.86327195-44.1375906-29.34286748-70.64480282-29.3428675-26.75379095 0-51.90482023 10.47959553-70.76809219 29.3428675L558.60337778 174.68031322c-18.86327195 18.86327195-29.34286748 44.1375906-29.34286749 70.64480283 0 26.75379095 10.47959553 51.90482023 29.34286749 70.76809218l103.31648301 103.31648302c-24.28800376 53.50758189-57.69942011 101.59043198-99.24793416 143.13894603-41.42522469 41.67180341-89.63136414 75.08321976-143.13894603 99.61780223L316.21649759 558.84995649c-18.86327195-18.86327195-44.1375906-29.34286748-70.64480283-29.34286747-26.75379095 0-51.90482023 10.47959553-70.76809217 29.34286747L33.39070759 700.01627278c-18.86327195 18.86327195-29.34286748 44.1375906-29.3428675 70.76809217 0 26.75379095 10.47959553 51.90482023 29.3428675 70.76809219l131.05658883 131.05658883c30.08260365 30.205893 71.63111769 47.34311394 114.28923598 47.34311394 9.00012323 0 17.63037836-0.73973616 26.13734414-2.21920846 166.19405621-27.37023774 331.03192945-115.76870829 464.06114804-248.67463751C901.84095379 636.27567408 990.11613498 471.56109018 1017.85624079 304.87387654c8.38367642-50.91850535-8.50696579-103.31648302-45.24719482-140.30329077z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M910.60451556 640.96028445c-20.38897778-65.49959112-43.83630221-120.54983112-79.89930667-210.64362666C836.31217778 193.67708444 737.93535999 2.27555556 511.36284444 2.27555556 282.24170667 2.27555556 186.03121778 197.50001778 192.14791111 430.31665779c-36.19043555 90.22122667-59.51032888 144.88917333-79.89930667 210.64362666-43.32657778 139.53706668-29.30915556 197.26336001-18.60494222 198.53767111 22.9376 2.80348444 89.32920888-105.00323556 89.32920889-105.00323556 0 62.44124445 32.11264001 143.86972444 101.69002667 202.61546667-33.64181333 10.32192-109.20846222 38.10190221-91.24067556 68.55793777 14.52714667 24.59420444 250.01984 15.67402668 317.94062222 8.02816 67.92078222 7.64586667 303.41347556 16.56604444 317.94062223-8.02816 17.96778667-30.32860444-57.72629333-58.23601779-91.24067555-68.55793777 69.57738667-58.87317334 101.69002667-140.30165333 101.69002667-202.61546667 0 0 66.39160889 107.80672 89.32920888 105.00323556 10.83164445-1.40174222 24.84906667-59.12803556-18.47751111-198.53767111z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1016.86992592 199.24764445c-37.13706667 16.01991111-77.55093333 27.54939259-119.17842962 32.03982222 42.96248889-25.60758518 75.60912592-66.02145185 91.02222222-114.08118519-39.68568889 23.66577778-84.58998518 41.02068148-131.31472593 50.00154074C819.53374815 126.79395555 765.76995555 101.79318518 706.18074075 101.79318518c-114.688 0-206.92385185 92.96402963-206.92385186 207.04521482 0 16.01991111 1.94180741 32.03982222 5.09724444 47.45291852-171.72859259-8.98085925-324.88865185-91.02222222-426.71217778-216.63288889-17.96171852 30.82619259-28.15620741 66.02145185-28.1562074 104.49351112 0 71.84687408 36.53025185 135.19834075 92.23585185 172.45677036-33.98162963-1.33499259-66.02145185-10.92266667-93.57084445-26.33576296v2.54862222c0 100.6098963 71.1186963 183.98625185 165.90317037 203.1616-17.3549037 4.49042963-35.92343703 7.03905185-54.49197037 7.03905185-13.47128889 0-26.2144-1.33499259-39.07887407-3.15543704C146.69748148 681.90814815 223.03478518 741.49736297 313.93564445 743.43917037c-71.1186963 55.7056-160.19911111 88.4736-256.9253926 88.4736-17.3549037 0-33.37481482-0.60681482-50.00154074-2.54862222C98.75911111 888.22518518 207.62168889 922.20681482 324.85831111 922.20681482 705.45256297 922.20681482 913.71140741 606.90583703 913.71140741 333.23235555c0-8.98085925 0-17.96171852-0.60681482-26.94257777 40.2925037-29.4912 75.60912592-66.02145185 103.76533333-107.04213333z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M917.96720197 1.08889505H106.03279803C53.56084718 1.08889505 9.37393998 45.27580225 9.37393998 97.74775309v5.52336372c0 19.33177108 8.28504494 41.42522469 22.0934536 55.23363205l331.40179753 392.15879462v325.87843379c0 16.57008987 8.28504494 30.37849854 22.09345359 35.90186098l209.88780469 104.94390299 2.76168121 2.76168121c27.61681602 11.04672615 55.23363335-8.28504494 55.23363335-38.66354218V550.66354348l331.40179753-392.15879462c35.90186097-41.42522469 30.37849854-102.18222047-11.04672616-135.32240022-11.04672615-13.80840865-33.14017975-22.0934536-55.23363335-22.09345359z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M491.70164031 97.48884502a25.89076502 25.89076502 0 0 1 40.59671938 0L745.66415762 367.01171317a25.89076502 25.89076502 0 0 0 30.49932208 7.72839349l208.00640948-89.14190458a25.89076502 25.89076502 0 0 1 35.56096592 29.06238339l-115.18801541 554.96855704A103.56306132 103.56306132 0 0 1 803.14165689 952.14301275H220.85834311a103.56306132 103.56306132 0 0 1-101.4011828-82.51387024l-115.18801541-554.96855704a25.89076502 25.89076502 0 0 1 35.54802012-29.06238339l208.01935528 89.14190458a25.89076502 25.89076502 0 0 0 30.49932208-7.72839349l213.36579793-269.52286815z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M643.02466884 387.7801525c19.85376751-88.69205333 33.718272-152.84087467 41.61900049-192.57389433C704.52292267 95.17283515 652.90057916 2.27555515 550.58614084 2.27555515c-92.26012484 0-138.59407685 45.84971417-165.91530666 137.49816969l-0.70087152 2.67605334c-16.40038399 74.13942085-41.47882668 131.61085116-74.6746315 172.73287031a189.06953915 189.06953915 0 0 1-143.04142182 70.44391902l-26.17434983 0.5606965C77.66380049 387.52529067 27.76177817 438.90551468 27.76177817 501.84374084V881.55022182c0 77.4144 62.25009818 140.17422182 139.05282766 140.17422303h492.82707951c101.23127467 0 191.59267516-63.995904 225.93535999-159.98976l102.37815468-286.22301868c26.04691951-72.82688-11.39234134-153.15945284-83.63303784-179.42300483a138.04612267 138.04612267 0 0 0-47.17499733-8.30850884H643.02466884z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M512 512c140.82958222 0 254.86222222-114.03264 254.86222222-254.86222222S652.82958222 2.27555555 512 2.27555555a254.78940445 254.78940445 0 0 0-254.86222222 254.86222223C257.13777778 397.96736 371.17041778 512 512 512z m0 72.81777778c-170.10232889 0-509.72444445 97.57582222-509.72444445 291.27111111v145.63555556h1019.4488889v-145.63555556c0-193.69528889-339.62211555-291.27111111-509.72444445-291.27111111z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1019.81297778 564.50161779l-138.89991111-472.51456c-8.66531556-25.99594668-29.43658667-43.45400889-57.21656889-43.45400891s-50.33528889 15.67402668-59.00060446 41.66997334l-92.00526221 274.48661334H351.69166222L259.6864 90.33045333c-8.66531556-25.99594668-31.22062222-41.66997333-59.00060444-41.66997332s-50.33528889 17.33063112-57.2165689 43.45400887L4.69674667 564.50161779c-5.22467555 17.33063112 1.78403556 36.44529778 15.67402667 46.89464887l491.11950221 368.27591113 492.77610666-368.27591113c13.76256-10.32192 20.77127111-29.43658667 15.54659557-46.89464887z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M927.78951111 340.39277037c-12.01493333-47.81700741 12.01493333-124.03294815 89.08041481-150.97552592l-82.40545184-4.36906667s-31.19028148-109.22666667-174.27721483-118.9357037c-143.08693333-9.8304-236.65777778-3.64088889-236.65777777-3.6408889s106.07122963 67.47780741 63.5941926 187.74850371c-31.06891852 63.71555555-79.85682963 116.02299259-132.04290371 175.61220741-1.57771852 1.57771852-3.03407408 3.15543703-4.2477037 4.49042962C278.25493333 624.86755555 7.13007408 934.34311111 7.13007408 934.34311111c298.43152592 78.15774815 498.43768889-7.64586667 616.76657777-110.56165926 24.87940741-0.24272592 43.5693037-0.36408889 56.19105185-0.36408888 164.8109037 0 304.13558518-142.72284445 298.43152593-301.4656-3.88361482-109.1053037-38.71478518-133.74198518-50.72971852-181.5589926z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M997.8886764 504.17210418L537.2729208 43.89182982c-13.97838539-13.97838539-36.56745619-13.97838539-50.5458416 0L26.1113236 504.17210418c-13.41924998 13.41924998-21.02349164 31.64706454-21.02349163 50.65766867 0 39.47496036 32.09437288 71.56933323 71.56933324 71.56933323h48.53295408V954.83524937c0 19.79339373 15.99127289 35.78466661 35.78466663 35.78466662H440.43066677V740.12724968h125.24633315v250.49266631h297.34821416c19.79339373 0 35.78466661-15.99127289 35.78466663-35.78466662V626.39910608h48.53295408c19.01060414 0 37.23841869-7.49241457 50.65766869-21.02349163 27.84494371-27.95677079 27.84494371-73.24673948-0.11182708-101.20351027z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1009.13013121 349.27572283L674.72427717 14.86986879c-8.82158299-8.82158299-20.35749924-13.16451618-31.89341544-13.16451618s-23.07183245 4.34293316-31.89341547 13.16451618L392.29790453 233.6451272c-16.5574327-1.90003326-33.25058207-2.71433322-49.94373146-2.71433324-99.34459624 0-198.68919249 32.70771543-280.25490606 98.12314628-20.90036589 16.69314938-22.52896582 48.04369819-3.66434987 67.04403081l246.59717401 246.59717401-292.33368895 292.06225564c-3.52863319 3.52863319-5.83581644 8.27871636-6.24296642 13.30023282l-4.61436649 50.48659809c-1.22144996 12.75736619 8.95729967 23.6146991 21.57894918 23.6146991 0.6785833 0 1.35716662 0 2.03574992-0.13571666l50.48659809-4.61436649c5.02151649-0.40714999 9.77159962-2.71433322 13.30023282-6.24296643l292.33368896-292.33368896 246.59717402 246.59717401c8.82158299 8.82158299 20.35749924 13.16451618 31.89341544 13.16451618 13.16451618 0 26.19331567-5.70009979 35.15061536-16.82886604 76.40848044-95.40881307 108.16617924-214.83947521 95.27309638-330.33435417l218.63954175-218.63954173c17.50744934-17.37173267 17.50744934-45.8722316 0-63.51539759z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M976.62005979 160.47737905c-0.39452595-0.39452595-80.35178503 78.64217259-239.47725131 237.50462156l-111.6508437-111.65084369 237.89914752-237.89914752c-125.19623464-75.35445635-286.03131335-56.02268482-390.31767264 48.26367449-81.92988882 81.92988882-112.57140424 200.15616502-83.37648398 310.09739626l2.36715569 8.81107954-372.82702222 372.69551356c-8.15353628 8.15353628-8.15353628 21.56741857 0 29.72095487l185.95323084 185.95323084c8.15353628 8.15353628 21.56741857 8.15353628 29.72095485 0l372.56400493-372.56400493 8.81107953 2.3671557c110.07273989 29.32642892 228.29901608-1.18357785 310.36041356-83.24497533 104.41786795-104.2863593 123.74963948-265.12143802 49.97328693-390.05465535z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },

  /// linear

  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M953.5488 832.61667556c-24.08448-57.08913778-58.74574221-108.31644445-102.70947556-152.28017777-43.96373333-43.96373333-95.19104-78.49756444-152.28017777-102.70947558-0.50972445-0.25486222-1.01944888-0.38229333-1.52917334-0.63715555C776.41955556 519.64586667 828.02915556 426.23886221 828.02915556 320.85333332c0-174.58062221-141.44853334-316.02915556-316.02915556-316.02915554S195.97084444 146.27271111 195.97084444 320.85333332c0 105.38552889 51.6096 198.79253333 130.99918223 256.26396447-0.50972445 0.25486222-1.01944888 0.38229333-1.52917334 0.63715555-57.08913778 24.08448-108.31644445 58.61831112-152.28017777 102.70947554-43.96373333 43.96373333-78.49756444 95.19104-102.70947556 152.28017779C46.74901333 888.55893332 34.13333334 947.8144 32.85902222 1008.72647111c-0.12743111 5.7344 4.46008889 10.44935111 10.19448889 10.44935111h76.45866667c5.60696888 0 10.06705778-4.46008889 10.19448889-9.93962666 2.54862221-98.37681778 42.05226667-190.50951112 111.88451555-260.34176001 72.25344-72.25344 168.20906666-112.01194667 270.40881778-112.01194667s198.15537778 39.75850667 270.40881778 112.01194667C852.24106667 818.72668444 891.74471111 910.85937779 894.29333333 1009.23619556c0.12743111 5.60696888 4.58752 9.93962667 10.19448889 9.93962666h76.45866667c5.7344 0 10.32192-4.71495112 10.19448889-10.44935111-1.27431111-60.91207112-13.88999112-120.16753779-37.59217778-176.10979555zM512 540.03484444c-58.49088 0-113.54112-22.81016889-154.95623111-64.22527999S292.81848888 379.34421333 292.81848888 320.85333332c0-58.49088 22.81016889-113.54112 64.22528001-154.9562311S453.50912 101.67182221 512 101.67182221s113.54112 22.81016889 154.95623111 64.22528001S731.18151112 262.36245333 731.18151112 320.85333332c0 58.49088-22.81016889 113.54112-64.22528001 154.95623113S570.49088 540.03484444 512 540.03484444z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M985.31555555 111.50222222H38.68444445c-20.13866667 0-36.40888889 16.27022222-36.4088889 36.40888889v728.17777778c0 20.13866667 16.27022222 36.40888889 36.4088889 36.40888889h946.6311111c20.13866667 0 36.40888889-16.27022222 36.4088889-36.40888889V147.91111111c0-20.13866667-16.27022222-36.40888889-36.4088889-36.40888889z m-45.5111111 126.06577778V830.57777778H84.19555555V237.568l-31.40266666-24.46222222 44.71466666-57.45777778 48.6968889 37.888h731.70488888l48.69688889-37.888 44.71466667 57.45777778-31.51644444 24.46222222z M877.90933333 193.42222222L512 477.86666667 146.09066667 193.42222222l-48.69688889-37.888-44.71466667 57.45777778 31.40266667 24.46222222 388.66488889 302.19377778c22.98311111 17.86311111 55.18222222 17.86311111 78.16533333 0L939.80444445 237.568l31.40266666-24.46222222-44.71466666-57.45777778-48.58311112 37.77422222z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M985.31555555 88.74666667H38.68444445c-20.13866667 0-36.40888889 16.27022222-36.4088889 36.40888888v564.33777778c0 20.13866667 16.27022222 36.40888889 36.4088889 36.40888889h432.35555555v127.43111111H275.34222222c-10.01244445 0-18.20444445 8.192-18.20444444 18.20444445v54.61333333c0 5.00622222 4.096 9.10222222 9.10222222 9.10222222h491.52c5.00622222 0 9.10222222-4.096 9.10222222-9.10222222v-54.61333333c0-10.01244445-8.192-18.20444445-18.20444444-18.20444445H552.96V725.90222222h432.35555555c20.13866667 0 36.40888889-16.27022222 36.4088889-36.40888889V125.15555555c0-20.13866667-16.27022222-36.40888889-36.4088889-36.40888888z m-45.5111111 555.23555555H84.19555555V170.66666667h855.6088889v473.31555555z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M512 2.27555555C230.51377778 2.27555555 2.27555555 230.51377778 2.27555555 512s228.23822222 509.72444445 509.72444445 509.72444445 509.72444445-228.23822222 509.72444445-509.72444445S793.48622222 2.27555555 512 2.27555555z m0 932.97777778c-233.69955555 0-423.25333333-189.55377778-423.25333333-423.25333333 0-101.26222222 35.61244445-194.33244445 95.00444444-267.15022222l595.39911111 595.39911111C706.33244445 899.64088889 613.26222222 935.25333333 512 935.25333333z m328.24888889-156.10311111L244.84977778 183.75111111C317.66755555 124.35911111 410.73777778 88.74666667 512 88.74666667c233.69955555 0 423.25333333 189.55377778 423.25333333 423.25333333 0 101.26222222-35.61244445 194.33244445-95.00444444 267.15022222z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M901.80266667 257.82044445L656.95288889 12.97066667c-6.82666667-6.82666667-16.04266667-10.69511111-25.71377778-10.69511112H147.91111111c-20.13866667 0-36.40888889 16.27022222-36.40888889 36.4088889v946.6311111c0 20.13866667 16.27022222 36.40888889 36.40888889 36.4088889h728.17777778c20.13866667 0 36.40888889-16.27022222 36.40888889-36.4088889V283.648c0-9.67111111-3.86844445-19.00088889-10.69511111-25.82755555zM828.52977778 300.37333333H614.4V86.24355555L828.52977778 300.37333333z m2.048 639.43111112H193.42222222V84.19555555h343.60888889v245.76c0 26.39644445 21.39022222 47.78666667 47.78666667 47.78666667h245.76v562.06222223z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M981.07392 55.79662222H42.92608c-31.22062222 0-50.71758221 34.02410666-35.04355556 61.16693334L304.28728889 620.82616888V927.42542221c0 22.55530667 18.09521779 40.77795555 40.52309333 40.77795557h334.37923556c22.42787556 0 40.52309333-18.22264888 40.52309333-40.77795557V620.82616888L1016.24490667 116.96355556c15.54659555-27.14282666-3.95036444-61.16693333-35.17098667-61.16693334zM628.47203556 876.45297779H395.52796444V677.66044445h233.07150222v198.79253334z m12.23338666-301.50200891l-12.10595556 21.15356445h-233.19893332l-12.10595556-21.15356445L130.59868445 147.54702221h762.8026311L640.70542222 574.95096888z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M980.62285431 4.54099753H654.39920987c-4.2719763 0-7.76722963 3.49525333-7.76722962 7.76722964v72.4941432c0 4.2719763 3.49525333 7.76722963 7.76722962 7.76722963h207.64393877L604.04167111 350.57107753c-64.72691358-49.83972347-143.69374815-76.7661195-226.67365136-76.7661195-99.54999309 0-193.27456395 38.83614815-263.5679921 109.25903012S4.54099753 547.08198717 4.54099753 646.63198025s38.83614815 193.27456395 109.25903012 263.5679921C184.09345581 980.62285431 277.81802667 1019.45900247 377.36801975 1019.45900247s193.27456395-38.83614815 263.5679921-109.25903012C711.35889383 839.90654419 750.19504197 746.18197333 750.19504197 646.63198025c0-82.9799032-26.92639605-161.68783013-76.63666567-226.41474372L931.4304 162.34521283V369.60079013c0 4.2719763 3.49525333 7.76722963 7.76722963 7.76722962h72.4941432c4.2719763 0 7.76722963-3.49525333 7.76722964-7.76722962V43.37714569c0-21.35988148-17.47626667-38.83614815-38.83614816-38.83614816zM377.36801975 921.07409383c-151.33152395 0-274.44211358-123.11058963-274.44211358-274.44211358s123.11058963-274.44211358 274.44211358-274.44211358 274.44211358 123.11058963 274.44211358 274.44211358-123.11058963 274.44211358-274.44211358 274.44211358z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
  },
  {
    key: "svg",
    elem: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M591.98717801 512l405.34042913-483.16579151c6.79427767-8.02960089 1.08090782-20.22841761-9.41933951-20.2284176h-123.22349044c-7.25752386 0-14.20621693 3.24272343-18.99309439 8.80167789L511.38233839 415.95362022 177.07299399 17.40746878c-4.63246205-5.55895447-11.58115512-8.80167789-18.99309439-8.80167789H34.85640916c-10.50024731 0-16.21361717 12.19881672-9.41933952 20.2284176L430.77749876 512 25.43706964 995.16579151c-6.79427767 8.02960089-1.08090782 20.22841761 9.41933952 20.2284176h123.22349044c7.25752386 0 14.20621693-3.24272343 18.99309439-8.80167789l334.3093444-398.54615144 334.30934441 398.54615144c4.63246205 5.55895447 11.58115512 8.80167789 18.99309439 8.80167789h123.22349044c10.50024731 0 16.21361717-12.19881672 9.41933951-20.2284176L591.98717801 512z" fill="#BBDEFB" stroke="#64B5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    options: { width: 200, height: 200, fill: "#BBDEFB" },
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
  const { editor } = useContext(GlobalStateContext);

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
      case "svg":
        createPathFromSvg({
          svgString: elem,
          canvas,
          // strokeWidth: 20,
        });
        break;
      default:
        createShape(item.shape, { ...options, canvas });
        break;
    }
  };

  return (
    <div className="p-4 w-full">
      <ScrollArea className="h-[90vh]">
        <h2 className="text-gray-300 text-sm">Lines</h2>
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          {lines.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                addLine(item);
              }}
            >
              <img src={`data:image/svg+xml,${encodeURIComponent(item.svg)}`} alt="" className="w-12 h-12" />
            </div>
          ))}
        </div>
        <h2 className="text-gray-300 text-sm mt-6">Basic shapes</h2>
        <Separator />
        <div className="grid grid-cols-4 gap-3 items-center justify-center mt-5 place-items-center">
          {basicShapes.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                addShape(item);
              }}
              className="bg-gray-700 rounded-md w-full aspect-square flex items-center justify-center"
            >
              <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.elem)}`} className="w-12 h-12" alt="" />
            </div>
          ))}
        </div>
        <h2 className="text-gray-300 text-sm mt-12">Common shapes</h2>
        <Separator />
        <div className="grid grid-cols-4 gap-3 items-center justify-center mt-5 place-items-center">
          {commonShapes.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                addShape(item);
              }}
              className="bg-gray-700 rounded-md w-full aspect-square flex items-center justify-center p-4"
            >
              <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.elem)}`} className="w-12 h-12" alt="" />
            </div>
          ))}
        </div>
        <h2 className="text-gray-300 text-sm mt-12">Arrows</h2>
        <Separator />
        <div className="grid grid-cols-4 gap-3 items-center justify-center mt-5 place-items-center">
          {arrowShapes.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                addShape(item);
              }}
              className="bg-gray-700 rounded-md w-full aspect-square flex items-center justify-center p-4"
            >
              <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.elem)}`} className="w-12 h-12" alt="" />
            </div>
          ))}
        </div>
        <h2 className="text-gray-300 text-sm mt-12">Special shapes</h2>
        <Separator />
        <div className="grid grid-cols-4 gap-3 items-center justify-center mt-5 place-items-center">
          {specialShapes.map((item, i) => (
            <div
              key={item.key + i}
              onClick={() => {
                addShape(item);
              }}
              className="bg-gray-700 rounded-md w-full aspect-square flex items-center justify-center p-4"
            >
              <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.elem)}`} className="w-12 h-12" alt="" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
