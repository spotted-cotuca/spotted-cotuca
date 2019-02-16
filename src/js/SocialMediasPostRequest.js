class SocialMediasPostRequest {
  constructor(spot) {
    this.spotId = spot.id;
    this.message = spot.message;
    this.facebookId = '';
    this.twitterId = '';
  }

  get handler() {
    return SocialMediasPostRequest.socialMediasHandler;
  }

  addFacebookPostId() {
    return fetch(this.handler.serverUrl + this.spotId + '/addPostId?fbPostId=' + this.facebookId, {
      method: 'PUT',
      headers: new Headers({
        Authorization: 'Bearer ' + this.handler.token
      })
    })
  }

  addTwitterPostId() {
    return fetch(this.handler.serverUrl + this.spotId + '/addPostId?ttPostId=' + this.twitterId, {
      async: true,
      crossDomain: true,
      method: 'PUT',
      headers: new Headers({
        Authorization: 'Bearer ' + this.handler.token
      })
    })
  }

  postFacebook() {
    return new Promise((resolve, reject) => {
      this.handler.fb.api('me/feed', 'post', {
        message: '"' + this.message + '"'
      }, res => {
        if (!res || res.error || (res.code && res.code !== 200)) {
          reject(res);
          return;
        }

        this.facebookId = res.id.split('_')[1];
        this.addFacebookPostId().then(() => resolve('posted'));
      });
    });
  }

  postTwitter() {
    return new Promise((resolve, reject) => {
      fetch(this.handler.proxyUrl, {
        async: true,
        crossDomain: true,
        method: 'POST',
        contentType: 'application/json',
        body: JSON.stringify({
          accessSecret: this.handler.tt.options.access_token_secret,
          accessToken: this.handler.tt.options.access_token_key,
          consumerKey: this.handler.tt.options.consumer_key,
          consumerSecret: this.handler.tt.options.consumer_secret,
          message: '"' + this.message + '"'
        })
      }).then(raw => raw.json())
        .then(response => {
          if (!response || !response.tweetId) {
            reject(response);
            return;
          }

          this.twitterId = response.tweetId;
          this.addTwitterPostId().then(() => resolve('posted'));
        });
    });
  }
}
SocialMediasPostRequest.socialMediasHandler = {};

export default SocialMediasPostRequest;