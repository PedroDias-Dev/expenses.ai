/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Transition from "@/components/animations/transition";
import { timer } from "@/helpers/utils";
import moment from "moment";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export const LoadingContext = createContext({
  loading: false,
  setLoading: ({
    loading,
    text,
    showTimer,
  }: {
    loading: boolean;
    text?: boolean | string;
    showTimer?: boolean;
  }) => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoadingState] = useState(false);

  const [loadingProps, setLoadingProps] = useState({
    text: "",
    showTimer: false,
  });

  const [start, setStart] = useState<moment.Moment | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<string>("0s");

  useEffect(() => {
    async function getLoader() {
      const { tailChase } = await import("ldrs");
      tailChase.register();
    }
    getLoader();
  }, []);

  useEffect(() => {
    if (!start) return;

    const interval = setInterval(() => setTimeElapsed(timer(start)), 1000);

    return () => clearInterval(interval);
  }, [start]);

  const setLoading = ({
    loading,
    text,
    showTimer,
  }: {
    loading: boolean;
    text?: boolean | string;
    showTimer?: boolean;
  }) => {
    setLoadingState(loading);

    if (text) {
      setLoadingProps({
        text: text as string,
        showTimer: showTimer || false,
      });
    }

    if (showTimer) setStart(moment());
  };

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading ? (
        <Transition>
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="flex flex-col gap-2 items-center justify-center">
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-expect-error  */}
              <l-tail-chase size="30" speed="1.75" color="white" />{" "}
              {loadingProps?.text && (
                <p className="text-white text-center max-w-30">
                  {loadingProps.text}{" "}
                  {loadingProps.showTimer && ` (${timeElapsed})`}
                </p>
              )}
            </div>
          </div>
        </Transition>
      ) : null}

      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
