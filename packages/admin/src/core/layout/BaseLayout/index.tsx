import { Outlet } from "react-router";
import Bars3BottomLeftIcon from "@heroicons/react/24/solid/Bars3BottomLeftIcon"
import { useAlterAiConfig } from "../../context/config";
import { produce } from "immer";

const BaseLayout = () => {

  const config = useAlterAiConfig();

  const handleToggleAsideCollapsed = () => {
    if (config?.alterConfig) {
      const alterConfig = produce(config.alterConfig, (draft) => {
        if (draft.aside) {
          draft.aside.collapsed = !draft.aside.collapsed;
        }
      });
      config.setAlterConfig(alterConfig);
    }
  }

  return <main className="relative overflow-hidden">
      {/* aside */}
      <aside style={{
        width: config?.alterConfig.aside.collapsed?config?.alterConfig?.aside.width: 0,
        opacity: config?.alterConfig?.aside.collapsed?1: 0,
      }} className="h-screen absolute top-0 left-0 bottom-0 bg-gray-200 transition-all">
        <div accessKey="logo" className="flex w-full items-center justify-center h-14">ALTER AI</div>
        <div className="h-full">
          
        </div>
      </aside>
      {/* end aside */}

      <section style={{
        marginLeft: config?.alterConfig.aside.collapsed?config?.alterConfig?.aside.width: 0,
      }} className="h-screen ml-72 p-2 overflow-y-auto transition-all">
        <header className="h-14 bg-gray-300 rounded-md px-2">
          <div className="w-10 h-full flex items-center justify-center">
            <Bars3BottomLeftIcon onClick={handleToggleAsideCollapsed} className="cursor-pointer rounded-md hover:bg-amber-50 transition-all" />
          </div>
        </header>
        <div className="h-full bg-green-100 rounded-md mt-2">
          <Outlet />
        </div>
      </section>
  </main>
}

export default BaseLayout;
