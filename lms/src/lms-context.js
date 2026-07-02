import { createContext, useContext } from "react";

export const LmsContext = createContext(null);

export const useLms = () => useContext(LmsContext);