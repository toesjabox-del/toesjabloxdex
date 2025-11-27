import Pusher from "pusher-js";

export const pusherClient = new Pusher("a0ca769eea1d4c26d81f", {
  cluster: "eu"
});
