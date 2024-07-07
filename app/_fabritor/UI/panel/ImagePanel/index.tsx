import { createFImage } from "@/app/_objects/image";
import { useContext, useState } from "react";
import ImageSelector from "@/app/_fabritor/components/ImageSelector";
import { GloablStateContext } from "@/context/global-context";
import { Input } from "@/components/ui/input";
import { Magnifer as SearchIcon } from "solar-icon-set";
import { PEXEL_API_KEY } from "@/config";
import { ScrollArea } from "@/components/ui/scroll-area";

const imageSearchTags = [
  "Background",
  "Sky",
  "Food",
  "Paper",
  "Money",
  "Beach",
  "Water",
  "White background",
  "Black background",
  "Coffee",
  "Nature",
  "Car",
  "Business",
  "Laptop",
  "Office",
];

export default function ImagePanel() {
  const { editor } = useContext(GloablStateContext);
  const [searchTerm, setSeachTerm] = useState("");
  const [images, setIamges] = useState<any[]>([]);

  const addImage = async (url: string) => {
    if (!editor?.canvas) return;

    await createFImage({
      src: url,
      canvas: editor?.canvas,
    });
  };

  const fetchIamges = async (term: string) => {
    setSeachTerm(term);
    const data = await fetch(`https://api.pexels.com/v1/search?query=${term}`, {
      headers: {
        Authorization: PEXEL_API_KEY,
      },
    }).then((res) => res.json());

    setIamges(data.photos);

    console.log(data.photos);
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
        <Input
          placeholder="Search by tags or names"
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => fetchIamges(e.target.value)}
          value={searchTerm}
        />
        <SearchIcon color="#BDBDBD" />
      </div>

      <div className="flex gap-2  w-full mt-4 overflow-scroll ">
        {imageSearchTags?.map((item) => {
          return (
            <div
              key={item}
              className="flex-shrink-0 w-max px-3 py-1 border-gray-500 border text-gray-400 font-light text-xs rounded-md cursor-pointer"
              onClick={() => fetchIamges(item)}
            >
              {item}
            </div>
          );
        })}
      </div>

      <ScrollArea className="h-[23rem] mt-4">
        <div className="grid gap-4 grid-cols-2  w-full">
          {images?.map((item) => {
            return (
              <img
                key={item?.id}
                src={item.src.original}
                alt=""
                className="w-36 aspect-square object-cover rounded-lg object-center"
                onClick={() => addImage(item.src.original)}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
