"use client";

import { useMemo, useState } from "react";
import CalendarFilters from "@/components/calendar/CalendarFilters";
import ClassroomCalendar from "@/components/calendar/ClassroomCalendar";
import { allEvents, type CalendarEvent } from "@/resources/data";

// Re-exportado para compatibilidad con importaciones existentes
export type { CalendarEvent };

export default function Page() {
  const [professor, setProfessor] = useState("all");
  const [company, setCompany] = useState("all");

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchesProfessor =
        professor === "all" || event.professorId === professor;
      const matchesCompany =
        company === "all" || event.companyId === company;
      return matchesProfessor && matchesCompany;
    });
  }, [professor, company]);

  const aula1Events = filteredEvents.filter((e) => e.aula === "aula1");
  const aula2Events = filteredEvents.filter((e) => e.aula === "aula2");
  const aula3Events = filteredEvents.filter((e) => e.aula === "aula3");

  return (
    <section className="bg-[#050505] p-6"> {/* TODO: migrate to COLORS.background */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
        <CalendarFilters
          professor={professor}
          company={company}
          onProfessorChange={setProfessor}
          onCompanyChange={setCompany}
          onReset={() => {
            setProfessor("all");
            setCompany("all");
          }}
        />
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
          <ClassroomCalendar title="Aula 1" events={aula1Events} />
          <ClassroomCalendar title="Aula 2" events={aula2Events} />
          <ClassroomCalendar title="Aula 3" events={aula3Events} />
        </div>
      </div>
    </section>
  );
}