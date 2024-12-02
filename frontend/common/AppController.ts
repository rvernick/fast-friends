import { Bike } from "@/models/Bike";
import AppContext from "./app-context";
import { getUserPreferences, sleep } from "./utils";
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

  getAllBikes = async (session: any, username: string): Promise<Bike[] | null> => {
    return getBikes(session, username);
  }

  getCurrentBikes = async (session: any, username: string): Promise<Bike[] | null> => {
    const result = await getBikes(session, username);
    console.log('get bikes result: ', result);
    if (result) {
      return result.filter(bike => bike.isRetired === false);
    }
    return result;
  }

  getUserPreferences = async (session: any): Promise<any> => {
    return getUserPreferences(session);
  }
}

export default AppController;