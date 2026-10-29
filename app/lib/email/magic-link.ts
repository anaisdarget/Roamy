import "server-only";
import { Resend } from "resend";
import { env } from "@/lib/config/env";

export async function sendMagicLinkEmail(email: string, url: string): Promise<boolean> {
  if (!env.RESEND_API_KEY) {
    return false;
  }

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#FFF9F2;font-family:Arial,Helvetica,sans-serif;color:#4A0F2E;padding:24px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;">
      <tr>
        <td style="background:#D6336C;padding:24px 28px;">
          <span style="font-family:'Arial Black',Arial,sans-serif;font-size:30px;color:#ffffff;">roamy <span style="color:#FFD93B;">☀</span></span>
        </td>
      </tr>
      <tr>
        <td style="padding:28px;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#D6336C;font-weight:700;">Ton accès voyage</p>
          <h1 style="margin:0 0 12px;font-family:'Arial Black',Arial,sans-serif;font-size:28px;text-transform:uppercase;line-height:1.05;color:#4A0F2E;">Retrouve tes roadbooks</h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.55;color:#4A0F2E;">Clique sur le bouton ci-dessous pour ouvrir tes voyages. Ce lien est valable 20 minutes et ne fonctionne qu'une fois.</p>
          <a href="${url}" style="display:inline-block;background:#FA7443;color:#ffffff;text-decoration:none;font-weight:800;font-size:15px;padding:14px 22px;border-radius:999px;">Ouvrir mes voyages</a>
          <p style="margin:20px 0 0;font-size:12px;line-height:1.5;color:#8B6A78;">Si tu n'es pas à l'origine de cette demande, ignore simplement cet email. Aucun mot de passe n'est nécessaire.</p>
        </td>
      </tr>
      <tr>
        <td style="background:#FFF6E0;padding:14px 28px;font-size:11px;color:#8B6A78;">Roamy · planificateur de voyages sur mesure</td>
      </tr>
    </table>
  </body>
</html>`;

  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Ton lien magique Roamy 🌞",
    html,
    tags: [{ name: "type", value: "magic-link" }],
  });

  if (error) {
    console.warn("[auth] magic link send failed", { name: error.name });
    return false;
  }
  return true;
}
