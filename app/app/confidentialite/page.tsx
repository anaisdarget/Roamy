import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment Roamy utilise et protège tes données personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      subtitle="Quelles données on garde, pourquoi, combien de temps, et comment demander leur suppression."
      updated="29 octobre 2026"
      sections={[
        {
          id: "responsable",
          title: "Responsable du traitement",
          paragraphs: [
            "Le responsable du traitement est Roamy SAS — À COMPLÉTER (adresse, RCS). Contact données personnelles : bonjour@roamy.travel.",
          ],
        },
        {
          id: "donnees",
          title: "Données collectées",
          paragraphs: [
            "Nous collectons uniquement les données nécessaires à la génération et à l'envoi de ton roadbook :",
          ],
          bullets: [
            "Identité : prénom, adresse email.",
            "Voyage : destination, dates, composition du groupe, budget, envies, rythme, préférences alimentaires, hébergement, transport et remarques libres.",
            "Commande : statut, identifiant de paiement Stripe (aucune donnée de carte n'est stockée par Roamy), date de commande.",
            "Technique : logs serveur minimaux (adresse IP tronquée pour la limitation de débit, horodatage), sans profilage publicitaire.",
          ],
        },
        {
          id: "finalites",
          title: "Finalités et base légale",
          paragraphs: [
            "Tes données servent à exécuter le contrat (générer et t'envoyer ton itinéraire), à répondre à tes demandes de support, à respecter nos obligations comptables et à lutter contre les abus.",
            "La base légale est l'exécution du contrat, ton consentement explicite (case cochée avant l'envoi) et notre intérêt légitime à sécuriser le service.",
          ],
        },
        {
          id: "destinataires",
          title: "Destinataires et sous-traitants",
          paragraphs: [
            "Tes réponses sont transmises à notre prestataire d'intelligence artificielle pour générer l'itinéraire, à Stripe pour le paiement et à Resend pour l'envoi de l'email. Ces prestataires agissent sur instruction et selon leurs garanties contractuelles. À COMPLÉTER : liste nominative, pays d'hébergement, clauses de transfert.",
          ],
        },
        {
          id: "conservation",
          title: "Durée de conservation",
          paragraphs: [
            "Les données de commande sont conservées 24 mois à compter du dernier contact, sauf obligation légale de conservation plus longue (comptabilité : 10 ans). Les jetons de connexion magic link expirent après 20 minutes. Les logs techniques sont conservés 30 jours maximum. À COMPLÉTER selon la politique réelle.",
          ],
        },
        {
          id: "droits",
          title: "Tes droits",
          paragraphs: [
            "Conformément au RGPD, tu disposes d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité. Tu peux aussi retirer ton consentement à tout moment.",
            "Pour exercer ces droits, écris à bonjour@roamy.travel. Nous répondons sous un mois. Tu peux également saisir la CNIL (www.cnil.fr).",
          ],
          bullets: [
            "Suppression : possible depuis l'espace Mes voyages (demande par email) ou via notre endpoint admin documenté.",
            "Opposition au marketing : aucun email marketing n'est envoyé sans consentement séparé.",
          ],
        },
        {
          id: "cookies",
          title: "Cookies",
          paragraphs: [
            "Roamy utilise uniquement des cookies strictement nécessaires : session de connexion à Mes voyages, protection contre les abus et mémorisation du brouillon de questionnaire dans le sessionStorage (effacé à la fermeture de l'onglet). Aucun cookie publicitaire ni traceur tiers n'est déposé.",
          ],
        },
        {
          id: "securite",
          title: "Sécurité",
          paragraphs: [
            "Les échanges sont chiffrés (HTTPS). Les paiements sont traités par Stripe. Les accès administrateur sont protégés par un secret. Les identifiants de commande sont non devinables et les endpoints publics sont limités en débit. Aucune donnée personnelle n'est écrite dans les logs applicatifs.",
          ],
        },
      ]}
    />
  );
}
