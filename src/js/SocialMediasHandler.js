import SocialMediasPostRequest from './SocialMediasPostRequest';

export default class SocialMediasHandler {
  constructor(tt, fb, config) {
    this.tt = tt;
    this.fb = fb;
    this.serverUrl = config.serverUrl;
    this.proxyUrl = config.proxyUrl;
    this.token = config.token;

    SocialMediasPostRequest.socialMediasHandler = this;
  }

  async postOnSocialMedias(spotId, spotMessage) {
    let sleep = (time) => new Promise(resolve => setTimeout(() => resolve(), time));
    let postRequest = new SocialMediasPostRequest({
      id: spotId,
      message: spotMessage
    });

    let facebook = false, twitter = false;
    for (let i = 0; i < 10; i++)
      try {
        if (await postRequest.postFacebook(spotId, spotMessage) === 'posted') {
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
          if (await postRequest.postTwitter(spotId, spotMessage) === 'posted') {
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