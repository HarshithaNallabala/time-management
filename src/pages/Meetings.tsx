"use client";

import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Users,
  Clock,
  MapPin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Meetings1 = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: "Project Alpha Kickoff",
      date: "Dec 20, 2024",
      time: "09:00 AM",
      duration: "2h",
      attendees: ["John Doe", "Sarah Smith", "Mike Johnson", "Emily Brown"],
      venue: "Conference Room A",
      project: "Alpha",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Budget Review Q4",
      date: "Dec 21, 2024",
      time: "02:00 PM",
      duration: "1h 30m",
      attendees: ["David Lee", "Anna White", "Tom Black"],
      venue: "Executive Boardroom",
      project: "Finance",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Team Building Workshop",
      date: "Dec 22, 2024",
      time: "10:00 AM",
      duration: "3h",
      attendees: ["All Team Members"],
      venue: "Main Hall",
      project: "HR",
      status: "upcoming",
    },
    {
      id: 4,
      title: "Client Presentation - Beta",
      date: "Dec 18, 2024",
      time: "03:00 PM",
      duration: "1h",
      attendees: ["Sarah Smith", "Mike Johnson"],
      venue: "Virtual - Zoom",
      project: "Beta",
      status: "completed",
    },
  ]);

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    attendees: "",
    venue: "",
    project: "",
  });

  const handleAddMeeting = () => {
    if (!newMeeting.title) return;
    const meeting = {
      ...newMeeting,
      id: meetings.length + 1,
      attendees: newMeeting.attendees
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      status: "upcoming",
    };
    setMeetings([...meetings, meeting]);
    setNewMeeting({
      title: "",
      date: "",
      time: "",
      duration: "",
      attendees: "",
      venue: "",
      project: "",
    });
    setOpen(false);
  };

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.attendees.some((a) =>
        a.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Meetings</h1>

          {/* Schedule Meeting Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </DialogTrigger>

            {/* Scrollable Dialog */}
            <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Schedule a New Meeting</DialogTitle>
              </DialogHeader>

              {/* Scrollable Form Area */}
              <div className="overflow-y-auto pr-2 space-y-4 py-2 flex-1">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={newMeeting.title}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, title: e.target.value })
                    }
                    placeholder="Meeting title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newMeeting.date}
                      onChange={(e) =>
                        setNewMeeting({ ...newMeeting, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={newMeeting.time}
                      onChange={(e) =>
                        setNewMeeting({ ...newMeeting, time: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Duration</Label>
                  <Input
                    value={newMeeting.duration}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, duration: e.target.value })
                    }
                    placeholder="e.g. 1h 30m"
                  />
                </div>

                <div>
                  <Label>Attendees (comma separated)</Label>
                  <Textarea
                    value={newMeeting.attendees}
                    onChange={(e) =>
                      setNewMeeting({
                        ...newMeeting,
                        attendees: e.target.value,
                      })
                    }
                    placeholder="John Doe, Jane Smith"
                  />
                </div>

                <div>
                  <Label>Venue</Label>
                  <Input
                    value={newMeeting.venue}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, venue: e.target.value })
                    }
                    placeholder="e.g. Conference Room A"
                  />
                </div>

                <div>
                  <Label>Project</Label>
                  <Input
                    value={newMeeting.project}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, project: e.target.value })
                    }
                    placeholder="Project Name"
                  />
                </div>
              </div>

              {/* Footer fixed at bottom */}
              <DialogFooter className="pt-4 border-t">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMeeting}>Add Meeting</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search meetings..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Meeting List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredMeetings.length === 0 ? (
            <p className="text-muted-foreground text-sm">No meetings found.</p>
          ) : (
            filteredMeetings.map((meeting) => (
              <Card
                key={meeting.id}
                className={meeting.status === "completed" ? "opacity-70" : ""}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {meeting.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {meeting.date} at {meeting.time}
                        </span>
                        <span>Duration: {meeting.duration}</span>
                        <Badge
                          variant={
                            meeting.status === "completed"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {meeting.status}
                        </Badge>
                      </div>
                    </div>
                    <Badge>{meeting.project}</Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Attendees</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {meeting.attendees.map((attendee, idx) => (
                          <Badge key={idx} variant="outline">
                            {attendee}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Venue</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {meeting.venue}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {meeting.status === "upcoming" && (
                      <>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Meetings1;

