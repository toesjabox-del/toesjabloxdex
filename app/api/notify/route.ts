import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    await pusherServer.trigger("global-channel", "notification", {
      message,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Notify error:", err);
    return Response.json({ error: "fail" }, { status: 500 });
  }
}
