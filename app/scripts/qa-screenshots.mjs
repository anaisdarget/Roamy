import { chromium } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL ||= "file:./dev.db";
const prisma = new PrismaClient();
const base = "http://localhost:3000";
const out = "../design/screenshots/app";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const email = `qa-${Date.now()}@example.com`;

async function shot(name, { fullPage = true } = {}) {
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage });
  console.log("saved", name);
}

async function scrollAll() {
  await page.evaluate(async () => {
    const step = Math.max(400, window.innerHeight / 2);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
}

// Landing
await page.goto(base, { waitUntil: "networkidle" });
await shot("landing-1280");
await page.setViewportSize({ width: 375, height: 812 });
await page.goto(base, { waitUntil: "networkidle" });
await shot("landing-375");
await page.setViewportSize({ width: 768, height: 1024 });
await page.goto(base, { waitUntil: "networkidle" });
await shot("landing-768", { fullPage: false });
await page.setViewportSize({ width: 1280, height: 900 });

// Planner + funnel
await page.goto(`${base}/planifier`, { waitUntil: "networkidle" });
await page.evaluate(() => sessionStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await shot("planner-step1-1280");
await page.getByRole("combobox").fill("Barcelone");
await page.getByRole("button", { name: /^Suivant/ }).click();
await page.waitForURL(/step=2/);
await page.getByRole("button", { name: "Une semaine" }).click();
await shot("planner-step2-1280");
await page.setViewportSize({ width: 375, height: 812 });
await shot("planner-step2-375");
await page.setViewportSize({ width: 1280, height: 900 });
await page.getByRole("button", { name: /^Suivant/ }).click();
await page.waitForURL(/step=3/);
await page.getByRole("button", { name: /Confort/ }).click();
await page.getByRole("button", { name: /^Suivant/ }).click();
await page.waitForURL(/step=4/);
await page.getByRole("checkbox", { name: /Plage/ }).click();
await page.getByRole("checkbox", { name: /Food/ }).click();
await page.getByRole("button", { name: /^Suivant/ }).click();
await page.waitForURL(/step=5/);
await page.getByRole("radio", { name: /Équilibré/ }).click();
await page.getByRole("button", { name: /^Suivant/ }).click();
await page.waitForURL(/step=6/);
await page.getByLabel("Ton prénom").fill("Camille");
await page.getByLabel("Ton email").fill(email);
await page.getByRole("checkbox", { name: /J'accepte/ }).check();
await shot("planner-step6-1280");
await page.getByRole("button", { name: /Créer mon planning/ }).click();
await page.waitForURL(/paiement/, { timeout: 20000 });
await shot("payment-1280");
await page.setViewportSize({ width: 375, height: 812 });
await shot("payment-375");
await page.setViewportSize({ width: 1280, height: 900 });
await page.getByRole("button", { name: /Simuler le paiement/ }).click();
await page.waitForURL(/confirmation/, { timeout: 20000 });
await page.waitForTimeout(300);
await shot("confirmation-loading-1280");
await page
  .getByRole("heading", { level: 1 })
  .filter({ hasText: /boîte mail/i })
  .waitFor({ timeout: 45000 });
await shot("confirmation-sent-1280");

const trip = await prisma.tripRequest.findFirst({
  where: { email },
  include: { itinerary: true, emailLogs: { orderBy: { createdAt: "desc" } } },
});
const itineraryId = trip?.itinerary?.id;

// Itinerary
await page.goto(`${base}/itineraire/${itineraryId}`, { waitUntil: "networkidle" });
await scrollAll();
await shot("itinerary-1280");
await page.setViewportSize({ width: 375, height: 812 });
await page.goto(`${base}/itineraire-demo`, { waitUntil: "networkidle" });
await scrollAll();
await shot("itinerary-375");
await page.setViewportSize({ width: 1280, height: 900 });

// Email preview
if (trip?.emailLogs?.[0]?.id) {
  await page.goto(`${base}/api/emails/${trip.emailLogs[0].id}`, { waitUntil: "networkidle" });
  await page.setViewportSize({ width: 800, height: 1200 });
  await shot("email-800");
  await page.setViewportSize({ width: 1280, height: 900 });
}

// Dashboard login + logged in
await page.goto(`${base}/mes-voyages`, { waitUntil: "networkidle" });
await shot("dashboard-login-1280");
await page.getByLabel("Ton email").fill(email);
await page.getByRole("button", { name: /Recevoir mon lien magique/ }).click();
const magic = await page
  .getByRole("link", { name: /Ouvrir mon lien de démo/ })
  .getAttribute("href");
await page.goto(magic, { waitUntil: "networkidle" });
await shot("dashboard-1280");

// Legal + 404
await page.goto(`${base}/mentions-legales`, { waitUntil: "networkidle" });
await shot("legal-1280");
await page.goto(`${base}/cette-page-nexiste-pas`, { waitUntil: "networkidle" });
await shot("404-1280", { fullPage: false });

await context.close();
await browser.close();
await prisma.$disconnect();
