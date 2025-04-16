// AddEventForm.tsx

import moment from "moment";
import React, { useState } from "react";

interface ChecklistItem {
  description: string;
  completed: boolean;
}

interface AddEventFormProps {
  onSubmit: (eventData: {
    title: string;
    description: string;
    date: string;
    endDate: string;
    time: string;
    frequency: string;
    reminder: string;
    checklist: ChecklistItem[];
  }) => void;
  onCancel: () => void;
}

export default function AddEventForm({
  onSubmit,
  onCancel,
}: AddEventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState("Every day");
  const [reminder, setReminder] = useState("10 mins before");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { description: "", completed: false },
  ]);

  const handleChecklistChange = (index: number, value: string) => {
    const updatedChecklist = checklist.map((item, i) =>
      i === index ? { ...item, description: value } : item
    );
    setChecklist(updatedChecklist);
  };

  const addChecklistItem = () => {
    setChecklist([...checklist, { description: "", completed: false }]);
  };

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      date,
      endDate,
      time,
      frequency,
      reminder,
      checklist: checklist.filter((item) => item.description.trim() !== ""),
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Add New Event</h2>

        <div className="mb-4">
          <label className="block font-normal text-sm mb-2">
            Title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            className="block w-full rounded-lg border p-2.5 bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <label className="block font-normal text-sm mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event description"
            className="block w-full rounded-lg border p-2.5 bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <label className="block font-normal text-sm mb-2">Start Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full rounded-lg border p-2.5 bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <label className="block font-normal text-sm mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="block w-full rounded-lg border p-2.5 bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <label className="block font-normal text-sm mb-2">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="block w-full rounded-lg border p-2.5 bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <label className="block font-normal text-sm mb-2">Frequency</label>
          <input
            type="text"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="e.g., Every day"
            className="block w-full rounded-lg border p-2.5 bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <label className="block font-normal text-sm mb-2">Reminder</label>
          <input
            type="text"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            placeholder="e.g., 10 mins before"
            className="block w-full rounded-lg border p-2.5 bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <label className="block font-normal text-sm mb-2">Checklist</label>
          {checklist.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleChecklistChange(index, e.target.value)}
                placeholder="Task description"
                className="block w-full rounded-lg border p-2.5 bg-gray-50"
              />
            </div>
          ))}
          <button
            onClick={addChecklistItem}
            className="text-primary text-sm mt-1"
          >
            + Add Task
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={onCancel}
            className="px-5 py-1.5 mx-2 rounded-xl border-2 bg-white border-primary text-primary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-9 py-2 mx-2 rounded-xl bg-primary text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
