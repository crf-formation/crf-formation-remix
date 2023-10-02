import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import type { TestProps } from "~/tests/playwright-utils";
import { getFormationContext } from "~/tests/playwright-utils";
import { TestPage } from "~/tests/e2e/page/TestPage";

/**
 * Abstract class to test pages that requires authentication and a pse formation.
 */
export abstract class PseFormationTestPage extends TestPage {
  private _pseFormation: PseFormationApiObject | null = null;
  private _student: UserApiObject | null = null;
  private _user: UserApiObject | null = null;
  private props: TestProps;

  constructor(props: TestProps) {
    super(props.page);

    this.props = props;
  }

  protected get user(): UserApiObject {
    if (!this._user) {
      throw new Error("Test not setup yet: missing user");
    }
    return this._user;
  }

  protected get student(): UserApiObject {
    if (!this._student) {
      throw new Error("Test not setup yet: missing student");
    }
    return this._student;
  }

  protected get pseFormation(): PseFormationApiObject {
    if (!this._pseFormation) {
      throw new Error("Test not setup yet: missing pseFormation");
    }
    return this._pseFormation;
  }

  public async setupFormation() {
    const {
      pseFormation,
      student,
      user
    } = await getFormationContext({ login: this.props.login, getPseFormation: this.props.getPseFormation });

    this._pseFormation = pseFormation;
    this._student = student;
    this._user = user;
  }

}