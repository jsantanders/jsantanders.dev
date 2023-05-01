import React, { createContext, PropsWithChildren } from "react";

import { usePersistedState } from "@/hooks/use-persisted-state";
import { generateId } from "@/lib/generate-id";

export const AnalyticsContext = createContext<{ userId: string }>({ userId: "" });

/**
 * Context provider for analytics
 * @param {PropsWithChildren} props The component props
 * @returns {React.ReactElement} The component
 */
export const AnalyticsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [userId] = usePersistedState("jss/unique-id", generateId(8));

  const value = React.useMemo(() => ({ userId }), [userId]);

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};
