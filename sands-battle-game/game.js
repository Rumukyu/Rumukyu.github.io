let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

let player;
let sands;
let cursors;
let hp = 100;
let hpText;
let dialogText;
let attackPatternActive = false;

let game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('sands', 'assets/sands.png');
    this.load.audio('megalo', 'assets/megalo.ogg');
}

function create() {
    // サウンド再生
    let bgMusic = this.sound.add('megalo');
    bgMusic.play();

    // プレイヤー生成
    player = this.physics.add.sprite(400, 500, 'player');
    sands = this.add.image(400, 100, 'sands');

    // キー入力設定
    cursors = this.input.keyboard.createCursorKeys();

    // HP表示
    hpText = document.getElementById('hp-text');
    dialogText = document.getElementById('dialogBox');

    // サンズ攻撃開始
    startSansAttack(this);
}

function update() {
    // プレイヤー移動
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
    } else {
        player.setVelocityY(0);
    }
}

function startSansAttack(scene) {
    // 簡単な攻撃パターンを開始
    scene.time.addEvent({
        delay: 1000,
        callback: function () {
            if (!attackPatternActive) {
                createSansAttack(scene);
            }
        },
        loop: true
    });
}

function createSansAttack(scene) {
    attackPatternActive = true;
    let attack = scene.add.rectangle(400, 200, 50, 50, 0xff0000);
    scene.physics.add.existing(attack);
    scene.physics.add.collider(player, attack, playerHit);

    scene.tweens.add({
        targets: attack,
        y: 600,
        duration: 2000,
        onComplete: function () {
            attack.destroy();
            attackPatternActive = false;
        }
    });
}

function playerHit() {
    hp -= 10;
    hpText.innerText = `HP: ${hp}`;
    if (hp <= 0) {
        dialogText.innerText = "SANS: 「お前はよくやったが、ここで終わりだ…」";
        player.setTint(0xff0000);
        player.setVelocity(0);
    }
}
