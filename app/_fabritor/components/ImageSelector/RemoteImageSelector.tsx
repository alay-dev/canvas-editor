import { useState } from "react";
import { Input, Popover, Space } from "antd";
import { Button } from "@/components/ui/button";

type Props = {
  onChange: (data: string) => void;
};

export default function RemoteImageSelector({ onChange }: Props) {
  const [url, setUrl] = useState("");

  const handleClick = () => {
    if (url) {
      onChange?.(url);
    }
  };

  return (
    <Popover
      content={
        <Space.Compact>
          <Input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            style={{ width: 260 }}
          />
          <Button onClick={handleClick}>confirm</Button>
        </Space.Compact>
      }
      title="Please enter the url:"
      trigger="click"
    >
      <Button variant="outline" size={"sm"} className="w-full">
        Add remote picture
      </Button>
    </Popover>
  );
}
