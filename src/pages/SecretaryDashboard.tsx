import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, LogOut, Plus, Users, Search, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/Layout1";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SecretaryDashboard = () => {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());

  const executives = [
    { id: 1, name: "Robert Johnson", status: "Available", meetings: 3 },
    { id: 2, name: "Emily Davis", status: "In Meeting", meetings: 5 },
    { id: 3, name: "Michael Chen", status: "On Leave", meetings: 0 },
  ];

  const pendingMeetings = [
    {
      id: 1,
      title: "Quarterly Review",
      executives: ["Robert Johnson", "Emily Davis"],
      duration: "2 hours",
      status: "Pending Schedule",
    },
    {
      id: 2,
      title: "Budget Discussion",
      executives: ["Robert Johnson", "Michael Chen"],
      duration: "1 hour",
      status: "Conflict Detected",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-secondary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Secretary Dashboard
                  </h1>
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
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Executives
                </CardTitle>
                <Users className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {executives.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active executives
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Meetings
                </CardTitle>
                <Calendar className="w-4 h-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">
                  {pendingMeetings.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Awaiting scheduling
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Meetings
                </CardTitle>
                <Clock className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">8</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Scheduled today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Conflicts</CardTitle>
                <Bell className="w-4 h-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">1</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Requires attention
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search and Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Schedule New Meeting</CardTitle>
                  <CardDescription>
                    Find common time slots for executives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Search executives or meeting title..."
                        className="flex-1"
                      />
                      <Button className="bg-secondary hover:bg-secondary/90">
                        <Search className="w-4 h-4 mr-2" />
                        Find Slots
                      </Button>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Meeting
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Meetings */}
              <Card>
                <CardHeader>
                  <CardTitle>Pending Meetings</CardTitle>
                  <CardDescription>
                    Meetings requiring your attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">
                            {meeting.title}
                          </h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              {meeting.executives.join(", ")}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Duration: {meeting.duration}
                            </div>
                            <div
                              className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                                meeting.status === "Conflict Detected"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-secondary/10 text-secondary"
                              }`}
                            >
                              {meeting.status}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            Resolve
                          </Button>
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Executive Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Executive Status</CardTitle>
                  <CardDescription>Current availability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {executives.map((exec) => (
                    <div
                      key={exec.id}
                      className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{exec.name}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            exec.status === "Available"
                              ? "bg-accent/20 text-accent"
                              : exec.status === "In Meeting"
                              ? "bg-secondary/20 text-secondary"
                              : "bg-muted-foreground/20 text-muted-foreground"
                          }`}
                        >
                          {exec.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {exec.meetings} meetings today
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions with Popups */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {/* Manage Executives Popup */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Executives
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Manage Executives</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 mt-2">
                        {executives.map((exec) => (
                          <div
                            key={exec.id}
                            className="flex items-center justify-between p-2 border rounded-lg"
                          >
                            <p>{exec.name}</p>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        ))}
                        <Button className="w-full mt-2">Add Executive</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Send Notifications Popup */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Bell className="w-4 h-4 mr-2" />
                        Send Notifications
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Notification</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 mt-2">
                        <Input placeholder="Recipient name or group" />
                        <Input placeholder="Notification message" />
                        <Button className="w-full mt-2">Send</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default SecretaryDashboard;

