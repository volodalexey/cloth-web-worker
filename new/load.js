class Load {

  static getText(url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw Error(response);
        }
        return response.text();
      })
      .catch(err => {
        console.error(err);
      });
  }

}