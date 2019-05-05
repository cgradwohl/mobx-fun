import {
  types,
  flow,
} from 'mobx-state-tree';

import _ from 'lodash';

import {
  Jumper,
} from '../services';

const PLATFORM_URL = 'http://localhost:8080/';

const User = types.model(
  'User',
  {
    id: types.identifierNumber,
    name: types.string,
  },
);

const Application = types.model(
  'Application',
  {
    users: types.array(User),
    user: types.maybe(types.reference(User)),

  },
)
  .actions(self => ({
    init: () => {
      Jumper.configure(PLATFORM_URL);
      self.getUsers();
    },

    getUsers: flow(function* share() {
      const response = yield Jumper.send().get('/users');
      self.user = _.uniqBy(response.data, 'id');
    }),
  }));

const application = Application.create({});
application.init();

export default application;
