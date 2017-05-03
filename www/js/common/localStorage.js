angular.module('util.localStorage', [])
  .factory('localStorage', function () {
    return {
      setItem: function (key, obj) {
        window.localStorage.setItem(key, obj);
      },
      getItem: function (key) {
        return window.localStorage.getItem(key);
      },
      removeItem: function (key) {
        window.localStorage.removeItem(key);
      },
      clear: function () {
        window.localStorage.clear();
      },
      getUser: function () {
        return this.getItem('user');
      }
    }
  })
  .provider('localStorage', function () {
    this.setItem = function (key, obj) {
      window.localStorage.setItem(key, obj);
    };
    this.getItem = function (key) {
      return window.localStorage.getItem(key);
    };
    this.removeItem = function (key) {
      window.localStorage.removeItem(key);
    };
    this.clear = function () {
      window.localStorage.clear();
    };
    this.getUser = function () {
      return this.getItem('user');
    };
    this.$get = function () {
      return this;
    }
  });
