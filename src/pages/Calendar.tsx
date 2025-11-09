import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Layout } from "@/components/Layout1";

const CalendarPage = () => {
  const [currentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const meetings = [
    { id: 1, title: "Project Alpha Review", start: 9, duration: 1, day: 2, project: "Alpha" },
    { id: 2, title: "Team Standup", start: 10.5, duration: 0.5, day: 2, project: "General" },
    { id: 3, title: "Client Presentation", start: 14, duration: 2, day: 2, project: "Beta" },
    { id: 4, title: "Weekly Planning", start: 11, duration: 1, day: 3, project: "Planning" },
    { id: 5, title: "Code Review", start: 15, duration: 1.5, day: 4, project: "Alpha" },
  ];

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">Today</Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <span className="text-lg font-medium text-foreground">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button 
                variant={view === "day" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setView("day")}
              >
                Day
              </Button>
              <Button 
                variant={view === "week" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setView("week")}
              >
                Week
              </Button>
              <Button 
                variant={view === "month" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setView("month")}
              >
                Month
              </Button>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Meeting
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {view === "week" && (
              <div className="overflow-auto">
                <div className="grid grid-cols-8 min-w-[900px]">
                  <div className="sticky left-0 bg-card border-r border-border">
                    <div className="h-12 border-b border-border"></div>
                    {hours.map((hour) => (
                      <div key={hour} className="h-16 border-b border-border px-2 py-1 text-xs text-muted-foreground">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                    ))}
                  </div>
                  {daysOfWeek.map((day, dayIndex) => (
                    <div key={day} className="border-r border-border">
                      <div className="h-12 border-b border-border flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">{day}</div>
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full font-medium ${
                            dayIndex === 2 ? 'bg-primary text-primary-foreground' : ''
                          }`}>
                            {15 + dayIndex}
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        {hours.map((hour) => (
                          <div key={hour} className="h-16 border-b border-border hover:bg-muted/30 transition-colors"></div>
                        ))}
                        {meetings
                          .filter((m) => m.day === dayIndex)
                          .map((meeting) => (
                            <div
                              key={meeting.id}
                              className="absolute left-1 right-1 bg-primary/90 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                              style={{
                                top: `${meeting.start * 64}px`,
                                height: `${meeting.duration * 64}px`,
                              }}
                            >
                              <div className="text-xs font-semibold text-primary-foreground">{meeting.title}</div>
                              <div className="text-xs text-primary-foreground/80 mt-1">
                                {Math.floor(meeting.start)}:{((meeting.start % 1) * 60).toString().padStart(2, '0')}
                              </div>
                              <Badge variant="secondary" className="mt-1 text-xs">{meeting.project}</Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CalendarPage;
