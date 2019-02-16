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
        console.log(res);
        if (!res || res.error || (res.code && res.code !== 200)) {
          reject(res);
          return;
        }

        resolve('deleted');
      });
    });
  }

  deleteFromTwitter() {
    return Promise.resolve('deleted');
  }
}
SocialMediasDeleteRequest.socialMediasHandler = {};

export default SocialMediasDeleteRequest;