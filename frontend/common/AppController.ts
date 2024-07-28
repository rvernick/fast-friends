import AppContext from "./app-context";

class AppController {
  private _appContext: AppContext;

  constructor(appContext: AppContext) {
    this._appContext = appContext;
  }

  public getUser(appContext: AppContext): Promise<User | null> {
    return this._appContext.getUserPromise();
  }

  get appContext(): AppContext {
    return this._appContext;
  }
}

export default AppController;