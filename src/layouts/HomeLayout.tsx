"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useMediaQuery, useScreen } from "usehooks-ts";

type HomeLayoutType = { children: React.ReactNode };
const HomeLayout: React.FC<HomeLayoutType> = ({ children }) => {
  return (
    <div
      className={`transition overflow-hidden w-full h-screen relative grid py-3 px-3 md:px-48 gap-3 bg-gray-700  grid-rows-[auto_90%]`}
    >
      <Header></Header>
      <div className={"flex h-full max-w-full flex-1 flex-col "}>
        {children}
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header
      className={
        "bg-gray-900 rounded-xl shadow-md shadow-gray-900 flex items-center justify-center"
      }
    >
      <h1 className="text-xl text-transparent font-semibold text-center flex gap-2 items-center justify-center bg-gradient-to-r from-rose-300 via-fuchsia-400 to-indigo-400 bg-clip-text">
        ChatGPT<span className={"text-sm place-self-start"}>+</span>
      </h1>
    </header>
  );
};

export default HomeLayout;
