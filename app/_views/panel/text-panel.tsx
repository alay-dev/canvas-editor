import { Button } from "@/components/ui/button";
import { createTextbox } from "@/app/_objects/textbox";
import { useContext } from "react";
import { GlobalStateContext } from "@/context/global-context";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const PRESET_FONT_LIST = [
  {
    label: (
      <div className="font-bold text-3xl" style={{ fontFamily: "Roboto" }}>
        Add title
      </div>
    ),
    key: "title",
    config: {
      fontFamily: "Roboto",
      fontWeight: "600",
      fontSize: 120,
      text: "Add title",
      top: 100,
    },
  },
  {
    label: <div style={{ fontSize: 24, fontFamily: "Roboto" }}>Add a subtitle</div>,
    key: "sub-title",
    config: {
      fontFamily: "Roboto",
      fontWeight: "500",
      fontSize: 100,
      text: "Add a subtitle",
      top: 400,
    },
  },
  {
    label: <div style={{ fontSize: 16, fontFamily: "Roboto" }}>Add a text</div>,
    key: "content",
    config: {
      fontFamily: "Roboto",
      fontSize: 80,
      text: "Add a text",
      fontWeight: "400",
    },
  },
  {
    label: (
      <div
        style={{
          fontSize: 26,
          fontFamily: "Roboto",
          color: "#ffffff",
          WebkitTextStroke: "1px rgb(255, 87, 87)",
        }}
      >
        Text border
      </div>
    ),
    key: "content",
    config: {
      fontFamily: "Roboto",
      fontSize: 100,
      text: "Text border",
      fill: "#ffffff",
      stroke: "#ff5757",
      strokeWidth: 12,
    },
  },
];

export function PresetFontPanel(props: any) {
  const { addTextBox } = props;

  const handleClick = (item: any) => {
    addTextBox?.(item.config);
  };

  return (
    <div className="">
      <div className="flex gap-3 items-center justify-center">
        <div className="flex-1 h-px bg-gray-500" />
        <h3 className="text-center my-5 text-gray-500 text-sm">Default text box</h3>
        <div className="flex-1 h-px bg-gray-500" />
      </div>

      <ul className="space-y-3">
        {PRESET_FONT_LIST.map((item) => (
          <li
            key={item.key}
            onClick={() => {
              handleClick(item);
            }}
            className=" border border-gray-500 p-2 rounded-lg text-gray-300 cursor-pointer"
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TextPanel() {
  const { editor } = useContext(GlobalStateContext);

  const handleAddText = async (options: any) => {
    await createTextbox({ ...options, canvas: editor?.canvas });
  };

  return (
    <div className="p-4 flex-1 ">
      <Button
        onClick={() => {
          handleAddText({ fontFamily: "Roboto", fontSize: 40, fontWeight: "400", text: "Add a text" });
        }}
        className="w-full bg-green-700 hover:bg-green-800"
      >
        Add text box
      </Button>
      <PresetFontPanel addTextBox={handleAddText} />
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <p className="text-primary font-normal text-sm">Font combination</p>
          <p className="text-primary/50 font-normal text-sm">Coming soon...</p>
        </div>

        <Separator />
        <ScrollArea className="">
          <div className="grid grid-cols-2 gap-3 my-4 max-h-[41vh] items-stretch">
            <div className="bg-gray-700 flex items-center justify-center rounded-md hover:border transition border-gray-400 overflow-hidden relative cursor-pointer">
              <img src="/images/font-combinations/art-or-not.png" alt="" />
            </div>
            <div className="bg-gray-700 flex items-center justify-center rounded-md hover:border transition border-gray-400 overflow-hidden relative cursor-pointer">
              <img src="/images/font-combinations/new-item.png" alt="" />
            </div>
            <div className="bg-gray-700 flex items-center justify-center rounded-md hover:border transition border-gray-400 overflow-hidden relative cursor-pointer">
              <img src="/images/font-combinations/instant-classic.png" alt="" />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
