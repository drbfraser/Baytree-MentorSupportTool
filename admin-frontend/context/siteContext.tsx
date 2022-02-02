import React from "react";

export interface SiteContextInterface {
  setSiteContext: (newSiteContext: Partial<SiteContextInterface>) => void;
}

export const defaultSiteContext: SiteContextInterface = {
  setSiteContext: () => {},
};

const siteContext =
  React.createContext<SiteContextInterface>(defaultSiteContext);

export default siteContext;
