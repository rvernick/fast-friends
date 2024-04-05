
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
    console.log('env for base url is: ' + process.env.BASE_URL);
    const envdict = process.env
    for (const [key, value] of Object.entries(envdict)) {
      console.log(key + ':'+ value);
    }
    if (process.env.NODE_ENV === 'production') {
      return 'https://fast-friends-be.onrender.com/';
    }
    return process.env.BASE_URL || 'http:localhost:3000/';
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