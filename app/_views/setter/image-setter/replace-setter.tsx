import ImageSelector from "@/app/_components/image-selector";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { GlobalStateContext } from "@/context/global-context";

export default function ReplaceSetter() {
  const { object, editor } = useContext(GlobalStateContext);

  const handleImageReplace = (base64: string | ArrayBuffer) => {
    if (base64) {
      (object as fabric.Image).setSrc(String(base64), () => {
        editor?.canvas?.requestRenderAll();
        editor?.fireCustomModifiedEvent();
      });
    }
  };

  return (
    <div className=" mb-4 w-full">
      <Popover>
        <PopoverTrigger asChild className="w-full">
          <Button size={"sm"} className="w-full bg-green-700 hover:bg-green-800">
            Replace the picture
          </Button>
        </PopoverTrigger>
        <PopoverContent className="">
          <ImageSelector onChange={handleImageReplace} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
