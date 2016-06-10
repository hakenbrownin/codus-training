'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Twitch = function () {
  function Twitch(channels) {
    _classCallCheck(this, Twitch);

    this.channels = channels;
    this.init();
  }

  Twitch.prototype.init = function init() {
    this.setBindings();
  };

  Twitch.prototype.getChannelInfo = function getChannelInfo() {
    this.channels.forEach(function (channel) {
      function makeURL(type, name) {
        return 'https://api.twitch.tv/kraken/' + type + '/' + name + '?callback=?';
      };
      $.getJSON(makeURL("streams", channel), function (data) {
        var game = undefined,
            status = undefined;
        if (data.stream === null) {
          game = "Offline";
          status = "offline";
        } else if (data.stream === undefined) {
          game = "Account Closed";
          status = "offline";
        } else {
          game = data.stream.game;
          status = "online";
        };
        $.getJSON(makeURL("channels", channel), function (data) {
          var logo = data.logo != null ? data.logo : "https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F",
              name = data.display_name != null ? data.display_name : channel,
              description = status === "online" ? ': ' + data.status : "";
          var html = '<div class="row ' + status + '"><div class="col-xs-2 col-sm-1" id="icon"><img src="' + logo + '" class="logo"></div><div class="col-xs-10 col-sm-3" id="name"><a href="' + data.url + '" target="_blank">' + name + '</a></div><div class="col-xs-10 col-sm-8" id="streaming">' + game + '<span class="hidden-xs">' + description + '</span></div></div>';
          status === "online" ? $("#display").prepend(html) : $("#display").append(html);
        });
      });
    });
  };

  Twitch.prototype.setBindings = function setBindings() {
    this.getChannelInfo();
    $(".selector").click(function () {
      $(".selector").removeClass("active");
      $(this).addClass("active");
      var status = $(this).attr('id');
      if (status === "all") {
        $(".online, .offline").removeClass("hidden");
      } else if (status === "online") {
        $(".online").removeClass("hidden");
        $(".offline").addClass("hidden");
      } else {
        $(".offline").removeClass("hidden");
        $(".online").addClass("hidden");
      }
    });
  };

  return Twitch;
}();

var CHANNELS = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "brunofin", "comster404", "test_channel", "cretetion", "sheevergaming", "TR7K", "OgamingSC2", "ESL_SC2"];

$(document).ready(function () {
  new Twitch(CHANNELS);
});