import React, { createContext, type PropsWithChildren } from "react";

import { usePersistedState } from "@/hooks/use-persisted-state";
import { generateId } from "@/lib/generate-id";

export const AnalyticsContext = createContext<{ userId: string }>({
  userId: "",
});

export const AnalyticsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [userId] = usePersistedState("jss/unique-id", generateId(8));
  const value = React.useMemo(() => ({ userId }), [userId]);

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
