const axios = require('axios');

const clientId = 'pippo';
const clientSecret = 'pippo';

const version = 'v2.11';
const baseUrl = `https://graph.facebook.com/${version}`;

class FacebookAuth {
  async getAccessToken() {
    const { data: { access_token } } = await axios.get(`${baseUrl}/oauth/access_token`, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      },
    });

    return access_token;
  }

  async validateToken(userToken) {
    const accessToken = await this.getAccessToken();

    const { data: { data } } = await axios.get(`${baseUrl}/debug_token`, {
      params: {
        input_token: userToken,
        access_token: accessToken,
      },
    });

    return data;
  }
}

module.exports = new FacebookAuth();
