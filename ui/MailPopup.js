//MailPopup.js
export default class MailPopup {
    constructor(scene) {
        this.scene = scene;
        this.popup = null;
        this.innerPopup = null;
    }

    show(mailList) {
        // Destroy previous popups if open
        if (this.popup) this.popup.destroy();
        if (this.innerPopup) this.innerPopup.destroy();

        // Popup background settings
        const centerX = this.scene.cameras.main.centerX;
        const centerY = this.scene.cameras.main.centerY;
        const width = 500, height = 700;
        const boxHeight = 105;
        const fontMd = 20, fontLg = 23;

        // Main mail popup
        this.popup = this.scene.add.container(centerX, centerY);

        // Panel background
        const bg = this.scene.add.rectangle(0, 0, width, height, 0xf7e6af)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0xbdc8cc);
        this.popup.add(bg);

        // Mail list: vertically stack mail items
        mailList.forEach((mail, idx) => {
            const boxY = -height / 2 + 55 + idx * (boxHeight + 8);

            // Draw each mail item box
            const mailBox = this.scene.add.rectangle(0, boxY, width - 40, boxHeight, 0xffffff)
                .setOrigin(0.5)
                .setStrokeStyle(0.5, 0xdddddd);
            this.popup.add(mailBox);

            // Icon (Envelope) – can preload or use a shape for demo
            const icon = this.scene.add.image(-width / 2 + 65, boxY, 'mail_icon')
                .setOrigin(0.5)
                .setDisplaySize(66, 44);
            this.popup.add(icon);

            // Sender name and preview
            this.popup.add(this.scene.add.text(-width / 2 + 120, boxY - 22, `보낸 사람: ${mail.sender}`, { fontSize: fontMd, color: "#222" }));
            this.popup.add(this.scene.add.text(-width / 2 + 120, boxY + 8, mail.title, { fontSize: fontMd, color: "#222" }));
            
            // Duration at right
            this.popup.add(this.scene.add.text(width / 2 - 150, boxY - 22, `보유 기간 n일`, { fontSize: fontMd - 2, color: "#222" }));

            // Make mail openable (popup inner)
            mailBox.setInteractive({ useHandCursor: true });
            mailBox.on('pointerdown', () => this.showDetail(mail));
        });

        // Close button
        const xBtn = this.scene.add.image(-width/2 + 32, height/2 - 32, 'exit_button')
            .setOrigin(0.5)
            .setDisplaySize(48, 48)
            .setInteractive({ useHandCursor: true });
        xBtn.on('pointerdown', () => { this.popup.destroy(); this.popup = null; });
        this.popup.add(xBtn);
    }

    showDetail(mail) {
        // Optional: destroy previous detail
        if (this.innerPopup) this.innerPopup.destroy();

        // Popup panel reused
        const centerX = this.scene.cameras.main.centerX;
        const centerY = this.scene.cameras.main.centerY;
        const width = 500, height = 700;

        this.innerPopup = this.scene.add.container(centerX, centerY);

        // Panel background
        const bg = this.scene.add.rectangle(0, 0, width, height, 0xf7e6af)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0xbdc8cc);
        this.innerPopup.add(bg);

        // Mail Details
        this.innerPopup.add(this.scene.add.text(-width/2+40, -height/2+50, `보낸 사람: ${mail.sender}\n${mail.content}`, {
            fontSize: 21,
            color: "#222"
        }));

        // Reward button only if mail.hasReward === true
        if (mail.hasReward && !mail.received) {
            const rewardBtn = this.scene.add.image(0, height/2-55, 'mail_rewardBtn')
                .setOrigin(0.5)
                .setDisplaySize(320, 70)
                .setInteractive({ useHandCursor: true });
            rewardBtn.on('pointerdown', () => {
                mail.received = true;
                this.showRewardReceived(mail.reward);
            });
            this.innerPopup.add(rewardBtn);
        } else {
            // Disabled button state
            const rewardBtn = this.scene.add.image(0, height/2-55, 'mail_rewardBtnX')
                .setOrigin(0.5)
                .setDisplaySize(320, 70);
            this.innerPopup.add(rewardBtn);
        }

        // Close button
        const xBtn = this.scene.add.image(-width/2 + 32, height/2 - 32, 'exit_button')
            .setOrigin(0.5)
            .setDisplaySize(48, 48)
            .setInteractive({ useHandCursor: true });
        xBtn.on('pointerdown', () => { this.innerPopup.destroy(); this.innerPopup = null; });
        this.innerPopup.add(xBtn);
    }

    showRewardReceived(reward) {
        // Simple reward popup, show at center
        const w = 340, h = 185;
        const popup = this.scene.add.container(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY);

        const bg = this.scene.add.rectangle(0, 0, w, h, 0xdbdbdb).setOrigin(0.5);
        popup.add(bg);

        // Coin image and description
        const coin = this.scene.add.image(0, 0, 'quest_coin').setOrigin(0.5).setDisplaySize(125, 125);
        popup.add(coin);
        popup.add(this.scene.add.text(-120, 60, `보상을 받았습니다.`, { fontSize: 30, color: "#222" }));

        // Confirm button (reuse yes_button asset or 'X' image)
        const yesBtn = this.scene.add.image(150, 78, 'yes_button')
            .setOrigin(0.5)
            .setDisplaySize(30, 30)
            .setInteractive({ useHandCursor: true });
        yesBtn.on('pointerdown', () => popup.destroy());
        popup.add(yesBtn);

        // Optionally close mail detail popup as well
        if (this.innerPopup) { this.innerPopup.destroy(); this.innerPopup = null; }
    }
}