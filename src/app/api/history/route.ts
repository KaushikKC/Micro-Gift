import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://madhuvarsha:madhu1234@cluster0.jqjbs.mongodb.net/";
const dbName = "morph-gift";
let cachedClient: MongoClient | null = null;

async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }
  return cachedClient.db(dbName);
}

// POST: Store a new gift transaction or update an existing one by voucherId
export async function POST(req: NextRequest) {
  const data = await req.json();
  const db = await getDb();
  const collection = db.collection("giftHistory");

  // Only update if voucherId and update fields are present, but NOT all new record fields
  if (
    data.voucherId &&
    (data.claimed !== undefined || data.status) &&
    !data.sender &&
    !data.recipient &&
    !data.amount &&
    !data.txHash
  ) {
    const result = await collection.updateOne(
      { voucherId: data.voucherId },
      { $set: { ...data } }
    );
    if (result.matchedCount > 0) {
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
  await collection.insertOne({ ...data });
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const db = await getDb();
  const collection = db.collection("giftHistory");
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Address required" }, { status: 400 });
  }
  // Classify as sent or received
  const history = await collection
    .find({
      $or: [{ sender: address }, { recipient: address }],
    })
    .toArray();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = history.map((item: any) => ({
    ...item,
    type: item.sender === address ? "sent" : "received",
    id: item._id?.toString() || item.voucherId,
  }));
  return NextResponse.json({ history: result });
}
