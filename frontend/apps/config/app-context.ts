
class AppContext {
  private _jwtToken: string;
  private _isLoggedInWatcher;
  constructor() {

  };

  public set jwtToken(token: string) {
    this._jwtToken = token;
    this._isLoggedInWatcher(this.isLoggedIn());
  }

  baseUrl() {
    return 'http://localhost:3000/';
  }

  isLoggedIn() {
    console.log('isLogged in: ' + this._jwtToken);
    console.log('isLogged in: ' + this._jwtToken != null);
    return this._jwtToken != null;
  }

  isLoggedInWatcher(fuct) {
    this._isLoggedInWatcher = fuct;
  }
};

export default AppContext;