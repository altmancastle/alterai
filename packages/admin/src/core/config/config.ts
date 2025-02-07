import { produce } from "immer";

type Theme = "light" | "dark";
type Layout = {
  direction: "ltr" | "rtl";
  sidebarPosition: "left" | "right";
  sidebarCollapsed: boolean;
  showBreadcrumb: boolean;
};

export type TAlterConfig = {
  appName: string;
  version: string;
  apiBaseUrl: string;
  theme: Theme;
  locale: string;
  debug: boolean;
  enableTransition: boolean;
  aside: {
    collapsed: boolean;
  };
  features: {
    [key: string]: boolean;
  };
  layout: Layout;
};

export const alterConfigInitial: TAlterConfig = {
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
    collapsed: false,
  },
  layout: {
    direction: "ltr",
    sidebarPosition: "left",
    sidebarCollapsed: false,
    showBreadcrumb: false,
  },
};

export class AlterConfig {
  config = alterConfigInitial;
  constructor(config: TAlterConfig) {
    this.config = config;
  }
  getTheme() {
    return this.config.theme;
  }
  setTheme(theme: Theme) {
    this.config = produce(this.config, (draft) => {
      draft.theme = theme;
    });
  }
  toggleAsideCollapsed() {
    this.config = produce(this.config, (draft) => {
      draft.aside.collapsed = !draft.aside.collapsed;
    });
  }
  getLayout() {
    return this.config.layout;
  }
  setLayout(layout: Layout) {
    this.config = produce(this.config, (draft) => {
      draft.layout = layout;
    });
  }
}

export const alterConfig = new AlterConfig(alterConfigInitial);
