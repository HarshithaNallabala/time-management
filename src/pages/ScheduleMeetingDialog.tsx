import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

// Define the shape of the component's props
interface ScheduleMeetingDialogProps {
  // Function to call when the meeting is successfully submitted/scheduled
  onSchedule: (data: MeetingFormData) => void;
}

// Define the shape of the form data
interface MeetingFormData {
  attendees: string;
  venue: string;
  time: string;
  duration: string;
  purpose: string;
}

const ScheduleMeetingDialog: React.FC<ScheduleMeetingDialogProps> = ({ onSchedule }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [meetingData, setMeetingData] = useState<MeetingFormData>({
    attendees: "",
    venue: "",
    time: "",
    duration: "",
    purpose: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMeetingData({ ...meetingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pass data back to the parent component (SecretaryDashboard)
    onSchedule(meetingData); 
    
    // Reset the form state
    setMeetingData({
      attendees: "",
      venue: "",
      time: "",
      duration: "",
      purpose: "",
    });
    
    // Close the dialog
    setIsDialogOpen(false); 
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {/* Button that triggers the dialog - Make sure this looks like your current button */}
        <Button className="w-full bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Create New Meeting
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a New Meeting</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          {/* 1. Persons Invited */}
          <div className="space-y-1">
            <label htmlFor="attendees" className="text-sm font-medium">Invited Person(s)</label>
            <Input
              id="attendees"
              name="attendees"
              placeholder="e.g., Robert Johnson, Emily Davis"
              value={meetingData.attendees}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* 2. Venue of the Meeting */}
          <div className="space-y-1">
            <label htmlFor="venue" className="text-sm font-medium">Venue</label>
            <Input
              id="venue"
              name="venue"
              placeholder="e.g., Conference Room A / Online"
              value={meetingData.venue}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {/* 3. Time and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="time" className="text-sm font-medium">Time</label>
              <Input
                id="time"
                name="time"
                type="datetime-local"
                value={meetingData.time}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="duration" className="text-sm font-medium">Duration</label>
              <Input
                id="duration"
                name="duration"
                placeholder="e.g., 60 minutes"
                value={meetingData.duration}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* 4. Purpose */}
          <div className="space-y-1">
            <label htmlFor="purpose" className="text-sm font-medium">Purpose</label>
            <Textarea
              id="purpose"
              name="purpose"
              placeholder="Briefly describe the meeting agenda and goals."
              value={meetingData.purpose}
              onChange={handleInputChange}
              className="min-h-[80px]"
              required
            />
          </div>

          <Button type="submit" className="mt-4">
            Confirm Schedule
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeetingDialog;
