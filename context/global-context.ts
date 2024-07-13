import Editor from "@/app/init";
import { createContext } from "react";

export interface IGloablStateContext {
  object?: fabric.Object | null | undefined;
  setActiveObject?: (o: fabric.Object | null) => void;
  isReady?: boolean;
  setReady?: (o: boolean) => void;
  editor?: Editor | null;
}

export const GloablStateContext = createContext<IGloablStateContext>({
  editor: null,
  isReady: false,
  object: null,
});
