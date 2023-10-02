import type { DailyNotePostApiObject } from "~/apiobject/daily.apiobject";
import { faker } from "@faker-js/faker";
import { PseFormationTestPage } from "~/tests/e2e/page/PseFormationTestPage";

export class NewDailyNoteTestPage extends PseFormationTestPage {

  async visit() {
    await this.page.goto(`/pse/${this.pseFormation.id}/students/${this.student.id}/daily/new`)
  }

  async fillForm() {
    const newNote = this.createDailyNoteApiObject()
    await this.textbox(/title/i).fill(newNote.title)
    await this.textbox(/content/i).fill(newNote.content)
    await this.button(/submit/i).click()
  }

  async submitForm() {
    await this.expectPageToHaveURL(new RegExp(`/pse/${this.pseFormation.id}/students/${this.student.id}/daily/.*`))
  }

  private createDailyNoteApiObject() {
    const dailyNoteApiObject: DailyNotePostApiObject = {
      title: faker.lorem.words(3),
      content: faker.lorem.paragraphs(3),
    }
    return dailyNoteApiObject;
  }

}

