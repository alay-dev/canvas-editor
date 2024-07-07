import Toolbar from "./Toolbar";
import Export from "./Export";
import BaseInfo from "./BaseInfo";

export default function HeaderWraper() {
  return (
    <header className="flex justify-between items-center px-4 h-14 bg-background  border-b border-gray-600 fixed top-0 w-full bg-body text-white [&>*]:flex-1 z-10">
      <BaseInfo />
      <Toolbar />
      <Export />
    </header>
  );
}
