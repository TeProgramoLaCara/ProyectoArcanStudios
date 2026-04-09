"use client";

import { useMemo, useState } from "react";
import CalendarFilters from "@/components/calendar/CalendarFilters";
import ClassroomCalendar from "@/components/calendar/ClassroomCalendar";

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  aula: "aula1" | "aula2" | "aula3";
  professorId: string;
  professorName: string;
  companyId: string;
  companyName: string;
  capacitaciones: string[];
};

const allEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "React Course - Nova",
    start: "2026-03-02",
    end: "2026-03-16",
    aula: "aula1",
    professorId: "p1",
    professorName: "Carlos Martínez",
    companyId: "e1",
    companyName: "Nova",
    capacitaciones: ["Fundamentos de React", "Hooks y Context API"],
  },
  {
    id: "2",
    title: "UX Design - Acme",
    start: "2026-03-09",
    end: "2026-03-23",
    aula: "aula2",
    professorId: "p2",
    professorName: "Laura Sánchez",
    companyId: "e2",
    companyName: "Acme",
    capacitaciones: ["Investigación de usuarios", "Prototipado en Figma"],
  },
  {
    id: "3",
    title: "Figma Course - Nova",
    start: "2026-03-12",
    end: "2026-03-26",
    aula: "aula3",
    professorId: "p1",
    professorName: "Carlos Martínez",
    companyId: "e1",
    companyName: "Nova",
    capacitaciones: ["Componentes y Auto Layout", "Design Systems"],
  },
  {
    id: "4",
    title: "Marketing Basics - Acme",
    start: "2026-03-17",
    end: "2026-03-31",
    aula: "aula1",
    professorId: "p2",
    professorName: "Laura Sánchez",
    companyId: "e2",
    companyName: "Acme",
    capacitaciones: ["Estrategia de marca", "Marketing digital"],
  },
  {
    id: "5",
    title: "Advanced Excel - Nova",
    start: "2026-03-20",
    end: "2026-04-03",
    aula: "aula2",
    professorId: "p1",
    professorName: "Carlos Martínez",
    companyId: "e1",
    companyName: "Nova",
    capacitaciones: ["Tablas dinámicas", "Macros y VBA"],
  },
  {
    id: "6",
    title: "Brand Strategy - Nova",
    start: "2026-03-11",
    end: "2026-03-25",
    aula: "aula3",
    professorId: "p2",
    professorName: "Laura Sánchez",
    companyId: "e1",
    companyName: "Nova",
    capacitaciones: ["Identidad corporativa", "Posicionamiento de marca"],
  },
  {
  id: "7",
  title: "Python Basics - Acme",
  start: "2026-03-02",
  end: "2026-03-16",
  aula: "aula1",
  professorId: "p2",
  professorName: "Laura Sánchez",
  companyId: "e2",
  companyName: "Acme",
  capacitaciones: ["Introducción a Python", "POO"],
},
];

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
    <section className="bg-[#050505] p-6">
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