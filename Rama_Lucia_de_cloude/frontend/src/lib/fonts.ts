import { Instrument_Serif, Montserrat } from "next/font/google";

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});