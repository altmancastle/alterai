import { createContext, useContext } from "react";
import { AlterConfig, alterConfig } from "../config/config";

const AlterConfigContext = createContext<AlterConfig | null>(null);

const AlterConfigProvider = (props: { children: React.ReactElement}) => {
  return (
    <AlterConfigContext.Provider value={alterConfig}>
      {props.children}
    </AlterConfigContext.Provider>
  )
}

const useAlterConfig = () => {
  return useContext(AlterConfigContext);
}

export { AlterConfigProvider, useAlterConfig };



