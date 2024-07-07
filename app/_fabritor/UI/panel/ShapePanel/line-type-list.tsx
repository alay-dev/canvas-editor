export const lines = [
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
