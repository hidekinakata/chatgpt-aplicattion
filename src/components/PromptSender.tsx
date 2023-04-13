import React, { FormEventHandler, useRef } from "react";

type PromptSenderType = {
  disabled: boolean;
  onSubmit?: (prompt: string) => any;
};

const PromptSender: React.FC<PromptSenderType> = ({
  onSubmit,
  disabled = false,
}) => {
  let ref = useRef<HTMLTextAreaElement>(null);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (onSubmit && !disabled && ref.current && ref.current.value !== "") {
      onSubmit(ref.current.value);
      ref.current.value = "";
      console.log("Sending prompt to OpenAI.");
    }
  };

  return (
    <div
      className={
        "fixed md:absolute bottom-6 md:bottom-0 left-1/2 -translate-x-1/2 w-[90%] md:w-full pt-2"
      }
    >
      {disabled && (
        <div className={"flex items-center justify-center"}>
          <span className={"inline-flex relative"}>
            <span className={"p-1 text-slate-500"}>Recebendo resposta</span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
          </span>
        </div>
      )}
      <form
        className={
          "stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
        }
      >
        <div className={"relative flex h-full flex-1 md:flex-col"}>
          <div
            className={
              "flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center"
            }
          ></div>
          <div
            className={
              "flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-gray-700  rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)]"
            }
          >
            <textarea
              ref={ref}
              disabled={disabled}
              name={"prompt"}
              tabIndex={0}
              data-id="root"
              rows={1}
              placeholder="Send a message..."
              className="overflow-y-hidden m-0 w-full max-h-[200px] resize-none border-0 bg-transparent text-white/90 p-0 pr-7 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none  pl-2 md:pl-0"
              onKeyDown={(e) => {
                if (e.key == "Enter" && !e.shiftKey) {
                  handleSubmit(e);
                }
              }}
            ></textarea>
            <button
              disabled={disabled}
              type={"button"}
              className={
                "absolute p-1 rounded-md text-gray-500 bottom-1/2 right-2 translate-y-1/2 hover:bg-gray-100 disabled:hover:bg-transparent disabled:opacity-40"
              }
              onClick={handleSubmit}
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-1"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PromptSender;
