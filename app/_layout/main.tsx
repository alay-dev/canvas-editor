import RotateAngleToolTip from "@/app/_components/rotate-angle-tool-tip";
import Header from "./header";
import Panel from "../_views/panel";
import Setter from "../_views/setter";
import { Spinner } from "@/components/ui/spinner";
import { MENUITEM_WIDTH, PANEL_WIDTH, SETTER_WIDTH } from "@/config";
import { useContext } from "react";
import { GlobalStateContext } from "@/context/global-context";

const Main = ({ children, isReady }: { children: React.ReactNode; isReady: boolean }) => {
  const { isPanel } = useContext(GlobalStateContext);

  return (
    <section className="h-full relative">
      {!isReady ? (
        <div className="absolute z-20 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Spinner className="" />
        </div>
      ) : null}
      <RotateAngleToolTip />
      <Header />
      <div className="h-screen w-full flex pt-14">
        <Panel />
        <div
          className="h-full bg-gray-200 relative"
          style={{
            width: isPanel ? `calc(100vw - ${PANEL_WIDTH}px - ${MENUITEM_WIDTH}px - ${SETTER_WIDTH}px)` : `calc(100vw - ${MENUITEM_WIDTH}px - ${SETTER_WIDTH}px)`,
          }}
        >
          {children}
        </div>
        <Setter />
      </div>
    </section>
  );
};

export default Main;
