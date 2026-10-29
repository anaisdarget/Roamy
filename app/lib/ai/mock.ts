import type { TripRequest } from "@prisma/client";
import { INTERESTS, RHYTHMS } from "@/lib/config/site";
import { dateRange, formatDateFr, seasonFor } from "@/lib/utils/date";
import type { GeneratedItinerary, ItineraryDay, Activity } from "@/lib/schemas/itinerary";

function activity(
  title: string,
  description: string,
  duration: string,
  cost: string,
  area: string,
  tip?: string,
): Activity {
  return { title, description, duration, cost, area, ...(tip ? { tip } : {}) };
}

const MORNINGS = [
  {
    title: "Réveil doux et petit-déj de quartier",
    description:
      "Commence par un café en terrasse dans le quartier le plus vivant de {city}. Tu observes la ville se réveiller, tu commandes une viennoiserie locale et tu prends ton temps : les vacances, ça sert aussi à ça.",
    area: "Centre historique",
    tip: "Arrive avant 9 h 30 : les meilleures tables du matin se remplissent vite.",
  },
  {
    title: "Balade guidée par les ruelles",
    description:
      "Pars à pied sans itinéraire fixe dans les ruelles de {city}. Repère les façades colorées, les petites places et les artisans qui ouvrent leur boutique. C'est la meilleure façon de sentir la ville avant les heures de pointe.",
    area: "Vieille ville",
    tip: "Prends une photo des plaques de rue : c'est un souvenir gratuit et très local.",
  },
  {
    title: "Marché local et dégustation",
    description:
      "Direction le marché couvert de {city} pour goûter les produits de saison. Fromages, fruits, spécialités sucrées : compose-toi un petit-déj nomade et demande aux commerçants leur adresse préférée pour le déjeuner.",
    area: "Halles / marché central",
    tip: "Les meilleurs stands sont ceux où il y a des locaux qui font la queue, pas les photos en vitrine.",
  },
  {
    title: "Point de vue et grand air",
    description:
      "Monte vers le point de vue le plus accessible de {city} avant la chaleur. La lumière du matin est parfaite pour les photos et tu comprends enfin la géographie de la ville d'un seul coup d'œil.",
    area: "Hauteurs de la ville",
    tip: "Prends de l'eau et des baskets : ça monte plus que prévu, mais la vue vaut chaque marche.",
  },
  {
    title: "Musée ou expo qui ne dort pas",
    description:
      "Choisis un musée compact et bien fichu de {city} plutôt qu'un marathon culturel. Une heure et demie suffisent pour repartir avec une anecdote à raconter et sans jambe cassée.",
    area: "Quartier des musées",
    tip: "Vérifie les horaires en ligne la veille : beaucoup de musées ferment un jour dans la semaine.",
  },
];

const AFTERNOONS = [
  {
    title: "Crique, plage ou parc : pause vitaminée",
    description:
      "Après le déjeuner, offre-toi une vraie pause au soleil dans le spot le plus sympa de {city}. Serviette, playlist, baignade si la météo le permet : pas de programme, juste du temps pour toi.",
    area: "Bord de mer / parc",
    tip: "Le milieu d'après-midi est le moment le plus calme : parfait pour éviter la foule.",
  },
  {
    title: "Session street art et boutiques",
    description:
      "Pars chasser les fresques et les petites boutiques de créateurs dans le quartier alternatif de {city}. C'est là que tu trouves les souvenirs qui ne ressemblent pas à ceux de l'aéroport.",
    area: "Quartier créatif",
    tip: "Demande aux vendeurs ce qu'ils feraient s'ils avaient une après-midi libre : tu vas découvrir des pépites.",
  },
  {
    title: "Balade à vélo ou à pied le long de l'eau",
    description:
      "Loue un vélo (ou garde tes jambes) pour suivre le front de mer / la rivière de {city}. Arrête-toi quand ça te plaît, repars quand tu veux : c'est la définition même d'une bonne après-midi.",
    area: "Front de mer / berges",
    tip: "Les loueurs demandent souvent une pièce d'identité : garde-la sur toi.",
  },
  {
    title: "Atelier ou expérience locale",
    description:
      "Teste un atelier cuisine, une initiation au surf ou une visite d'artisan dans {city}. Tu repars avec une compétence inutile en société mais géniale en vacances.",
    area: "Atelier local",
    tip: "Réserve la veille au matin : les créneaux de fin d'après-midi partent en premier.",
  },
  {
    title: "Sieste stratégique et café de spécialité",
    description:
      "Ralentis : un café de spécialité, un cookie et 20 minutes à l'ombre. C'est officiellement une activité et c'est souvent le meilleur moment de la journée.",
    area: "Café de quartier",
    tip: "Les cafés de spécialité ferment souvent à 17 h : ne décale pas trop.",
  },
];

const EVENINGS = [
  {
    title: "Apéro au coucher du soleil",
    description:
      "Trouve un rooftop ou une terrasse orientée ouest dans {city} et commande la spécialité locale. Le but n'est pas de courir : c'est de regarder le ciel changer de couleur sans regarder l'heure.",
    area: "Rooftop / terrasse",
    tip: "Réserve si tu tiens absolument à la première rangée, sinon arrive 30 minutes avant le coucher.",
  },
  {
    title: "Dîner dans une adresse de quartier",
    description:
      "Ce soir, on évite la rue à touristes et on pousse la porte d'une petite salle où les habitués connaissent le serveur. Commande deux plats à partager et laisse-toi guider pour le dessert.",
    area: "Quartier local",
    tip: "Un menu court est souvent le signe d'une cuisine fraîche. C'est bon signe.",
  },
  {
    title: "Concert, bar à vinyles ou night market",
    description:
      "Selon l'ambiance de {city}, choisis un petit concert, un bar à vinyles ou un marché de nuit. Pas besoin de finir à 4 h du matin : l'idée, c'est de rentrer avec une anecdote, pas une migraine.",
    area: "Scène locale",
    tip: "Vérifie le programme le jour même sur les pages locales : les meilleures soirées sont souvent annoncées tard.",
  },
  {
    title: "Glace nocturne et dernière balade",
    description:
      "Termine par une glace et une balade sans but dans les rues illuminées de {city}. C'est le genre de moment que tu racontes six mois plus tard sans savoir pourquoi.",
    area: "Centre-ville",
    tip: "Les centres historiques sont souvent piétons après 20 h : profites-en.",
  },
];

const RESTAURANTS = [
  {
    cuisine: "Cuisine locale de saison",
    why: "Une carte courte, des produits frais et une équipe qui prend le temps de t'expliquer ce que tu manges.",
    priceRange: "€€",
  },
  {
    cuisine: "Street food locale",
    why: "Le spot parfait pour un déjeuner rapide et pas cher, avec une file de locaux à midi.",
    priceRange: "€",
  },
  {
    cuisine: "Tapas / petites assiettes",
    why: "Idéal à plusieurs : tu goûtes tout, tu partages tout, tu repars en ayant découvert trois plats.",
    priceRange: "€€",
  },
  {
    cuisine: "Brunch du week-end",
    why: "Pour les matins lents, avec du bon café et une terrasse qui donne envie de rester jusqu'à 14 h.",
    priceRange: "€€",
  },
  {
    cuisine: "Poisson / végétarien de saison",
    why: "Une adresse lumineuse, généreuse et facile à adapter aux régimes alimentaires.",
    priceRange: "€€",
  },
  {
    cuisine: "Dessert & café de spécialité",
    why: "La pause sucrée parfaite entre deux balades, sans le piège à touristes du centre.",
    priceRange: "€",
  },
];

export function buildMockItinerary(trip: TripRequest): GeneratedItinerary {
  const dates = dateRange(
    trip.startDate.toISOString().slice(0, 10),
    trip.endDate.toISOString().slice(0, 10),
  );
  const travelers = Math.max(1, trip.adults + trip.children + trip.babies);
  const total = trip.budgetAmount * travelers;
  const interests = JSON.parse(trip.interests || "[]") as string[];
  const interestLabels = interests
    .map((slug) => INTERESTS.find((interest) => interest.slug === slug)?.label ?? slug)
    .join(", ");
  const rhythm = RHYTHMS.find((item) => item.id === trip.rhythm)?.label ?? "Équilibré";
  const city = trip.destination.split(",")[0]?.trim() || trip.destination;

  const days: ItineraryDay[] = dates.map((date, index) => {
    const morning = MORNINGS[index % MORNINGS.length];
    const afternoon = AFTERNOONS[(index + 2) % AFTERNOONS.length];
    const evening = EVENINGS[(index + 1) % EVENINGS.length];
    const themeList = [
      "Arrivée & premiers pas",
      "La ville côté local",
      "Grand air & pauses",
      "Culture sans overdose",
      "Food & flânerie",
      "Pépites et coucher de soleil",
      "Dernier tour, déjà",
    ];
    const theme =
      index === dates.length - 1 ? "Dernier tour, déjà" : themeList[index % themeList.length];

    const morningActivities: Activity[] = [
      activity(
        morning.title.replace("{city}", city),
        morning.description.replaceAll("{city}", city),
        "1 h 30",
        index === 0 ? "Gratuit" : "5–12 €",
        morning.area,
        morning.tip,
      ),
    ];
    const afternoonActivities: Activity[] = [
      activity(
        afternoon.title.replace("{city}", city),
        afternoon.description.replaceAll("{city}", city),
        "2 h",
        afternoon.title.includes("Atelier") ? "25–40 €" : "Gratuit–15 €",
        afternoon.area,
        afternoon.tip,
      ),
    ];
    if (trip.rhythm === "a-fond") {
      morningActivities.push(
        activity(
          "Deuxième pépite du matin",
          `Juste avant midi, enchaîne avec un détour par le quartier voisin de ${city}. C'est court, ça se fait à pied et ça évite de revenir sur ses pas plus tard.`,
          "45 min",
          "Gratuit",
          "Quartier voisin",
        ),
      );
      afternoonActivities.push(
        activity(
          "Le spot bonus",
          `Un dernier arrêt dans une adresse que les guides oublient : librairie, galerie ou jardin caché de ${city}. Tu repartiras avec l'impression d'avoir eu une journée de plus.`,
          "40 min",
          "Gratuit",
          "Centre-ville",
        ),
      );
    }

    const eveningActivities: Activity[] = [
      activity(
        evening.title.replace("{city}", city),
        evening.description.replaceAll("{city}", city),
        "2 h 30",
        "20–35 €",
        evening.area,
        evening.tip,
      ),
    ];

    return {
      date,
      theme,
      morning: { activities: morningActivities },
      afternoon: { activities: afternoonActivities },
      evening: { activities: eveningActivities },
      ...(index === 0
        ? {
            tip: `Le premier jour, ne surcharge rien : le vrai luxe c'est de prendre le pouls de ${city} sans courir après un programme.`,
            transport:
              "Depuis l'aéroport ou la gare, privilégie les transports en commun : c'est souvent deux fois moins cher qu'un taxi.",
          }
        : {}),
      ...(trip.children > 0 || trip.babies > 0
        ? {
            tip: "Avec les petits, garde une marge de 30 minutes entre deux activités et repère un parc ou une aire de jeu sur la route.",
          }
        : {}),
    };
  });

  const budget = {
    accommodation: Math.round(total * 0.42),
    food: Math.round(total * 0.3),
    activities: Math.round(total * 0.18),
    transport: Math.round(total * 0.1),
    get total() {
      return this.accommodation + this.food + this.activities + this.transport;
    },
    get perPerson() {
      return Math.round(this.total / travelers);
    },
    currency: "EUR" as const,
  };

  return {
    summary: `${dates.length} jours à ${city}, pensés pour un rythme ${rhythm.toLowerCase()}${interestLabels ? ` et des envies de ${interestLabels.toLowerCase()}` : ""}. On a mixé les incontournables, les pauses qui sauvent une journée et quelques adresses qui ne ressemblent pas à des pièges à touristes. Le programme reste assez souple pour que tu puisses dire « finalement, on reste là » sans culpabiliser. ${seasonFor(dates[0]) === "été" ? "En été, on décale les grosses visites tôt le matin et on garde les après-midis pour l'eau et l'ombre." : "La saison est parfaite pour marcher : prévois quand même une couche de plus pour le soir."}`,
    days,
    restaurants: RESTAURANTS.map((restaurant, index) => ({
      name: `${["Le Comptoir du Coin", "Chez Mémé", "La Terrasse", "Le Petit Marché", "Casa Verde", "Café Soleil"][index] ?? `Adresse ${index + 1}`} — ${city}`,
      cuisine: restaurant.cuisine,
      area:
        [
          "Centre historique",
          "Quartier local",
          "Vieux port",
          "Marché central",
          "Quartier créatif",
          "Centre-ville",
        ][index] ?? "Centre-ville",
      priceRange: restaurant.priceRange,
      why: restaurant.why,
    })),
    budget: {
      accommodation: budget.accommodation,
      food: budget.food,
      activities: budget.activities,
      transport: budget.transport,
      total: budget.total,
      perPerson: budget.perPerson,
      currency: "EUR",
    },
    practicalTips: {
      weather: `${formatDateFr(dates[0], "short")} → ${formatDateFr(dates[dates.length - 1], "short")} : prévois une couche légère pour le soir et vérifie la météo 48 h avant. En cas de pluie, garde le musée et les halles couvertes en plan B.`,
      transport: `À ${city}, les transports en commun suffisent pour l'essentiel. Prends un pass si tu restes plusieurs jours, et garde les trajets longs pour les heures creuses.`,
      safety:
        "Les zones touristiques attirent les pickpockets : sac fermé devant toi, téléphone rangé dans les transports bondés. Rien de dramatique, juste des réflexes.",
      etiquette:
        "Un « bonjour » et un sourire ouvrent plus de portes qu'un pourboire. Demande avant de photographier les gens, et goûte au moins une spécialité locale sans négocier le prix.",
    },
    packingHints: [
      "Une gourde : les fontaines sont nombreuses et l'eau du robinet est potable dans la plupart des zones.",
      "Des baskets déjà faites : tu marcheras plus que prévu, c'est une loi universelle.",
      "Une petite veste pour le soir et un anti-moustique si tu sors de la ville.",
      "Un sac à dos compact pour les journées, avec de la place pour les souvenirs.",
    ],
  };
}
