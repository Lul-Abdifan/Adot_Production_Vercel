import Calendar from "../Calendar";
import { useEditAppointmentMutation } from "@/api/hospital-admin";
import { useGetAllAppointmentQuery } from "@/api/hospital-admin";
import { MyEvent, GetEvent } from "@/types/calendar";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from "@mui/material";
import moment from "moment";
import { useState, useEffect } from "react";


interface Props {
  id: string;
}

export default function ControlCalendar({ id }: Props) {
  const { data, isLoading, error } = useGetAllAppointmentQuery({ id });
  const [events, setEvents] = useState<GetEvent[]>([]);
  const [editAppointment, { isLoading: isEditLoading }] = useEditAppointmentMutation();
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<GetEvent | null>(null);
  const [newEvent, setNewEvent] = useState<GetEvent>({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
    time: "",
    frequency: "",
    reminder: "",
    checklist: [],
  });

  // Transform fetched appointments into MyEvent format
useEffect(() => {
  if (data && data.data) {
    const formattedEvents = data.data.formattedAppointments.map(
      (appointment) => {
        const appointmentDate = new Date(appointment.date);
        const appointmentTime = new Date(appointment.time);

        // Combine day and time for start
        const start = new Date(appointmentDate);
        start.setHours(
          appointmentTime.getHours(),
          appointmentTime.getMinutes(),
          appointmentTime.getSeconds(),
          appointmentTime.getMilliseconds()
        );

        // Combine day and time for end and add 30 minutes
        const end = new Date(appointmentDate);
        end.setHours(
          appointmentTime.getHours(),
          appointmentTime.getMinutes(),
          appointmentTime.getSeconds(),
          appointmentTime.getMilliseconds()
        );
        end.setMinutes(end.getMinutes() + 30); // Add 30 minutes to the end time

        return {
          _id: appointment.headEvent,
          title: appointment.title,
          description: appointment.description,
          start,
          end,
          time: appointment.time,
          frequency: appointment.frequency,
          reminder: appointment.reminder,
          checklist: appointment.checklist.map((item) => ({
            description: item.description,
            completed: item.completed,
          })),
        };
      }
    );

    console.log("Formatted Events:", data); // Debug: Check formatted events
    console.log("id", id);
    setEvents(formattedEvents); // Update events state
    console.log("Events:", events);
  }
}, [data]);



 

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    // Open the form and set the selected start and end time for the new event
    setNewEvent((prev) => ({
      ...prev,
      start, // Set the start time of the selected slot
      end,
      time: moment(start).format("HH:mm"), // Set the end time of the selected slot
    }));
    setFormOpen(true); // Open the form to add an event
  };


  const handleAddEvent = () => {
    setEvents((prevEvents) => [...prevEvents, { ...newEvent }]);
    setFormOpen(false);
  };

  const handleCloseDetails = () => {
    setSelectedEvent(null); // Close event details popup
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Calendar
      className="py-5 mb-2"
        selectable
        events={events}
        onSelectSlot={handleSelectSlot}
        defaultView="month"
        id={id}
      />
     
    </div>
  );
}