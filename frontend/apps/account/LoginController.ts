

class LoginController {
  login(username: string, password: string) {
    fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
             body: JSON.stringify({
                username: username,
                password: password,
            })
        }) /*end fetch */
        .then(results => results.json())
        .then(data => { data });
  };
}

export default LoginController;