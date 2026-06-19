import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    // Amount must be in the smallest currency unit (paise for INR)
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${session.user.id}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create Razorpay order" }, { status: 500 });
  }
}
