document.addEventListener("DOMContentLoaded", function () {
  let instructionBtn = document.getElementById("instructionBtn");
  let closeInstructionBtn = document.getElementById("closeInstruction");
  let instructionText = document.getElementById("instructionText");

  instructionBtn.addEventListener("click", function (e) {
    instructionText.style.display = "block";
  });

  closeInstructionBtn.addEventListener("click", function (e) {
    instructionText.style.display = "none";
  });

  let board = document.getElementById("board");
  let container = document.getElementById("containerId");
  let playBtn = document.getElementById("playBtn");

  class Target {
    constructor(type, canvasWidth, canvasHeight) {
      this.size = 100;
      this.type = type;
      this.img = new Image();
      this.img.src = `../assets/target${type}.png`;
      this.x = Math.random() * (canvasWidth - this.size) + this.size / 2;
      this.y = Math.random() * (canvasHeight - this.size) + this.size / 2;
      this.isAlive = true;
    }

    draw(ctx) {
      if (this.isAlive) {
        ctx.drawImage(
          this.img,
          this.x - this.size / 2,
          this.y - this.size / 2,
          this.size,
          this.size
        );
      }
    }

    isClick(mx, my) {
      return (
        mx >= this.x - this.size / 2 &&
        mx <= this.x + this.size / 2 &&
        my >= this.y - this.size / 2 &&
        my <= this.y + this.size / 2
      );
    }
  }

  class Gameboard {
    constructor(canvas, targetType) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.width = 1240;
      this.height = 720;
      this.bgImg = new Image();
      this.bgImg.src = "../assets/background.jpg";

      this.pointerImg = new Image();
      this.pointerImg.src = "../assets/pointer.png";
      this.pointerSize = 64;
      this.pointerX = this.width / 2;
      this.pointerY = this.height / 2;

      this.targets = [];
      this.spawnInterval = null;
      this.targetType = targetType;

      this.initCanvas();
      this.mouse();
      this.click();
      this.pointerImg.onload = () => {
        this.draw();
      };
    }

    initCanvas() {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    mouse() {
      this.canvas.addEventListener("mousemove", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        x = Math.max(
          this.pointerSize / 2,
          Math.min(x, this.width - this.pointerSize / 2)
        );
        y = Math.max(
          this.pointerSize / 2,
          Math.min(y, this.height - this.pointerSize / 2)
        );

        this.pointerX = x;
        this.pointerY = y;

        this.draw();
      });
    }

    click() {
      this.canvas.addEventListener("click", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        this.targets.forEach((target) => {
          if (target.isAlive && target.isClick(mx, my)) {
            target.isAlive = false;
          }
        });
        this.draw();
      });
    }

    start() {
      this.draw();
      this.spawnTarget();
      this.spawnInterval = setInterval(() => {
        this.spawnTarget();
      }, 3000);
    }

    spawnTarget() {
      const target = new Target(this.targetType, this.width, this.height);
      this.targets.push(target);
      target.img.onload = () => {
        this.draw();
      };
    }

    draw() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Draw background image
      if (this.bgImg.complete) {
        this.ctx.drawImage(this.bgImg, 0, 0, this.width, this.height);
      }

      // Draw targets
      this.targets.forEach((target) => {
        target.draw(this.ctx);
      });

      // Draw pointer
      this.ctx.drawImage(
        this.pointerImg,
        this.pointerX - this.pointerSize / 2,
        this.pointerY - this.pointerSize / 2,
        this.pointerSize,
        this.pointerSize
      );
    }
  }

  playBtn.addEventListener("click", function (e) {
    e.preventDefault();
    container.style.display = "none";
    board.style.display = "block";

    let targetType = 1;
    const targetRadios = document.getElementsByName("target");
    targetRadios.forEach((radio, idx) => {
      if (radio.checked) targetType = idx + 1;
    });

    let gameboard = new Gameboard(board, targetType); // Pass targetType here!
    gameboard.start();
  });
});
