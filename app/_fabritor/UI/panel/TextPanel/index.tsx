import { Button } from "@/components/ui/button";
import PresetFontPanel from "./PresetFontPanel";
import { createTextbox } from "@/app/_objects/textbox";
import { useContext } from "react";
import { GloablStateContext } from "@/context/global-context";

export default function TextPanel() {
  const { editor } = useContext(GloablStateContext);

  const handleAddText = async (options: any) => {
    await createTextbox({ ...options, canvas: editor?.canvas });
  };

  return (
    <div className="p-4 flex-1 ">
      <Button
        onClick={() => {
          handleAddText({
            fontFamily: "Roboto",
            fontSize: 40,
            text: "Add a text",
          });
        }}
        className="w-full bg-green-700 hover:bg-green-800"
      >
        Add text box
      </Button>
      <PresetFontPanel addTextBox={handleAddText} />
    </div>
  );
}
