import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, LogOut, Plus, Users, FileText, MapPin } from "lucide-react";
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

const ExecutiveDashboard = () => {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());

  // Popups
  const [openAddMeeting, setOpenAddMeeting] = useState(false);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Data states
  const [todaysMeetings, setTodaysMeetings] = useState([
    {
      id: 1,
      title: "Project Alpha Review",
      time: "9:00 AM - 10:00 AM",
      venue: "Conference Room A",
      attendees: ["John Smith", "Sarah Johnson"],
      project: "Alpha Development"
    },
    {
      id: 2,
      title: "Budget Planning",
      time: "11:30 AM - 12:30 PM",
      venue: "Meeting Room 3",
      attendees: ["Michael Brown"],
      project: "Q4 Budget"
    },
    {
      id: 3,
      title: "Team Standup",
      time: "2:00 PM - 2:30 PM",
      venue: "Virtual - Zoom",
      attendees: ["Dev Team"],
      project: "Sprint Planning"
    }
  ]);

  const [upcomingTasks, setUpcomingTasks] = useState([
    { id: 1, task: "Review Q3 Reports", time: "3:00 PM" },
    { id: 2, task: "Prepare presentation", time: "4:30 PM" }
  ]);

  // Form states
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    time: "",
    venue: "",
    project: "",
  });

  const [newTask, setNewTask] = useState({
    task: "",
    time: "",
  });

  // Handlers
  const handleAddAppointment = () => {
    if (!newMeeting.title || !newMeeting.time) return;
    setTodaysMeetings([
      ...todaysMeetings,
      {
        id: todaysMeetings.length + 1,
        ...newMeeting,
        attendees: [],
      },
    ]);
    setOpenAddMeeting(false);
    setNewMeeting({ title: "", time: "", venue: "", project: "" });
  };

  const handleAddTask = () => {
    if (!newTask.task) return;
    setUpcomingTasks([
      ...upcomingTasks,
      { id: upcomingTasks.length + 1, ...newTask },
    ]);
    setOpenAddTask(false);
    setNewTask({ task: "", time: "" });
  };

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
              <Button variant="outline" onClick={() => navigate("/")}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
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
                <div className="text-3xl font-bold text-primary">{todaysMeetings.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Scheduled appointments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                <Clock className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">4.5</div>
                <p className="text-xs text-muted-foreground mt-1">Hours in meetings today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <FileText className="w-4 h-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{upcomingTasks.length}</div>
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
                          <DialogDescription>
                            Fill in details for the new meeting.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                              Title
                            </Label>
                            <Input
                              id="title"
                              value={newMeeting.title}
                              onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="time" className="text-right">
                              Time
                            </Label>
                            <Input
                              id="time"
                              value={newMeeting.time}
                              onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="venue" className="text-right">
                              Venue
                            </Label>
                            <Input
                              id="venue"
                              value={newMeeting.venue}
                              onChange={(e) => setNewMeeting({ ...newMeeting, venue: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="project" className="text-right">
                              Project
                            </Label>
                            <Input
                              id="project"
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
                  {todaysMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{meeting.title}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {meeting.time}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              {meeting.venue}
                            </div>
                            <div className="text-xs text-accent mt-2">
                              Project: {meeting.project}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMeeting(meeting)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
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
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">{task.task}</p>
                        <p className="text-xs text-muted-foreground">{task.time}</p>
                      </div>
                    </div>
                  ))}

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
                          <Label htmlFor="task" className="text-right">
                            Task
                          </Label>
                          <Input
                            id="task"
                            value={newTask.task}
                            onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="time" className="text-right">
                            Time
                          </Label>
                          <Input
                            id="time"
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
                  <Button variant="outline" className="w-full justify-start">
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
                  <span>{selectedMeeting.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedMeeting.venue}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Project:</p>
                  <Badge variant="secondary">{selectedMeeting.project}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Attendees:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeeting.attendees.map((person, i) => (
                      <Badge key={i} variant="outline">
                        {person}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedMeeting(null)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default ExecutiveDashboard;

