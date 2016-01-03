(function() {
  define([], function() {
    return {
      prepared: function(requestName) {
        var req, securedReq;
        req = function(method, uri, body) {
          if (body == null) {
            body = void 0;
          }
          return {
            secured: false,
            method: method,
            uri: uri,
            body: body
          };
        };
        securedReq = function(method, uri, body) {
          if (body == null) {
            body = void 0;
          }
          return {
            secured: true,
            method: method,
            uri: uri,
            body: body
          };
        };
        switch (requestName) {
          case 'status':
            return req('GET', 'status');
          case 'usernames':
            return req('GET', 'usernames');
          case 'signin':
            return req('POST', 'signin', {
              username: "akhil",
              password: "godknows"
            });
          case 'signin-atul':
            return req('POST', 'signin', {
              username: "atul",
              password: "godknows"
            });
          case 'signout':
            return securedReq('POST', 'signout');
          case 'signup':
            return req('POST', 'signup', {
              username: "user4@mail.com",
              password: "123456",
              user: {
                name: "User 4"
              }
            });
          case 'account':
            return securedReq('GET', 'account');
          case 'account-update':
            return securedReq('PUT', 'account', {
              name: "New name"
            });
          case 'account-update-password':
            return securedReq('PUT', 'account/password', {
              old: "123456",
              "new": "654321"
            });
          case 'account-delete':
            return securedReq('DELETE', 'account');
          case 'searchInteraction':
            return securedReq('GET', 'interaction/search?q=test&sort=id&page=1');
          case 'searchDirectInteraction':
            return securedReq('GET', 'interaction/search?q=test&sort=id&page=1&types=direct');
          case 'searchRoomInteraction':
            return securedReq('GET', 'interaction/search?q=test&sort=id&page=1&types=room');
          case 'searchPeople':
            return securedReq('GET', 'people/search?q=test&sort=id&page=1');
          case 'searchUser':
            return securedReq('GET', 'people/search?q=test&sort=id&page=1&types=user');
          case 'searchRoom':
            return securedReq('GET', 'people/search?q=test&sort=id&page=1&types=room');
          case 'tasks-filtering-sorting':
            return securedReq('GET', 'folders/1/tasks?done=false&sort=-deadline,-date,order&page=1');
          case 'tasks-searching':
            return securedReq('GET', 'folders/1/tasks?q=barcelona&page=1');
          case 'task-new':
            return securedReq('POST', 'folders/1/tasks', {
              text: "New task",
              deadline: "24-11-2015 18:00:00"
            });
          case 'task':
            return securedReq('GET', 'tasks/1');
          case 'task-update':
            return securedReq('PUT', 'tasks/1', {
              text: "New text"
            });
          case 'task-update-order':
            return securedReq('PUT', 'tasks/1/order/2');
          case 'task-update-folder':
            return securedReq('PUT', 'tasks/1/folder/2');
          case 'task-update-done':
            return securedReq('PUT', 'tasks/1/done');
          case 'task-update-undone':
            return securedReq('DELETE', 'tasks/1/done');
          case 'task-delete':
            return securedReq('DELETE', 'tasks/1');
        }
      }
    };
  });

}).call(this);
