// src/pages/Calender_e.tsx
import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { getMeetings } from "@/integrations/api/meetings";
import { getLeaves } from "@/integrations/api/leaves";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Meeting = {
  _id: string;
  title: string;
  date: string; // ISO
  time: string;
  status?: "pending" | "completed";
};

type Leave = {
  _id: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  reason?: string;
};

export default function Calender_e() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);

  const monthStart = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  }, []);

  const monthEnd = useMemo(() => {
    const d = new Date(monthStart);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return d;
  }, [monthStart]);

  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const load = async () => {
    try {
      const ms = await getMeetings(iso(monthStart), iso(monthEnd));
      const ls = await getLeaves(iso(monthStart), iso(monthEnd));
      setMeetings(ms);
      setLeaves(ls);
    } catch {
      toast.error("Failed to load calendar data");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  // days with a meeting
  const meetingDays = new Set(meetings.map(m => new Date(m.date).toDateString()));

  // leave ranges
  const leaveRanges = leaves.map(l => ({
    from: new Date(l.startDate),
    to: new Date(l.endDate),
  }));

  const dayModifiers = {
    meeting: (day: Date) => meetingDays.has(day.toDateString()),
    leave: leaveRanges,
  };

  const dayModifierClassNames = {
    meeting: "bg-primary/20 rounded-full",
    leave: "bg-yellow-200 rounded-md",
  };

  const meetingsOnSelected = meetings.filter(
    m => new Date(m.date).toDateString() === (selected ? selected.toDateString() : "")
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div>
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={setSelected}
                modifiers={dayModifiers}
                modifiersClassNames={dayModifierClassNames}
                captionLayout="dropdown"
                fromYear={2023}
                toYear={2032}
              />
              <div className="flex gap-3 mt-4 text-sm">
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary/60 inline-block" />
                  Meeting
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-yellow-300 inline-block" />
                  Leave
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {selected ? selected.toLocaleDateString() : "Select a date"}
              </h3>
              {meetingsOnSelected.length === 0 ? (
                <p className="text-sm text-muted-foreground">No meetings.</p>
              ) : (
                <div className="space-y-3">
                  {meetingsOnSelected.map(m => (
                    <div key={m._id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{m.title}</p>
                          <p className="text-xs text-muted-foreground">{m.time}</p>
                        </div>
                        <Badge variant={m.status === "completed" ? "secondary" : "default"}>
                          {m.status === "completed" ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

