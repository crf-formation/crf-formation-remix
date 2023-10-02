import { test } from "~/tests/playwright-utils";
import { NewDailyNoteTestPage } from "~/tests/e2e/page/NewDailyNoteTestPage";

test.describe('Daily notes', () => {

  test('Users can create notes', async (
    {
      page,
      insertNewUser,
      login,
      getPseFormation,
    }) => {
    const newDailyNotePage: NewDailyNoteTestPage = new NewDailyNoteTestPage({
      page,
      insertNewUser,
      login,
      getPseFormation,
    });
    await newDailyNotePage.setupFormation();
    await newDailyNotePage.visit();
    await newDailyNotePage.fillForm();
    await newDailyNotePage.submitForm();
  })

// test('Users can edit notes', async ({ page, login }) => {
//
// })

});
