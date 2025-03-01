"use client";

import {
  Book,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  UserCheck,
  UserPen,
  UserPlus,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import SidebarDropdown from "./sidebar-dropdown";

import { AnimatePresence, motion } from "framer-motion";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        onTapStart={() => (!sidebarOpen ? setSidebarOpen(true) : null)}
        initial={{ width: 60 }}
        animate={{ width: sidebarOpen ? 300 : 60 }}
        transition={{
          type: "keyframes",
        }}
        layout
        className={`bg-zinc-500 h-full ${
          sidebarOpen ? "w-[300px]" : "w-[60px] cursor-pointer hover:opacity-80"
        } flex flex-col items-center gap-3 text-white h-[calc(100vh_-_56px)] select-none`}
      >
        <div className="w-full flex h-full relative">
          <div className="w-[280px] grid grid-rows-[56px_1fr_70px] items-start gap-6">
            <div className="flex items-center w-full">
              <div className="grid grid-cols-[44px_1fr] w-full gap-2 p-2 h-fit">
                <div
                  className={`bg-blue-400 h-10 w-[44px] flex items-center justify-center rounded-sm`}
                >
                  <Book size={20} color={"white"} />
                </div>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "keyframes",
                      delay: 0.1,
                    }}
                    layout
                    className="flex flex-col w-full"
                  >
                    <h2 className="text-md text-white font-bold">
                      RANDOM COMPANY
                    </h2>
                    <span className="text-xs text-zinc-200">
                      not a actual company
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            <div
              className={`w-full flex flex-col gap-3 align-top ${
                !sidebarOpen && `px-2`
              }`}
            >
              <SidebarDropdown
                groupName="Dashboard"
                groupIcon={LayoutDashboard}
                items={[{ name: "Home", icon: LayoutDashboard }]}
                sidebarOpen={sidebarOpen}
              />
              <SidebarDropdown
                groupName="Users"
                groupIcon={UserRound}
                items={[
                  { name: "All Users", icon: UserRound },
                  { name: "Verify Users", icon: UserCheck },
                  { name: "Create User", icon: UserPlus },
                  { name: "Edit Users", icon: UserPen },
                ]}
                sidebarOpen={sidebarOpen}
              />
              <SidebarDropdown
                groupName="Settings"
                groupIcon={Settings}
                items={[{ name: "Settings", icon: Settings }]}
                sidebarOpen={sidebarOpen}
              />
            </div>

            <div className="grid grid-cols-[44px_1fr] w-full gap-2 px-2 pr-4 h-fit">
              <div
                className={`bg-zinc-300 w-[44px] h-[44px] flex items-center justify-center rounded-full`}
              >
                <User size={20} color={"white"} />
              </div>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "keyframes",
                    delay: 0.2,
                  }}
                  layout
                  className="flex w-full justify-between items-center"
                >
                  <div className="flex flex-col w-full">
                    <h2 className="text-md text-white font-bold">
                      RANDOM COMPANY
                    </h2>
                    <span className="text-xs text-zinc-200">
                      not a actual company
                    </span>
                  </div>

                  <LogOut size={20} color={"white"} />
                </motion.div>
              )}
            </div>
          </div>

          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: "keyframes",
              }}
              layout
              className="w-[20px] h-full flex items-center justify-center cursor-pointer hover:opacity-50 absolute top-0 right-[-20px]"
              onTapStart={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronLeft size={20} color={"white"} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
