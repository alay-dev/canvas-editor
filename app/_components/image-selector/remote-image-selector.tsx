import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

type Props = {
  onChange: (data: string) => void;
};

export default function RemoteImageSelector({ onChange }: Props) {
  const [url, setUrl] = useState("");

  const handleClick = () => {
    onChange(url);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size={"sm"} className="w-full">
          Add remote picture
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right" className="w-max bg-background flex gap-3">
        <Input className="w-[20rem]" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter the image URL" />
        <Button disabled={!url} onClick={handleClick}>
          Add image
        </Button>
      </PopoverContent>
    </Popover>
  );
}
