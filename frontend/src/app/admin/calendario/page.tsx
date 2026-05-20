"use client";

import { useEffect, useMemo, useState } from "react";
import CalendarFilters from "@/components/calendar/CalendarFilters";
import ClassroomCalendar from "@/components/calendar/ClassroomCalendar";
import MonthNavigator from "@/components/calendar/MonthNavigator";
import { getCalendarData } from "@/services/calendar.service";
import { mapCalendarApiData } from "@/components/calendar/calendar.mapper";
import type {
  CalendarEvent,
  CalendarProfessorOption,
  CalendarCompanyOption,
} from "@/components/calendar/types";
import {
  getWorkflowGlobalCalendar,
  RESERVATION_WORKFLOW_EVENT,
} from "@/services/reservation-workflow.service";

export default function Page() {
  const [professor, setProfessor] = useState("all");
  const [company, setCompany] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [eventsState, setEventsState] = useState<CalendarEvent[]>([]);

  const [professorOptions, setProfessorOptions] = useState<
    CalendarProfessorOption[]
  >([]);

  const [companyOptions, setCompanyOptions] = useState<CalendarCompanyOption[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCalendarData()
      .then((data) => {
        const mapped = mapCalendarApiData(data);
        const workflow = getWorkflowGlobalCalendar();

        setEventsState([...mapped.events, ...workflow.events]);
        setProfessorOptions([
          ...mapped.professors,
          ...workflow.professors.filter((professor) => !mapped.professors.some((item) => item.id === professor.id)),
        ]);
        setCompanyOptions([
          ...mapped.companies,
          ...workflow.companies.filter((company) => !mapped.companies.some((item) => item.id === company.id)),
        ]);
        setError(null);
      })
      .catch((error) => {
        console.error("Error cargando calendario:", error);
        setError("No se pudieron cargar los datos del calendario.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const refreshWorkflow = () => {
      const workflow = getWorkflowGlobalCalendar();
      setEventsState((current) => [
        ...current.filter((event) => !event.id.includes("-assignment-")),
        ...workflow.events,
      ]);
      setProfessorOptions((current) => [
        ...current.filter((professor) => !workflow.professors.some((item) => item.id === professor.id)),
        ...workflow.professors,
      ]);
      setCompanyOptions((current) => [
        ...current.filter((company) => !workflow.companies.some((item) => item.id === company.id)),
        ...workflow.companies,
      ]);
    };

    window.addEventListener(RESERVATION_WORKFLOW_EVENT, refreshWorkflow);
    window.addEventListener("storage", refreshWorkflow);

    return () => {
      window.removeEventListener(RESERVATION_WORKFLOW_EVENT, refreshWorkflow);
      window.removeEventListener("storage", refreshWorkflow);
    };
  }, []);

  const filteredEvents = useMemo(() => {
    return eventsState.filter((event) => {
      const matchesProfessor =
        professor === "all" || event.professorId === professor;

      const matchesCompany = company === "all" || event.companyId === company;

      return matchesProfessor && matchesCompany;
    });
  }, [eventsState, professor, company]);

  const aula1Events = filteredEvents.filter((event) => event.aula === "aula1");
  const aula2Events = filteredEvents.filter((event) => event.aula === "aula2");
  const aula3Events = filteredEvents.filter((event) => event.aula === "aula3");

  function handleDeleteEvent(eventId: string) {
    setEventsState((prev) => prev.filter((event) => event.id !== eventId));
  }

  function handleUpdateEvent(updatedEvent: CalendarEvent) {
    setEventsState((prev) =>
      prev.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
  }

  function handlePrev() {
    setCurrentDate((date) => {
      const nextDate = new Date(date);
      nextDate.setMonth(nextDate.getMonth() - 1);
      return nextDate;
    });
  }

  function handleNext() {
    setCurrentDate((date) => {
      const nextDate = new Date(date);
      nextDate.setMonth(nextDate.getMonth() + 1);
      return nextDate;
    });
  }

  if (loading) {
    return (
      <div className="p-6 text-(--text-primary)">Cargando calendario...</div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-400">{error}</div>;
  }

  return (
    <section className="rounded-2xl p-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
        <CalendarFilters
          professor={professor}
          company={company}
          professorLegend={professorOptions}
          companyLegend={companyOptions}
          onProfessorChange={setProfessor}
          onCompanyChange={setCompany}
          onReset={() => {
            setProfessor("all");
            setCompany("all");
          }}
        />

        <MonthNavigator
          currentDate={currentDate}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
          <ClassroomCalendar
            title="Aula 1"
            aulaId="aula1"
            events={aula1Events}
            currentDate={currentDate}
            onDeleteEvent={handleDeleteEvent}
            onUpdateEvent={handleUpdateEvent}
          />

          <ClassroomCalendar
            title="Aula 2"
            aulaId="aula2"
            events={aula2Events}
            currentDate={currentDate}
            onDeleteEvent={handleDeleteEvent}
            onUpdateEvent={handleUpdateEvent}
          />

          <ClassroomCalendar
            title="Aula 3"
            aulaId="aula3"
            events={aula3Events}
            currentDate={currentDate}
            onDeleteEvent={handleDeleteEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        </div>
      </div>
    </section>
  );
}
