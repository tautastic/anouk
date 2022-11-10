function KeyboardInputManager() {
    this.events = {};

    this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
    const callbacks = this.events[event];
    if (callbacks) {
        callbacks.forEach(function (callback) {
            callback(data);
        });
    }
};

KeyboardInputManager.prototype.listen = function () {
    const self = this;

    const map = {
        "ArrowUp": 0, // Up
        "ArrowRight": 1, // Right
        "ArrowDown": 2, // Down
        "ArrowLeft": 3, // Left
        "KeyW": 0, // W
        "KeyD": 1, // D
        "KeyS": 2, // S
        "KeyA": 3  // A
    };

    document.addEventListener("keydown", function (event) {
        const modifiers = event.altKey || event.ctrlKey || event.metaKey ||
            event.shiftKey;
        const mapped = map[event.code];

        if (!modifiers) {
            if (mapped !== undefined) {
                event.preventDefault();
                self.emit("move", mapped);
            }

            if (event.code === "Space") self.restart.bind(self)(event);
        }
    });

    const retry = document.querySelector(".retry-button");
    retry.addEventListener("click", this.restart.bind(this));
    retry.addEventListener("touchend", this.restart.bind(this));

    const keepPlaying = document.querySelector(".keep-playing-button");
    keepPlaying.addEventListener("click", this.keepPlaying.bind(this));
    keepPlaying.addEventListener("touchend", this.keepPlaying.bind(this));

    // Listen to swipe events
    let touchStartClientX, touchStartClientY;
    const gameContainer = document.getElementsByClassName("game-container")[0];

    gameContainer.addEventListener("touchstart", function (event) {
        if (event.touches.length > 1) return;

        touchStartClientX = event.touches[0].clientX;
        touchStartClientY = event.touches[0].clientY;
        event.preventDefault();
    });

    gameContainer.addEventListener("touchmove", function (event) {
        event.preventDefault();
    });

    gameContainer.addEventListener("touchend", function (event) {
        if (event.touches.length > 0) return;

        const dx = event.changedTouches[0].clientX - touchStartClientX;
        const absDx = Math.abs(dx);

        const dy = event.changedTouches[0].clientY - touchStartClientY;
        const absDy = Math.abs(dy);

        if (Math.max(absDx, absDy) > 10) {
            // (right : left) : (down : up)
            self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
        }
    });
};

KeyboardInputManager.prototype.restart = function (event) {
    event.preventDefault();
    this.emit("restart");
};

KeyboardInputManager.prototype.keepPlaying = function (event) {
    event.preventDefault();
    this.emit("keepPlaying");
};
