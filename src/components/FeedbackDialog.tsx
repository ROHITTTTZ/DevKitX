import { useState, type ReactNode } from "react";
import { MessageSquarePlus, Send, Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzFuqXjaG6EyjeB9ek1kEMr3QqnEwY2xtH4nfIgDYSVHGb1z6UT7QSrrPBrDhcJaEe8/exec";

const CATEGORIES = [
  { id: "tool-request", label: "Request a tool" },
  { id: "bug", label: "Report a bug" },
  { id: "improvement", label: "Suggest improvement" },
  { id: "other", label: "Other" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

interface FeedbackDialogProps {
  children?: ReactNode;
}

export function FeedbackDialog({ children }: FeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<CategoryId>("tool-request");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const reset = () => {
    setMessage("");
    setEmail("");
    setCategory("tool-request");
    setSent(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    const label = CATEGORIES.find((c) => c.id === category)?.label ?? category;
    const payload = {
      feedback: `[${label}] ${message.trim()}${email ? `\n\nReply to: ${email.trim()}` : ""}`,
      category,
      message: message.trim(),
      email: email.trim() || null,
      url: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      submittedAt: new Date().toISOString(),
    };
    try {
      // Apps Script web apps reject CORS preflights; send as text/plain to avoid it.
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      setSent(true);
      toast.success("Thanks — your feedback was sent.");
      setTimeout(() => {
        setOpen(false);
        setTimeout(reset, 200);
      }, 1100);
    } catch {
      toast.error("Couldn't send feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setTimeout(reset, 200);
      }}
    >
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="outline" size="sm" className="gap-1.5">
            <MessageSquarePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Feedback</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        {sent ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold tracking-tight">Feedback sent</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We read every message. Thanks for helping make DevKitX better.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="text-[17px] tracking-tight">Share feedback</DialogTitle>
              <DialogDescription className="text-[13px]">
                Found a bug, want a new tool, or have an idea? Tell us — it goes straight to the
                maintainer.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 px-6 py-5">
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Topic
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((c) => {
                    const active = category === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setCategory(c.id)}
                        className={cn(
                          "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                          active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background text-foreground/80 hover:bg-accent",
                        )}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fb-message" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Message
                </Label>
                <Textarea
                  id="fb-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    category === "tool-request"
                      ? "Which tool would you love to see next?"
                      : category === "bug"
                        ? "Which tool, what happened, and what did you expect?"
                        : "What's on your mind?"
                  }
                  rows={5}
                  maxLength={2000}
                  required
                  className="resize-none text-sm"
                />
                <div className="flex justify-end text-[11px] text-muted-foreground">
                  {message.length}/2000
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fb-email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email <span className="normal-case text-muted-foreground/70">(optional)</span>
                </Label>
                <Input
                  id="fb-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com — only if you want a reply"
                  maxLength={200}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/30 px-6 py-3">
              <p className="text-[11px] text-muted-foreground">
                No tracking. We only store what you write here.
              </p>
              <Button type="submit" size="sm" disabled={submitting || !message.trim()} className="gap-1.5">
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Send feedback
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
