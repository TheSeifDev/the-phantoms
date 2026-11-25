export const faceStates = [
  { id: "idle", label: "Idle", title: "Calm, present, breathing", body: "A soft face with natural blinking. RAFIQ rests quietly and waits." },
  { id: "listening", label: "Listening", title: "The microphone is open", body: "The wake word has been heard. Eyes widen while RAFIQ listens." },
  { id: "thinking", label: "Thinking", title: "Retrieving context", body: "The local model is working through only the memory relevant to this question." },
  { id: "speaking", label: "Speaking", title: "Answering out loud", body: "A gentle rhythm follows the voice as an answer is generated." },
  { id: "happy", label: "Happy", title: "A warm moment", body: "A kind reply, a joke remembered, a familiar song." },
  { id: "alert", label: "Alert", title: "Attention requested", body: "A reminder or SOS workflow needs a calm, clear response." },
] as const;

export type FaceStateId = (typeof faceStates)[number]["id"];
