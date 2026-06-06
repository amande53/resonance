import * as React from "react";

const MOBILE_BREAKPOINT = 1024;
const SERVER_SNAPSHOT = false;

const subscribe = (callback: () => void) => {
  window.addEventListener("resize", callback);

  return () => window.removeEventListener("resize", callback);
};

const getSnapshot = () => window.innerWidth < MOBILE_BREAKPOINT;

const getServerSnapshot = () => SERVER_SNAPSHOT;

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
