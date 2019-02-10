export default class SocialMediasHandler {
  constructor(tt, fb, config) {
    this.tt = tt;
    this.fb = fb;
    this.serverUrl = config.serverUrl;
    this.proxyUrl = config.proxyUrl;
    this.token = config.token;
  }

  addFacebookPostId(spotId, postId) {
    return fetch(this.serverUrl + spotId + '/addPostId?fbPostId=' + postId, {
      method: 'PUT',
      headers: new Headers({
        Authorization: 'Bearer ' + this.token
      })
    })
  }

  addTwitterPostId(spotId, postId) {
    return fetch(this.serverUrl + spotId + '/addPostId?ttPostId=' + postId, {
      async: true,
      crossDomain: true,
      method: 'PUT',
      headers: new Headers({
        Authorization: 'Bearer ' + this.token
      })
    })
  }

  postFacebook(spotId, spotMessage) {
    return new Promise((resolve, reject) => {
      this.fb.api('me/feed', 'post', {
        message: '"' + spotMessage + '"'
      }, res => {
        if (!res || res.error || (res.code && res.code !== 200)) {
          reject(res);
          return;
        }

        this.addFacebookPostId(spotId, res.id.split('_')[1]).then(() => resolve('posted'));
      });
    });
  }

  postTwitter(spotId, spotMessage) {
    return new Promise((resolve, reject) => {
      fetch(this.proxyUrl, {
        async: true,
        crossDomain: true,
        method: 'POST',
        contentType: 'application/json',
        body: JSON.stringify({
          accessSecret: this.tt.options.access_token_secret,
          accessToken: this.tt.options.access_token_key,
          consumerKey: this.tt.options.consumer_key,
          consumerSecret: this.tt.options.consumer_secret,
          message: '"' + spotMessage + '"'
        })
      }).then(raw => raw.json())
        .then(response => {
          if (!response || !response.tweetId) {
            reject(response);
            return;
          }

          this.addTwitterPostId(spotId, response.tweetId).then(() => resolve('posted'));
        });
    });
  }

  async postOnSocialMedias(spotId, spotMessage) {
    let sleep = (time) => new Promise(resolve => setTimeout(() => resolve(), time));

    let facebook = false, twitter = false;
    for (let i = 0; i < 10; i++)
      try {
        if (await this.postFacebook(spotId, spotMessage) === 'posted') {
          facebook = true;
          break;
        }
      } catch (e) {
        await sleep(1000);
        console.error('erro ao postar no facebook', e);
      }

    if (facebook)
      for (let i = 0; i < 10; i++) 
        try {
          if (await this.postTwitter(spotId, spotMessage) === 'posted') {
            twitter = true;
            break;
          }
        } catch (e) {
          await sleep(1000);
          console.error('erro ao postar no twitter', e);
        }

    return {
      facebook,
      twitter
    };
  }
}