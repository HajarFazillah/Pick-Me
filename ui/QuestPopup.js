// QuestPopup.js
export default class QuestPopup {
    constructor(scene) {
        this.scene = scene;
        this.popup = null;
        this.timerEvent = null;
    }

    show(questData) {
        // Clean up previous popup
        if (this.popup) {
            this.popup.destroy();
            this.popup = null;
        }
         if (this.timerEvent) {
            this.timerEvent.remove();
            this.timerEvent = null;
        }

        // Calculate center for popup
        const centerX = this.scene.cameras.main.centerX;
        const centerY = this.scene.cameras.main.centerY;

        // Sizing constants
        const scale = 1;
        const bgWidth = 500;
        const bgHeight = 700;
        const questBoxWidth = 450 * scale;
        const questBoxHeight = 85 * scale;
        const weeklyBoxHeight = 110 * scale;
        const fontLg = 23 * scale;
        const fontMd = 20 * scale;
        const progressBarWidth = 260 * scale;
        const progressBarHeight = 13 * scale;
        const iconSize = 70 * scale;
        const gap = 18 * scale;  // spacing between boxes

        // Main popup box
        this.popup = this.scene.add.container(centerX, centerY);

         // Blocker (blocks lever click)
        const blocker = this.scene.add.rectangle(0, 0, bgWidth * scale, bgHeight * scale, 0x000000, 0)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: false });
        this.popup.add(blocker); 

       // Popup background
        const bg = this.scene.add.rectangle(0, 0, bgWidth * scale, bgHeight * scale, 0xf7e6af)
            .setStrokeStyle(2, 0xbdc8cc)
            .setOrigin(0.5);
        this.popup.add(bg);

       // Timer (top right)
        const timerText = this.scene.add.text(bgWidth * scale / 2 - 95 * scale, -bgHeight * scale / 2 + 25 * scale, '', { fontSize: 18 * scale, color: '#444' });
        this.popup.add(timerText);
        const timerIcon = this.scene.add.circle(bgWidth * scale / 2 - 115 * scale, -bgHeight * scale / 2 + 32 * scale, 12 * scale, 0xf7e6af)
            .setStrokeStyle(1, 0x444444);
        this.popup.add(timerIcon);
         // Timer update (KST)
        function getKSTTime() {
            const now = new Date();
            const utc = now.getTime() + now.getTimezoneOffset() * 60000;
            const kstTime = new Date(utc + 9 * 3600000);
            return kstTime;
        }

        const updateTimer = () => {
        const now = getKSTTime();
        let midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const diff = Math.max(0, midnight - now);
        const seconds = Math.floor(diff / 1000);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

  timerText.setText(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`);
};

updateTimer()
this.timerEvent = this.scene.time.addEvent({
  delay: 1000,
  callback: updateTimer,
  loop: true
});

         // --- Unified Quest List ---
        const allQuests = [
            {
                // Weekly quest at top, flagged
                title: questData.weekly.title,
                curValue: questData.weekly.curValue,
                goalValue: questData.weekly.goalValue,
                status: questData.weekly.status,
                isWeekly: true
            },
            ...questData.quests.map(q => ({
                title: q.title,
                curValue: q.curValue,
                goalValue: q.goalValue,
                status: q.status,
                isWeekly: false
            }))
        ];

// --- Center all quest boxes within the background ---
        const n = allQuests.length;
        const totalBoxesHeight = weeklyBoxHeight + (n - 1) * questBoxHeight;
        const firstBoxStartY = -totalBoxesHeight / 2 + weeklyBoxHeight / 2 + gap;

        allQuests.forEach((quest, idx) => {
            let baseY;
            if (idx === 0) {
                // Weekly quest 
                baseY = firstBoxStartY + weeklyBoxHeight / 4 + (idx - 1) * (questBoxHeight + gap) + questBoxHeight / 3;
                const questBg = this.scene.add.rectangle(0, baseY, questBoxWidth, weeklyBoxHeight, 0xdabbfd).setOrigin(0.5);
                this.popup.add(questBg);

                // "월요일 보상" top white
                this.popup.add(this.scene.add.text(0, baseY - weeklyBoxHeight / 2 + 20 * scale, "월요일 보상", {
                    fontSize: fontMd,
                    color: "#ffffff"
                }).setOrigin(0.5));

                // Title (centered below)
                this.popup.add(this.scene.add.text(0, baseY - weeklyBoxHeight / 2 + 42 * scale, quest.title, {
                    fontSize: fontLg,
                    color: "#222"
                }).setOrigin(0.5, 0));

                // Progress bar (full width, same as rest)
                const pbBg = this.scene.add.rectangle(-questBoxWidth/2 + 40 * scale, baseY + 25 * scale, progressBarWidth, progressBarHeight, 0xffffff)
                    .setOrigin(0, 0.5).setStrokeStyle(1, 0x666);
                this.popup.add(pbBg);
                const progress = Math.max(0, Math.min(1, quest.curValue / quest.goalValue));
                const pbFill = this.scene.add.rectangle(-questBoxWidth/2 + 40 * scale, baseY + 25 * scale, progress * progressBarWidth, progressBarHeight, 0x000000)
                    .setOrigin(0, 0.5);
                this.popup.add(pbFill);

                // Reward button
                let iconColor = 0xffffff;
                if (quest.status === "완료") iconColor = 0xdadbdb;
                if (quest.status === "수령") iconColor = 0x222222;
                const btn = this.scene.add.rectangle(questBoxWidth/2 - 40 * scale, baseY + 5 * scale, iconSize, iconSize, iconColor).setStrokeStyle(2, 0xdbdbdb);
                this.popup.add(btn);
            } else {
                // Regular quests
                baseY = firstBoxStartY + weeklyBoxHeight / 4 + (idx - 1) * (questBoxHeight + gap) + questBoxHeight / 2;
                const questBg = this.scene.add.rectangle(0, baseY, questBoxWidth, questBoxHeight, 0xffd55c).setOrigin(0.5);
                this.popup.add(questBg);

                // Title (left)
                this.popup.add(this.scene.add.text(-questBoxWidth/2 + 40 * scale, baseY, quest.title, {
                    fontSize: fontLg,
                    color: "#222"
                }).setOrigin(0, 0.5));

                // Progress bar
                const pbBg = this.scene.add.rectangle(-questBoxWidth/2 + 40 * scale, baseY + 18 * scale, progressBarWidth, progressBarHeight, 0xffffff)
                    .setOrigin(0, 0.5).setStrokeStyle(1, 0x666);
                this.popup.add(pbBg);
                const progress = Math.max(0, Math.min(1, quest.curValue / quest.goalValue));
                const pbFill = this.scene.add.rectangle(-questBoxWidth/2 + 40 * scale, baseY + 18 * scale, progress*progressBarWidth, progressBarHeight, 0x000000)
                    .setOrigin(0, 0.5);
                this.popup.add(pbFill);

                // Reward button
                let iconColor = 0xffffff;
                if (quest.status === "완료") iconColor = 0xdadbdb;
                if (quest.status === "수령") iconColor = 0x222222;
                const btn = this.scene.add.rectangle(questBoxWidth/2 - 40 * scale, baseY + 2 * scale, iconSize, iconSize, iconColor).setStrokeStyle(2, 0xdbdbdb);
                this.popup.add(btn);
            }
        });

        // --- X Button Bottom Left
       const xBtnSize = 48; 
const closeBtn = this.scene.add.text(
    -bgWidth * scale / 2 + xBtnSize,  // X: left edge + offset
    bgHeight * scale / 1.9 - xBtnSize,  // Y: bottom edge - offset
    'X',
    {
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#91131a',
      fontFamily: 'Arial'
    }
).setOrigin(0.5).setInteractive({ useHandCursor: true });

closeBtn.on('pointerover', () => closeBtn.setColor('#fa5555'));
closeBtn.on('pointerout', () => closeBtn.setColor('#91131a'));
closeBtn.on('pointerdown', () => {
    this.popup.destroy();
    this.popup = null;
    if (this.timerEvent) {
        this.timerEvent.remove();
        this.timerEvent = null;
    }
});
this.popup.add(closeBtn);
    }
}