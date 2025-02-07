import { Outlet, NavLink } from "react-router";
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
      }} className="h-screen absolute top-0 left-0 bottom-0 bg-sky-500 transition-all text-white">
        <div accessKey="logo" className="flex w-full items-center justify-center h-14 text-white">ALTER AI</div>
        <div className="h-full">
          <div className="w-full">
            <div className="px-2">
              <NavLink to="/"
                className={({ isActive }) =>
                  isActive ? " bg-sky-50 block px-2 py-2 rounded-md text-black" : "block px-2 py-2"
                }>
                  Dashboard
                </NavLink>
            </div>
            <div className="px-2">
              <NavLink to="/analytics"
                className={({ isActive }) =>
                  isActive ? " bg-sky-50 block px-2 py-2 rounded-md text-black" : "block px-2 py-2"
                }>
                  analytics
                </NavLink>
                <div className="pl-2">
                  <NavLink to="/analytics/overview"
                    className={({ isActive }) =>
                      isActive ? " bg-sky-50 block px-2 py-2 rounded-md text-black" : "block px-2 py-2"
                    }>
                      overview
                    </NavLink>
                </div>
            </div>
            <div className="px-2">
                <div className="px-2 py-2">analytics</div>
                <div className="pl-2">
                  <NavLink to="/chat/index"
                    className={({ isActive }) =>
                      isActive ? " bg-sky-50 block px-2 py-2 rounded-md text-black" : "block px-2 py-2"
                    }>
                      overview
                    </NavLink>
                  <NavLink to="/chat/history"
                    className={({ isActive }) =>
                      isActive ? " bg-sky-50 block px-2 py-2 rounded-md text-black" : "block px-2 py-2"
                    }>
                      overview
                    </NavLink>
                  <NavLink to="/chat/collect"
                    className={({ isActive }) =>
                      isActive ? " bg-sky-50 block px-2 py-2 rounded-md text-black" : "block px-2 py-2"
                    }>
                      collect
                    </NavLink>
                </div>
            </div>
            <div className="px-2">
              <NavLink to="/settings"
                className={({ isActive }) =>
                  isActive ? " bg-sky-50 block px-2 py-2 rounded-md text-black" : "block px-2 py-2"
                }>
                  Settings
                </NavLink>
            </div>
            <div className="px-2">
              <NavLink to="/models"
                className={({ isActive }) =>
                  isActive ? " bg-sky-50 block px-2 py-2 rounded-md text-black" : "block px-2 py-2"
                }>
                  Models
                </NavLink>
            </div>
            <div className="px-2">
              <NavLink to="/register"
                className={({ isActive }) =>
                  isActive ? " bg-sky-50 block px-2 py-2 rounded-md text-black" : "block px-2 py-2"
                }>
                  Register
                </NavLink>
            </div>
            <div className="px-2">
              <NavLink to="/login"
                className={({ isActive }) =>
                  isActive ? " bg-sky-50 block px-2 py-2 rounded-md text-black" : "block px-2 py-2"
                }>
                  Login
                </NavLink>
            </div>
            <div className="px-2">
              <NavLink to="/help"
                className={({ isActive }) =>
                  isActive ? " bg-sky-50 block px-2 py-2 rounded-md text-black" : "block px-2 py-2"
                }>
                  Help
                </NavLink>
            </div>
            <div className="px-2">
              <NavLink to="/notifications"
                className={({ isActive }) =>
                  isActive ? " bg-sky-50 block px-2 py-2 rounded-md text-black" : "block px-2 py-2"
                }>
                  Notifications
                </NavLink>
            </div>
          </div>
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
