import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import type { TripRequest } from "@prisma/client";
import type { StoredItinerary } from "@/lib/schemas/itinerary";
import { INTERESTS, formatPrice, getPlan } from "@/lib/config/site";
import { formatDateFr, formatDateRange, tripLength } from "@/lib/utils/date";

const colors = {
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

const font = "Arial, Helvetica, sans-serif";
const display = "'Arial Black', 'Helvetica Neue', Arial, sans-serif";

function truncate(text: string, max = 220): string {
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

export function ItineraryEmail({
  trip,
  itinerary,
  itineraryId,
  baseUrl,
}: {
  trip: TripRequest;
  itinerary: StoredItinerary;
  itineraryId: string;
  baseUrl: string;
}) {
  const startISO = trip.startDate.toISOString().slice(0, 10);
  const endISO = trip.endDate.toISOString().slice(0, 10);
  const travelers = trip.adults + trip.children + trip.babies;
  const plan = getPlan(trip.plan);
  const interests = (JSON.parse(trip.interests || "[]") as string[])
    .map((slug) => INTERESTS.find((item) => item.slug === slug)?.label ?? slug)
    .join(" · ");
  const pdfUrl = `${baseUrl}/api/itineraries/${itineraryId}/pdf`;
  const itineraryUrl = `${baseUrl}/itineraire/${itineraryId}`;
  const budgetRows = [
    ["Hébergement", itinerary.budget.accommodation],
    ["Food & boissons", itinerary.budget.food],
    ["Activités", itinerary.budget.activities],
    ["Transports", itinerary.budget.transport],
  ] as const;

  return (
    <Html lang="fr" dir="ltr">
      <Head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
      </Head>
      <Preview>{`Ton roadbook ${trip.destination} est prêt — ${tripLength(startISO, endISO)} jours, zéro prise de tête.`}</Preview>
      <Body
        style={{
          backgroundColor: colors.cream,
          margin: 0,
          padding: "24px 12px",
          fontFamily: font,
          color: colors.prune,
        }}
      >
        <Container style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
          <Section
            style={{
              backgroundColor: colors.framboise,
              borderRadius: "24px 24px 0 0",
              padding: "26px 28px 20px",
            }}
          >
            <Row>
              <Column>
                <Text
                  style={{
                    margin: 0,
                    fontFamily: display,
                    fontSize: 34,
                    lineHeight: "34px",
                    color: "#FFFFFF",
                    letterSpacing: "-0.5px",
                  }}
                >
                  roamy <span style={{ color: colors.sun }}>☀</span>
                </Text>
              </Column>
              <Column align="right">
                <Text
                  style={{
                    margin: 0,
                    fontSize: 10,
                    letterSpacing: "1.6px",
                    textTransform: "uppercase",
                    color: colors.butter,
                    fontWeight: 700,
                  }}
                >
                  Roadbook {plan.name}
                </Text>
              </Column>
            </Row>
            <Text
              style={{
                margin: "22px 0 4px",
                fontSize: 11,
                letterSpacing: "1.6px",
                textTransform: "uppercase",
                color: colors.butter,
                fontWeight: 700,
              }}
            >
              C&apos;est prêt, {trip.firstName} !
            </Text>
            <Heading
              style={{
                margin: "0 0 8px",
                fontFamily: display,
                fontSize: 38,
                lineHeight: "40px",
                color: "#FFFFFF",
                textTransform: "uppercase",
              }}
            >
              {trip.destination}
            </Heading>
            <Text style={{ margin: 0, fontSize: 14, lineHeight: "21px", color: colors.blush }}>
              {formatDateRange(startISO, endISO)} · {tripLength(startISO, endISO)} jours ·{" "}
              {travelers} voyageur
              {travelers > 1 ? "s" : ""}
            </Text>
            <Section style={{ marginTop: 20 }}>
              <Button
                href={pdfUrl}
                style={{
                  backgroundColor: colors.framboise,
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 800,
                  textDecoration: "none",
                  borderRadius: 999,
                  padding: "14px 22px",
                  display: "inline-block",
                }}
              >
                Télécharger le PDF complet 📄
              </Button>
            </Section>
          </Section>

          <Section style={{ backgroundColor: "#FFFFFF", padding: "24px 28px 8px" }}>
            <Img
              src={`${baseUrl}/images/hero-apero.jpg`}
              alt="Deux cocktails face au coucher de soleil"
              width="544"
              height="220"
              style={{
                width: "100%",
                height: 220,
                objectFit: "cover",
                borderRadius: 18,
                display: "block",
              }}
            />
          </Section>

          <Section style={{ backgroundColor: "#FFFFFF", padding: "18px 28px 24px" }}>
            <Row>
              <Column style={{ width: "33.33%", paddingRight: 6 }}>
                <Section
                  style={{ backgroundColor: colors.butter, borderRadius: 14, padding: "12px 14px" }}
                >
                  <Text
                    style={{
                      margin: 0,
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: colors.prune,
                      fontWeight: 700,
                    }}
                  >
                    Durée
                  </Text>
                  <Text
                    style={{
                      margin: "3px 0 0",
                      fontFamily: display,
                      fontSize: 18,
                      color: colors.prune,
                    }}
                  >
                    {tripLength(startISO, endISO)} jours
                  </Text>
                </Section>
              </Column>
              <Column style={{ width: "33.33%", padding: "0 3px" }}>
                <Section
                  style={{ backgroundColor: colors.butter, borderRadius: 14, padding: "12px 14px" }}
                >
                  <Text
                    style={{
                      margin: 0,
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: colors.prune,
                      fontWeight: 700,
                    }}
                  >
                    Équipe
                  </Text>
                  <Text
                    style={{
                      margin: "3px 0 0",
                      fontFamily: display,
                      fontSize: 18,
                      color: colors.prune,
                    }}
                  >
                    {travelers} pers.
                  </Text>
                </Section>
              </Column>
              <Column style={{ width: "33.33%", paddingLeft: 6 }}>
                <Section
                  style={{ backgroundColor: colors.butter, borderRadius: 14, padding: "12px 14px" }}
                >
                  <Text
                    style={{
                      margin: 0,
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: colors.prune,
                      fontWeight: 700,
                    }}
                  >
                    Budget
                  </Text>
                  <Text
                    style={{
                      margin: "3px 0 0",
                      fontFamily: display,
                      fontSize: 18,
                      color: colors.prune,
                    }}
                  >
                    {formatPrice(trip.budgetAmount * 100)}
                  </Text>
                </Section>
              </Column>
            </Row>
            {interests ? (
              <Text
                style={{
                  margin: "14px 0 0",
                  fontSize: 11,
                  color: colors.framboise,
                  fontWeight: 700,
                }}
              >
                Tes envies : {interests}
              </Text>
            ) : null}
            <Text
              style={{ margin: "12px 0 0", fontSize: 14, lineHeight: "22px", color: colors.prune }}
            >
              {itinerary.summary}
            </Text>
          </Section>

          <Section style={{ backgroundColor: colors.warm, padding: "24px 28px" }}>
            <Text
              style={{
                margin: "0 0 14px",
                fontFamily: display,
                fontSize: 24,
                textTransform: "uppercase",
                color: colors.prune,
              }}
            >
              Ton programme, jour par jour
            </Text>

            {itinerary.days.map((day, index) => (
              <Section
                key={day.date}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 18,
                  padding: "16px 16px 10px",
                  marginBottom: 12,
                  border: `1px solid ${colors.blush}`,
                }}
              >
                <Text
                  style={{
                    margin: 0,
                    display: "inline-block",
                    backgroundColor: colors.framboise,
                    color: "#FFFFFF",
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    borderRadius: 999,
                    padding: "4px 9px",
                  }}
                >
                  Jour {index + 1} · {formatDateFr(day.date, "short")}
                </Text>
                <Text
                  style={{
                    margin: "8px 0 2px",
                    fontFamily: display,
                    fontSize: 20,
                    lineHeight: "22px",
                    textTransform: "uppercase",
                    color: colors.prune,
                  }}
                >
                  {day.theme}
                </Text>
                {(
                  [
                    ["🌅 Matin", day.morning],
                    ["☀️ Après-midi", day.afternoon],
                    ["🌙 Soir", day.evening],
                  ] as const
                ).map(([label, period]) => (
                  <Section key={label} style={{ marginTop: 10 }}>
                    <Text
                      style={{
                        margin: 0,
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: "1.2px",
                        textTransform: "uppercase",
                        color: colors.framboise,
                      }}
                    >
                      {label}
                    </Text>
                    {period.activities.map((item, activityIndex) => (
                      <Section key={`${label}-${activityIndex}`} style={{ marginTop: 5 }}>
                        <Text
                          style={{ margin: 0, fontSize: 13, fontWeight: 800, color: colors.prune }}
                        >
                          {item.title}
                        </Text>
                        {activityIndex === 0 ? (
                          <>
                            <Text
                              style={{
                                margin: "2px 0 0",
                                fontSize: 12,
                                lineHeight: "18px",
                                color: "#6d3d52",
                              }}
                            >
                              {truncate(item.description)}
                            </Text>
                            <Text
                              style={{
                                margin: "3px 0 0",
                                fontSize: 10,
                                fontWeight: 700,
                                color: colors.framboise,
                              }}
                            >
                              {item.duration} · {item.cost} · {item.area}
                            </Text>
                          </>
                        ) : null}
                      </Section>
                    ))}
                  </Section>
                ))}
                {day.tip ? (
                  <Section
                    style={{
                      backgroundColor: colors.butter,
                      borderRadius: 12,
                      padding: "9px 11px",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{ margin: 0, fontSize: 11, lineHeight: "17px", color: colors.prune }}
                    >
                      <strong>Astuce Roamy :</strong> {day.tip}
                    </Text>
                  </Section>
                ) : null}
              </Section>
            ))}
          </Section>

          <Section style={{ backgroundColor: "#FFFFFF", padding: "24px 28px" }}>
            <Text
              style={{
                margin: "0 0 10px",
                fontFamily: display,
                fontSize: 22,
                textTransform: "uppercase",
                color: colors.prune,
              }}
            >
              Nos tables repérées
            </Text>
            {itinerary.restaurants.slice(0, 6).map((restaurant) => (
              <Section
                key={restaurant.name}
                style={{ borderBottom: `1px solid ${colors.blush}`, padding: "7px 0" }}
              >
                <Row>
                  <Column>
                    <Text style={{ margin: 0, fontSize: 12, fontWeight: 800, color: colors.prune }}>
                      {restaurant.name}
                    </Text>
                    <Text
                      style={{
                        margin: "1px 0 0",
                        fontSize: 10,
                        color: colors.framboise,
                        fontWeight: 700,
                      }}
                    >
                      {restaurant.cuisine} · {restaurant.area}
                    </Text>
                  </Column>
                  <Column align="right">
                    <Text style={{ margin: 0, fontSize: 11, fontWeight: 800, color: colors.prune }}>
                      {restaurant.priceRange}
                    </Text>
                  </Column>
                </Row>
              </Section>
            ))}
          </Section>

          <Section style={{ backgroundColor: colors.rose, padding: "24px 28px" }}>
            <Text
              style={{
                margin: "0 0 10px",
                fontFamily: display,
                fontSize: 22,
                textTransform: "uppercase",
                color: colors.prune,
              }}
            >
              Le budget en clair
            </Text>
            {budgetRows.map(([label, value]) => (
              <Row key={label} style={{ marginBottom: 6 }}>
                <Column>
                  <Text style={{ margin: 0, fontSize: 12, color: colors.prune }}>{label}</Text>
                </Column>
                <Column align="right">
                  <Text style={{ margin: 0, fontSize: 12, fontWeight: 800, color: colors.prune }}>
                    {formatPrice(value * 100)}
                  </Text>
                </Column>
              </Row>
            ))}
            <Hr style={{ borderColor: colors.framboise, opacity: 0.25, margin: "10px 0" }} />
            <Row>
              <Column>
                <Text style={{ margin: 0, fontSize: 13, fontWeight: 800, color: colors.prune }}>
                  Total groupe
                </Text>
              </Column>
              <Column align="right">
                <Text
                  style={{ margin: 0, fontFamily: display, fontSize: 20, color: colors.framboise }}
                >
                  {formatPrice(itinerary.budget.total * 100)}
                </Text>
              </Column>
            </Row>
            <Text style={{ margin: "6px 0 0", fontSize: 11, color: "#6d3d52" }}>
              Soit ~{formatPrice(itinerary.budget.perPerson * 100)} par personne, hors vols
              internationaux.
            </Text>
          </Section>

          <Section style={{ backgroundColor: "#FFFFFF", padding: "24px 28px" }}>
            <Text
              style={{
                margin: "0 0 10px",
                fontFamily: display,
                fontSize: 22,
                textTransform: "uppercase",
                color: colors.prune,
              }}
            >
              Les bons réflexes
            </Text>
            {[
              ["Météo", itinerary.practicalTips.weather],
              ["Transports", itinerary.practicalTips.transport],
              ["Sécurité", itinerary.practicalTips.safety],
              ["Us & coutumes", itinerary.practicalTips.etiquette],
            ].map(([label, value]) => (
              <Section key={label} style={{ marginBottom: 9 }}>
                <Text style={{ margin: 0, fontSize: 11, fontWeight: 800, color: colors.framboise }}>
                  {label}
                </Text>
                <Text
                  style={{
                    margin: "2px 0 0",
                    fontSize: 12,
                    lineHeight: "18px",
                    color: colors.prune,
                  }}
                >
                  {value}
                </Text>
              </Section>
            ))}
            <Section
              style={{
                backgroundColor: colors.butter,
                borderRadius: 14,
                padding: "12px 14px",
                marginTop: 14,
              }}
            >
              <Text
                style={{ margin: "0 0 5px", fontSize: 12, fontWeight: 800, color: colors.prune }}
              >
                Dans ta valise
              </Text>
              {itinerary.packingHints.map((hint) => (
                <Text
                  key={hint}
                  style={{ margin: "2px 0", fontSize: 11, lineHeight: "17px", color: colors.prune }}
                >
                  • {hint}
                </Text>
              ))}
            </Section>
          </Section>

          <Section
            style={{
              backgroundColor: colors.framboise,
              padding: "26px 28px",
              borderRadius: "0 0 24px 24px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                margin: "0 0 12px",
                fontFamily: display,
                fontSize: 24,
                lineHeight: "26px",
                color: "#FFFFFF",
                textTransform: "uppercase",
              }}
            >
              Tout ton roadbook, dans ta poche
            </Text>
            <Button
              href={pdfUrl}
              style={{
                backgroundColor: colors.framboise,
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 800,
                textDecoration: "none",
                borderRadius: 999,
                padding: "14px 24px",
                display: "inline-block",
              }}
            >
              Télécharger en PDF
            </Button>
            <Text style={{ margin: "12px 0 0", fontSize: 12, color: colors.blush }}>
              Ou ouvre la{" "}
              <Link href={itineraryUrl} style={{ color: colors.sun, textDecoration: "underline" }}>
                version en ligne
              </Link>
              .
            </Text>
          </Section>

          <Section style={{ padding: "18px 6px 4px" }}>
            <Text style={{ margin: 0, fontSize: 10, lineHeight: "15px", color: "#8b6a78" }}>
              {itinerary.disclaimer}
            </Text>
            <Text
              style={{ margin: "10px 0 0", fontSize: 10, lineHeight: "15px", color: "#8b6a78" }}
            >
              Tu as une question ? Réponds à cet email ou écris-nous à{" "}
              <Link
                href="mailto:bonjour@roamy.travel"
                style={{ color: colors.framboise, textDecoration: "underline" }}
              >
                bonjour@roamy.travel
              </Link>
              .
            </Text>
            <Text style={{ margin: "8px 0 0", fontSize: 9, color: "#a18894" }}>
              Roamy · planificateur de voyages sur mesure · Tu reçois cet email parce que tu as
              commandé un roadbook.{" "}
              <Link href={`${baseUrl}/confidentialite`} style={{ color: "#a18894" }}>
                Confidentialité
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
