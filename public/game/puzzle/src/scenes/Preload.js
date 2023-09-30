// You can write more code here

/* START OF COMPILED CODE */

class Preload extends Phaser.Scene {
  constructor() {
    super("Preload");

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  /** @returns {void} */
  editorPreload() {
    this.load.pack("asset-pack", "assets/asset-pack.json");
  }

  /** @returns {void} */
  editorCreate() {
    // progressBar
    const progressBar = this.add.rectangle(372, 740, 256, 20);
    progressBar.setOrigin(0, 0);
    progressBar.isFilled = true;
    progressBar.fillColor = 14737632;

    // preloadUpdater
    new PreloadBarUpdaterScript(progressBar);

    // progressBarBg
    const progressBarBg = this.add.rectangle(372, 740, 256, 20);
    progressBarBg.setOrigin(0, 0);
    progressBarBg.fillColor = 14737632;
    progressBarBg.isStroked = true;

    // loadingText
    const loadingText = this.add.text(456, 700, "", {});
    loadingText.text = "Loading...";
    loadingText.setStyle({
      color: "#e0e0e0",
      fontFamily: "arial",
      fontSize: "20px",
    });

    this.events.emit("scene-awake");
  }

  /* START-USER-CODE */

  // Write your code here

  preload() {
    this.editorCreate();

    this.editorPreload();

    const assets = window.gameOpt.assets;
    for (const key in assets) {
      if (Object.hasOwnProperty.call(assets, key)) {
        const imageUrl = assets[key].imgUrl;
        if (key == "tiles") {
          this.load.spritesheet(key, imageUrl, {
            frameWidth: 200,
            frameHeight: 200,
            startFrame: 0,
            endFrame: -1,
            spacing: 0,
            margin: 0,
          });
        } else {
          this.load.image(key, imageUrl);
        }
      }
    }

    loadFont("neodgm", "./assets/neodgm.ttf");

    this.load.on(Phaser.Loader.Events.COMPLETE, () =>
      this.scene.start("Level")
    );
  }

  /* END-USER-CODE */
}

function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont
    .load()
    .then(function (loaded) {
      document.fonts.add(loaded);
    })
    .catch(function (error) {
      return error;
    });
}

/* END OF COMPILED CODE */

// You can write more code here
