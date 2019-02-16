import SocialMediasPostRequest from './SocialMediasPostRequest';
import SocialMediasDeleteRequest from './SocialMediasDeleteRequest';

export default class SocialMediasHandler {
  constructor(tt, fb, config) {
    this.tt = tt;
    this.fb = fb;
    this.serverUrl = config.serverUrl;
    this.proxyUrl = config.proxyUrl;
    this.token = config.token;

    SocialMediasPostRequest.socialMediasHandler = this;
    SocialMediasDeleteRequest.socialMediasHandler = this;
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
        if (await postRequest.postOnFacebook() === 'posted') {
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
          if (await postRequest.postOnTwitter() === 'posted') {
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

  async deleteFromSocialMedias(facebookId, twitterId) {
    let sleep = (time) => new Promise(resolve => setTimeout(() => resolve(), time));
    let deleteRequest = new SocialMediasDeleteRequest({
      facebook: facebookId,
      twitter: twitterId
    });

    let facebook = false, twitter = false;
    for (let i = 0; i < 10; i++)
      try {
        if (await deleteRequest.deleteFromFacebook() === 'deleted') {
          facebook = true;
          break;
        }
      } catch (e) {
        await sleep(1000);
        console.error('erro ao deletar do facebook', e);
      }

    if (facebook)
      for (let i = 0; i < 10; i++) 
        try {
          if (await deleteRequest.deleteFromTwitter() === 'deleted') {
            twitter = true;
            break;
          }
        } catch (e) {
          await sleep(1000);
          console.error('erro ao deletar do twitter', e);
        }

    return {
      facebook,
      twitter
    };
  }
}