import Pusher from "pusher";

export const pusherServer = new Pusher({
  appId: "2083818",
  key: "a0ca769eea1d4c26d81f",
  secret: "fb93f2cf8899ead79a46",
  cluster: "eu",
  useTLS: true
});
