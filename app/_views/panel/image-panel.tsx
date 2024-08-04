import { createFImage } from "@/app/_objects/image";
import { useContext, useEffect, useState } from "react";
import ImageSelector from "@/app/_components/image-selector";
import { GlobalStateContext } from "@/context/global-context";
import { Input } from "@/components/ui/input";
import { Magnifer as SearchIcon } from "solar-icon-set";
import { PEXEL_API_KEY } from "@/config";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const imageSearchTags = ["Background", "Sky", "Food", "Paper", "Money", "Beach", "Water", "White background", "Black background", "Coffee", "Nature", "Car", "Business", "Laptop", "Office"];

export default function ImagePanel() {
  const { editor } = useContext(GlobalStateContext);
  const [searchTerm, setSeachTerm] = useState("Background");
  const [images, setImages] = useState<any[]>([]);

  const addImage = async (url: string) => {
    if (!editor?.canvas) return;

    await createFImage({ src: url, canvas: editor?.canvas });
  };

  useEffect(() => {
    fetchImages("Background");
  }, []);

  const fetchImages = async (term: string) => {
    setSeachTerm(term);
    const data = await fetch(`https://api.pexels.com/v1/search?query=${term}`, {
      headers: {
        Authorization: PEXEL_API_KEY,
      },
    }).then((res) => res.json());

    setImages(data.photos);
  };

  return (
    <div className="p-4 w-full overflow-hidden">
      <ImageSelector onChange={addImage} />
      <div className="mt-8 mb-4 flex gap-2 items-center">
        <div className="bg-gray-500 h-px flex-1" />
        <span className="text-gray-500 text-sm">Search for images</span>
        <div className="bg-gray-500 h-px flex-1" />
      </div>
      <div className="flex gap-1 items-center border-gray-500 border rounded-lg px-2">
        <Input placeholder="Search by tags or names" className="border-none focus-visible:ring-0 focus-visible:ring-offset-0" onChange={(e) => fetchImages(e.target.value)} value={searchTerm} />
        <SearchIcon color="#BDBDBD" />
      </div>
      <ScrollArea>
        <div className="flex gap-2  w-full mt-4  pb-2">
          {imageSearchTags?.map((item) => {
            return (
              <div key={item} className="flex-shrink-0 w-max px-3 py-1 border-gray-500 border text-gray-400 font-light text-xs rounded-md cursor-pointer" onClick={() => fetchImages(item)}>
                {item}
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <ScrollArea className="h-[28rem] mt-4">
        <div className="grid gap-3 grid-cols-2  w-full">
          {images?.map((item) => {
            return <img key={item?.id} src={item.src.small} alt="" className="w-full aspect-video object-cover rounded-md object-center" onClick={() => addImage(item.src.large2x)} />;
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
