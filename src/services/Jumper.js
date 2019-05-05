import axios from 'axios';

const makeMissingClient = () => (
  Object.assign(...['get', 'post', 'put', 'delete'].map(method => (
    {
      [method]: () => {
        throw new Error('You must call Jumper.configure(platformHost) before use.');
      },
    }
  )))
);

let platform = () => makeMissingClient();

export default {
  configure: (platformHost) => {
    platform = axios.create({
      baseURL: platformHost,
      timeout: 10000,
    });
  },

  send: () => platform,
};
