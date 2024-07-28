export const APP_VERSION = "3.0.0";
export const SCHEMA_VERSION = 3;

export const OBJECT_DEFAULT_CONFIG = {
  // controls
  cornerSize: 12,
  padding: 0,
  centeredScaling: false,
  strokeUniform: true,
  paintFirst: "stroke",
  transparentCorners: false,
  borderColor: "#51B9F9",
  cornerColor: "#FFF",
  borderScaleFactor: 2.5,
  cornerStyle: "circle",
  cornerStrokeColor: "#0E98FC",
  borderOpacityWhenMoving: 1,
};

export const TEXTBOX_DEFAULT_CONFIG = {
  // styles
  fill: "#000000",
  fontWeight: "normal",
  fontSize: 50,
  lineHeight: 1.3,
  textAlign: "center",
  fontFamily: "Roboto",
  // size
  width: 500,
};

export const FONT_PRESET_FAMILY_LIST = [
  {
    label: <span style={{ fontFamily: "Roboto", fontSize: 16 }}>Roboto</span>,
    value: "Roboto",
  },
  {
    label: (
      <span style={{ fontFamily: "Sedan SC", fontSize: 16 }}>Sedan SC</span>
    ),
    value: "Sedan SC",
  },
  {
    label: (
      <span style={{ fontFamily: "Ubuntu Sans", fontSize: 16 }}>
        Ubuntu Sans
      </span>
    ),
    value: "Ubuntu Sans",
  },
  {
    label: (
      <span style={{ fontFamily: "Noto Serif", fontSize: 16 }}>Noto Serif</span>
    ),
    value: "Noto Serif",
  },

  {
    label: (
      <span style={{ fontFamily: "Sevillana", fontSize: 16 }}>Sevillana</span>
    ),
    value: "Sevillana",
  },
];

export const SKETCH_ID = "sketch-canvas";

export const CANVAS_CUSTOM_PROPS = [
  "id",
  "canvas_name",
  "selectable",
  "hasControls",
  "sub_type",
  "imageSource",
  "imageBorder",
  "oldArrowInfo",
];
