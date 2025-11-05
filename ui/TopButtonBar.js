import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js';

// TopButtonBar.js

export default class TopButtonBar {

    constructor(scene, startX, startY) {
        this.scene = scene;
        this.container = scene.add.container(startX, startY);
        
        this.buttonRadius = 25;
        this.buttonGap = 34;
        this.buttonLabels = ['퀘스트', '메일', '설정', '공지'];
        
        this.popup = null;
        this.createButtonBar();
    }

    createButtonBar() {
        this.scene.cameras.main.setBackgroundColor('#ffffff');

        this.buttonsGroup = this.scene.add.container(0, 48);
        this.buttonLabels.forEach((label, i) => {
            const x = i * (this.buttonRadius * 2 + this.buttonGap);
            const btn = this.scene.add.circle(x, 0, this.buttonRadius, 0xffffff)
                .setStrokeStyle(4, 0x8887f6)
                .setInteractive({ useHandCursor: true });
            const txt = this.scene.add.text(x, this.buttonRadius + 10, label, {
                fontSize: '22px', color: '#222', fontFamily: 'Arial'
            }).setOrigin(0.5, 0);

            btn.on('pointerover', () => btn.setFillStyle(0xf4f6ff));
            btn.on('pointerout', () => btn.setFillStyle(0xffffff));
            btn.on('pointerdown', () => this.showSimplePopup(label + ' 팝업입니다'));

            this.buttonsGroup.add([btn, txt]);
        });

        const totalButtonsWidth = this.buttonLabels.length * this.buttonRadius * 2 +
            (this.buttonLabels.length - 1) * this.buttonGap;
        const centerX = this.scene.cameras.main.centerX;
        this.buttonsGroup.x = this.scene.cameras.main.centerX - totalButtonsWidth / 2;
        this.container.add(this.buttonsGroup);
    }

    showSimplePopup(message) {
    
        if (this.popup) {
            this.popup.destroy();
            this.popup = null;
        }
    
        const centerX = this.scene.cameras.main.centerX;
        const centerY = 300;

        this.popup = this.scene.add.container(centerX, centerY);
        const bg = this.scene.add.rectangle(0, 0, 360, 200, 0xe0e0e0)
        .setStrokeStyle(2, 0x000000)
        .setOrigin(0.5);
        this.popup.add(bg);

        const msgText = this.scene.add.text(0, 0, message, {
            fontSize: '22px', color: '#000', fontFamily: 'Arial'
        }).setOrigin(0.5);
        this.popup.add(msgText);

        const xBtnSize = 30;
        const xBtn = this.scene.add.text(bg.width / 2 - xBtnSize, -bg.height / 2 + xBtnSize, 'X', {
            fontSize: '28px', fontStyle: 'bold', color: '#91131a', fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.popup.add(xBtn);

        xBtn.on('pointerover', () => xBtn.setColor('#fa5555'));
        xBtn.on('pointerout', () => xBtn.setColor('#91131a'));
        xBtn.on('pointerdown', () => {
            this.popup.destroy();
            this.popup = null;
        });
    }

    showMailPopup() {
        
        if (this.popup) {
            this.popup.destroy();
            this.popup = null;
        }
        const centerX = this.cameras.main.centerX;
        const centerY = 300;

        this.popup = this.add.container(centerX, centerY);
        const bg = this.add.rectangle(0, 0, 400, 300, 0xffcce2)
            .setStrokeStyle(2, 0x000000)
            .setOrigin(0.5);
        this.popup.add(bg);

        const xBtnSize = 36;
        const xBtn = this.add.text(bg.width/2 - xBtnSize, -bg.height/2 + xBtnSize, 'X', {
        fontSize: '28px', fontStyle: 'bold', color: '#91131a', fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.popup.add(xBtn);

        xBtn.on('pointerover', () => xBtn.setColor('#fa5555'));
        xBtn.on('pointerout', () => xBtn.setColor('#91131a'));
        xBtn.on('pointerdown', () => {
        this.popup.destroy();
        this.popup = null;
        });

        // Example mail list (you can replace with dynamic message list)
        const mails = [
            '메시지1: 환영합니다!',
            '메시지2: 보상 수령하세요.',
            '메시지3: 새 친구가 추가되었습니다.',
            '메시지4: 이벤트 안내'
        ];
    
        mails.forEach((msg, i) => {
            const item = this.add.text(-140, -140 + i * 38, msg, {
            fontSize: '21px', color: '#222'
            }).setOrigin(0, 0);
        this.popup.add(item);
        });
    }

}
