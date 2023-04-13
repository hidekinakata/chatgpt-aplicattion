"use client";
import React from "react";
import { useScreen } from "usehooks-ts";
import Nav from "@/components/Nav";

type SidebarType = {
  layoutMd?: boolean;
  hidden?: boolean;
  closeAction?: () => any;
};

const Sidebar: React.FC<SidebarType> = ({ layoutMd, hidden, closeAction }) => {
  return (
    <>
      <div
        className={
          "flex h-full w-full p-1 flex-1 items-start bg-gray-900 border-white/20 shadow rounded-xl"
        }
      >
        <Nav />
      </div>
    </>
  );
};

export default Sidebar;
