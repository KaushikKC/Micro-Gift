import { NextRequest, NextResponse } from "next/server";

// In-memory store for demo purposes (replace with DB in production)
let giftHistory: any[] = [];

// POST: Store a new gift transaction or update an existing one by voucherId
export async function POST(req: NextRequest) {
  const data = await req.json();

  // If only voucherId and update fields are provided, update the record
  if (
    data.voucherId &&
    (data.claimed !== undefined || data.status) &&
    !data.sender &&
    !data.recipient &&
    !data.amount &&
    !data.txHash
  ) {
    const idx = giftHistory.findIndex(
      (item) => item.voucherId === data.voucherId
    );
    if (idx !== -1) {
      giftHistory[idx] = { ...giftHistory[idx], ...data };
      return NextResponse.json({ success: true, updated: true });
    } else {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    }
  }

  // Otherwise, require all fields for new record
  if (
    !data.sender ||
    !data.recipient ||
    !data.amount ||
    !data.txHash ||
    !data.voucherId
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  giftHistory.push({ ...data });
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Address required" }, { status: 400 });
  }
  // Classify as sent or received
  const history = giftHistory
    .filter((item) => item.sender === address || item.recipient === address)
    .map((item) => ({
      ...item,
      type: item.sender === address ? "sent" : "received",
    }));
  return NextResponse.json({ history });
}
