import { ChangeEvent } from "react";
import { Gallery as ImageIcon } from "solar-icon-set";

type Props = {
  onChange: (data: string) => void;
};

export default function LocalImageSelector({ onChange }: Props) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
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
      <ImageIcon iconStyle="BoldDuotone" size={40} color="#BDBDBD" />
      <p className="text-center text-gray-400 font-light text-sm cursor-pointer">
        Drag & drop or
        <label htmlFor="upload-image">
          <span className="text-white underline">upload</span>
        </label>{" "}
        a image
      </p>
      <input id="upload-image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  );
}
