import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Roamy — ton voyage, planifié pour toi",
    short_name: "Roamy",
    description: "Ton roadbook de voyage sur mesure, jour par jour.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F2",
    theme_color: "#D6336C",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
