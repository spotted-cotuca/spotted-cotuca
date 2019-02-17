class SocialMediasDeleteRequest {
  constructor(ids) {
    this.facebookId = ids.facebook;
    this.twitterId = ids.twitter;
  }

  get handler() {
    return SocialMediasDeleteRequest.socialMediasHandler;
  }

  deleteFromFacebook() {
    return new Promise((resolve, reject) => {
      this.handler.fb.api('171419300152494_' + this.facebookId, 'delete', res => {
        if (!res || res.error || (res.code && res.code !== 200)) {
          reject(res);
          return;
        }

        resolve('deleted');
      });
    });
  }

  deleteFromTwitter() {
    return new Promise((resolve, reject) => {
      fetch(this.handler.proxyUrl + '/' + this.twitterId, {
        async: true,
        crossDomain: true,
        method: 'DELETE',
        contentType: 'application/json',
        body: JSON.stringify({
          accessSecret: this.handler.tt.options.access_token_secret,
          accessToken: this.handler.tt.options.access_token_key,
          consumerKey: this.handler.tt.options.consumer_key,
          consumerSecret: this.handler.tt.options.consumer_secret
        })
      }).then(raw => raw.json())
        .then(response => {
          if (response && response.errors.length > 0) {
            reject(response);
            return;
          }

          resolve('deleted');
        })
        .catch(error => reject(error));
    });
  }
}
SocialMediasDeleteRequest.socialMediasHandler = {};

export default SocialMediasDeleteRequest;