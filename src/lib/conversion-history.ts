import { createClient } from "./supabase/client";

export async function logConversion({
  userId,
  fileName,
  fromFormat,
  toFormat,
  status = "completed",
}: {
  userId: string;
  fileName: string;
  fromFormat: string;
  toFormat: string;
  status?: string;
}) {
  const supabase = createClient();
  
  const { error } = await supabase.from("conversions").insert({
    user_id: userId,
    filename: fileName,
    from_format: fromFormat,
    to_format: toFormat,
    status: status,
  });

  if (error) {
    console.error("Error logging conversion:", error);
  }
}
