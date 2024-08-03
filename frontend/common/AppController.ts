import AppContext from "./app-context";

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
}

export default AppController;