import moment from "moment";
import { Calendar as BigCalendar, CalendarProps, momentLocalizer, EventProps } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useGetAllPatientsForDoctorQuery } from "@/api/doctor-api";
import { useAddAppointmentMutation, useEditAppointmentMutation, useGetAllAppointmentQuery } from "@/api/hospital-admin";
import { useDeleteAppointmentMutation } from "@/api/hospital-admin";
import successImg from "@/public/common/success-img.png";
import { MyEvent, AddEvent, GetEvent } from "@/types/calendar";
import { Patient } from "@/types/hospital-admin";
import { FormattedAppointment } from "@/types/hospital-admin";
import { id } from "@material-tailwind/react/types/components/tabs";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaPencilAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import errorImg from "../../public/common/error-img.png";
import { hospitalAdminSlice } from "@/api/hospital-admin";
import MessageCard from "@/components/common/MessageCard";
import { IoIosCloseCircleOutline } from "react-icons/io";


// adjust path to your adotApi file

const localizer = momentLocalizer(moment);

const EventBlock: React.FC<EventProps<GetEvent>> = ({ event }) => (
  <div className="flex bg-primary text-white rounded cursor-pointer">
    {event.title}
  </div>
);
interface CalendarPropsWithId
  extends Omit<CalendarProps<GetEvent>, "localizer"> {
  id: string; // Accept the `id` prop here
}
export default function Calendar({
  id, // Accept the `id` prop
  ...props
}: CalendarPropsWithId) {
    const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<GetEvent | null>(null);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { refetch } = useGetAllAppointmentQuery({ id: id });
  const [editAppointment, { isLoading: isEditLoading }] =
    useEditAppointmentMutation();
  const [addAppointment, { isLoading: isAppointmentLoading }] =
    useAddAppointmentMutation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [newEvent, setNewEvent] = useState<AddEvent>({
    patientId: "",
    title: "",
    description: "",
    date: new Date(),
    endDate: new Date(),
    time: "",
    frequency: "Every day",
    reminder: "10 mins before",
    checklist: [],
  });
  const defaultEvent = {
    patientId: "",
    title: "",
    description: "",
    frequency: "None",
    time: "",
    date: new Date(),
    endDate: new Date(),
    reminder: "",
    checklist: [],
  };
  const handleAddCloseModal = () => {
    setShowAddAppointment(false);
    setNewEvent(defaultEvent);
  };

  const [showMessage, setShowMessage] = useState(false);
  const [messageProps, setMessageProps] = useState({
    img: successImg,
    textColor: "text-green-500",
    detail: "Appointment created successfully!",
  });
  const [deleteAppointment, {isLoading: isDeleteLoading}] = useDeleteAppointmentMutation();

  const handleCancelAppointment = async () => {
    if (selectedEvent) {
      console.log("idds", id, selectedEvent._id);
      deleteAppointment({
        id: id ?? "",
        appointmentId: selectedEvent._id ?? "",
      })
        .then(() => {
          setSelectedEvent(null); // Clear the selected event
          refetch();
          closeModal(); // Close the modal
          setMessageProps({
            img: successImg,
            textColor: "text-green-500",
            detail: "Appointment deleted successfully!",
          });
          setShowMessage(true);
        })
        .catch((error) => {
          setMessageProps({
            img: errorImg,
            textColor: "text-red-500",
            detail: "Failed to delete the appointment. Please try again.",
          });
          setShowMessage(true);
        });
    }
  };
  const {
    data: patients,
    isLoading,
    isError,
  } = useGetAllPatientsForDoctorQuery({ doctorId: id });
  console.log(patients);
  // Handle event click by setting the selected event
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = () => {
    setIsEditMode(false);
  };

  const handleEventClick = (event: GetEvent) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setShowAddAppointment(false); // Close the appointment add form
  };

  const addChecklistItem = () => {
    if (selectedEvent && selectedEvent.checklist) {
      const newChecklist = [
        ...selectedEvent.checklist,
        { description: "", completed: false },
      ];
      setSelectedEvent({ ...selectedEvent, checklist: newChecklist });
    }
  };
  const handleChecklistChange = (
    index: number,
    key: "description" | "completed",
    value: string | boolean
  ) => {
    if (selectedEvent && selectedEvent.checklist) {
      const updatedChecklist = [...selectedEvent.checklist];
      updatedChecklist[index] = {
        ...updatedChecklist[index],
        [key]: value,
      };
      setSelectedEvent({ ...selectedEvent, checklist: updatedChecklist });
    }
  };
  const removeChecklistItem = (index: number) => {
    if (selectedEvent && selectedEvent.checklist) {
      const updatedChecklist = [...selectedEvent.checklist];
      updatedChecklist.splice(index, 1); // Remove the item at the specified index
      setSelectedEvent({ ...selectedEvent, checklist: updatedChecklist });
    }
  };

  // Handle click on empty slot
  const handleSlotClick = (slotInfo: any) => {
    // Set thedate time of the clicked slot
    const clickedTime = slotInfo.date;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      date: clickedTime,
      endDate: clickedTime, // Default end time is same asdate
    }));
    setShowAddAppointment(true); // Show the "Add Appointment" form
  };

  // Type the event handler to handle both input and select changes
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEvent) {
      console.error("No selected event to edit");
      return; // Exit if selectedEvent is not available
    }

    const updatedEvent = {
      _id: selectedEvent._id,
      userId: selectedEvent?.userId ?? "", // Ensure you're passing the existing event ID
      title: selectedEvent.title,
      description: selectedEvent.description,
      date: selectedEvent.start.toISOString(), // Ensure 'date' is a string and set it appropriately
      endDate: selectedEvent.end ? selectedEvent.end.toISOString() : "", // Ensure 'endDate' is set to the proper date string
      time: selectedEvent.time,
      reminder: selectedEvent.reminder,
      frequency: selectedEvent.frequency,
      checklist: selectedEvent.checklist,
    };

   editAppointment({ dataToSend: updatedEvent, doctorId: id }) // Call the mutation with the updated event
  .unwrap()
  .then(() => {
    refetch()
    closeModal();
    setMessageProps({
      img: successImg,
      textColor: "text-green-500",
      detail: "Appointment Edited successfully!",
    });
    setSelectedEvent(null);
    setShowMessage(true);
  })
  .catch((error) => {
    setMessageProps({
      img: errorImg,
      textColor: "text-red-500",
      detail: error.data.message ?? "Something went wrong. Please try again.",
    });
    setShowMessage(true);
  });
  }

 const handleSubmitAppointment = async (e: React.FormEvent) => {
   e.preventDefault(); // Prevent default form submission

   try {
     // Check if all checklist items are empty
     const allEmpty = newEvent.checklist.every(
       (task) => task.description.trim() === "" && !task.completed
     );

     // If all items are empty, treat checklist as an empty array
     const checklist = allEmpty
       ? []
       : newEvent.checklist.map((task) => ({
           description: task.description,
           completed: task.completed,
         }));

     console.log(newEvent);

     const response = await addAppointment({
       dataToSend: {
         userId: newEvent.patientId,
         title: newEvent.title,
         description: newEvent.description,
         date: moment(newEvent.date).toISOString(),
         endDate: moment(newEvent.endDate).toISOString(),
         time: newEvent.time,
         frequency: newEvent.frequency,
         reminder: newEvent.reminder,
         checklist,
       },
       doctorId: id,
     })
       .unwrap()
       .then(() => {
         // On successful response
         setMessageProps({
           img: successImg,
           textColor: "text-green-500",
           detail: "Appointment created successfully!",
         });
         setNewEvent({
           patientId: "",
           title: "",
           description: "",
           date: new Date(),
           endDate: new Date(),
           time: "",
           frequency: "Every day",
           reminder: "10 mins before",
           checklist: [{ description: "", completed: false }],
         });
         refetch();
         setShowMessage(true);
         closeModal();
       })
       .catch((error) => {
         setMessageProps({
           img: errorImg,
           textColor: "text-red-500",
           detail:
             error.data.message ?? "Something went wrong. Please try again.",
         });
         setShowMessage(true);
       });

     // If successful, log the response (or handle as needed)
     console.log("Appointment successfully added:", response);
   } catch (error) {
     setMessageProps({
       img: errorImg,
       textColor: "text-red-500",
       detail: "Something went wrong. Please try again.",
     });
     setShowMessage(true);
   }
 };
const handleEditCloseModal = () => {
  setEditMode(false); // Resets editMode to false
  // Any additional actions to reset state or clear inputs can be added here
  closeModal()
};


  const formIsValid =
    newEvent.patientId &&
    newEvent.title.trim() &&
    newEvent.frequency &&
    newEvent.time &&
    newEvent.date &&
    (newEvent.frequency === "None" || newEvent.endDate) &&
    newEvent.reminder;
 const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 const [searchTerm, setSearchTerm] = useState("");

 {
   /* Filtered patients based on the search term */
 }
 const filteredPatients =
   patients?.data.patient.filter(
     (patient) =>
       patient.requestStatus === true &&
       `${patient.patient.firstName} ${patient.patient.lastName}`
         .toLowerCase()
         .includes(searchTerm.toLowerCase())
   ) || [];
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <BigCalendar
        {...props}
        localizer={localizer}
        components={{
          event: EventBlock,
        }}
        style={{ height: 600 }}
        onSelectEvent={handleEventClick} // Handle event click
        onSelectSlot={handleSlotClick} // Handle slot click (empty space)
        selectable
      />

      {/* Modal for displaying selected event details */}
      {selectedEvent && (
        <div className="fixed inset-0 p-4 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-2xl relative max-h-screen overflow-y-auto">
            {/* Close Button (X) */}

            <button onClick={handleEditCloseModal} className="-mt-4 ml-auto">
              <IoIosCloseCircleOutline className="h-7 w-7" />
            </button>

            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                {editMode ? "Edit Appointment" : selectedEvent.title}
              </h2>
              <button
                onClick={() => setEditMode((prev) => !prev)}
                className="text-xl text-primary bg-transparent border-none"
              >
                <FaPencilAlt size={23} className="text-primary mb-4" />
              </button>
            </div>
            <hr className="mb-4" />

            <div className="mb-4">
              <div className="flex space-x-1">
                <label className="block text-sm font-semibold mb-2">
                  Title
                </label>
                {editMode && <span className="text-red-500"> *</span>}
                </div>
              <input
                type="text"
                name="title"
                required
                value={selectedEvent.title}
                minLength={3}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    title: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                readOnly={!editMode}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={selectedEvent.description}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border rounded resize-none h-[120px]" // Adjust height
                readOnly={!editMode}
              />
            </div>
            <div className="flex justify-between space-x-4">
              <div className="mb-4 w-1/2">
                 <div className="flex space-x-1">
                  <label className="block text-sm font-semibold mb-2">
                    Frequency
                  </label>
                 {editMode && <span className="text-red-500"> *</span>}
                </div>
                <select
                  name="frequency"
                  value={selectedEvent.frequency}
                  onChange={(e) => {
                    const newFrequency = e.target.value;
                    setSelectedEvent((prev) => {
                      if (!prev) return null; // Ensure `prev` is not null
                      return {
                        ...prev,
                        frequency: newFrequency,
                        ...(newFrequency === "None" && { end: undefined }), // Remove `end` if "None" is selected
                      };
                    });
                  }}
                  className="p-2 border rounded w-full"
                  disabled={!editMode} // Disables dropdown when not in edit mode
                >
                  <option value="None">None</option>
                  <option value="Every day">Every day</option>
                  <option value="Every 2 days">Every 2 days</option>
                  <option value="Every week">Every week</option>
                  <option value="Every 2 weeks">Every 2 weeks</option>
                  <option value="Every month">Every month</option>
                  <option value="Every 3 months">Every 3 months</option>
                  <option value="Every 6 months">Every 6 months</option>
                  <option value="Every year">Every year</option>
                </select>
              </div>

              <div className="mb-4 w-1/2">
                 <div className="flex space-x-1">
                  <label className="block text-sm font-semibold mb-2">
                    Start Time
                  </label>
                   {editMode && <span className="text-red-500"> *</span>}  
                </div>
                <input
                  type="time"
                  name="time"
                  required
                  value={moment(selectedEvent.time).format("HH:mm")} // Use the formatted string for the value
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      time: e.target.value, // Store the time as an 'HH:mm' string
                    })
                  }
                  className="p-2 border rounded w-full"
                  readOnly={!editMode}
                />
              </div>
            </div>
           <div className="flex w-full justify-between space-x-4">
  <div className="mb-4 w-1/2">
    <div className="space-x-1 flex">
      <label className="block text-sm font-semibold mb-2">Start Date</label>
      {editMode && <span className="text-red-500"> *</span>}
    </div>
    <input
      type="date"
      name="start"
      required
      value={moment(selectedEvent.start).format("YYYY-MM-DD")}
      onChange={(e) =>
        setSelectedEvent((prev) => {
          if (!prev) return null;
          const newStartDate = new Date(e.target.value);
          return {
            ...prev,
            start: newStartDate,
          };
        })
      }
      className="w-full p-2 border rounded"
      readOnly={!editMode}
    />
  </div>

  {selectedEvent.frequency !== "None" && (
    <div className="mb-4 w-1/2">
      <div className="space-x-1 flex">
        <label className="block text-sm font-semibold mb-2">End Date</label>
        {editMode && <span className="text-red-500"> *</span>}
      </div>
      <input
        type="date"
        name="endDate"
        required
        value={moment(selectedEvent.end).format("YYYY-MM-DD")}
        min={moment(selectedEvent.start).format("YYYY-MM-DD")} // Disable dates before start
        onChange={(e) =>
          setSelectedEvent((prev) => {
            if (!prev) return null;
            const newEndTime = new Date(e.target.value);
            return {
              ...prev,
              end: newEndTime,
            };
          })
        }
        className="w-full p-2 border rounded"
        readOnly={!editMode}
      />
    </div>
  )}
</div>

            <div className="mb-4">
             <div className="flex space-x-1">
                <label className="block text-sm font-semibold mb-2">
                  Reminder
                </label>
                 {editMode && <span className="text-red-500"> *</span>  }
                </div>
              <select
                name="reminder"
                value={selectedEvent.reminder}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    reminder: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                disabled={!editMode} // Disable dropdown if not in edit mode
              >
                <option value="10 mins before">10 minutes before</option>
                <option value="30 mins before">30 minutes before</option>
                <option value="1 hour before">1 hour before</option>
                <option value="1 day before">1 day before</option>
              </select>
            </div>

            <div>
              {!editMode && selectedEvent.checklist && selectedEvent.checklist.length > 0 && (
  <h3 className="font-semibold mb-2">Checklist:</h3>
)}
{editMode&& (
  <h3 className="font-semibold mb-2">Checklist:</h3>
)}
{selectedEvent.checklist &&
  selectedEvent.checklist.map((item, index) => (
    <div key={index} className="flex items-center mb-2">
      {editMode ? (
        <>
          {editMode && (
            <input
              type="checkbox"
              checked={item.completed}
              onChange={(e) =>
                handleChecklistChange(index, "completed", e.target.checked)
              }
              className="mr-2"
            />
          )}
          <input
            type="text"
            value={item.description}
            required
            onChange={(e) =>
              handleChecklistChange(index, "description", e.target.value)
            }
            className={`flex-1 mr-2 p-1 border rounded ${
              item.completed ? "line-through text-gray-400" : ""
            }`}
            placeholder="Task description"
          />

          <button
            type="button"
            onClick={() => removeChecklistItem(index)}
            className="text-red-500 ml-2"
          >
            -
          </button>
        </>
      ) : (
        <div className="flex items-center justify-between w-full">
          <p className={item.completed ? "line-through text-gray-400" : ""}>
            {item.description}
          </p>
        </div>
      )}
    </div>
  ))}


              {editMode && (
                <button
                  type="button"
                  onClick={addChecklistItem}
                  className="mt-2 px-3 py-1 mb-2 bg-primary text-white rounded"
                >
                  +
                </button>
              )}
            </div>

            <div className="flex justify-between">
              {!editMode && (
                <button
                  type="button"
                  onClick={handleCancelAppointment}
                  className="px-5 py-1.5 rounded-xl border-2 border-primary text-primary"
                >
                 {isDeleteLoading? "Cancelling..." : "Cancel appointment"}
                </button>
              )}
              <button
                type="submit"
                onClick={handleEditCloseModal}
                className="px-9 py-2 rounded-xl bg-primary text-white"
              >
                Close
              </button>
              {editMode && (
                <button
                  onClick={handleEditFormSubmit}
                 className={`px-9 py-2 rounded-xl ${
                     !isEditLoading
                      ? "bg-primary text-white  px-4 py-2 rounded-2xl flex items-center"
                      : "bg-[#C9AFC6] text-white"
                  }`}
                >
                  {isEditLoading ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
            {showMessage && (
              <div className="fixed inset-0 p-4 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative max-h-screen overflow-y-auto">
                  <button
                    onClick={() => setShowMessage(false)}
                    className="w-full flex justify-end"
                  >
                    <IoIosCloseCircleOutline className="h-7 w-7" />
                  </button>
                  <MessageCard
                    img={messageProps.img}
                    textColor={messageProps.textColor}
                    detail={messageProps.detail}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Appointment Form Modal */}
      {showAddAppointment && (
        <div className="fixed inset-0 p-4 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-2xl relative max-h-screen overflow-y-auto">
            {/* Close Button (X) */}

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Add Appointment
              </h2>
              <button
                onClick={handleAddCloseModal}
                className="ml-auto -mt-4 -mr-3"
              >
                <IoIosCloseCircleOutline className="h-7 w-7" />
              </button>
            </div>
            <form onSubmit={handleSubmitAppointment}>
              {/* Title */}
             <div className="mb-4 relative">
  <div className="flex space-x-1">
    <label className="block text-sm font-semibold mb-2">Select Patient</label>
    <span className="text-red-500"> *</span>
  </div>

  {isLoading ? (
    <div className="w-full p-2 border rounded">Loading...</div>
  ) : isError ? (
    <div className="w-full p-2 border rounded">Error loading patients</div>
  ) : (
    <div>
      {/* Input to display selected value and toggle dropdown */}
      <div
        className="w-full p-2 border rounded cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {newEvent.patientId
          ? patients?.data.patient.find(
              (patient) => patient.patient._id === newEvent.patientId
            )?.patient.firstName || "Select a patient"
          : "Select a patient"}
      </div>

      {/* Dropdown with Search */}
      {isDropdownOpen && (
        <div className="absolute w-full mt-2 border rounded bg-white shadow-lg z-10">
          <input
            type="text"
            placeholder="Search for a patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border-b focus:outline-none"
          />
          <ul className="max-h-40 overflow-y-auto">
            {filteredPatients?.length > 0 ? (
              filteredPatients.map((patient) => (
                <li
                  key={patient.patient._id}
                  onClick={() => {
                    setNewEvent({
                      ...newEvent,
                      patientId: patient.patient._id,
                    });
                    setSearchTerm("");
                    setIsDropdownOpen(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {`${patient.patient.firstName} ${patient.patient.lastName}`}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )}
</div>


              <div className="mb-4">
                <div className="flex space-x-1">
                <label className="block text-sm font-semibold mb-2">
                  Title
                </label>
                <span className="text-red-500"> *</span>
                </div>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleFormChange}
                  minLength={3}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded h-[120px]"
                />
              </div>
              <div className="flex w-full justify-between space-x-4">
                <div className="mb-4 w-1/2">
                <div className="flex space-x-1">
                  <label className="block text-sm font-semibold mb-2">
                    Frequency
                  </label>
                  <span className="text-red-500"> *</span>  
                </div>
                  <select
                    name="frequency"
                    value={newEvent.frequency}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Frequency</option>{" "}
                    {/* Placeholder option */}
                    <option value="None">None</option>
                    <option value="Every day">Every day</option>
                    <option value="Every 2 days">Every 2 days</option>
                    <option value="Every week">Every week</option>
                    <option value="Every 2 weeks">Every 2 weeks</option>
                    <option value="Every month">Every month</option>
                    <option value="Every 3 months">Every 3 months</option>
                    <option value="Every 6 months">Every 6 months</option>
                    <option value="Every year">Every year</option>
                  </select>
                </div>
                <div className="mb-4 w-1/2">
                <div className="flex space-x-1">
                  <label className="block text-sm font-semibold mb-2">
                    Start Time
                  </label>
                    <span className="text-red-500"> *</span>  
                </div>
                  <input
                    type="time"
                    name="time"
                    required
                    value={newEvent.time} // Use the time string directly
                    onChange={(e) => {
                      setNewEvent({
                        ...newEvent,
                        time: e.target.value, // Store the time as an 'HH:mm' string
                      });
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
               <div className="flex w-full justify-between space-x-4">
      {/* Start Date */}
      <div className="mb-4 w-1/2">
  <div className="space-x-1 flex">
    <label className="block text-sm font-semibold mb-2">Start Date</label>
    <span className="text-red-500"> *</span>
  </div>
  <input
    type="date"
    name="date"
    value={newEvent.date ? moment(newEvent.date).format("YYYY-MM-DD") : ""}
    onChange={(e) => {
      const newDate = new Date(e.target.value);
      if (newEvent.endDate && new Date(newEvent.endDate).getTime() < newDate.getTime()) {
        setError("Start Date cannot be after End Date.");
      } else {
        setError("");
        setNewEvent((prev) => ({
          ...prev,
          date: newDate,
        }));
      }
    }}
    className="w-full p-2 border rounded"
    required
  />
</div>

{/* End Date */}
{newEvent.frequency !== "None" && (
  <div className="mb-4 w-1/2">
    <div className="space-x-1 flex">
      <label className="block text-sm font-semibold mb-2">End Date</label>
      <span className="text-red-500"> *</span>
    </div>
    <input
      type="date"
      name="endDate"
      value={newEvent.endDate ? moment(newEvent.endDate).format("YYYY-MM-DD") : ""}
      min={newEvent.date ? moment(newEvent.date).format("YYYY-MM-DD") : ""} // Disable dates before start
      onChange={(e) => {
        const newEndDate = new Date(e.target.value);
        if (newEvent.date && newEndDate.getTime() < new Date(newEvent.date).getTime()) {
          setError("End Date cannot be earlier than Start Date.");
        } else {
          setError("");
          setNewEvent((prev) => ({
            ...prev,
            endDate: newEndDate,
          }));
        }
      }}
      className="w-full p-2 border rounded"
      required
    />
  </div>
)}

{error && <div className="text-red-500 text-sm">{error}</div>}
</div>

              {/* Reminder */}
              <div className="mb-4">
                <div className="flex space-x-1">
                <label className="block text-sm font-semibold mb-2">
                  Reminder
                </label>
                  <span className="text-red-500"> *</span>  
                </div>
                <select
                  name="reminder"
                  value={newEvent.reminder}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Reminder</option>{" "}
                  {/* Placeholder option */}
                  <option value="10 mins before">10 minutes before</option>
                  <option value="30 mins before">30 minutes before</option>
                  <option value="1 hour before">1 hour before</option>
                  <option value="1 day before">1 day before</option>
                </select>
              </div>

              {/* Checklist */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Checklist:</h3>
                {newEvent.checklist.map((item, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={(e) => {
                        const updatedChecklist = [...newEvent.checklist];
                        updatedChecklist[index].completed = e.target.checked;
                        setNewEvent({
                          ...newEvent,
                          checklist: updatedChecklist,
                        });
                      }}
                      className="mr-2"
                    />
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const updatedChecklist = [...newEvent.checklist];
                        updatedChecklist[index].description = e.target.value;
                        setNewEvent({
                          ...newEvent,
                          checklist: updatedChecklist,
                        });
                      }}
                      className="flex-1 mr-2 p-1 border rounded"
                      placeholder="Task description"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedChecklist = newEvent.checklist.filter(
                          (_, i) => i !== index
                        );
                        setNewEvent({
                          ...newEvent,
                          checklist: updatedChecklist,
                        });
                      }}
                      className="text-red-500 ml-2"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setNewEvent((prev) => ({
                      ...prev,
                      checklist: [
                        ...prev.checklist,
                        { description: "", completed: false },
                      ],
                    }))
                  }
                  className="mt-2 px-3 py-1 bg-primary text-white rounded"
                >
                  +
                </button>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleAddCloseModal}
                  className="px-5 py-1.5 rounded-xl border-2 border-primary text-primary"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className={`px-9 py-2 rounded-xl ${
                    formIsValid && !isAppointmentLoading
                      ? "bg-primary text-white  px-4 py-2 rounded-2xl flex items-center"
                      : "bg-[#C9AFC6] text-white"
                  }`}
                  disabled={!formIsValid || isAppointmentLoading}
                >
                  {isAppointmentLoading ? "Adding..." : "Add Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showMessage && (
        <div className="fixed inset-0 p-4 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative max-h-screen overflow-y-auto">
            <button
              onClick={() => setShowMessage(false)}
              className="w-full flex justify-end"
            >
              <IoIosCloseCircleOutline className="h-7 w-7" />
            </button>
            <MessageCard
              img={messageProps.img}
              textColor={messageProps.textColor}
              detail={messageProps.detail}
            />
          </div>
        </div>
      )}
    </div>
  );
}