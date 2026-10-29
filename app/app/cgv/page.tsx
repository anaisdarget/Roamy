import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Les conditions de vente des roadbooks Roamy.",
};

export default function CgvPage() {
  return (
    <LegalPage
      title="Conditions générales de vente"
      subtitle="Les règles du jeu quand tu commandes un roadbook Roamy. Version de démonstration à compléter."
      updated="29 octobre 2026"
      sections={[
        {
          id: "objet",
          title: "Objet",
          paragraphs: [
            "Les présentes conditions régissent la vente de roadbooks de voyage personnalisés générés par intelligence artificielle, accessibles en version numérique (email + PDF).",
            "La commande implique l'acceptation sans réserve des présentes conditions.",
          ],
        },
        {
          id: "prix",
          title: "Prix et paiement",
          paragraphs: [
            "Les prix sont indiqués en euros, toutes taxes comprises. Deux formules sont proposées : Essentiel et Premium, dont les tarifs figurent sur la page Tarifs au moment de la commande.",
            "Le paiement est réalisé une seule fois, par carte bancaire ou via Apple Pay / Google Pay, par l'intermédiaire de Stripe. Aucun abonnement n'est souscrit.",
          ],
          bullets: [
            "Paiement sécurisé : les données bancaires ne transitent jamais par nos serveurs.",
            "Les codes promotionnels sont appliqués au moment du paiement, selon disponibilité.",
            "Toute commande est ferme dès validation du paiement.",
          ],
        },
        {
          id: "livraison",
          title: "Livraison du roadbook",
          paragraphs: [
            "Le roadbook est généré après confirmation du paiement, généralement en quelques minutes. Il est envoyé à l'adresse email indiquée lors du questionnaire et reste accessible depuis l'espace Mes voyages.",
            "En cas d'échec technique, Roamy relance automatiquement la génération. Si le problème persiste, le support peut relancer la commande ou procéder à un remboursement.",
          ],
        },
        {
          id: "retractation",
          title: "Droit de rétractation",
          paragraphs: [
            "Le roadbook est un contenu numérique personnalisé fourni immédiatement. Conformément à la réglementation applicable, le client reconnaît que l'exécution commence dès la validation du paiement et renonce expressément à son droit de rétractation, sauf disposition légale impérative contraire. À COMPLÉTER avec un juriste.",
          ],
        },
        {
          id: "garanties",
          title: "Garanties et réclamations",
          paragraphs: [
            "Roamy met tout en œuvre pour fournir un itinéraire cohérent et utile. Les informations (prix, horaires, disponibilités) sont des estimations et ne constituent pas une garantie de disponibilité.",
            "Toute réclamation peut être adressée à bonjour@roamy.travel dans un délai de 14 jours après réception. Nous répondons sous 48 heures ouvrées.",
          ],
        },
        {
          id: "donnees",
          title: "Données personnelles",
          paragraphs: [
            "Le traitement des données est décrit dans la politique de confidentialité. Tu peux demander la suppression de tes données à tout moment.",
          ],
        },
        {
          id: "droit",
          title: "Droit applicable",
          paragraphs: [
            "Les présentes conditions sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À COMPLÉTER : tribunal compétent, médiateur de la consommation.",
          ],
        },
      ]}
    />
  );
}
