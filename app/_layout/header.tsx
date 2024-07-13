import Toolbar from "@/app/_components/tool-bar";
import Export from "@/app/_components/export";
import BaseInfo from "@/app/_components/canvas-info";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-4 h-14 bg-background  border-b border-gray-600 fixed top-0 w-full bg-body text-white [&>*]:flex-1 z-10">
      <BaseInfo />
      <Toolbar />
      <Export />
    </header>
  );
}
