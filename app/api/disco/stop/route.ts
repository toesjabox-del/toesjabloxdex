// app/api/disco/stop/route.ts
import { pusherServer } from "../../../../lib/pusher";

export async function POST() {
  try {
    await pusherServer.trigger("disco", "toggle", { active: false });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("DISCO STOP ERROR:", error);
    return Response.json({ error: "fail" }, { status: 500 });
  }
}
