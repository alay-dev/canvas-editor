import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BorderOutlined } from "@ant-design/icons";
import MoreConfigWrapper from "../Form/MoreConfigWrapper";
import CommonBorderSetter from "../BorderSetter";
import { useForm } from "react-hook-form";
import { PIP as FrameIcon } from "solar-icon-set";

export default function BorderSetter() {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setShowMore(true);
        }}
        className="w-full mb-3 gap-2 border-gray-400"
      >
        <FrameIcon />
        Frame
      </Button>
      <MoreConfigWrapper open={showMore} setOpen={setShowMore} title="frame">
        <div style={{ marginTop: 24 }}>
          <CommonBorderSetter />
        </div>
      </MoreConfigWrapper>
    </>
  );
}
