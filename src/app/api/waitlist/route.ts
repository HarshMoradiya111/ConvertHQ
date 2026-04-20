import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = await createClient();

    // Insert into waitlist table
    const { error } = await supabase
      .from("waitlist")
      .insert([{ email }]);

    if (error) {
      // 23505 is the PostgreSQL error code for unique violation
      if (error.code === '23505') {
        return NextResponse.json({ message: "Email already registered" }, { status: 200 });
      }
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
