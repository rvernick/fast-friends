
class AppContext {
  private _jwtToken: string;
  constructor() {};

  public set jwtToken(token: string) {
    this._jwtToken = token;
  }

  baseUrl() {
    return 'http://localhost:3000/';
  }

  isLoggedIn() {
    return this._jwtToken != null;
  }
};

export default AppContext;