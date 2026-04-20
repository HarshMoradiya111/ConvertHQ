import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "./server";

const SESSION_COOKIE_NAME = "converthq_session_id";
const FREE_TIER_DAILY_LIMIT = 5;

/**
 * Gets or creates an anonymous session ID for tracking unauthenticated usage
 */
export async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    sessionId = uuidv4();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return sessionId;
}

/**
 * Checks if the current user/session has exceeded their quota
 */
export async function checkQuota(action: 'convert' | 'compress' | 'download'): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    let userId = null;
    let sessionId = null;
    
    if (user) {
      userId = user.id;
      
      // Check pro tier status
      const { data: profile } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', userId)
        .single();
        
      if (profile?.tier === 'pro') {
        return { allowed: true };
      }
    } else {
      sessionId = await getOrCreateSessionId();
    }
      
    // Calculate start of today for limit checking
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count usage for this user/session today
    let query = supabase
      .from('usage_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());
      
    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('session_id', sessionId);
    }
    
    const { count, error } = await query;
        
    if (error) {
        console.error("Quota check error:", error);
        // Fail open if database is down
        return { allowed: true };
      }
      
      if (count !== null && count >= FREE_TIER_DAILY_LIMIT) {
        return { 
          allowed: false, 
          reason: `Daily free limit reached (${FREE_TIER_DAILY_LIMIT}/${FREE_TIER_DAILY_LIMIT}). Please sign up to convert more files.` 
        };
      }
      
      return { allowed: true };
    } catch (error) {
    console.error("Quota check exception:", error);
    return { allowed: true };
  }
}

/**
 * Logs usage to the database
 */
export async function logUsage(
  action: 'convert' | 'compress' | 'download',
  fileSizeBytes?: number
): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let userId = null;
    let sessionId = null;
    
    if (user) {
      userId = user.id;
    } else {
      sessionId = await getOrCreateSessionId();
    }
    
    await supabase.from('usage_logs').insert([{
      user_id: userId,
      session_id: sessionId,
      action,
      file_size_bytes: fileSizeBytes
    }]);
    
  } catch (error) {
    console.error("Failed to log usage:", error);
    // Don't block the actual conversion if logging fails
  }
}
