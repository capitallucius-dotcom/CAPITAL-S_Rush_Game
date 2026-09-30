// ===============================
// CAPITAL RUSH
// FINAL GAME VERSION
// OBSTACLE + JUMP + LIVES
// SCORE + LEVEL + COIN + HEALTH
// GAME OVER + RESTART + HIGH SCORE
// LEVEL 1 - 5
// ===============================


// ===============================
// ELEMENTS
// ===============================

let screenStartButton =
    document.querySelector("#screenStartButton");

let startScreen =
    document.querySelector("#startScreen");

let startButton =
    document.querySelector("#startButton");

let restartButton =
    document.querySelector("#restartButton");

let gameOverScreen =
    document.querySelector("#gameOverScreen");

let jumpButton =
    document.querySelector("#jumpButton");

let player =
    document.querySelector(".player");

let obstacle =
    document.querySelector(".obstacle");

let coin =
    document.querySelector(".coin");

let health =
    document.querySelector(".health");

let coinMessage =
    document.querySelector("#coinMessage");

let livesDisplay =
    document.querySelector("#lives");

let scoreDisplay =
    document.querySelector("#score");

let levelDisplay =
    document.querySelector("#level");

let highScoreDisplay =
    document.querySelector("#highScore");

let liveHighScoreDisplay =
    document.querySelector("#liveHighScore");


// ===============================
// GAME VARIABLES
// ===============================

let gameStarted = false;

let obstaclePosition = 0;

let coinPosition = 0;

let healthPosition = 0;

let isJumping = false;

let lives = 3;

let score = 0;

let level = 1;

let obstacleSpeed = 5;

let coinSpeed = 4;

let healthSpeed = 3;

let hitCooldown = false;

let coinCollected = false;

let coinActive = false;

let healthActive = false;

let coinTimer = null;

let healthTimer = null;


// ===============================
// HIGH SCORE
// ===============================

let highScore =
    Number(localStorage.getItem("capitalRushHighScore")) || 0;


function updateHighScoreDisplay() {

    if (highScoreDisplay) {

        highScoreDisplay.textContent =
            highScore;
    }


    if (liveHighScoreDisplay) {

        liveHighScoreDisplay.textContent =
            highScore;
    }
}


updateHighScoreDisplay();


// ===============================
// CHECK HIGH SCORE
// ===============================

function checkHighScore() {

    if (score > highScore) {

        highScore =
            score;


        localStorage.setItem(
            "capitalRushHighScore",
            highScore
        );


        updateHighScoreDisplay();
    }
}


// ===============================
// START GAME
// ===============================

function startGame() {

    clearTimeout(coinTimer);
    clearTimeout(healthTimer);

    gameStarted = true;

    lives = 3;
    score = 0;
    level = 1;

    obstacleSpeed = 5;
    coinSpeed = 4;
    healthSpeed = 3;

    hitCooldown = false;

    coinActive = false;
    healthActive = false;

    coinCollected = false;

    coin.style.display =
        "none";

    health.style.display =
        "none";

    gameOverScreen.style.display =
        "none";


    livesDisplay.textContent =
        lives;

    scoreDisplay.textContent =
        score;

    levelDisplay.textContent =
        level;


    updateHighScoreDisplay();


    startButton.textContent =
        "GAME STARTED";


    obstaclePosition =
        document.querySelector(".game").offsetWidth + 50;

    obstacle.style.left =
        obstaclePosition + "px";

    obstacle.style.right =
        "auto";


    moveObstacle();

    scheduleCoin();

    scheduleHealth();
}


// ===============================
// START SCREEN
// ===============================

screenStartButton.addEventListener(
    "click",
    function () {

        startScreen.style.display =
            "none";

        startGame();
    }
);


// ===============================
// NORMAL START BUTTON
// ===============================

startButton.addEventListener(
    "click",
    function () {

        if (!gameStarted) {

            startScreen.style.display =
                "none";

            startGame();
        }
    }
);


// ===============================
// MOVE OBSTACLE
// ===============================

function moveObstacle() {

    if (!gameStarted) {
        return;
    }


    obstaclePosition -=
        obstacleSpeed;

    obstacle.style.left =
        obstaclePosition + "px";


    // OBSTACLE PASSED

    if (obstaclePosition < -80) {

        score++;

        scoreDisplay.textContent =
            score;

        updateLevel();

        checkHighScore();


        obstaclePosition =
            document.querySelector(".game").offsetWidth + 50;

        obstacle.style.left =
            obstaclePosition + "px";
    }


    checkCollision();


    requestAnimationFrame(
        moveObstacle
    );
}


// ===============================
// LEVEL SYSTEM
// ===============================

function updateLevel() {

    if (score >= 40) {

        level = 5;

        obstacleSpeed = 11;

    }

    else if (score >= 30) {

        level = 4;

        obstacleSpeed = 9.5;

    }

    else if (score >= 20) {

        level = 3;

        obstacleSpeed = 8;

    }

    else if (score >= 10) {

        level = 2;

        obstacleSpeed = 6.5;

    }

    else {

        level = 1;

        obstacleSpeed = 5;
    }


    levelDisplay.textContent =
        level;
}


// ===============================
// PERIODIC COIN
// ===============================

function scheduleCoin() {

    if (!gameStarted) {
        return;
    }


    coinTimer =
        setTimeout(
            function () {

                if (gameStarted) {
                    startCoin();
                }

            },
            4000
        );
}


// ===============================
// START COIN
// ===============================

function startCoin() {

    if (!gameStarted) {
        return;
    }


    coinPosition =
        document.querySelector(".game").offsetWidth + 80;


    coin.style.left =
        coinPosition + "px";

    coin.style.right =
        "auto";

    coin.style.display =
        "block";


    coinCollected = false;

    coinActive = true;


    moveCoin();
}


// ===============================
// MOVE COIN
// ===============================

function moveCoin() {

    if (!gameStarted) {
        return;
    }

    if (!coinActive) {
        return;
    }


    coinPosition -=
        coinSpeed;


    coin.style.left =
        coinPosition + "px";


    if (coinPosition < -40) {

        coin.style.display =
            "none";

        coinActive = false;

        scheduleCoin();

        return;
    }


    checkCoinCollision();


    requestAnimationFrame(
        moveCoin
    );
}


// ===============================
// COIN COLLISION
// ===============================

function checkCoinCollision() {

    if (!coinActive) {
        return;
    }

    if (coinCollected) {
        return;
    }


    let playerRect =
        player.getBoundingClientRect();

    let coinRect =
        coin.getBoundingClientRect();


    if (
        playerRect.left <
        coinRect.right &&

        playerRect.right >
        coinRect.left &&

        playerRect.top <
        coinRect.bottom &&

        playerRect.bottom >
        coinRect.top
    ) {

        coinCollected = true;

        coinActive = false;


        score += 2;


        scoreDisplay.textContent =
            score;


        updateLevel();

        checkHighScore();


        coin.style.display =
            "none";


        coinMessage.textContent =
            "+2";


        coinMessage.style.display =
            "block";


        setTimeout(
            function () {

                coinMessage.style.display =
                    "none";

            },
            700
        );


        scheduleCoin();
    }
}


// ===============================
// PERIODIC HEALTH
// ===============================

function scheduleHealth() {

    if (!gameStarted) {
        return;
    }


    healthTimer =
        setTimeout(
            function () {

                if (gameStarted) {
                    startHealth();
                }

            },
            8000
        );
}


// ===============================
// START HEALTH
// ===============================

function startHealth() {

    if (!gameStarted) {
        return;
    }


    healthPosition =
        document.querySelector(".game").offsetWidth + 120;


    health.style.left =
        healthPosition + "px";

    health.style.right =
        "auto";

    health.style.display =
        "block";


    healthActive = true;


    moveHealth();
}


// ===============================
// MOVE HEALTH
// ===============================

function moveHealth() {

    if (!gameStarted) {
        return;
    }

    if (!healthActive) {
        return;
    }


    healthPosition -=
        healthSpeed;


    health.style.left =
        healthPosition + "px";


    if (healthPosition < -60) {

        health.style.display =
            "none";

        healthActive = false;

        scheduleHealth();

        return;
    }


    checkHealthCollision();


    requestAnimationFrame(
        moveHealth
    );
}


// ===============================
// HEALTH COLLISION
// ===============================

function checkHealthCollision() {

    if (!healthActive) {
        return;
    }


    let playerRect =
        player.getBoundingClientRect();

    let healthRect =
        health.getBoundingClientRect();


    if (
        playerRect.left <
        healthRect.right &&

        playerRect.right >
        healthRect.left &&

        playerRect.top <
        healthRect.bottom &&

        playerRect.bottom >
        healthRect.top
    ) {

        healthActive = false;

        health.style.display =
            "none";


        if (lives < 3) {

            lives++;

            livesDisplay.textContent =
                lives;
        }


        scheduleHealth();
    }
}


// ===============================
// JUMP
// ===============================

function jump() {

    if (!gameStarted) {
        return;
    }

    if (isJumping) {
        return;
    }


    isJumping = true;


    player.style.transform =
        "translateY(-120px)";


    setTimeout(
        function () {

            player.style.transform =
                "translateY(0)";

            isJumping = false;

        },
        600
    );
}


// ===============================
// JUMP BUTTON
// ===============================

jumpButton.addEventListener(
    "click",
    function () {

        jump();
    }
);


// ===============================
// SPACEBAR
// ===============================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.code === "Space") {

            event.preventDefault();

            jump();
        }
    }
);


// ===============================
// OBSTACLE COLLISION
// ===============================

function checkCollision() {

    let playerRect =
        player.getBoundingClientRect();

    let obstacleRect =
        obstacle.getBoundingClientRect();


    if (
        playerRect.left <
        obstacleRect.right &&

        playerRect.right >
        obstacleRect.left &&

        playerRect.top <
        obstacleRect.bottom &&

        playerRect.bottom >
        obstacleRect.top
    ) {


        if (isJumping) {
            return;
        }


        if (hitCooldown) {
            return;
        }


        hitCooldown = true;


        lives--;


        livesDisplay.textContent =
            lives;


        obstaclePosition =
            document.querySelector(".game").offsetWidth + 50;


        obstacle.style.left =
            obstaclePosition + "px";


        if (lives <= 0) {

            gameStarted = false;

            coinActive = false;

            healthActive = false;


            coin.style.display =
                "none";

            health.style.display =
                "none";


            clearTimeout(coinTimer);

            clearTimeout(healthTimer);


            checkHighScore();


            let finalScore =
                document.querySelector("#finalScore");


            if (finalScore) {

                finalScore.textContent =
                    score;
            }


            updateHighScoreDisplay();


            gameOverScreen.style.display =
                "block";


            startButton.textContent =
                "START GAME";
        }


        setTimeout(
            function () {

                hitCooldown = false;

            },
            800
        );
    }
}


// ===============================
// RESTART
// ===============================

restartButton.addEventListener(
    "click",
    function () {

        startGame();
    }
);