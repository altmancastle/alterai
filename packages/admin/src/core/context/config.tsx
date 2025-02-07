import { createContext, useContext } from "react";
import { AlterConfig, alterConfig } from "../config/config";

const AlterAiConfigContext = createContext<AlterConfig>(alterConfig);

const AlterAiConfigProvider = (props: { children: React.ReactElement}) => {
  return (
    <AlterAiConfigContext.Provider value={alterConfig}>
      {props.children}
    </AlterAiConfigContext.Provider>
  )
}

const useAlterAiConfig = () => {
  return useContext(AlterAiConfigContext);
}

export { AlterAiConfigProvider, useAlterAiConfig };



