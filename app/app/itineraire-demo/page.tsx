import type { Metadata } from "next";
import { getSampleData } from "@/lib/data/sample";
import { toTripDTO } from "@/lib/trips/dto";
import { ItineraryView } from "@/components/itinerary/itinerary-view";

export const metadata: Metadata = {
  title: "Exemple d'itinéraire — Barcelone 5 jours",
  description:
    "Découvre un roadbook Roamy complet : jour par jour, adresses, budget, astuces et PDF. Un exemple de ce que tu recevras.",
  alternates: { canonical: "/itineraire-demo" },
};

export default function DemoItineraryPage() {
  const { trip, itinerary } = getSampleData();
  return <ItineraryView trip={toTripDTO(trip)} itinerary={itinerary} itineraryId="demo" isDemo />;
}
