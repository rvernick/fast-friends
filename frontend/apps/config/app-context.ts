
class AppContext {
  private _jwtToken: string;
  private _isLoggedInWatcher;
  private _userEmail;
  constructor() {

  };

  public set email(anEmail: string) {
    this._userEmail = anEmail;
  }

  public set jwtToken(token: string) {
    this._jwtToken = token;
    this._isLoggedInWatcher(this.isLoggedIn());
  }

  baseUrl() {
    if (process.env.NODE_ENV === 'production') {
      return 'https://fast-friends-be.onrender.com/';
    }
    console.log('process.env.BASE_URL: ' + process.env.BASE_URL)
    return process.env.BASE_URL || 'http://localhost:3000/';
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