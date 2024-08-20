"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlobalStateContext } from "@/context/global-context";
import { Magnifer as SearchIcon } from "solar-icon-set";
import { useContext, useEffect, useState } from "react";
import { createPathFromSvg, loadSvgFromUrl } from "@/app/_objects/path";
import { fabric } from "fabric";
import { uuid } from "@/lib/utils";

const IconPanel = () => {
  const { editor } = useContext(GlobalStateContext);
  const [searchTerm, setSeachTerm] = useState("star");
  const [icons, setIcons] = useState<string[]>([]);

  useEffect(() => {
    onSearchTermChange("star");
  }, []);

  const onSearchTermChange = async (val: string) => {
    setSeachTerm(val);
    await fetch(`https://api.iconify.design/search?query=${val}`)
      .then((res) => res.json())
      .then((res) => {
        setIcons(res.icons);
      });
  };

  const addIcon = async (url: string) => {
    if (!editor?.canvas) return;

    const svg = (await loadSvgFromUrl(url)) as fabric.Path;
    svg.set({ id: uuid(), type: "polygon" });
    editor.canvas.add(svg);
    editor.canvas.requestRenderAll();
  };

  return (
    <div className="p-4 w-full overflow-hidden">
      <p className="text-gray-500 text-sm mb-1">Search for icons</p>
      <div className="flex gap-1 items-center border-gray-500 border rounded-lg px-2">
        <Input placeholder="Search by tags or names" className="border-none focus-visible:ring-0 focus-visible:ring-offset-0" onChange={(e) => onSearchTermChange(e.target.value)} value={searchTerm} />
        <SearchIcon color="#BDBDBD" />
      </div>
      <ScrollArea className="mt-5">
        <div className="grid grid-cols-4 gap-3  max-h-[82vh]">
          {icons?.map((item) => {
            const lib = item.split(":")?.at(0);
            const iconName = item.split(":")?.at(1);
            const url = `https://api.iconify.design/${lib}/${iconName}.svg?width=25&color=%23fff`;
            const addIconUrl = `https://api.iconify.design/${lib}/${iconName}.svg?width=100&color=%23000`;
            return (
              <div key={item} onClick={() => addIcon(addIconUrl)} className="bg-gray-700 rounded-md flex items-center justify-center aspect-square hover:border transition border-gray-400 overflow-hidden relative cursor-pointer">
                <img src={url} alt={item} />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default IconPanel;
