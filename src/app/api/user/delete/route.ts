import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createAdminClient();

    // Delete user from Supabase Auth (cascades to profiles and other linked tables)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }

    return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
