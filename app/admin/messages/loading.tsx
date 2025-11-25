import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    // Set the height to match your main page content area
    <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-3 text-lg text-muted-foreground">Loading messages...</p>
    </div>
  );
}