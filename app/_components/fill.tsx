import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Pattern } from "fabric/fabric-impl";
import { ChangeEvent } from "react";
import { SketchPicker, BlockPicker, HuePicker } from "react-color";
import { Box, CloseCircle, FullScreenSquare, Gallery, GalleryAdd } from "solar-icon-set";

export type FillType = "solid" | "image";

export type Fill = {
  type: FillType;
  color?: string;
  image?: string;
};

type Props = {
  fill: Fill;
  onChange: (type: FillType, data: string) => void;
};

export default function Fill({ fill, onChange }: Props) {
  const onUploadPattern = (e: ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    if (!files) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (!evt.target?.result) return;
      onChange("image", evt?.target?.result as string);
    };
    reader.readAsDataURL(files[0]);
  };

  return (
    <div className="w-max text-white cursor-pointer">
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex  w-full py-2  rounded-xl items-center gap-2">
            {fill?.type === "solid" ? <div className={cn(" w-6 h-6 rounded-sm")} style={{ backgroundColor: fill?.color }} /> : <img src={fill?.image} alt="" className="w-6 h-6 rounded-sm" />}
            <p className="font-light text-xs">{fill?.type}</p>
          </div>
        </PopoverTrigger>
        <PopoverContent side="left" className="z-50 w-[20rem] p-4 border-0 rounded-xl bg-background mr-5 " align="start">
          <div className="flex items-center gap-2  relative">
            <Tabs defaultValue="solid" className="w-full">
              <TabsList className="bg-gray-700 w-full">
                <TabsTrigger value="solid" className="flex-1">
                  <FullScreenSquare color="#fff" />
                  <p className="text-gray-400 ml-2 text-xs font-normal">Solid</p>
                </TabsTrigger>
                <TabsTrigger value="image" className="flex-1">
                  <Gallery color="#fff" />
                  <p className="text-gray-400 ml-2 text-xs font-normal">Image</p>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="solid">
                <SketchPicker
                  styles={{
                    default: {
                      picker: { width: "100%", border: "none", backgroundColor: "transparent", borderRadius: "0.2rem", overflow: "hidden", padding: 0 },
                      color: { display: "none" },
                    },
                  }}
                  presetColors={[]}
                  color={fill?.color}
                  onChange={(val) => onChange("solid", val.hex)}
                />
              </TabsContent>
              <TabsContent value="image">
                <div className="flex justify-center items-center w-full h-56 border-2 border-dashed  rounded-lg border-gray-500">
                  <label htmlFor="pattern-input" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <GalleryAdd color="#fff" size={30} iconStyle="BoldDuotone" />
                      <p className="text-gray-400 text-sm">Upload image</p>
                    </div>
                  </label>
                  <input onChange={onUploadPattern} id="pattern-input" className="hidden" type="file" accept="image/*" />
                </div>
              </TabsContent>
            </Tabs>
            {/* <Button variant="ghost" className="p-1 h-max hover:bg-gray-700">
              <FullScreenSquare color="#fff" />
            </Button>
            <Button variant="ghost" className="p-1 h-max hover:bg-gray-700">
              <Gallery color="#fff" />
            </Button> */}
            {/* <Button variant="ghost" className="p-1 h-max hover:bg-gray-700 absolute top-2 right-2">
              <CloseCircle color="#90A4AE" />
            </Button> */}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
