"use client";

import { useMemo, useState } from "react";
import CalendarFilters from "@/components/calendar/CalendarFilters";
import ClassroomCalendar from "@/components/calendar/ClassroomCalendar";
import MonthNavigator from "@/components/calendar/MonthNavigator";
import {
  allEvents,
  PROFESSOR_COLORS,
  type CalendarEvent,
} from "@/resources/data";

// Re-exportado para compatibilidad con importaciones existentes
export type { CalendarEvent };

export default function Page() {
  const [professor, setProfessor] = useState("all");
  const [company, setCompany] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchesProfessor =
        professor === "all" || event.professorId === professor;
      const matchesCompany =
        company === "all" || event.companyId === company;
      return matchesProfessor && matchesCompany;
    });
  }, [professor, company]);

  const aula1Events = useMemo(
    () => filteredEvents.filter((e) => e.aula === "aula1"),
    [filteredEvents],
  );
  const aula2Events = useMemo(
    () => filteredEvents.filter((e) => e.aula === "aula2"),
    [filteredEvents],
  );
  const aula3Events = useMemo(
    () => filteredEvents.filter((e) => e.aula === "aula3"),
    [filteredEvents],
  );

  const professorLegend = useMemo(() => {
    const seen = new Set<string>();
    return allEvents
      .filter((event) => {
        if (seen.has(event.professorId)) return false;
        seen.add(event.professorId);
        return true;
      })
      .map((event) => ({
        id: event.professorId,
        name: event.professorName,
        color: PROFESSOR_COLORS[event.professorId] ?? "#9ca3af",
      }));
  }, []);

  function handlePrev() {
    setCurrentDate((d) => {
      const nd = new Date(d);
      nd.setMonth(nd.getMonth() - 1);
      return nd;
    });
  }

  function handleNext() {
    setCurrentDate((d) => {
      const nd = new Date(d);
      nd.setMonth(nd.getMonth() + 1);
      return nd;
    });
  }

  return (
    <section className="bg-surface p-6 rounded-2xl">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
        <CalendarFilters
          professor={professor}
          company={company}
          professorLegend={professorLegend}
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
          />
          <ClassroomCalendar
            title="Aula 2"
            aulaId="aula2"
            events={aula2Events}
            currentDate={currentDate}
          />
          <ClassroomCalendar
            title="Aula 3"
            aulaId="aula3"
            events={aula3Events}
            currentDate={currentDate}
          />
        </div>
      </div>
    </section>
  );
}
