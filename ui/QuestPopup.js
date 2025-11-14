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

        // Main popup box
        this.popup = this.scene.add.container(centerX, centerY);
        // --- [2] BLOCK CLICK THROUGH ---
        // Add a fully transparent blocker rectangle as the first child to block lever clicks
        const blocker = this.scene.add.rectangle(0, 0, 420, 480, 0x000000, 0)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: false });
        this.popup.add(blocker); // This makes sure all events inside popup are blocked!
        const bg = this.scene.add.rectangle(0, 0, 420, 480, 0xf7e6af)
            .setStrokeStyle(2, 0xbdc8cc)
            .setOrigin(0.5);
        this.popup.add(bg);

       // --- [3] TIMER POSITION & REAL TIME ---
        // Create timer text (top right in popup)
        const timerText = this.scene.add.text(bg.width / 2 - 85, -bg.height / 2 + 25, '', { fontSize: '18px', color: '#444' });
        this.popup.add(timerText);
        // Draw timer icon next to text
        const timerIcon = this.scene.add.circle(bg.width / 2 - 115, -bg.height / 2 + 32, 12, 0xf7e6af)
            .setStrokeStyle(1, 0x444444);
        this.popup.add(timerIcon);
        // Timer update function
        function getKSTTime() {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const kstTime = new Date(utc + 9 * 3600000); // KST is UTC+9
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

        allQuests.forEach((quest, idx) => {
            // Spacing: first box starts at -155, then +70 for each following
            const baseY = -155 + idx * 70;
            // Background box color
            const bgColor = quest.isWeekly ? 0xdabbfd : 0xffd55c;
            const questBg = this.scene.add.rectangle(0, baseY, 370, 65, bgColor).setOrigin(0.5);
            this.popup.add(questBg);

            // Weekly "월요일 보상" label above first box
            if (idx === 0) {
                const weeklyRewardLabel = this.scene.add.text(-40, baseY - 23, "월요일 보상", { fontSize: "17px", color: "#ffffffff" }).setOrigin(0.5);
                this.popup.add(weeklyRewardLabel);
            }

            // Quest Title
            this.popup.add(this.scene.add.text(-130, baseY - 13, quest.title, { fontSize: "19px", color: "#222" }).setOrigin(0, 0));

            // Unified progress bars (always same width and x)
            const pbBg = this.scene.add.rectangle(-130, baseY + 18, 170, 11, 0xffffff).setOrigin(0, 0.5).setStrokeStyle(1, 0x666);
            this.popup.add(pbBg);
            const progress = Math.max(0, Math.min(1, quest.curValue / quest.goalValue));
            const pbFill = this.scene.add.rectangle(-130, baseY + 18, progress * 170, 11, 0x000000).setOrigin(0, 0.5);
            this.popup.add(pbFill);

            // Reward Button/Icon (same alignment for all)
            let iconColor = 0xffffff;
            if (quest.status === "완료") iconColor = 0xdadbdb;
            if (quest.status === "수령") iconColor = 0x222222;
            const btn = this.scene.add.rectangle(120, baseY + 2, 56, 56, iconColor).setStrokeStyle(2, 0xdbdbdb);
            this.popup.add(btn);
        });


        // --- [1] X Button at BOTTOM LEFT ---
        // Place closeBtn at the bottom left, using negative X and positive Y
        const closeBtn = this.scene.add.text(-bg.width / 2 + 30, bg.height / 2 - 30, 'X', { fontSize: '32px', color: '#c70a2a' })
            .setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.popup.add(closeBtn);
        // Close the popup on click
        closeBtn.on('pointerdown', () => {
            this.popup.destroy();
            this.popup = null;
            if (this.timerEvent) {
                this.timerEvent.remove();
                this.timerEvent = null;
            }
        });
    }
}