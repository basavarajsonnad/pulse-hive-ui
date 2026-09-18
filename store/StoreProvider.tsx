"use client";

import { type ReactNode, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./index";

export default function StoreProvider({ children }: { children: ReactNode }) {
  // Lazy initializer runs makeStore() once per client instance.
  const [store] = useState(makeStore);

  return <Provider store={store}>{children}</Provider>;
}
