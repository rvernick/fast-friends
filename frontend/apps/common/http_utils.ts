
export const baseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://fast-friends-be.onrender.com/';
  }
  console.log('process.env.BASE_URL: ' + process.env.BASE_URL)
  return process.env.BASE_URL || 'http://localhost:3000/';
}


export const post = (endpoint: string, bodyString: string) => {
  const url = baseUrl() + endpoint;
  console.log('Calling: ' + url)
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: bodyString});
};
