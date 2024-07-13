"use client";

import { SETTER_WIDTH } from "@/config";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AltArrowLeft } from "solar-icon-set";

export default function MoreConfigWrapper(props: any) {
  const { open, setOpen, title = "", children, ...rest } = props;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        style={{ width: SETTER_WIDTH }}
        className="  mt-14  bg-background text-white p-0 border-none overflow-auto pb-6 outline-none"
      >
        <div className="flex p-2 gap-2 items-center  border-b border-gray-600">
          <AltArrowLeft size={20} onClick={() => setOpen(false)} />
          <p className="text-sm">{title}</p>
        </div>
        <div className="p-4 h-max">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
