import { expect, test } from "@playwright/test";

test("complete funnel: landing → planner → mock payment → email → itinerary → PDF", async ({
  page,
  request,
}) => {
  const email = `e2e-${Date.now()}@example.com`;

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/ton voyage/i);
  await page.getByRole("link", { name: "Créer mon planning" }).first().click();
  await expect(page).toHaveURL(/\/planifier\?step=1/);

  await page.getByRole("combobox").fill("Barcelone");
  await page.getByRole("button", { name: /^Suivant/ }).click();
  await expect(page).toHaveURL(/step=2/);

  await page.getByRole("button", { name: "Une semaine" }).click();
  await expect(page.getByText(/jours sur place/)).toBeVisible();
  await page.getByRole("button", { name: /^Suivant/ }).click();
  await expect(page).toHaveURL(/step=3/);

  await page.getByRole("button", { name: /Confort/ }).click();
  await page.getByRole("button", { name: /^Suivant/ }).click();
  await expect(page).toHaveURL(/step=4/);

  await page.getByRole("checkbox", { name: /Plage/ }).click();
  await page.getByRole("checkbox", { name: /Food/ }).click();
  await page.getByRole("button", { name: /^Suivant/ }).click();
  await expect(page).toHaveURL(/step=5/);

  await page.getByRole("radio", { name: /Équilibré/ }).click();
  await page.getByRole("button", { name: /^Suivant/ }).click();
  await expect(page).toHaveURL(/step=6/);

  await page.getByLabel("Ton prénom").fill("Camille");
  await page.getByLabel("Ton email").fill(email);
  await page.getByRole("checkbox", { name: /J'accepte/ }).check();
  await page.getByRole("button", { name: /Créer mon planning/ }).click();

  await expect(page).toHaveURL(/\/paiement\//, { timeout: 20_000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/prêt à décoller/i);
  await page.getByRole("button", { name: /Simuler le paiement/ }).click();

  await expect(page).toHaveURL(/\/confirmation\//, { timeout: 20_000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/C'est dans ta boîte mail/i, {
    timeout: 45_000,
  });

  await expect(page.getByRole("link", { name: /Voir mon itinéraire/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Voir l'email envoyé/ })).toBeVisible();

  const emailHref = await page
    .getByRole("link", { name: /Voir l'email envoyé/ })
    .getAttribute("href");
  expect(emailHref).toBeTruthy();
  const emailPreview = await request.get(emailHref!);
  expect(emailPreview.status()).toBe(200);
  expect(await emailPreview.text()).toContain("roamy");

  await page.getByRole("link", { name: /Voir mon itinéraire/ }).click();
  await expect(page).toHaveURL(/\/itineraire\//);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/barcelone/i);
  await expect(page.locator("article[id^='jour-']")).toHaveCount(7);

  const pdfHref = await page
    .getByRole("link", { name: /Télécharger le PDF/ })
    .first()
    .getAttribute("href");
  expect(pdfHref).toBeTruthy();
  const pdf = await request.get(pdfHref!);
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");

  // Dashboard magic-link flow.
  await page.goto("/mes-voyages");
  await page.getByLabel("Ton email").fill(email);
  await page.getByRole("button", { name: /Recevoir mon lien magique/ }).click();
  const magicLink = await page
    .getByRole("link", { name: /Ouvrir mon lien de démo/ })
    .getAttribute("href");
  expect(magicLink).toBeTruthy();
  await page.goto(magicLink!);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/salut camille/i);
  await expect(page.getByText("Barcelone", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Voir le roadbook/ }).click();
  await expect(page).toHaveURL(/\/itineraire\//);
});

test("mobile smoke: landing and planner fit the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(2);

  await page.getByRole("link", { name: "Créer mon planning" }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/où est-ce/i);
  await expect(page.getByRole("button", { name: /^Suivant/ })).toBeVisible();
});
