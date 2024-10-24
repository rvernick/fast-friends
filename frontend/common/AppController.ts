import { Bike } from "@/models/Bike";
import AppContext from "./app-context";
import { getInternal } from "./http-utils";
import { sleep } from "./utils";

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
    sleep(0.1);
    if (session === null) {
      console.log('get maintenanceItems has no context: ' + username);
      return Promise.resolve(null);
    }
    const jwtToken = await session.jwt_token;
    if (jwtToken == null) {
      console.log('get bikes has no token dying: ' + username);
      return Promise.resolve(null);
    }

    try {
      const parameters = {
        username: username,
      };
      console.log('get bikes ' +'username:'+ username);
      return getInternal('/bike/bikes', parameters, jwtToken);
    } catch(e: any) {
      console.log(e.message);
      return null;
    }
  }
}

export default AppController;