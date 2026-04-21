import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { History, FileIcon, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: conversions, error } = await supabase
    .from("conversions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conversion History</h1>
          <p className="text-muted-foreground mt-1">Track your recent activity and file transformations.</p>
        </div>
        <Button asChild>
          <Link href="/convert">
            Start New Conversion
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="size-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Showing your last 50 conversions.</CardDescription>
        </CardHeader>
        <CardContent>
          {conversions && conversions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversions.map((conv) => (
                    <TableRow key={conv.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        <div className="flex items-center gap-2">
                          <FileIcon className="size-4 text-muted-foreground shrink-0" />
                          <span>{conv.filename}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="uppercase text-[10px]">
                          {conv.from_format}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="uppercase text-[10px]">
                          {conv.to_format}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(conv.created_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={conv.status === "completed" ? "outline" : "destructive"}
                          className={`capitalize text-[10px] ${conv.status === "completed" ? "text-emerald-500 border-emerald-500/30" : ""}`}
                        >
                          {conv.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <History className="size-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No conversion history found.</p>
              <p className="text-slate-400 text-sm mt-1">Start converting files to see them here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
