import RotateAngleToolTip from "@/app/_components/rotate-angle-tool-tip";
import Header from "./header";
import Panel from "../_views/panel";
import Setter from "../_views/setter";
import { Spinner } from "@/components/ui/spinner";

const Main = ({ children, isReady }: { children: React.ReactNode; isReady: boolean }) => {
  return (
    <section className="h-full relative">
      {!isReady && (
        <div className="absolute top-1/2 left-1/2 z-20 backdrop-brightness-50 w-full h-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <RotateAngleToolTip />
      <Header />
      <div className="h-screen w-full flex pt-14">
        <Panel />
        <div className="h-full bg-gray-200  flex-1 relative">{children}</div>
        <Setter />
      </div>
    </section>
  );
};

export default Main;
