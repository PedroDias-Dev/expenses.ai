import React, { useEffect } from "react";
import Transition from "../animations/transition";

export default function Loading() {
  useEffect(() => {
    async function getLoader() {
      const { tailChase } = await import("ldrs");
      tailChase.register();
    }
    getLoader();
  }, []);

  return (
    <Transition>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50 flex items-center justify-center">
        <div className="flex flex-col gap-2 items-center justify-center">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-expect-error  */}
          <l-tail-chase size="30" speed="1.75" color="white" />
        </div>
      </div>
    </Transition>
  );
}
