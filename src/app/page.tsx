import ChatContainer from "@/components/ChatContainer";

export default function Home() {
  return (
    <main className="relative h-full w-full  flex flex-col items-stretch flex-1 bg-gray-800 shadow-xl rounded-xl p-1">
      <ChatContainer />
    </main>
  );
}
