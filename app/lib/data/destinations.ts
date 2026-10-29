export interface Destination {
  name: string;
  country: string;
  label: string;
  tag: string;
  emoji: string;
  image?: string;
  trending?: boolean;
}

/**
 * Curated destination list. Deliberately static and framework-agnostic so the
 * combobox can be swapped for Google Places / Mapbox later without UI changes.
 */
export const DESTINATIONS: Destination[] = [
  {
    name: "Séville",
    country: "Espagne",
    label: "Séville, Espagne",
    tag: "Soleil",
    emoji: "☀️",
    image: "/images/dest-seville.jpg",
    trending: true,
  },
  {
    name: "Santorin",
    country: "Grèce",
    label: "Santorin, Grèce",
    tag: "Vue mer",
    emoji: "🌊",
    image: "/images/dest-santorini.jpg",
    trending: true,
  },
  {
    name: "Bali",
    country: "Indonésie",
    label: "Bali, Indonésie",
    tag: "Jungle",
    emoji: "🌴",
    image: "/images/dest-bali.jpg",
    trending: true,
  },
  {
    name: "Split",
    country: "Croatie",
    label: "Split, Croatie",
    tag: "Crique",
    emoji: "⛵",
    image: "/images/dest-split.jpg",
    trending: true,
  },
  {
    name: "Lisbonne",
    country: "Portugal",
    label: "Lisbonne, Portugal",
    tag: "Sunset",
    emoji: "🌇",
  },
  { name: "Porto", country: "Portugal", label: "Porto, Portugal", tag: "Food", emoji: "🍷" },
  { name: "Lagos", country: "Portugal", label: "Lagos, Algarve", tag: "Criques", emoji: "🏖️" },
  { name: "Madère", country: "Portugal", label: "Madère, Portugal", tag: "Rando", emoji: "🥾" },
  {
    name: "Barcelone",
    country: "Espagne",
    label: "Barcelone, Espagne",
    tag: "Fiesta",
    emoji: "🎶",
  },
  { name: "Madrid", country: "Espagne", label: "Madrid, Espagne", tag: "Culture", emoji: "🎨" },
  { name: "Valence", country: "Espagne", label: "Valence, Espagne", tag: "Food", emoji: "🥘" },
  { name: "Malaga", country: "Espagne", label: "Malaga, Espagne", tag: "Plage", emoji: "🏖️" },
  { name: "Grenade", country: "Espagne", label: "Grenade, Espagne", tag: "Culture", emoji: "🏛️" },
  {
    name: "Palma de Majorque",
    country: "Espagne",
    label: "Palma de Majorque, Espagne",
    tag: "Criques",
    emoji: "⛵",
  },
  { name: "Ibiza", country: "Espagne", label: "Ibiza, Espagne", tag: "Fiesta", emoji: "🪩" },
  { name: "Rome", country: "Italie", label: "Rome, Italie", tag: "Culture", emoji: "🏛️" },
  { name: "Florence", country: "Italie", label: "Florence, Italie", tag: "Culture", emoji: "🎨" },
  { name: "Naples", country: "Italie", label: "Naples, Italie", tag: "Food", emoji: "🍕" },
  {
    name: "Amalfi",
    country: "Italie",
    label: "Côte amalfitaine, Italie",
    tag: "Vue mer",
    emoji: "🍋",
  },
  {
    name: "Cinque Terre",
    country: "Italie",
    label: "Cinque Terre, Italie",
    tag: "Rando",
    emoji: "🥾",
  },
  { name: "Venise", country: "Italie", label: "Venise, Italie", tag: "Romance", emoji: "🛶" },
  { name: "Sicile", country: "Italie", label: "Sicile, Italie", tag: "Soleil", emoji: "🌋" },
  { name: "Athènes", country: "Grèce", label: "Athènes, Grèce", tag: "Culture", emoji: "🏺" },
  { name: "Mykonos", country: "Grèce", label: "Mykonos, Grèce", tag: "Fiesta", emoji: "🪩" },
  { name: "Crète", country: "Grèce", label: "Crète, Grèce", tag: "Plage", emoji: "🏖️" },
  { name: "Corfou", country: "Grèce", label: "Corfou, Grèce", tag: "Vue mer", emoji: "🌊" },
  { name: "Nice", country: "France", label: "Nice, France", tag: "Vue mer", emoji: "🌊" },
  { name: "Marseille", country: "France", label: "Marseille, France", tag: "Criques", emoji: "⛵" },
  { name: "Calanques", country: "France", label: "Calanques, France", tag: "Rando", emoji: "🥾" },
  { name: "Biarritz", country: "France", label: "Biarritz, France", tag: "Surf", emoji: "🏄" },
  { name: "Paris", country: "France", label: "Paris, France", tag: "Culture", emoji: "🗼" },
  { name: "Bordeaux", country: "France", label: "Bordeaux, France", tag: "Food", emoji: "🍷" },
  { name: "Lyon", country: "France", label: "Lyon, France", tag: "Food", emoji: "🍽️" },
  { name: "Berlin", country: "Allemagne", label: "Berlin, Allemagne", tag: "Fiesta", emoji: "🎛️" },
  {
    name: "Amsterdam",
    country: "Pays-Bas",
    label: "Amsterdam, Pays-Bas",
    tag: "Vélo",
    emoji: "🚲",
  },
  { name: "Prague", country: "Tchéquie", label: "Prague, Tchéquie", tag: "Culture", emoji: "🏰" },
  { name: "Budapest", country: "Hongrie", label: "Budapest, Hongrie", tag: "Spa", emoji: "🧖" },
  { name: "Vienne", country: "Autriche", label: "Vienne, Autriche", tag: "Culture", emoji: "🎻" },
  {
    name: "Cracovie",
    country: "Pologne",
    label: "Cracovie, Pologne",
    tag: "Histoire",
    emoji: "🏛️",
  },
  {
    name: "Reykjavik",
    country: "Islande",
    label: "Reykjavik, Islande",
    tag: "Nature",
    emoji: "🌋",
  },
  {
    name: "Lofoten",
    country: "Norvège",
    label: "Îles Lofoten, Norvège",
    tag: "Nature",
    emoji: "🏔️",
  },
  { name: "Bergen", country: "Norvège", label: "Bergen, Norvège", tag: "Fjords", emoji: "⛰️" },
  {
    name: "Copenhague",
    country: "Danemark",
    label: "Copenhague, Danemark",
    tag: "Design",
    emoji: "🧃",
  },
  { name: "Stockholm", country: "Suède", label: "Stockholm, Suède", tag: "Nature", emoji: "🌲" },
  { name: "Tallinn", country: "Estonie", label: "Tallinn, Estonie", tag: "Culture", emoji: "🏰" },
  {
    name: "Dubrovnik",
    country: "Croatie",
    label: "Dubrovnik, Croatie",
    tag: "Vue mer",
    emoji: "🌊",
  },
  { name: "Kotor", country: "Monténégro", label: "Kotor, Monténégro", tag: "Fjords", emoji: "⛰️" },
  { name: "Istanbul", country: "Turquie", label: "Istanbul, Turquie", tag: "Culture", emoji: "🕌" },
  { name: "Marrakech", country: "Maroc", label: "Marrakech, Maroc", tag: "Soleil", emoji: "☀️" },
  { name: "Essaouira", country: "Maroc", label: "Essaouira, Maroc", tag: "Surf", emoji: "🏄" },
  { name: "Taghazout", country: "Maroc", label: "Taghazout, Maroc", tag: "Surf", emoji: "🏄" },
  { name: "Djerba", country: "Tunisie", label: "Djerba, Tunisie", tag: "Plage", emoji: "🏖️" },
  { name: "Zanzibar", country: "Tanzanie", label: "Zanzibar, Tanzanie", tag: "Plage", emoji: "🐚" },
  {
    name: "Le Cap",
    country: "Afrique du Sud",
    label: "Le Cap, Afrique du Sud",
    tag: "Nature",
    emoji: "🦓",
  },
  {
    name: "New York",
    country: "États-Unis",
    label: "New York, États-Unis",
    tag: "City",
    emoji: "🗽",
  },
  { name: "Oaxaca", country: "Mexique", label: "Oaxaca, Mexique", tag: "Food", emoji: "🌮" },
  { name: "Tulum", country: "Mexique", label: "Tulum, Mexique", tag: "Cénotes", emoji: "💧" },
  {
    name: "Carthagène",
    country: "Colombie",
    label: "Carthagène, Colombie",
    tag: "Fiesta",
    emoji: "💃",
  },
  { name: "Costa Rica", country: "Costa Rica", label: "Costa Rica", tag: "Nature", emoji: "🐒" },
  {
    name: "Rio de Janeiro",
    country: "Brésil",
    label: "Rio de Janeiro, Brésil",
    tag: "Plage",
    emoji: "🏖️",
  },
  {
    name: "Buenos Aires",
    country: "Argentine",
    label: "Buenos Aires, Argentine",
    tag: "Fiesta",
    emoji: "🪩",
  },
  { name: "Bangkok", country: "Thaïlande", label: "Bangkok, Thaïlande", tag: "Food", emoji: "🍜" },
  {
    name: "Chiang Mai",
    country: "Thaïlande",
    label: "Chiang Mai, Thaïlande",
    tag: "Nature",
    emoji: "🐘",
  },
  { name: "Vietnam", country: "Vietnam", label: "Vietnam", tag: "Food", emoji: "🍜" },
  { name: "Sri Lanka", country: "Sri Lanka", label: "Sri Lanka", tag: "Nature", emoji: "🐘" },
  { name: "Tokyo", country: "Japon", label: "Tokyo, Japon", tag: "City", emoji: "🗼" },
  { name: "Kyoto", country: "Japon", label: "Kyoto, Japon", tag: "Culture", emoji: "⛩️" },
  { name: "Osaka", country: "Japon", label: "Osaka, Japon", tag: "Food", emoji: "🍜" },
  {
    name: "Séoul",
    country: "Corée du Sud",
    label: "Séoul, Corée du Sud",
    tag: "City",
    emoji: "🌃",
  },
  { name: "Philippines", country: "Philippines", label: "Philippines", tag: "Plage", emoji: "🏝️" },
  { name: "Maldives", country: "Maldives", label: "Maldives", tag: "Lagon", emoji: "🐠" },
  {
    name: "Wadi Rum",
    country: "Jordanie",
    label: "Wadi Rum, Jordanie",
    tag: "Désert",
    emoji: "🏜️",
  },
  { name: "Goa", country: "Inde", label: "Goa, Inde", tag: "Plage", emoji: "🏖️" },
  { name: "Sydney", country: "Australie", label: "Sydney, Australie", tag: "Surf", emoji: "🏄" },
  {
    name: "Nouvelle-Zélande",
    country: "Nouvelle-Zélande",
    label: "Nouvelle-Zélande",
    tag: "Road trip",
    emoji: "🚐",
  },
  {
    name: "Polynésie",
    country: "Polynésie française",
    label: "Polynésie française",
    tag: "Lagon",
    emoji: "🐠",
  },
];

export function searchDestinations(query: string, limit = 8): Destination[] {
  const normalized = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (!normalized) return DESTINATIONS.slice(0, limit);

  return DESTINATIONS.filter((destination) => {
    const haystack = `${destination.label} ${destination.country} ${destination.tag}`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return haystack.includes(normalized);
  }).slice(0, limit);
}

export function findDestination(label: string): Destination | undefined {
  return DESTINATIONS.find(
    (destination) => destination.label.toLowerCase() === label.toLowerCase(),
  );
}

export const TRENDING_DESTINATIONS = DESTINATIONS.filter((destination) => destination.trending);

export const SURPRISE_DESTINATIONS = [
  "Reykjavik, Islande",
  "Oaxaca, Mexique",
  "Kyoto, Japon",
  "Lisbonne, Portugal",
  "Lofoten, Norvège",
  "Carthagène, Colombie",
  "Séoul, Corée du Sud",
  "Kotor, Monténégro",
];
