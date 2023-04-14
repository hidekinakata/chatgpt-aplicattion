"use client";
import React, { useEffect, useRef, useState } from "react";
import PromptSender from "@/components/PromptSender";
import OAISimulation from "@/utils/SimuleteOAIResquest";

function convertResponse(response: string) {
  let parsedResponse: {
    type: string;
    content: string;
  }[] = [];
  let curIndex = 0;
  let blockIndex: number;
  let inlineIndex: number;
  let currentType = "plain";
  let currentContent = "";
  while (curIndex < response.length) {
    let search = response.slice(curIndex);
    blockIndex = search.indexOf("```");
    if (blockIndex !== -1) {
      if (currentType === "block") {
        parsedResponse.push({
          type: currentType,
          content: search.slice(0, blockIndex),
        });
        currentType = "plain";
      } else {
        parsedResponse.push({
          type: currentType,
          content: search.slice(0, blockIndex),
        });
        currentType = "block";
      }
      curIndex += blockIndex + 3;
    } else {
      parsedResponse.push({
        type: currentType,
        content: search.slice(0, search.length),
      });
      currentType = "plain";
      curIndex += search.length;
    }
  }
  return parsedResponse;
}

type ChatContainerType = {};

const ChatContainer: React.FC<ChatContainerType> = (props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const lastP = useRef();
  const [prompt, setPrompt] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [typing, setTyping] = useState(false);
  const handleSubmit = async (prompt: string) => {
    setGptResponse("");
    setPrompt(prompt);
    setTyping(true);
    // const response = new OAISimulation();
    // let done = false;
    // while (!done) {
    //   const { value, done: readerDone } = await response.read();
    //   done = readerDone;
    //   setGptResponse((prev) => prev + value);
    //   contentRef.current!.scrollTo({
    //     top: contentRef.current!.scrollHeight,
    //     behavior: "smooth",
    //   });
    // }

    const response = await fetch("/api/gpt3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const data = response.body;
    if (!data) return;

    const reader = data.getReader();
    const decoder = new TextDecoder();

    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunkValue = decoder.decode(value);
      setGptResponse((prev) => prev + chunkValue);
      contentRef.current!.scrollTo({
        top: contentRef.current!.scrollHeight,
        behavior: "smooth",
      });
    }
    setTyping(false);
  };

  return (
    <>
      {prompt === "" ? (
        <ContentPlaceholder />
      ) : (
        <div
          ref={contentRef}
          className={
            "p-1 md:px-14 text-gray-100 whitespace-pre-wrap overflow-x-hidden overflow-y-scroll pb-48 md:pb-48 text-sm"
          }
        >
          <div className={"p-4 "}>
            <h1 className={"text-center py-3  bg-gray-900 rounded-t-lg"}>
              Your Prompt:
            </h1>
            <p className={"text-center p-2 bg-gray-700 rounded-b-lg"}>
              {prompt}
            </p>
          </div>
          <div className={"p-4"}>
            <div className={"p-5 bg-gray-700/80 rounded-lg"}>
              {convertResponse(gptResponse).map((block, i) => {
                if (block.type === "plain")
                  return (
                    <p key={i} className={""}>
                      {block.content.split(" ").map((palavra, index) => {
                        if (
                          palavra.indexOf("`") !== -1 &&
                          palavra.indexOf("`") !== palavra.lastIndexOf("`")
                        ) {
                          const parsed = palavra.replaceAll("`", "");

                          return (
                            <code
                              key={index}
                              className={"bg-gray-900/50 p-0.5 rounded w-full"}
                            >
                              {parsed}
                            </code>
                          );
                        } else {
                          return <span key={index}>{palavra} </span>;
                        }
                      })}
                    </p>
                  );
                if (block.type === "block")
                  return (
                    <div key={i} className={"rounded-lg shadow-2xl"}>
                      <h1
                        className={
                          "bg-slate-900 p-3 font-mono rounded-t-lg w-full flex itens-center justify-between " +
                          "bg-gradient-to-r from-rose-300 via-fuchsia-400 to-indigo-400 "
                        }
                      >
                        Code{" "}
                        <span
                          className={
                            "p-1 bg-slate-900/10 cursor-pointer rounded-lg"
                          }
                          onClick={async (e) => {
                            console.log("copied");
                            if ("clipboard" in navigator) {
                              await navigator.clipboard.writeText(
                                "Text which you want to copy"
                              );
                            } else {
                              document.execCommand(
                                "copy",
                                true,
                                "Text which you want to copy"
                              );
                            }
                          }}
                        >
                          Copy code
                        </span>
                      </h1>
                      <pre
                        className={
                          "bg-gray-700 p-3 font-mono rounded-b-lg w-full whitespace-pre-wrap"
                        }
                      >
                        {block.content.trimStart().trimEnd()}
                      </pre>
                    </div>
                  );
              })}
            </div>
          </div>
        </div>
      )}
      <PromptSender onSubmit={handleSubmit} disabled={typing} />
    </>
  );
};

const ContentPlaceholder = () => {
  return (
    <div
      className={
        "h-full box-border w-full bg-gray-800 overflow-y-scroll overflow-x-hidden flex flex-col items-center text-sm px-3  mb-16 text-white"
      }
    >
      <h1
        className={
          "select-none text-4xl text-transparent font-semibold text-center mt-10 sm:mt-[10vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center " +
          "bg-gradient-to-r from-rose-300 via-fuchsia-400 to-indigo-400 bg-clip-text"
        }
      >
        ChatGPT <span className={"text-sm place-self-start"}>+</span>
      </h1>
      <div className="max-h-full max-w-2xl md:flex items-start text-center gap-3.5">
        <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
          <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            Examples
          </h2>
          <ul className="flex flex-col gap-3.5 max-w-md m-auto">
            <button className="w-full bg-white/5 p-3 rounded-md hover:bg-gray-900">
              &quot;Explain quantum computing in simple terms&quot; →
            </button>
            <button className="w-full bg-white/5 p-3 rounded-md hover:bg-gray-900">
              &quot;Got any creative ideas for a 10 year old’s birthday?&quot; →
            </button>
            <button className="w-full bg-white/5 p-3 rounded-md hover:bg-gray-900">
              &quot;How do I make an HTTP request in Javascript?&quot; →
            </button>
          </ul>
        </div>
        <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
          <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
              ></path>
            </svg>
            Capabilities
          </h2>
          <ul className="flex flex-col gap-3.5 max-w-md m-auto">
            <li className="w-full bg-white/5 p-3 rounded-md">
              Remembers what user said earlier in the conversation
            </li>
            <li className="w-full bg-white/5 p-3 rounded-md">
              Allows user to provide follow-up corrections
            </li>
            <li className="w-full bg-white/5 p-3 rounded-md">
              Trained to decline inappropriate requests
            </li>
          </ul>
        </div>
        <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
          <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Limitations
          </h2>
          <ul className="flex flex-col gap-3.5 max-w-md m-auto">
            <li className="w-full bg-white/5 p-3 rounded-md">
              May occasionally generate incorrect information
            </li>
            <li className="w-full bg-white/5 p-3 rounded-md">
              May occasionally produce harmful instructions or biased content
            </li>
            <li className="w-full bg-white/5 p-3 rounded-md">
              Limited knowledge of world and events after 2021
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
