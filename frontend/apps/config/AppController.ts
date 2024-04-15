import AppContext from "./app-context";


class AppController {
  _appContext: AppContext;
  _baseUrl: string;


  constructor(context: AppContext) {
    this._appContext = context;
    this._baseUrl = context.baseUrl();
  }

  public get baseUrl() {
    return this._baseUrl;
  }

  public get appContext() {
    return this._appContext;
  }

  public get isLoggedIn() {
    return this._appContext.isLoggedIn;
  }
}

export default AppController;