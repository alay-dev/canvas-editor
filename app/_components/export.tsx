import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { downloadFile, base64ToBlob } from "@/lib/utils";
import { useContext, useRef } from "react";
import { GlobalStateContext } from "@/context/global-context";
import { Export as ExportIcon } from "solar-icon-set";
import { toast } from "sonner";
import { defaultCanvasName } from "@/constants/canvas";

const items: { key: string; label: string }[] = [
  {
    key: "jpg",
    label: "Export as JPG",
  },
  {
    key: "png",
    label: "Export as PNG",
  },
  {
    key: "svg",
    label: "Export as SVG",
  },
  {
    key: "json",
    label: "Export as template",
  },

  {
    key: "clipboard",
    label: "copy to clipboard",
  },
];

export default function Export() {
  const { editor, setReady, setActiveObject } = useContext(GlobalStateContext);
  const localFileSelectorRef = useRef<any>();

  const selectJsonFile = () => {
    localFileSelectorRef.current?.start?.();
  };

  const handleFileChange = (file: Blob) => {
    setReady?.(false);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const json = evt.target?.result as string;
      if (json) {
        await editor?.loadFromJSON(json, true);
        editor?.fhistory?.reset();
        setReady?.(true);
        setActiveObject?.(null);
        editor?.fireCustomModifiedEvent();
      }
    };
    reader.readAsText(file);
  };

  const copyImage = async () => {
    if (!editor) throw new Error("Canvas is not initialized");
    try {
      const png = editor?.export2Img({ format: "png" });

      const blob = await base64ToBlob(png);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      toast("Copied successfully.");
    } catch (e) {
      toast("If the copy fails, please choose to export to the local area");
    }
  };

  const handleClick = (key: string) => {
    if (!editor) throw new Error("Editor is not initialized");
    const { sketch } = editor;
    const name = sketch?.canvas_name || defaultCanvasName;
    switch (key) {
      case "png":
        const png = editor?.export2Img({ format: "png" });
        downloadFile(png, "png", name);
        break;
      case "jpg":
        const jpg = editor?.export2Img({ format: "jpg" });
        downloadFile(jpg, "jpg", name);
        break;
      case "svg":
        const svg = editor?.export2Svg();
        downloadFile(svg, "svg", name);
        break;
      case "json":
        const json = editor?.canvas2Json();
        downloadFile(`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(json, null, 2))}`, "json", name);
        break;
      case "clipboard":
        copyImage();
        break;
      default:
        break;
    }
  };
  return (
    <div className="flex items-center gap-3 justify-end">
      <Button variant="outline" size="sm" onClick={selectJsonFile}>
        Load templates
      </Button>
      {/* <Dropdown
        menu={{ items, onClick: handleClick }}
        arrow={{ pointAtCenter: true }}
        placement="bottom"
      >
        <Button size="sm" icon={<ExportOutlined />}>
          Export
        </Button>
      </Dropdown> */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="sm" className="gap-2 w-28 border-none">
            <ExportIcon />
            Export
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-[12rem] p-0">
          <ul className="my-2">
            {items?.map((item) => {
              return (
                <li onClick={() => handleClick(item.key)} className="text-sm font-light cursor-pointer hover:bg-gray-100 py-2 px-4" key={item?.key}>
                  {item.label}
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>
      {/* <LocalFileSelector accept="application/json" ref={localFileSelectorRef} onChange={handleFileChange} /> */}
    </div>
  );
}
