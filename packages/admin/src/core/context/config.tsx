import { createContext, useContext, useState } from "react";
type Theme = "light" | "dark";
type Layout = {
  direction: "ltr" | "rtl";
  sidebarPosition: "left" | "right";
  sidebarCollapsed: boolean;
  showBreadcrumb: boolean;
};

export type Config = {
  appName: string;
  version: string;
  apiBaseUrl: string;
  theme: Theme;
  locale: string;
  debug: boolean;
  enableTransition: boolean;
  aside: {
    collapsed: boolean;
    width: number;
  };
  features: {
    [key: string]: boolean;
  };
  layout: Layout;
};

const configInitial: Config = {
  appName: "Alter Admin",
  version: "1.0.0",
  apiBaseUrl: "http://localhost:3000",
  theme: "light",
  locale: "en",
  debug: false,
  enableTransition: true,
  features: {
    darkMode: true,
    multiLanguage: true,
    notification: true,
  },
  aside: {
    collapsed: true,
    width: 250,
  },
  layout: {
    direction: "ltr",
    sidebarPosition: "left",
    sidebarCollapsed: false,
    showBreadcrumb: false,
  },
};

const AlterAiConfigContext = createContext<{
  alterConfig: Config,
  setAlterConfig: (config: Config) => void
} | null>(null);

const AlterAiConfigProvider = (props: { children: React.ReactElement}) => {

  const [alterConfig, setAlterConfig] = useState(configInitial);

  return (
    <AlterAiConfigContext.Provider value={{alterConfig, setAlterConfig}}>
      {props.children}
    </AlterAiConfigContext.Provider>
  )
}

const useAlterAiConfig = () => {
  return useContext(AlterAiConfigContext);
}

export { AlterAiConfigProvider, useAlterAiConfig };



