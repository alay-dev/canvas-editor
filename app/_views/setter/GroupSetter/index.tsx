// @ts-nocheck

import { Button } from "antd";
import { useContext } from "react";
import { GloablStateContext } from "@/context/global-context";
import { groupSelection, ungroup } from "@/utils/helper";

export default function GroupSetter() {
  const { object, editor } = useContext(GloablStateContext);

  if (!object || (object.type !== "group" && object.type !== "activeSelection"))
    return null;

  return (
    <div>
      {object.type === "group" ? (
        <Button
          type="primary"
          block
          onClick={() => {
            ungroup(editor?.canvas, object);
          }}
        >
          Cancel the construction group
        </Button>
      ) : (
        <Button
          type="primary"
          block
          onClick={() => {
            groupSelection(editor?.canvas, object);
          }}
        >
          Build a group
        </Button>
      )}
    </div>
  );
}
