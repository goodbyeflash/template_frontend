// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {
  constructor() {
    super("Level");

    /* START-USER-CTR-CODE */
    // Write your code here.
    this.player;
    this.platforms;
    this.cursors;
    this.playerSpeed = window.gameOpt.playerSpeed;
    this.bombs;
    this.frameTime = 0;
    this.spawnTime = window.gameOpt.spawnTime * 1000; //s
    // this.minusSpawnTime = 0.001 * 1000; //s
    this.gravityY = window.gameOpt.gravity;
    this.score = 0;
    this.gameOver = false;
    this.time = 0;
    /* END-USER-CTR-CODE */
  }

  /** @returns {void} */
  editorCreate() {
    // scoreTxt
    const scoreTxt = this.add.text(550, 60, "", {});
    scoreTxt.setOrigin(0.5, 0.5);
    scoreTxt.text = "Score : 0";
    scoreTxt.setStyle({ fontFamily: "neodgm", fontSize: "30px" });

    // bg
    this.add.image(360, 640, "bg");

    // timeTxt
    const timeTxt = this.add.text(150, 60, "", {});
    timeTxt.setOrigin(0.5, 0.5);
    timeTxt.text = "Time : 00:00";
    timeTxt.setStyle({ fontFamily: "neodgm", fontSize: "30px" });

    this.scoreTxt = scoreTxt;
    this.timeTxt = timeTxt;

    this.events.emit("scene-awake");
  }

  /** @type {Phaser.GameObjects.Text} */
  scoreTxt;
  /** @type {Phaser.GameObjects.Text} */
  timeTxt;

  /* START-USER-CODE */

  // Write more your code here

  create() {
    this.editorCreate();

    this.scoreTxt.setDepth(1);
    this.timeTxt.setDepth(1);
    this.platforms = this.physics.add.staticGroup();
    this.platforms
      .create(720 / 2, 1220, "ground")
      .setScale(2)
      .setAlpha(0)
      .refreshBody();

    this.player = this.physics.add.sprite(720 / 2, 1140, "player");
    this.player.setBounce(0.2);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setCircle(30, 28, 10);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 3 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "fail",
      frames: [{ key: "player", frame: 7 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 4, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.add.collider(this.player, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.bombs = this.physics.add.group();

    this.physics.add.collider(
      this.bombs,
      this.platforms,
      this.hitPlatform,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );
  }

  update(time, delta) {
    if (this.gameOver) {
      return;
    }

    this.time = Math.round(time * 0.001);
    this.timeTxt.setText(
      `Time : ${new Date(this.time * 1000).toISOString().slice(14, 19)}`
    );

    this.frameTime += delta;

    if (this.frameTime > this.spawnTime) {
      // this.spawnTime -= this.minusSpawnTime;
      this.frameTime = 0;
      const bomb = this.bombs.create(Phaser.Math.Between(0, 720), -100, "bomb");
      bomb.body.setCollideWorldBounds(true);
      bomb.body.setCircle(23, 35, 48);
      bomb.setGravityY(this.gravityY);
    }

    // Desktop
    if (this.sys.game.device.os.desktop) {
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-this.playerSpeed);
        this.player.anims.play("left", true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(this.playerSpeed);
        this.player.anims.play("right", true);
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play("turn");
      }
    } else {
      // Mobile
      if (this.input.activePointer.isDown) {
        if (this.input.activePointer.x < this.player.x) {
          this.player.setVelocityX(-this.playerSpeed);
          this.player.anims.play("left", true);
        } else {
          this.player.setVelocityX(this.playerSpeed);
          this.player.anims.play("right", true);
        }
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play("turn");
      }
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause();
    player.anims.play("fail");
    this.gameOver = true;

    $.ajax({
      url: `${window.apiUrl}/api/poo`,
      data: {
        serialNum: window.serialNum,
        score: this.score,
        playTime: this.time,
        publishedDate: new Date(),
      },
      dataType: "json",
      method: "post",
      success: function (res) {
        console.log(res);
      },
      error: function (xhr, status, error) {
        if (xhr.status == 200) {
          console.log(`[API UPDATE] => ${xhr.responseText}`);
        } else {
          console.error(`[API ERROR] => ${xhr.responseText}`);
        }
      },
    });
  }

  hitPlatform(bomb, platform) {
    bomb.disableBody(true, false);
    bomb.setTexture("bombEffect");
    this.tweens.add({
      targets: bomb,
      duration: 500,
      alpha: { from: 1, to: 0 },
      onComplete: () => {
        bomb.disableBody(true, true);
      },
    });
    this.score += window.gameOpt.score;
    this.scoreTxt.setText(`Score : ${this.score}`);
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
