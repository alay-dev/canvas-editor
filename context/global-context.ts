import Editor from "@/app/init";
import { createContext } from "react";

export interface IGloablStateContext {
  object?: fabric.Object | null;
  setActiveObject?: (o: fabric.Object | null) => void;
  isReady?: boolean;
  setReady?: (o: boolean) => void;
  editor?: Editor;
}

export const GloablStateContext = createContext<IGloablStateContext>({
  editor: undefined,
  isReady: false,
  object: undefined,
});
