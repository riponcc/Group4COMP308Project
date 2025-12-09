// modelClient.js — wraps a LangChain chat model so callers can use invoke([["human","..."],...])
export default function makeModelClient({ llm }) {
  if (!llm) throw new Error("llm (LangChain model) is required");

  return {
    invoke: async (messages) => {
      // messages format: [ ["human","text"], ["assistant","..."] ]
      // Convert to LangChain expected format (role: user/assistant)
      const formatted = messages.map(([role, content]) => {
        if (!content) return null;
        if (role === "human") return { role: "user", content };
        if (role === "assistant") return { role: "assistant", content };
        // keep other roles as-is
        return { role, content };
      }).filter(Boolean);

      // LangChain ChatGoogleGenerativeAI supports .invoke(formattedMessages)
      // or .call depending on version. We'll use .invoke which returns { content }.
      const response = await llm.invoke(formatted);
      // Normalize to { content: string } shape like earlier code expects
      // Some versions might return string directly; handle both.
      if (typeof response === "string") return { content: response };
      return { content: response.content ?? (response.text ?? JSON.stringify(response)) };
    },
  };
}
