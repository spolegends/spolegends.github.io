kaboom();

const GRAVITY = 3200;
const WIDTH = width();
const HEIGHT = height();

const BACKGROUND_COLOR = Color.fromHex('#b6e5ea');
const PIPE_COLOR = Color.fromHex('#74c02e');

const PIPE_WIDTH = 64;
const PIPE_BORDER = 4;
const PIPE_OPEN = 240;
const PIPE_MIN_HEIGHT = 50;

const JUMP_FORCE = 800;
const SPEED = 320;    
const CELING = -60;

loadSprite("bird", "bird.png");
loadSprite("pipeUp", "pipeUp.png");
loadSprite("background", "background.png");
loadSprite("pipeDown", "pipeDown.png");
loadSound("jump", "wing.mp3");
loadSound("die", "die.wav");
loadSound("score", "score.wav");



setGravity(GRAVITY);
setBackground(BACKGROUND_COLOR);

const startGame = () => {
    add([
        text("Нажмите на пробел чтобы начать игру"),
        pos(center()),
        scale(2),
        anchor("center"),
    ]);
    onKeyPress("space", () => {    go("game");});
}


scene("game", () => {
    let score = 0;

    const game = add([timer()]);
    
    const createBird = () => {
        const bird = game.add([
            sprite("bird"),
            pos(WIDTH / 4, 0),
            area(),
            body()
        ])

        return bird;
    }
    const bird = createBird();

    const jump = () => {
        bird.jump(JUMP_FORCE);
        play("jump");
    }

    onClick(jump);
    onKeyPress("space", jump);

    const createPipes = () => {
        const topPipeMinHeight = rand(PIPE_MIN_HEIGHT, HEIGHT - PIPE_MIN_HEIGHT - PIPE_OPEN);
        const bottomPipeHeight = HEIGHT - topPipeMinHeight - PIPE_OPEN;

        game.add([
            rect(PIPE_WIDTH, topPipeMinHeight),
            pos(WIDTH, 0),
            color(PIPE_COLOR),
            outline(PIPE_BORDER),
            area(),
            move(LEFT, SPEED),
            offscreen({ destroy: true}),
            "pipe"
        ]);

        game.add([
            rect(PIPE_WIDTH, bottomPipeHeight),
            pos(WIDTH, topPipeMinHeight + PIPE_OPEN),
            color(PIPE_COLOR),
            outline(PIPE_BORDER),
            area(),
            move(LEFT, SPEED),
            offscreen({ destroy: true}),
            "pipe",
            { passed: false }
        ]);
    }

    game.loop(1, createPipes);

    bird.onUpdate(() => {
        const birdPosY = bird.pos.y;

        if (birdPosY > HEIGHT || birdPosY <= CELING){
            go("lose");
        }
    });

    bird.onCollide(() => {
        play("die");
        go("lose", score);
    });

    const createScoreLabel = () => {
        const scoreLabel = game.add([
            text(score),
            anchor("center"),
            pos(WIDTH / 2, 80),
            scale(2),
            fixed(),
            z(100)
        ])
        return scoreLabel;
    }
    const scoreLabel = createScoreLabel();

    const addScore = () => {
        score++;
        scoreLabel.text = score;

        play("score");
    }

    onUpdate("pipe", pipe => {
        if(bird.pos.x > pipe.pos.x + pipe.width && pipe.passed === false){
            addScore();
            pipe.passed = true;
        }
            
    })
});


scene("lose", (score = 0) =>{
    add([
        text("Ваш  результат: " + score),
        pos(center()),
        scale(3),
        anchor("center"),
    ]);

    onClick(startGame);
    onKeyPress("space", startGame);


});

startGame();
