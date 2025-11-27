// app/api/disco/start/route.ts
import { pusherServer } from "../../../../lib/pusher";

export async function POST() {
  try {
    await pusherServer.trigger("disco", "toggle", { active: true });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("DISCO START ERROR:", error);
    return Response.json({ error: "fail" }, { status: 500 });
  }
}
