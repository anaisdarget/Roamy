import "server-only";
import path from "node:path";
import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { TripRequest } from "@prisma/client";
import type { StoredItinerary } from "@/lib/schemas/itinerary";
import { INTERESTS, getPlan } from "@/lib/config/site";
import { formatDateFr, formatDateRange, tripLength } from "@/lib/utils/date";

Font.register({
  family: "Anton",
  src: path.join(process.cwd(), "public", "fonts", "Anton-Regular.ttf"),
});

const C = {
  prune: "#4A0F2E",
  framboise: "#D6336C",
  orange: "#FA7443",
  butter: "#FFE99A",
  sun: "#FFD93B",
  cream: "#FFF9F2",
  warm: "#FFF6E0",
  blush: "#FFE0EA",
  rose: "#FFE8EF",
  mint: "#BFEBE3",
};

const s = StyleSheet.create({
  page: {
    backgroundColor: C.cream,
    color: C.prune,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.45,
    paddingTop: 36,
    paddingBottom: 44,
    paddingHorizontal: 38,
  },
  cover: {
    backgroundColor: C.framboise,
    color: "#FFFFFF",
    padding: 46,
    justifyContent: "space-between",
  },
  brandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { fontFamily: "Anton", fontSize: 30, color: "#FFFFFF", letterSpacing: 0.5 },
  brandSun: { fontFamily: "Anton", fontSize: 20, color: C.sun },
  kicker: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: C.sun,
    marginBottom: 10,
    fontFamily: "Helvetica-Bold",
  },
  coverTitle: {
    fontFamily: "Anton",
    fontSize: 52,
    lineHeight: 0.98,
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  coverSub: { fontSize: 12, color: C.blush, marginTop: 12 },
  coverMeta: { flexDirection: "row", gap: 10, marginTop: 26, flexWrap: "wrap" },
  coverPill: {
    backgroundColor: C.sun,
    color: C.prune,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  summaryBox: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 18,
    padding: 16,
    marginTop: 24,
  },
  summaryText: { color: "#FFFFFF", fontSize: 10, lineHeight: 1.55 },
  coverFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  circle: { width: 90, height: 90, borderRadius: 45, backgroundColor: C.orange, opacity: 0.8 },
  circleSmall: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.butter, opacity: 0.9 },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 2,
    borderBottomColor: C.blush,
    paddingBottom: 10,
    marginBottom: 14,
  },
  pageHeaderBrand: { fontFamily: "Anton", fontSize: 16, color: C.framboise },
  pageHeaderMeta: { fontSize: 7.5, color: C.framboise, fontFamily: "Helvetica-Bold" },
  dayBadge: {
    backgroundColor: C.orange,
    color: "#FFFFFF",
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 14,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    alignSelf: "flex-start",
    marginBottom: 7,
  },
  dayTitle: { fontFamily: "Anton", fontSize: 26, lineHeight: 1, textTransform: "uppercase" },
  dayDate: { fontSize: 9, color: C.framboise, fontFamily: "Helvetica-Bold", marginTop: 5 },
  period: { marginTop: 14 },
  periodLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: C.framboise,
    marginBottom: 5,
  },
  activity: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 11,
    marginBottom: 6,
    borderLeftWidth: 4,
    borderLeftColor: C.orange,
  },
  activityTitle: { fontFamily: "Helvetica-Bold", fontSize: 9.5, marginBottom: 3 },
  activityDesc: { fontSize: 8.6, color: "#5c3346", lineHeight: 1.45 },
  activityMeta: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
    fontSize: 7.2,
    color: C.framboise,
    fontFamily: "Helvetica-Bold",
  },
  tip: {
    backgroundColor: C.butter,
    borderRadius: 10,
    padding: 9,
    marginTop: 8,
    fontSize: 8.2,
  },
  transport: {
    backgroundColor: C.rose,
    borderRadius: 10,
    padding: 9,
    marginTop: 6,
    fontSize: 8.2,
  },
  sectionTitle: { fontFamily: "Anton", fontSize: 24, textTransform: "uppercase", marginBottom: 12 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 14, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { fontSize: 8.5, color: "#6d3d52" },
  value: { fontSize: 8.5, fontFamily: "Helvetica-Bold" },
  restaurantName: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  restaurantMeta: { fontSize: 8, color: C.framboise, fontFamily: "Helvetica-Bold", marginTop: 1 },
  restaurantWhy: { fontSize: 8.4, marginTop: 3, color: "#5c3346" },
  bullet: { flexDirection: "row", gap: 7, marginBottom: 4 },
  bulletDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.orange, marginTop: 4 },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 38,
    right: 38,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: "#8b6a78",
    borderTopWidth: 1,
    borderTopColor: C.blush,
    paddingTop: 6,
  },
});

function periods(day: StoredItinerary["days"][number]) {
  return [
    { key: "morning", label: "Matin", data: day.morning },
    { key: "afternoon", label: "Après-midi", data: day.afternoon },
    { key: "evening", label: "Soir", data: day.evening },
  ] as const;
}

export function ItineraryPdfDocument({
  trip,
  itinerary,
}: {
  trip: TripRequest;
  itinerary: StoredItinerary;
}) {
  const startISO = trip.startDate.toISOString().slice(0, 10);
  const endISO = trip.endDate.toISOString().slice(0, 10);
  const travelers = trip.adults + trip.children + trip.babies;
  const plan = getPlan(trip.plan);
  const interests = (JSON.parse(trip.interests || "[]") as string[])
    .map((slug) => INTERESTS.find((item) => item.slug === slug)?.label ?? slug)
    .join(" · ");
  const totalBudget = itinerary.budget.total;
  const budgetRows = [
    { label: "Hébergement", value: itinerary.budget.accommodation, color: C.framboise },
    { label: "Food & boissons", value: itinerary.budget.food, color: C.orange },
    { label: "Activités", value: itinerary.budget.activities, color: C.sun },
    { label: "Transports", value: itinerary.budget.transport, color: C.mint },
  ];

  return (
    <Document
      title={`Roadbook ${trip.destination} — Roamy`}
      author="Roamy"
      subject={itinerary.summary}
      creator="Roamy"
    >
      <Page size="A4" style={[s.page, s.cover]}>
        <View style={s.brandRow}>
          <Text style={s.brand}>roamy</Text>
          <Text style={s.brandSun}>☀</Text>
        </View>

        <View>
          <Text style={s.kicker}>Roadbook sur mesure · {plan.name}</Text>
          <Text style={s.coverTitle}>{trip.destination}</Text>
          <Text style={s.coverSub}>
            {formatDateRange(startISO, endISO)} · {tripLength(startISO, endISO)} jours · {travelers}{" "}
            voyageur{travelers > 1 ? "s" : ""}
          </Text>
          <View style={s.coverMeta}>
            <Text style={s.coverPill}>{formatDateRange(startISO, endISO)}</Text>
            <Text style={s.coverPill}>
              {travelers} voyageur{travelers > 1 ? "s" : ""}
            </Text>
            <Text style={s.coverPill}>{trip.budgetAmount} € / pers</Text>
            {interests ? <Text style={s.coverPill}>{interests}</Text> : null}
          </View>
          <View style={s.summaryBox}>
            <Text style={s.summaryText}>{itinerary.summary}</Text>
          </View>
        </View>

        <View style={s.coverFooter}>
          <View>
            <Text style={{ fontSize: 9, color: C.blush }}>Préparé pour {trip.firstName}</Text>
            <Text style={{ fontSize: 8, color: C.blush, marginTop: 4 }}>
              Généré par Roamy · à vérifier avant réservation
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={s.circleSmall} />
            <View style={s.circle} />
          </View>
        </View>
      </Page>

      {itinerary.days.map((day, index) => (
        <Page key={day.date} size="A4" style={s.page} wrap>
          <View style={s.pageHeader} fixed>
            <Text style={s.pageHeaderBrand}>roamy · {trip.destination}</Text>
            <Text style={s.pageHeaderMeta}>
              {formatDateRange(startISO, endISO)} · {plan.name}
            </Text>
          </View>

          <Text style={s.dayBadge}>JOUR {index + 1}</Text>
          <Text style={s.dayTitle}>{day.theme}</Text>
          <Text style={s.dayDate}>{formatDateFr(day.date, "day")}</Text>

          {periods(day).map((period) => (
            <View key={period.key} style={s.period} wrap>
              <Text style={s.periodLabel}>{period.label}</Text>
              {period.data.activities.map((item, activityIndex) => (
                <View key={`${period.key}-${activityIndex}`} style={s.activity} wrap={false}>
                  <Text style={s.activityTitle}>{item.title}</Text>
                  <Text style={s.activityDesc}>{item.description}</Text>
                  <View style={s.activityMeta}>
                    <Text>{item.duration}</Text>
                    <Text>{item.cost}</Text>
                    <Text>{item.area}</Text>
                  </View>
                  {item.tip ? (
                    <Text style={{ fontSize: 7.5, color: "#8b3d5a", marginTop: 3 }}>
                      Astuce : {item.tip}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          ))}

          {day.tip ? <Text style={s.tip}>Astuce Roamy : {day.tip}</Text> : null}
          {day.transport ? <Text style={s.transport}>Transport : {day.transport}</Text> : null}

          <View style={s.footer} fixed>
            <Text>Roamy · roadbook sur mesure</Text>
            <Text>Page {index + 2}</Text>
          </View>
        </Page>
      ))}

      <Page size="A4" style={s.page} wrap>
        <View style={s.pageHeader} fixed>
          <Text style={s.pageHeaderBrand}>roamy · le carnet pratique</Text>
          <Text style={s.pageHeaderMeta}>{trip.destination}</Text>
        </View>

        <Text style={s.sectionTitle}>Nos tables repérées</Text>
        {itinerary.restaurants.map((restaurant) => (
          <View key={restaurant.name} style={s.card} wrap={false}>
            <View style={s.row}>
              <Text style={s.restaurantName}>{restaurant.name}</Text>
              <Text style={s.value}>{restaurant.priceRange}</Text>
            </View>
            <Text style={s.restaurantMeta}>
              {restaurant.cuisine} · {restaurant.area}
            </Text>
            <Text style={s.restaurantWhy}>{restaurant.why}</Text>
          </View>
        ))}

        <View break />
        <Text style={s.sectionTitle}>Budget estimé</Text>
        <View style={s.card}>
          {budgetRows.map((row) => (
            <View key={row.label} style={s.row}>
              <Text style={s.label}>{row.label}</Text>
              <Text style={s.value}>
                {row.value} € · {totalBudget > 0 ? Math.round((row.value / totalBudget) * 100) : 0}{" "}
                %
              </Text>
            </View>
          ))}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: C.blush,
              marginTop: 6,
              paddingTop: 8,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 11 }}>Total groupe</Text>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 11 }}>
              {itinerary.budget.total} €
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
            <Text style={s.label}>Soit par personne</Text>
            <Text style={s.value}>{itinerary.budget.perPerson} €</Text>
          </View>
          <Text style={{ fontSize: 7.5, color: "#8b6a78", marginTop: 8 }}>
            Estimation hors vols internationaux, calculée au moment de la génération.
          </Text>
        </View>

        <Text style={s.sectionTitle}>Les bons réflexes</Text>
        {Object.entries(itinerary.practicalTips).map(([key, value]) => (
          <View key={key} style={s.card} wrap={false}>
            <Text
              style={{
                fontFamily: "Helvetica-Bold",
                fontSize: 9,
                textTransform: "capitalize",
                marginBottom: 3,
              }}
            >
              {key === "weather"
                ? "Météo"
                : key === "transport"
                  ? "Transports"
                  : key === "safety"
                    ? "Sécurité"
                    : "Us et coutumes"}
            </Text>
            <Text style={s.activityDesc}>{value}</Text>
          </View>
        ))}

        <View style={{ backgroundColor: C.butter, borderRadius: 14, padding: 14, marginTop: 8 }}>
          <Text
            style={{
              fontFamily: "Anton",
              fontSize: 16,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Dans ta valise
          </Text>
          {itinerary.packingHints.map((hint) => (
            <View key={hint} style={s.bullet}>
              <View style={s.bulletDot} />
              <Text style={{ fontSize: 8.5, flex: 1 }}>{hint}</Text>
            </View>
          ))}
        </View>

        <View style={{ backgroundColor: C.blush, borderRadius: 12, padding: 12, marginTop: 14 }}>
          <Text style={{ fontSize: 8, color: "#6d3d52", lineHeight: 1.5 }}>
            {itinerary.disclaimer}
          </Text>
        </View>

        <View style={s.footer} fixed>
          <Text>Roamy · {trip.destination}</Text>
          <Text>Page {itinerary.days.length + 2}</Text>
        </View>
      </Page>
    </Document>
  );
}
