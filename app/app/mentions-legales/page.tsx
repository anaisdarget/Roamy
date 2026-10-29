import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Informations légales de Roamy.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      subtitle="Qui est derrière Roamy, comment nous joindre et qui héberge ce site."
      updated="29 octobre 2026"
      sections={[
        {
          id: "editeur",
          title: "Éditeur du site",
          paragraphs: [
            "Roamy est un service de planification de voyages assistée par intelligence artificielle.",
            "Raison sociale : Roamy SAS — À COMPLÉTER. Capital social : À COMPLÉTER. Siège social : À COMPLÉTER. RCS : À COMPLÉTER. Numéro de TVA intracommunautaire : À COMPLÉTER.",
          ],
        },
        {
          id: "publication",
          title: "Responsable de publication",
          paragraphs: [
            "Responsable de la publication : À COMPLÉTER (nom, prénom, qualité). Contact : bonjour@roamy.travel.",
          ],
        },
        {
          id: "hebergeur",
          title: "Hébergement",
          paragraphs: [
            "Le site est hébergé par : À COMPLÉTER (nom, adresse, téléphone, site web).",
            "Base de données et emails transactionnels : prestataires À COMPLÉTER (région d'hébergement, garanties).",
          ],
        },
        {
          id: "propriete",
          title: "Propriété intellectuelle",
          paragraphs: [
            "L'ensemble des contenus du site (textes, identité visuelle, illustrations, interfaces) est protégé par le droit d'auteur. Toute reproduction sans autorisation écrite est interdite, sauf usage personnel et non commercial.",
            "Les photographies d'illustration proviennent de banques d'images libres ou de sources créditées. Crédits : Wikimedia Commons (Plaza de España, Calanque de Sugiton), Unsplash (road trip). Les visuels de démonstration peuvent être remplacés avant mise en production.",
          ],
        },
        {
          id: "responsabilite",
          title: "Responsabilité",
          paragraphs: [
            "Roamy fournit des recommandations et des estimations. Les prix, horaires, disponibilités et conditions d'accès doivent être vérifiés auprès des prestataires avant toute réservation. Roamy n'est pas une agence de voyages et ne réalise aucune réservation en ton nom.",
          ],
        },
        {
          id: "contact",
          title: "Contact",
          paragraphs: [
            "Pour toute question : bonjour@roamy.travel. Pour les demandes relatives aux données personnelles, voir la page Confidentialité.",
          ],
        },
      ]}
    />
  );
}
