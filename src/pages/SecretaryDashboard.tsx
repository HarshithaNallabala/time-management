import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Plus } from "lucide-react";
import { Layout } from "@/components/Layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getMeetings, createMeeting, resolveMeeting } from "@/integrations/api/meetings";

const SecretaryDashboard = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [openAddMeeting, setOpenAddMeeting] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    project: "",
  });

  // ✅ Load all meetings
  const loadMeetings = async () => {
    try {
      const data = await getMeetings();
      setMeetings(data);
    } catch (err) {
      toast.error("Failed to load meetings");
      console.error(err);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  // ✅ Add new meeting
  const handleAddMeeting = async () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await createMeeting(newMeeting);
      toast.success("Meeting added successfully");
      setOpenAddMeeting(false);
      setNewMeeting({ title: "", date: "", time: "", venue: "", project: "" });
      loadMeetings();
    } catch (err) {
      toast.error("Failed to add meeting");
      console.error(err);
    }
  };

  // ✅ Resolve (mark as completed)
  const handleResolve = async (id: string) => {
    try {
      await resolveMeeting(id);
      toast.success("Meeting marked as completed");
      setMeetings((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: "completed" } : m))
      );
    } catch (err) {
      toast.error("Failed to resolve meeting");
      console.error(err);
    }
  };

  // ✅ Filter lists
  const pendingMeetings = meetings.filter((m) => m.status !== "completed");
  const completedMeetings = meetings.filter((m) => m.status === "completed");

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Secretary Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                View and manage all executive meetings
              </p>
            </div>
          </div>

          {/* ADD MEETING */}
          <Dialog open={openAddMeeting} onOpenChange={setOpenAddMeeting}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Meeting
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Meeting</DialogTitle>
                <DialogDescription>Enter meeting details below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Label>Title</Label>
                <Input
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                />
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                />
                <Label>Time</Label>
                <Input
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                />
                <Label>Venue</Label>
                <Input
                  value={newMeeting.venue}
                  onChange={(e) => setNewMeeting({ ...newMeeting, venue: e.target.value })}
                />
                <Label>Project</Label>
                <Input
                  value={newMeeting.project}
                  onChange={(e) => setNewMeeting({ ...newMeeting, project: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenAddMeeting(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMeeting}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* ✅ PENDING MEETINGS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Meetings</CardTitle>
            <CardDescription>Meetings yet to be completed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingMeetings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending meetings.</p>
            ) : (
              pendingMeetings.map((m) => (
                <div
                  key={m._id}
                  className="p-4 border rounded-lg flex justify-between items-center hover:shadow-md transition"
                >
                  <div>
                    <h3 className="font-semibold">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {m.date} • {m.time} • {m.venue}
                    </p>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Created by: {m.user?.name || "Unknown"}
                    </p>
                    <Button variant="outline" size="sm" onClick={() => handleResolve(m._id)}>
                      Resolve
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* ✅ COMPLETED MEETINGS */}
        <Card>
          <CardHeader>
            <CardTitle>Completed Meetings</CardTitle>
            <CardDescription>Resolved meetings history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedMeetings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No completed meetings yet.</p>
            ) : (
              completedMeetings.map((m) => (
                <div
                  key={m._id}
                  className="p-4 border rounded-lg flex justify-between items-center bg-muted hover:bg-muted/80 transition"
                >
                  <div>
                    <h3 className="font-semibold">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {m.date} • {m.time} • {m.venue}
                    </p>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created by: {m.user?.name || "Unknown"}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SecretaryDashboard;
