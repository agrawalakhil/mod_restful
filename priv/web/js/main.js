(function() {
  require.config({
    paths: {
      jquery: "jquery.min",
      bootstrap: "bootstrap.min"
    },
    shim: {
      jquery: {
        exports: "$"
      },
      bootstrap: {
        deps: ["jquery"]
      }
    }
  });

  require(["app"]);

}).call(this);
