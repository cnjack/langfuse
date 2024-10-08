import { PlusCircleIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/src/components/ui/button";
import { ChatMessageRole } from "@langfuse/shared";

import { ChatMessageComponent } from "./ChatMessageComponent";

import type { MessagesContext } from "./types";

type ChatMessagesProps = MessagesContext;
export const ChatMessages: React.FC<ChatMessagesProps> = (props) => {
  const { messages } = props;
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const prevMessageCount = useRef(0);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (prevMessageCount.current < messages.length && scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
    prevMessageCount.current = messages.length;
  }, [scrollAreaRef, messages.length]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 font-semibold">Messages</div>
      <div className="flex-1 overflow-auto scroll-smooth" ref={scrollAreaRef}>
        <div className="mb-4 flex-1 space-y-3">
          {props.messages.map((message) => {
            return (
              <ChatMessageComponent
                {...{ message, ...props }}
                key={message.id}
              />
            );
          })}
        </div>
      </div>
      <div className="py-3">
        <AddMessageButton {...props} />
      </div>
    </div>
  );
};

type AddMessageButtonProps = Pick<MessagesContext, "messages" | "addMessage">;
const AddMessageButton: React.FC<AddMessageButtonProps> = ({
  messages,
  addMessage,
}) => {
  const lastMessageRole = messages[messages.length - 1]?.role;
  const nextMessageRole =
    lastMessageRole === ChatMessageRole.User
      ? ChatMessageRole.Assistant
      : ChatMessageRole.User;

  return (
    <Button
      type="button" // prevents submitting a form if this button is inside a form
      variant="outline"
      className="w-full"
      onClick={() => addMessage(nextMessageRole)}
    >
      <PlusCircleIcon size={14} className="mr-2" />
      <p>Add message</p>
    </Button>
  );
};
