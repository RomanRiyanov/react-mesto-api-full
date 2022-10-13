const BASE_URL = 'https://api.mesto.romanriyanov.nomoredomains.icu';

export const register = (password, email) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(password, email)
    })
      .then((res) => {
        if (res.ok) return res.json();
        else return Promise.reject(`Ошибка ${res.status}`)
      })
      .then((res) => {
        return res;
      })
      .catch((error) => console.log(error));
}; 

export const clearCookie = () => {
  return fetch(`${BASE_URL}/signup`, {
      method: 'GET',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json'
      },
  })
    .then((res) => {
      if (res.ok) return res.json();
      else return Promise.reject(`Ошибка ${res.status}`)
    })
    .then((res) => {
      return res;
    })
    .catch((error) => console.log(error));
}; 

export const authorize = (password, email) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(password, email)
    })
    .then((res) => {
      if (res.ok) return res.json();
      else return Promise.reject(`Ошибка ${res.status}`)
    })
    .then((res) => {
        return res;
      })
    .catch((err) => console.log(`Ошибка: ${err}`))
}

export const getContent = (jwt) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            // "Authorization" : `Bearer ${jwt}`
        }
    })
    .then((res) => {
      if (res.ok) return res.json();
      else return Promise.reject(`Ошибка ${res.status}`)
    })
    .catch((err) => console.log(`Ошибка: ${err}`))
}