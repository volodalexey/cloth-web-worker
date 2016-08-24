function send(method, url, responseType) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.__url = url;
    xhr.open(method, url, true);
    if (responseType) {
      xhr.responseType = responseType;
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          var result;
          if (responseType) {
            result = xhr.response
          } else {
            result = xhr.responseText
          }
          resolve(result);
        } else {
          reject(xhr);
        }
      }
    };
    xhr.send();
  })
}