// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {
  constructor() {
    super("Level");

    /* START-USER-CTR-CODE */
    // Write your code here.
    this.gameOptions = {
      tileSize: 200,
      tweenSpeed: 50,
      tileSpacing: 20,
    };
    this.children = [];
    this.tileNumber = window.gameOpt.score;
    this.time = 0;
    this.score = 0;
    this.gameOver = false;
    this.directions = ["left", "right", "up", "down"];
    /* END-USER-CTR-CODE */
  }

  /** @returns {void} */
  editorCreate() {
    // scoreTxt
    const scoreTxt = this.add.text(823, 70, "", {});
    scoreTxt.setOrigin(0.5, 0.5);
    scoreTxt.text = "0";
    scoreTxt.setStyle({
      align: "center",
      fontFamily: "neodgm",
      fontSize: "40px",
    });

    // timeTxt
    const timeTxt = this.add.text(180, 70, "", {});
    timeTxt.setOrigin(0.5, 0.5);
    timeTxt.text = "Time :";
    timeTxt.setStyle({
      align: "center",
      fontFamily: "neodgm",
      fontSize: "40px",
    });

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

  preload() {
    this.load.scenePlugin({
      key: "rexgesturesplugin",
      url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgesturesplugin.min.js",
      sceneKey: "rexGestures",
    });
  }

  create() {
    this.editorCreate();
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.scoreTxt.setDepth(1);
    this.timeTxt.setDepth(1);
    this.fieldArray = [];
    this.fieldGroup = this.add.group();
    for (var i = 0; i < 4; i++) {
      this.fieldArray[i] = [];
      for (var j = 0; j < 4; j++) {
        var two = this.add.sprite(
          this.tileDestination(j),
          this.tileDestination(i),
          "tiles"
        );
        two.alpha = 0;
        two.visible = 0;
        this.fieldGroup.add(two);
        this.fieldArray[i][j] = {
          tileValue: 0,
          tileSprite: two,
          canUpgrade: true,
        };
      }
    }

    this.children = this.fieldGroup.getChildren();
    this.input.keyboard.on("keydown", this.handleKey, this);
    this.canMove = false;
    this.addTwo();
    this.addTwo();

    this.container = this.add.container();
    this.container.add(this.children);
    this.container.setPosition("", 370);

    this.swipeInput = this.rexGestures.add
      .swipe({ velocityThreshold: 1000 })
      .on(
        "swipe",
        function (swipe) {
          print.text += `swipe, v = ${swipe.dragVelocity}\n`;
        },
        this
      );
  }

  update(time, delta) {
    if (this.gameOver) {
      return;
    }

    if (this.swipeInput.isSwiped) {
      const dirState = this.dumpDirectionStates(this.swipeInput);
      if (dirState == "left") {
        this.canMove && this.moveLeft();
      } else if (dirState == "right") {
        this.canMove && this.moveRight();
      } else if (dirState == "up") {
        this.canMove && this.moveUp();
      } else if (dirState == "down") {
        this.canMove && this.moveDown();
      }
    }

    this.time = Math.round(time * 0.001);
    this.timeTxt.setText(
      `Time : ${new Date(this.time * 1000).toISOString().slice(14, 19)}`
    );
  }

  dumpDirectionStates(swipe) {
    var s = "";
    var dir;
    for (var i = 0, cnt = this.directions.length; i < cnt; i++) {
      dir = this.directions[i];
      if (swipe[dir]) {
        s += dir;
      }
    }
    return s;
  }

  addTwo() {
    var emptyTiles = [];
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (this.fieldArray[i][j].tileValue == 0) {
          emptyTiles.push({
            row: i,
            col: j,
          });
        }
      }
    }
    var chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);
    this.fieldArray[chosenTile.row][chosenTile.col].tileValue = 1;
    this.fieldArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
    this.fieldArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
    this.tweens.add({
      targets: [this.fieldArray[chosenTile.row][chosenTile.col].tileSprite],
      alpha: 1,
      duration: this.gameOptions.tweenSpeed,
      onComplete: function (tween) {
        tween.parent.scene.canMove = true;

        // when a move is completed, it's time to chek for game over
        tween.parent.scene.checkGameOver();
      },
    });
  }

  moveLeft() {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].depth = this.children[i].x;
    }
    this.handleMove(0, -1);
  }

  moveRight() {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].depth = this.game.config.width - this.children[i].x;
    }
    this.handleMove(0, 1);
  }

  moveUp() {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].depth = this.children[i].y;
    }
    this.handleMove(-1, 0);
  }

  moveDown() {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].depth = this.game.config.height - this.children[i].y;
    }
    this.handleMove(1, 0);
  }

  handleKey(e) {
    if (this.canMove) {
      switch (e.code) {
        case "ArrowLeft":
          this.moveLeft();
          break;
        case "ArrowRight":
          this.moveRight();
          break;
        case "ArrowUp":
          this.moveUp();
          break;
        case "ArrowDown":
          this.moveDown();
          break;
      }
    }
  }

  handleMove(deltaRow, deltaCol) {
    this.canMove = false;
    var somethingMoved = false;
    this.movingTiles = 0;
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        var colToWatch = deltaCol == 1 ? 4 - 1 - j : j;
        var rowToWatch = deltaRow == 1 ? 4 - 1 - i : i;
        var tileValue = this.fieldArray[rowToWatch][colToWatch].tileValue;
        if (tileValue != 0) {
          var colSteps = deltaCol;
          var rowSteps = deltaRow;
          while (
            this.isInsideBoard(rowToWatch + rowSteps, colToWatch + colSteps) &&
            this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps]
              .tileValue == 0
          ) {
            colSteps += deltaCol;
            rowSteps += deltaRow;
          }
          if (
            this.isInsideBoard(rowToWatch + rowSteps, colToWatch + colSteps) &&
            this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps]
              .tileValue == tileValue &&
            this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps]
              .canUpgrade &&
            this.fieldArray[rowToWatch][colToWatch].canUpgrade
          ) {
            this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps]
              .tileValue++;
            this.fieldArray[rowToWatch + rowSteps][
              colToWatch + colSteps
            ].canUpgrade = false;
            this.fieldArray[rowToWatch][colToWatch].tileValue = 0;
            this.moveTile(
              this.fieldArray[rowToWatch][colToWatch],
              rowToWatch + rowSteps,
              colToWatch + colSteps,
              Math.abs(rowSteps + colSteps),
              true
            );
            somethingMoved = true;
          } else {
            colSteps = colSteps - deltaCol;
            rowSteps = rowSteps - deltaRow;
            if (colSteps != 0 || rowSteps != 0) {
              this.fieldArray[rowToWatch + rowSteps][
                colToWatch + colSteps
              ].tileValue = tileValue;
              this.fieldArray[rowToWatch][colToWatch].tileValue = 0;
              this.moveTile(
                this.fieldArray[rowToWatch][colToWatch],
                rowToWatch + rowSteps,
                colToWatch + colSteps,
                Math.abs(rowSteps + colSteps),
                false
              );
              somethingMoved = true;
            }
          }
        }
      }
    }
    if (!somethingMoved) {
      this.canMove = true;
    }
  }
  moveTile(tile, row, col, distance, changeNumber) {
    this.movingTiles++;
    this.tweens.add({
      targets: [tile.tileSprite],
      x: this.tileDestination(col),
      y: this.tileDestination(row),
      duration: this.gameOptions.tweenSpeed * distance,
      onComplete: function (tween) {
        tween.parent.scene.movingTiles--;
        if (changeNumber) {
          tween.parent.scene.transformTile(tile, row, col);
        }
        if (tween.parent.scene.movingTiles == 0) {
          tween.parent.scene.resetTiles();
          tween.parent.scene.addTwo();
        }
      },
    });
  }

  transformTile(tile, row, col) {
    this.movingTiles++;
    const tileValue = this.fieldArray[row][col].tileValue - 1;
    tile.tileSprite.setFrame(tileValue);
    this.scoreTxt.setText(
      ` ${(this.score += parseInt(this.tileNumber[tileValue]))}`
    );

    this.tweens.add({
      targets: [tile.tileSprite],
      scaleX: 1.1,
      scaleY: 1.1,
      duration: this.gameOptions.tweenSpeed,
      yoyo: true,
      repeat: 1,
      onComplete: function (tween) {
        tween.parent.scene.movingTiles--;
        if (tween.parent.scene.movingTiles == 0) {
          tween.parent.scene.resetTiles();
          tween.parent.scene.addTwo();
        }
      },
    });
  }
  resetTiles() {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        this.fieldArray[i][j].canUpgrade = true;
        this.fieldArray[i][j].tileSprite.x = this.tileDestination(j);
        this.fieldArray[i][j].tileSprite.y = this.tileDestination(i);
        if (this.fieldArray[i][j].tileValue > 0) {
          this.fieldArray[i][j].tileSprite.alpha = 1;
          this.fieldArray[i][j].tileSprite.visible = true;
          this.fieldArray[i][j].tileSprite.setFrame(
            this.fieldArray[i][j].tileValue - 1
          );
        } else {
          this.fieldArray[i][j].tileSprite.alpha = 0;
          this.fieldArray[i][j].tileSprite.visible = false;
        }
      }
    }
  }
  isInsideBoard(row, col) {
    return row >= 0 && col >= 0 && row < 4 && col < 4;
  }
  tileDestination(pos) {
    return (
      50 +
      pos * (this.gameOptions.tileSize + this.gameOptions.tileSpacing) +
      this.gameOptions.tileSize / 2 +
      this.gameOptions.tileSpacing
    );
  }
  checkGameOver() {
    // loop through the entire board
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        // if there is an empty tile, it's not game over
        if (this.fieldArray[i][j].tileValue == 0) {
          return;
        }

        // if there are two vertical adjacent tiles with the same value, it's not game over
        if (
          i < 3 &&
          this.fieldArray[i][j].tileValue == this.fieldArray[i + 1][j].tileValue
        ) {
          return;
        }

        // if there are two horizontal adjacent tiles with the same value, it's not game over
        if (
          j < 3 &&
          this.fieldArray[i][j].tileValue == this.fieldArray[i][j + 1].tileValue
        ) {
          return;
        }
      }
    }

    this.gameOver = true;

    $.ajax({
      url: `${window.apiUrl}/api/puzzle`,
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

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
