(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['jquery', 'bootstrap', 'requests'], function($, bootstrap, requests) {
    var bodyIsRequired, crossDomain, envelope, envelopeRequest, getDefaultHeaders, getHeaders, getMethod, isEmpty, makeRequest, removeKeys, removeToken, selectMethod, setPreparedRequest, showResponse, signIn, signOut, signedIn, signedOut, storeToken, unenvelope, withApiUrl;
    makeRequest = function() {
      return withApiUrl(function(apiUrl) {
        var data, method, request;
        request = $('#request').val().replace(/^\//, '');
        if (isEmpty(request)) {
          return alert('The Request is required');
        } else {
          $('.response-empty, .response').addClass('hidden');
          $('.response-loading').removeClass('hidden');
          method = getMethod();
          data = {
            url: apiUrl + "/" + request,
            method: method,
            headers: getHeaders(),
            body: bodyIsRequired(method) ? $('#request-body').val() : ''
          };
          console.log("\n-----------------------------\nSent Data:");
          console.log(data);
          console.log("-----------------------------\n");
          return crossDomain(data, function(jqXHR) {
            return showResponse(jqXHR, request, data);
          }, function(jqXHR) {
            return showResponse(jqXHR, request, data);
          });
        }
      });
    };
    showResponse = function(jqXHR, request, data) {
      var body, headers, status, statusText, withNewLines, withSpaces;
      status = jqXHR.status;
      statusText = jqXHR.statusText;
      headers = jqXHR.getAllResponseHeaders();
      body = jqXHR.responseJSON !== void 0 ? JSON.stringify(jqXHR.responseJSON, null, 2) : void 0;
      withNewLines = function(str, newLine) {
        return str.replace(/[\n\r]+/g, newLine);
      };
      withSpaces = function(str) {
        return str.replace(/\s/g, '&nbsp;');
      };
      console.log("\n-----------------------------");
      console.log("Response (jqXHR):");
      console.log(jqXHR);
      console.log("Status: " + status + " " + statusText);
      console.log("Headers:");
      console.log("\t" + withNewLines(headers, '\n\t'));
      console.log("Body:");
      console.log(body);
      console.log("-----------------------------\n");
      $('#response-status').removeClass('success error').addClass(status < 400 ? 'success' : 'error');
      $('#response-status-code').text(status);
      $('#response-status-text').text(statusText);
      $('#response-headers').html(withNewLines(headers, '<br>'));
      $('#response-body').html(body !== void 0 ? withSpaces(withNewLines(body, '<br>')) : '');
      $('.response-empty, .response-loading').addClass('hidden');
      $('.response').removeClass('hidden');
      switch (request) {
        case 'signin':
          storeToken(jqXHR.responseJSON.token);
          return signedIn(JSON.parse(data.body).username);
        case 'signout':
          removeToken();
          return signedOut();
      }
    };
    setPreparedRequest = function(reqName) {
      var body, method, secured, uri, _ref;
      _ref = requests.prepared(reqName), secured = _ref.secured, method = _ref.method, uri = _ref.uri, body = _ref.body;
      selectMethod(method);
      $('#request').val($('#enveloped').prop('checked') ? envelope(uri) : uri);
      $('#checkbox-token').prop('checked', secured);
      return $('#request-body').val(JSON.stringify(body, null, 2));
    };
    signIn = function() {
      return withApiUrl(function(apiUrl) {
        $('#signin').button('loading');
        return crossDomain({
          url: apiUrl + "/signin",
          method: 'POST',
          headers: getDefaultHeaders(),
          body: JSON.stringify({
            username: "akhil",
            password: "godknows"
          })
        }, function(jqXHR) {
          storeToken(jqXHR.responseJSON.token);
          return signedIn("akhil");
        }, function(jqXHR) {
          console.log(jqXHR);
          return alert('Error while trying to sign in');
        }, function(jqXHR) {
          return $('#signin').button('reset');
        });
      });
    };
    signOut = function() {
      return withApiUrl(function(apiUrl) {
        var headers, tokenHeader;
        headers = getDefaultHeaders(true);
        tokenHeader = headers['X-Auth-Token'];
        if (tokenHeader !== void 0 && tokenHeader.length > 0) {
          $('#signout').button('loading');
          return crossDomain({
            url: apiUrl + "/signout",
            method: 'POST',
            headers: headers,
            body: ''
          }, function(jqXHR) {
            removeToken();
            return signedOut();
          }, function(jqXHR) {
            console.log(jqXHR);
            return alert('Error while trying to sign out');
          }, function(jqXHR) {
            return $('#signout').button('reset');
          });
        } else {
          return removeToken();
        }
      });
    };
    isEmpty = function(str) {
      return (str == null) || str.length === 0;
    };
    bodyIsRequired = function(method) {
      return !(method === 'GET' || method === 'DELETE');
    };
    selectMethod = function(method) {
      $('#method-selector label[method=' + method + ']').addClass('active').siblings().removeClass('active');
      if (bodyIsRequired(method)) {
        return $('#request-body-section').removeClass('hidden');
      } else {
        return $('#request-body-section').addClass('hidden');
      }
    };
    getMethod = function() {
      return $('#method-selector label.active').attr('method');
    };
    envelopeRequest = function(envelopeOrNot) {
      var req;
      req = $('#request').val();
      return $('#request').val(envelopeOrNot ? envelope(req) : unenvelope(req));
    };
    unenvelope = function(req) {
      return req.replace(/&envelope=[^&]*/ig, '').replace(/[?&]envelope=\w*$/i, '').replace(/\?envelope=\w*&/ig, '?');
    };
    envelope = function(req) {
      var separator, unenveloped;
      unenveloped = unenvelope(req);
      separator = unenveloped.indexOf('?') === -1 ? '?' : '&';
      return unenveloped + separator + 'envelope=true';
    };
    withApiUrl = function(f) {
      var apiUrl;
      apiUrl = $('#apiurl').val().replace(/\/$/, '');
      if (isEmpty(apiUrl)) {
        return alert('The API URL is required');
      } else {
        return f(apiUrl);
      }
    };
    getDefaultHeaders = function(withToken) {
      var headers, key, tr, value, _i, _len, _ref, _ref1;
      if (withToken == null) {
        withToken = false;
      }
      headers = {};
      _ref = $('#request-headers tr');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tr = _ref[_i];
        _ref1 = [$(tr).find('td.key').text(), $(tr).find('input[type=text]').attr('value')], key = _ref1[0], value = _ref1[1];
        if (withToken || key !== 'X-Auth-Token') {
          headers[key] = value;
        }
      }
      return headers;
    };
    getHeaders = function() {
      var headers, key, tr, value, _i, _len, _ref, _ref1;
      headers = {};
      _ref = $('#request-headers tr');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tr = _ref[_i];
        if ($(tr).find('input[type=checkbox]').prop('checked')) {
          _ref1 = [$(tr).find('td.key').text(), $(tr).find('input[type=text]').val()], key = _ref1[0], value = _ref1[1];
          headers[key] = value;
        }
      }
      return headers;
    };
    removeKeys = function(object, keys) {
      var filtered, key, value;
      filtered = {};
      for (key in object) {
        value = object[key];
        if (!(__indexOf.call(keys, key) >= 0)) {
          filtered[key] = value;
        }
      }
      return filtered;
    };
    crossDomain = function(data, doneFunc, failFunc, alwaysFunc) {
      var aElement, headersWithoutDate;
      if (alwaysFunc == null) {
        alwaysFunc = function(x) {
          return null;
        };
      }
      aElement = document.createElement('a');
      aElement.href = data.url;
      if (window.location.hostname === aElement.hostname) {
        headersWithoutDate = removeKeys(data.headers, ["Date"]);
        return $.ajax({
          url: data.url,
          method: data.method,
          headers: headersWithoutDate,
          data: data.body
        }).done(function(data, textStatus, jqXHR) {
          doneFunc(jqXHR);
          return alwaysFunc(jqXHR);
        }).fail(function(jqXHR, textStatus, err) {
          failFunc(jqXHR);
          return alwaysFunc(jqXHR);
        });
      } else {
        return $.ajax({
          url: '/api/proxy',
          method: 'POST',
          contentType: "application/json",
          data: JSON.stringify(data)
        }).done(function(data, textStatus, jqXHR) {
          doneFunc(jqXHR);
          return alwaysFunc(jqXHR);
        }).fail(function(jqXHR, textStatus, err) {
          failFunc(jqXHR);
          return alwaysFunc(jqXHR);
        });
      }
    };
    storeToken = function(token) {
      if ((token != null) && token.length > 0) {
        $('#checkbox-token').prop('checked', true);
        return $('#token').val(token).attr('value', token);
      }
    };
    removeToken = function() {
      $('#checkbox-token').prop('checked', false);
      return $('#token').removeAttr('value');
    };
    signedIn = function(username) {
      if ((username != null) && username.length > 0) {
        $('#signin').addClass('hidden');
        $('#signedin').html('Signed in as <b>' + username + '</b>');
        return $('#signedin').removeClass('hidden');
      }
    };
    signedOut = function() {
      $('#signin').removeClass('hidden');
      $('#signedin').html('');
      return $('#signedin').addClass('hidden');
    };
    return $(function() {
      $('#method-selector label[method]').click(function() {
        return selectMethod($(this).attr('method'));
      });
      $('#test-button').click(function() {
        return makeRequest();
      });
      $('#request').keyup(function(e) {
        if (e.which === 13) {
          return makeRequest();
        }
      });
      $('#test-list a[req]').click(function() {
        return setPreparedRequest($(this).attr('req'));
      });
      $('#signin').click(function() {
        return signIn();
      });
      $('#signout').click(function() {
        return signOut();
      });
      $('#enveloped').change(function() {
        return envelopeRequest($(this).prop('checked'));
      });
      return $('[data-toggle="tooltip"]').tooltip();
    });
  });

}).call(this);
