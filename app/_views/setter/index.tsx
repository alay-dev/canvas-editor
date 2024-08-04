// @ts-nocheck

import { useContext } from "react";
import { GlobalStateContext } from "@/context/global-context";
import { SKETCH_ID } from "@/constants/canvas";
import SketchSetter from "./sketch-setter";
import TextSetter from "./text-setter";
import ImageSetter from "./image-setter";
import { LineSetter, ShapeSetter } from "./shape-setter";
// import CommonSetter from "./CommonSetter";
// import GroupSetter from "./GroupSetter";
import PathSetter from "./PathSetter";
import { SETTER_WIDTH } from "@/config";

export default function Setter() {
  const { object, isReady } = useContext(GlobalStateContext);
  const objectType = object?.get?.("type") || "";

  const getRenderSetter = () => {
    if (!isReady) return null;
    if (!object || object.id === SKETCH_ID) return <SketchSetter />;
    switch (objectType) {
      case "f-text":
        return <TextSetter />;
      case "rect":
      case "circle":
      case "triangle":
      case "polygon":
        // case "ellipse":
        return <ShapeSetter />;
      case "f-line":
      case "f-arrow":
        return <LineSetter />;
      case "f-image":
        return <ImageSetter />;
      case "path":
        return <PathSetter />;
      // case "group":
      //   if (object?.sub_type === "rough") {
      //     return <RoughSetter />;
      //   }
      //   return <GroupSetter />;
      // case "activeSelection":
      //   return <GroupSetter />;
      default:
        return null;
    }
  };

  const renderSetter = () => {
    const Setter = getRenderSetter();
    if (Setter) {
      return Setter;
    }
    return null;
  };

  const getSetterTitle = () => {
    if (!isReady) return null;
    if (!object || object.id === SKETCH_ID) return "Canvas";
    switch (objectType) {
      case "f-text":
      case "custom-text":
        return "Text";
      case "rect":
      case "circle":
      case "triangle":
      case "polygon":
      case "ellipse":
        return "Shape";
      case "line":
      case "f-line":
      case "f-arrow":
      case "f-tri-arrow":
        return "line";
      case "f-image":
        return "Picture";
      case "image":
        return "Configuration";
      case "path":
        return "Brush";
      case "group":
        return "combination";
      case "activeSelection":
        return "combination";
      default:
        return "Canvas";
    }
  };

  const renderSetterTitle = () => {
    const title = getSetterTitle();
    if (!title) {
      return null;
    }
    return (
      <div className="p-2 border-b border-gray-600">
        <h3 className="text-gray-100  text-lg uppercase"> {getSetterTitle()}</h3>
      </div>
    );
  };

  return (
    <div style={{ width: SETTER_WIDTH }} className=" bg-[#263238] text-white overflow-y-scroll">
      {renderSetterTitle()}
      <div className="px-6 py-4">{renderSetter()}</div>
    </div>
  );
}
