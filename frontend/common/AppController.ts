import { Bike } from "@/models/Bike";
import AppContext from "./app-context";
import { getInternal } from "./http-utils";
import { sleep } from "./utils";
import { getBikes } from "./data-utils";

class AppController {
  private _appContext: AppContext;

  constructor(appContext: AppContext) {
      this._appContext = appContext;
    }

  get appContext(): AppContext {
    return this._appContext;
  }

  public getEmail(): string  {
    const result = this._appContext.getEmail();
    if (result == null) {
      return '';
    }
    return result;
  }

  public getJwtToken(): string | null {
    return this._appContext.getJwtToken();
  }

  public getJwtTokenPromise(): Promise<string | null> {
    return this._appContext.getJwtTokenPromise();
  }

  getBikes = async (session: any, username: string): Promise<Bike[] | null> => {
    const result =  getBikes(session, username);
    console.log('get bikes result: ', result);
    return result;
  }
}

export default AppController;