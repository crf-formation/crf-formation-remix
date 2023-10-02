import { expect, test } from "~/tests/playwright-utils"

test('Test root error boundary caught', async ({ page }) => {
  await page.goto('/does-not-exist')

  await expect(page.getByText(/Oops! La page demandée n'a pas été trouvée./i)).toBeVisible()
})