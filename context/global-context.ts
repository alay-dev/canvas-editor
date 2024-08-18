import Editor from "@/app/init";
import { createContext } from "react";

export interface IGlobalStateContext {
  object?: fabric.Object | null;
  setActiveObject?: (o: fabric.Object | null) => void;
  isReady?: boolean;
  setReady?: (o: boolean) => void;
  editor?: Editor;
  isPanel: boolean;
  setPanel: (data: boolean) => void;
}

export const GlobalStateContext = createContext<IGlobalStateContext>({
  editor: undefined,
  isReady: false,
  object: undefined,
  isPanel: true,
  setPanel: () => null,
});
