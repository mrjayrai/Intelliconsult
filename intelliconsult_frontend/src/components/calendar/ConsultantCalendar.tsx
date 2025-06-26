"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiLink";

interface TrainingData {
  _id: string;
  name: string;
}

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [trainings, setTrainings] = useState<TrainingData[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { authData } = useAuth();

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  useEffect(() => {
    if (!authData?.user?._id) return;

    const fetchAssignedTrainings = async () => {
      const res = await fetch(api + "trainings/assigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: authData.user._id }),
      });
      const data = await res.json();
      setTrainings(data.data.trainings.map((t: any) => t.trainingId));
    };

    const fetchAttendance = async () => {
      const res = await fetch(api + "attendance/get-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: authData.user._id }),
      });
      const json = await res.json();

      if (json.success && json.data?.attendanceSheet) {
        const trainingEvents = json.data.attendanceSheet.flatMap(
          (record: { daysPresent: string[]; trainingAttended: string }, i: number) =>
            record.daysPresent.map((dateStr: string, idx: number) => ({
              id: `${i}-${idx}`,
              title: "Present",
              start: dateStr,
              allDay: true,
              extendedProps: {
                calendar: "Primary",
              },
            }))
        );
        setEvents(trainingEvents);
      }
    };

    fetchAssignedTrainings();
    fetchAttendance();
  }, [authData?.user?._id]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const date = new Date(selectInfo.startStr);
    const day = date.getDay();

    if (day === 0 || day === 6) {
      alert("Only Monday to Friday are allowed for attendance.");
      return;
    }

    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.startStr);
    openModal();
  };

  // const handleEventClick = (clickInfo: EventClickArg) => {
  //   const event = clickInfo.event;
  //   setSelectedEvent(event as unknown as CalendarEvent);
  //   setEventTitle(event.title);
  //   setEventStartDate(event.start?.toISOString().split("T")[0] || "");
  //   setEventEndDate(event.end?.toISOString().split("T")[0] || "");
  //   setEventLevel(event.extendedProps.calendar);
  //   openModal();
  // };

  const handleEventClick = (clickInfo: EventClickArg) => {
  // Disable editing events — do nothing on click
  alert("Attendance for this date is already marked as 'Present'.");
};

  const handleAddOrUpdateEvent = async () => {
    const selectedDate = new Date(eventStartDate);
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const saturday = new Date(monday);
    saturday.setDate(monday.getDate() + 5);

    const training = trainings.find((t) => t.name === eventTitle);
    if (!training) {
      alert("Please select a valid training.");
      return;
    }

    const weekNo = getWeekNumber(selectedDate);
    const year = selectedDate.getFullYear();
    const daysPresent = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: "Present",
      start: eventStartDate,
      end: eventEndDate,
      allDay: true,
      extendedProps: { calendar: eventLevel || "Primary" },
    };

    try {
      const res = await fetch(api + "attendance/add-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: authData?.user._id,
          attendanceEntry: {
            weekNo,
            year,
            totalDaysInWeek: 5,
            daysPresent,
            trainingAttended: training.name,
            trainingId: training._id,
          },
        }),
      });

      const data = await res.json();

      // Fix: if HTTP status is 200, consider it success
      if (res.ok && data?.success !== false) {
        setEvents((prev) => [...prev, newEvent]);
        closeModal();
        resetModalFields();
      } else {
        alert("Failed to add attendance.");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };

  const getWeekNumber = (date: Date): number => {
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((days + firstJan.getDay() + 1) / 7);
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Add Attendance +",
              click: openModal,
            },
          }}
        />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedEvent ? "Edit Event" : "Add Attendance"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Plan your next big moment: schedule or edit an event to stay on track
            </p>
          </div>

          <div className="mt-8">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Select Training
              </label>
              <select
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              >
                <option value=""> Select Training </option>
                {trainings.map((training) => (
                  <option key={training._id} value={training.name}>
                    {training.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="mt-6">
              <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Color
              </label>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {Object.entries(calendarsEvents).map(([key, value]) => (
                  <div key={key} className="n-chk">
                    <div className={`form-check form-check-${value} form-check-inline`}>
                      <label
                        className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                        htmlFor={`modal${key}`}
                      >
                        <span className="relative">
                          <input
                            className="sr-only form-check-input"
                            type="radio"
                            name="event-level"
                            value={key}
                            id={`modal${key}`}
                            checked={eventLevel === key}
                            onChange={() => setEventLevel(key)}
                          />
                          <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                            <span
                              className={`h-2 w-2 rounded-full bg-white ${eventLevel === key ? "block" : "hidden"}`}
                            ></span>
                          </span>
                        </span>
                        {key}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Enter Start Date
              </label>
              <div className="relative">
                <input
                  id="event-start-date"
                  type="date"
                  value={eventStartDate}
                  onChange={(e) => setEventStartDate(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Enter End Date
              </label>
              <div className="relative">
                <input
                  id="event-end-date"
                  type="date"
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 sm:w-auto"
            >
              Close
            </button>
            <button
              onClick={handleAddOrUpdateEvent}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white sm:w-auto"
            >
              {selectedEvent ? "Update Changes" : "Add Event"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}>
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">Present</div>
      {/* {eventInfo.event.title} */}
    </div>
  );
};

export default Calendar;
