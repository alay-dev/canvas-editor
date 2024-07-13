import LocalImagePanel from "./local-image-selector";
import RemoteImagePanel from "./remote-image-selector";

type Props = {
  onChange: (data: string) => void;
};

export default function ImageSelector({ onChange }: Props) {
  return (
    <div className="flex flex-col gap-3 items-center  justify-center ">
      <LocalImagePanel onChange={onChange} />
      <RemoteImagePanel onChange={onChange} />
    </div>
  );
}
