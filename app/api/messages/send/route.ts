import { pusherServer } from "@/app/lib/pusher";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return Response.json({ error: "No message" }, { status: 400 });
    }

    await pusherServer.trigger("global", "new_message", { message });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
