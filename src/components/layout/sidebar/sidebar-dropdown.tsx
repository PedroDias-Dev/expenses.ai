"use client";

import { ChevronDown, ChevronsUpDownIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function SidebarDropdown({
  groupName,
  groupIcon: GroupIcon,
  items,
  sidebarOpen,
}: {
  groupName: string;
  groupIcon?: React.ElementType;
  items: { name: string; icon?: React.ElementType }[];
  sidebarOpen: boolean;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(true);

  if (!sidebarOpen)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          type: "keyframes",
          delay: 0.1,
        }}
        layout
        className={`bg-zinc-500 h-10 w-[44px] flex items-center justify-center rounded-sm`}
      >
        {GroupIcon && <GroupIcon size={20} color={"white"} />}
      </motion.div>
    );

  return (
    <div className="w-full flex flex-col gap-1 px-3 select-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          type: "keyframes",
          delay: 0.1,
        }}
        layout
        className={`flex items-center px-2 py-1 w-full justify-between ${
          !dropdownOpen && "hover:bg-zinc-700 transition-all rounded-sm"
        }`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="text-zinc-200 text-sm font-bold">{groupName}</span>

        <AnimatePresence mode="wait">
          {dropdownOpen ? (
            <motion.div
              key="open"
              initial={{ y: 3, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -3, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={15} color="white" />
            </motion.div>
          ) : (
            <motion.div
              key="closed"
              initial={{ y: 3, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -3, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronsUpDownIcon size={15} color="white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "fit-content" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{
              type: "keyframes",
            }}
            layout
            className="w-full flex flex-col gap-1"
          >
            {items.map((item, i) => {
              const { name, icon: Icon } = item;

              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "keyframes",
                    delay: 0.1,
                  }}
                  layout
                  key={i}
                  className={`w-full px-2 py-1 h-30 flex cursor-pointer ${
                    dropdownOpen ? "justify-start" : "justify-center"
                  } items-center rounded-sm hover:bg-zinc-700 transition-all`}
                >
                  {Icon && <Icon size={15} color={"white"} />}

                  {dropdownOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        type: "keyframes",
                        delay: 0.1,
                      }}
                      layout
                      className="text-sm text-white ml-2 h-[19px]"
                    >
                      {name}
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
