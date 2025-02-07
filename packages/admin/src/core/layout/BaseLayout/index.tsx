import { Outlet } from "react-router";
import Bars3BottomLeftIcon from "@heroicons/react/24/solid/Bars3BottomLeftIcon"
const BaseLayout = () => {

  return <main className="relative overflow-hidden">
      <aside className="h-screen w-72 absolute top-0 left-0 bottom-0 bg-gray-200 transition-all">aside</aside>
      <section className="h-screen ml-72 p-2 overflow-y-auto transition-all">
        <header className="h-14 bg-gray-300 rounded-md px-2">
          <div className="w-10 h-full flex items-center justify-center">
            <Bars3BottomLeftIcon className="cursor-pointer rounded-md hover:bg-amber-50 transition-all" />
          </div>
        </header>
        <div className="h-full bg-green-100 rounded-md mt-2">
          <Outlet />
        </div>
      </section>
  </main>
}

export default BaseLayout;
