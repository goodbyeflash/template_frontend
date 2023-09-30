window.addEventListener("load", () => {
  var game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: "phaser-game",
    backgroundColor: "#242424",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 720,
      height: 1280,
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
      },
    },
  });
  // window.gameOpt = {
  //   assets: {
  //     bg: "./assets/bg.png",
  //     player: "./assets/player.png",
  //     bomb: "./assets/bomb.png",
  //     bombEffect: "./assets/bombEffect.png",
  //   },
  //   playerSpeed: 300,
  //   spawnTime: 0.1,
  //   gravity: 300,
  //   score: 10,
  // };

  // game.scene.add("Boot", Boot, true);
  // game.scene.add("Preload", Preload);
  // game.scene.add("Level", Level);

  const urlParams = new URLSearchParams(window.location.search);
  const serialNum = decodeURIComponent(urlParams.get("serialNum"));

  window.apiUrl = `${window.location.protocol}//${
    window.location.host.indexOf("localhost") > -1
      ? `localhost`
      : window.location.host
  }`;

  $.ajax({
    url: `${window.apiUrl}/api/user/read`,
    data: {
      serialNum: serialNum,
    },
    dataType: "json",
    method: "post",
    success: function (res) {
      window.serialNum = res.serialNum;
      $.ajax({
        url: `${window.apiUrl}/api/poo_opt`,
        data: {},
        dataType: "json",
        method: "get",
        success: function (res) {
          window.gameOpt = res[0];
          game.scene.add("Boot", Boot, true);
          game.scene.add("Preload", Preload);
          game.scene.add("Level", Level);
        },
        error: function (xhr, status, error) {
          console.error(`[API ERROR] => ${xhr.responseText}`);
        },
      });
    },
    error: function (xhr, status, error) {
      console.error(`[API ERROR] => ${xhr.responseText}`);
    },
  });
});

class Boot extends Phaser.Scene {
  preload() {
    this.load.pack("pack", "assets/preload-asset-pack.json");
  }

  create() {
    this.scene.start("Preload");
  }
}
