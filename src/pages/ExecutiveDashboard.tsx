import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, LogOut, Plus, Users, FileText, MapPin, CheckCircle2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { getTasks, createTask, resolveTask, deleteTask } from "@/integrations/api/tasks";
import { getMeetings, createMeeting, resolveMeeting } from "@/integrations/api/meetings";
import { createLeave } from "@/integrations/api/leaves";

type Meeting = {
  _id?: string;
  title: string;
  date: string; // ISO
  time: string;
  venue?: string;
  project?: string;
  attendees?: string[];
  status?: "pending" | "completed";
};

type Task = {
  _id?: string;
  task: string;
  time?: string;
  status?: "pending" | "completed";
};

const ExecutiveDashboard = () => {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());

  // Popups
  const [openAddMeeting, setOpenAddMeeting] = useState(false);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Delete confirm dialog for tasks
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Mark leave dialog
  const [leaveOpen, setLeaveOpen] = useState(false);

  // Data states
  const [todaysMeetings, setTodaysMeetings] = useState<Meeting[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  // Form states
  const [newMeeting, setNewMeeting] = useState<Meeting>({
    title: "",
    date: "", // yyyy-mm-dd
    time: "",
    venue: "",
    project: "",
    attendees: [],
  });

  const [newTask, setNewTask] = useState<Task>({
    task: "",
    time: "",
  });

  // Leave form
  const [leaveStart, setLeaveStart] = useState<string>("");
  const [leaveEnd, setLeaveEnd] = useState<string>("");
  const [leaveReason, setLeaveReason] = useState<string>("");

  const authGuard = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in");
      navigate("/login");
      return false;
    }
    return true;
  };

  const loadData = async () => {
    try {
      const todayISO = new Date().toISOString().slice(0, 10);
      const meetings = await getMeetings(todayISO, todayISO); // only today
      const tasks = await getTasks();
      setTodaysMeetings(meetings);
      setUpcomingTasks(tasks);
    } catch {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    if (!authGuard()) return;
    loadData();
  }, []);

  // Create appointment
  const handleAddAppointment = async () => {
    if (!newMeeting.title || !newMeeting.time || !newMeeting.date) {
      toast.error("Title, Date & Time are required");
      return;
    }
    try {
      await createMeeting({
        title: newMeeting.title,
        date: newMeeting.date,
        time: newMeeting.time,
        venue: newMeeting.venue,
        project: newMeeting.project,
        attendees: newMeeting.attendees || [],
      });
      toast.success("Appointment added");
      setOpenAddMeeting(false);
      setNewMeeting({ title: "", date: "", time: "", venue: "", project: "", attendees: [] });
      loadData();
    } catch {
      toast.error("Failed to add appointment");
    }
  };

  // Resolve meeting
  const handleResolveMeeting = async (id?: string) => {
    if (!id) return;
    try {
      await resolveMeeting(id);
      toast.success("Meeting marked as completed");
      loadData();
    } catch {
      toast.error("Failed to resolve meeting");
    }
  };

  // Create task
  const handleAddTask = async () => {
    if (!newTask.task) {
      toast.error("Task is required");
      return;
    }
    try {
      await createTask(newTask.task, newTask.time);
      toast.success("Task added");
      setOpenAddTask(false);
      setNewTask({ task: "", time: "" });
      loadData();
    } catch {
      toast.error("Failed to add task");
    }
  };

  // Resolve task
  const handleResolveTask = async (id?: string) => {
    if (!id) return;
    try {
      await resolveTask(id);
      toast.success("Task completed");
      loadData();
    } catch {
      toast.error("Failed to resolve task");
    }
  };

  // Delete task (with confirm)
  const askDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setDeleteConfirmOpen(true);
  };

  const doDeleteTask = async () => {
    if (!taskToDelete?._id) return;
    try {
      await deleteTask(taskToDelete._id);
      toast.success("Task deleted");
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
      loadData();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  // Mark leave
  const handleMarkLeave = async () => {
    if (!leaveStart || !leaveEnd) {
      toast.error("Select start and end dates");
      return;
    }
    try {
      const { createLeave } = await import("@/integrations/api/leaves");
      await createLeave(leaveStart, leaveEnd, leaveReason);
      toast.success("Leave period saved");
      setLeaveOpen(false);
      setLeaveStart("");
      setLeaveEnd("");
      setLeaveReason("");
      // No reload needed for dashboard cards; calendar page will show it.
    } catch {
      toast.error("Failed to mark leave");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const todayCount = todaysMeetings.length;
  const pendingTasks = upcomingTasks.filter(t => t.status !== "completed").length;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Executive Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    {currentDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mr-2">
                      <Users className="w-4 h-4 mr-2" />
                      Mark Leave Period
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Mark Leave Period</DialogTitle>
                      <DialogDescription>Select a date range for leave.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Start</Label>
                        <Input type="date" className="col-span-3" value={leaveStart} onChange={e => setLeaveStart(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">End</Label>
                        <Input type="date" className="col-span-3" value={leaveEnd} onChange={e => setLeaveEnd(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Reason</Label>
                        <Input className="col-span-3" value={leaveReason} onChange={e => setLeaveReason(e.target.value)} placeholder="Optional" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setLeaveOpen(false)}>Cancel</Button>
                      <Button onClick={handleMarkLeave}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Today's Meetings</CardTitle>
                <Calendar className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{todayCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Scheduled appointments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                <Clock className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">—</div>
                <p className="text-xs text-muted-foreground mt-1">Auto-calc later</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <FileText className="w-4 h-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{pendingTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">Tasks to complete</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Today's Schedule */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Today's Schedule</CardTitle>
                      <CardDescription>Your meetings and appointments</CardDescription>
                    </div>

                    {/* ADD APPOINTMENT POPUP */}
                    <Dialog open={openAddMeeting} onOpenChange={setOpenAddMeeting}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Appointment
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Appointment</DialogTitle>
                          <DialogDescription>Fill in details for the new meeting.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Title</Label>
                            <Input
                              value={newMeeting.title}
                              onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Date</Label>
                            <Input
                              type="date"
                              value={newMeeting.date}
                              onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Time</Label>
                            <Input
                              value={newMeeting.time}
                              onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Venue</Label>
                            <Input
                              value={newMeeting.venue}
                              onChange={(e) => setNewMeeting({ ...newMeeting, venue: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Project</Label>
                            <Input
                              value={newMeeting.project}
                              onChange={(e) => setNewMeeting({ ...newMeeting, project: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setOpenAddMeeting(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddAppointment}>Save Appointment</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>

                {/* Meeting list */}
                <CardContent className="space-y-4">
                  {todaysMeetings.map((m) => (
                    <div
                      key={m._id}
                      className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {m.title}{" "}
                            {m.status === "completed" ? (
                              <Badge variant="secondary" className="ml-2">Completed</Badge>
                            ) : (
                              <Badge className="ml-2">Pending</Badge>
                            )}
                          </h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {new Date(m.date).toLocaleDateString()} • {m.time}
                            </div>
                            {m.venue && (
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                {m.venue}
                              </div>
                            )}
                            {m.project && (
                              <div className="text-xs text-accent mt-2">Project: {m.project}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {m.status !== "completed" && (
                            <Button variant="outline" size="sm" onClick={() => handleResolveMeeting(m._id)}>
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {todaysMeetings.length === 0 && (
                    <p className="text-sm text-muted-foreground">No meetings today.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* SIDEBAR */}
            <div className="space-y-6">
              {/* Personal Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Tasks</CardTitle>
                  <CardDescription>Today's to-do list</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingTasks.map((t) => (
                    <div key={t._id} className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            {t.task}{" "}
                            {t.status === "completed" && (
                              <Badge variant="secondary" className="ml-1">Done</Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{t.time}</p>
                        </div>

                        <div className="flex gap-2">
                          {t.status !== "completed" ? (
                            <Button variant="outline" size="sm" onClick={() => handleResolveTask(t._id)}>
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Resolve
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => askDeleteTask(t)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {upcomingTasks.length === 0 && (
                    <p className="text-sm text-muted-foreground">No tasks yet.</p>
                  )}

                  {/* ADD TASK POPUP */}
                  <Dialog open={openAddTask} onOpenChange={setOpenAddTask}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>Enter your task details below.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Task</Label>
                          <Input
                            value={newTask.task}
                            onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Time</Label>
                          <Input
                            value={newTask.time}
                            onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenAddTask(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddTask}>Save Task</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setLeaveOpen(true)}>
                    <Users className="w-4 h-4 mr-2" />
                    Mark Leave Period
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* VIEW DETAILS POPUP */}
        {selectedMeeting && (
          <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedMeeting.title}</DialogTitle>
                <DialogDescription>Meeting Details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(selectedMeeting.date).toLocaleDateString()} • {selectedMeeting.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedMeeting.venue}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Project:</p>
                  <Badge variant="secondary">{selectedMeeting.project}</Badge>
                </div>
                {!!selectedMeeting.attendees?.length && (
                  <div>
                    <p className="text-sm font-medium mb-2">Attendees:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMeeting.attendees!.map((person, i) => (
                        <Badge key={i} variant="outline">
                          {person}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedMeeting(null)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* CONFIRM DELETE TASK */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this completed task?
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <p className="text-sm">
                <strong>{taskToDelete?.task}</strong> {taskToDelete?.time ? `• ${taskToDelete?.time}` : ""}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
              <Button onClick={doDeleteTask} className="bg-red-600 hover:bg-red-700">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ExecutiveDashboard;

