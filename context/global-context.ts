import Editor from "@/app/init";
import { createContext } from "react";

export interface IGlobalStateContext {
  object?: fabric.Object | null;
  setActiveObject?: (o: fabric.Object | null) => void;
  isReady?: boolean;
  setReady?: (o: boolean) => void;
  editor?: Editor;
}

export const GlobalStateContext = createContext<IGlobalStateContext>({
  editor: undefined,
  isReady: false,
  object: undefined,
});
