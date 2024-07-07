import { useRef } from "react";

import LocalFileSelector from "../LocalFileSelector";
import { Gallery as ImageIcon } from "solar-icon-set";

type Props = {
  onChange: (data: string) => void;
};

export default function LocalImageSelector({ onChange }: Props) {
  const localFileSelectorRef = useRef<any>();

  const handleClick = () => {
    localFileSelectorRef.current?.start?.();
  };

  const handleFileChange = (file: Blob) => {
    if (file.type === "image/svg+xml") {
      // const url = URL.createObjectURL(file);
      // addSvg?.({ url });
      return;
    }

    const reader = new FileReader();
    reader.onload = (revt) => {
      if (revt.target?.result) onChange?.(revt?.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="border-dashed border-gray-500 border w-full h-max p-8 px-4 gap-3 rounded-xl flex flex-col items-center justify-center">
      {/* <Button variant="outline" size={"sm"} onClick={handleClick}>
        upload
      </Button> */}
      <ImageIcon iconStyle="BoldDuotone" size={40} color="#BDBDBD" />
      <p
        className="text-center text-gray-400 font-light text-sm cursor-pointer"
        onClick={handleClick}
      >
        Drag & drop or <span className="text-white underline">upload</span> a
        image
      </p>

      <LocalFileSelector
        accept="image/*"
        ref={localFileSelectorRef}
        onChange={handleFileChange}
      />
    </div>
  );
}
