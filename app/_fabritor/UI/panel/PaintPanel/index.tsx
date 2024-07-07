import { useContext, useEffect, useState } from "react";
import { fabric } from "fabric";
import { DRAW_MODE_CURSOR, DRAG_ICON } from "@/public/icons";
import { brushList } from "./brush-list";
import { GloablStateContext } from "@/context/global-context";
import PathSetterForm from "../../setter/PathSetter/PathSetterForm";
import { FormProvider, useForm } from "react-hook-form";
import CommonSetter from "../../setter/CommonSetter/common-setter";

export type PaintInputs = {
	color: string;
	width: number;
	isLocked?: boolean;
	shadow: {
		color: string;
		width: number;
		offset: number;
	};
};

export default function PaintPanel() {
	const [isDrawingMode, setIsDrawingMode] = useState(true);
	const { editor } = useContext(GloablStateContext);

	const methods = useForm<PaintInputs>();

	// const handleBrushChange = (options) => {
	//   if (!editor) return;

	//   if (options.color) {
	//     editor.canvas.freeDrawingBrush.color = options.color;
	//   }
	//   if (options.width) {
	//     editor.canvas.freeDrawingBrush.width = options.width;
	//   }
	//   if (options.strokeLineCap) {
	//     editor.canvas.freeDrawingBrush.strokeLineCap = options.strokeLineCap;
	//   }
	//   if (options.shadow) {
	//     const shadow = editor.canvas.freeDrawingBrush.shadow;
	//     const originalShadowObject = shadow ? shadow.toObject() : {};
	//     const newShadowObject = {
	//       blur: options.shadow.width || originalShadowObject.blur,
	//       offsetX: options.shadow.offset || originalShadowObject.offsetX,
	//       offsetY: options.shadow.offset || originalShadowObject.offsetY,
	//       affectStroke: true,
	//       color: options.shadow.color || originalShadowObject.color,
	//     };
	//     editor.canvas.freeDrawingBrush.shadow = new fabric.Shadow(
	//       newShadowObject
	//     );
	//   }
	// };

	const stopFreeDrawMode = () => {
		if (!editor?.canvas) return;
		editor.canvas.isDrawingMode = !editor?.canvas?.isDrawingMode;
		setIsDrawingMode(!isDrawingMode);
	};

	const initBrush = () => {
		if (!editor?.canvas) return;
		if (editor) {
			editor.canvas.isDrawingMode = true;
			editor.canvas.freeDrawingCursor = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
				DRAW_MODE_CURSOR
			)}") 4 12, crosshair`;
			const freeDrawingBrush = new fabric.PencilBrush(editor.canvas);
			editor.canvas.freeDrawingBrush = freeDrawingBrush;
			const { color, width } = brushList[0].options;
			freeDrawingBrush.color = color;
			freeDrawingBrush.width = width;
			freeDrawingBrush.shadow = new fabric.Shadow({
				blur: 0,
				offsetX: 0,
				offsetY: 0,
				affectStroke: true,
				color: "#000000",
			});

			methods.setValue("color", color);
			methods.setValue("width", width);
			methods.setValue("shadow", {
				color: "#000000",
				width: 0,
				offset: 0,
			});
		}

		return () => {
			if (editor?.canvas) {
				editor.canvas.isDrawingMode = false;
			}
		};
	};

	useEffect(() => {
		return initBrush();
	}, []);

	return (
		<div className="p-4 w-full">
			<FormProvider {...methods}>
				<PathSetterForm mode="paint" />
			</FormProvider>
		</div>
	);
}
