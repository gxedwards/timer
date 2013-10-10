$(function () {

    // beep if present
    function playBeep() {
        if (navigator){
            console.log("beep");
            navigator.notification.beep(1);
        }
    }

    /**
     * Countdown timer. Start, pause, reset
     */
    var TimerVM = function () {

        var self = this;

        // configuration information
        self.cfg = {
            initialValue: "Start to Go",
            completeValue: "Complete",
            seconds: 1 * 5,
            warmup: 5,
            work: 20,
            rest: 10,
            reps: 8
        };

        self.actionColor = ko.observable("orange");
        self.totalSecs = (self.cfg.work + self.cfg.rest) * self.cfg.reps;

        self.seconds = ko.observable(self.cfg.seconds);
        self.startTime = ko.observable();
        self.clock = ko.observable(self.cfg.initialValue);

        self.interval = ko.observable();

        self.intervalStates = [];

        // the index of the states
        self.currentInterval = ko.observable(0);

        // the current rep we are in
        self.rep = ko.observable(0);

        self.realsecs;
        self.startTime;

        // keep the state of the timer
        self.isRunning = ko.observable(false);
        self.isPaused = ko.observable(false);

        /**
         *
         *
         */
        self.start = function () {

            console.log("Start");


            console.log ("initializing intervals");
            // create an array of all the periods that we are working with. A warmup then n work
            self.intervalStates.push( {"name": "Warmup", "start": self.cfg.warmup, "rep": 0, "actionColor" : "orange"});
            for (var i=0; i < self.cfg.reps; i++){
                var rep = i +1;
                self.intervalStates.push({"name": "Work", "start": self.cfg.work, "rep": rep, "actionColor": "green"});
                self.intervalStates.push({"name": "Rest", "start": self.cfg.rest, "rep": rep, "actionColor": "red"});
            };
            self.currentInterval(0);

            self.clock (self.intervalStates[0].name + ":" +self.intervalStates[0].start);


            self.isRunning(true);
            self.startTime(new Date());
            self.interval ( window.setInterval(self.run, 1000) );
        };

        self.updateConfig  = function (){

        };

        self.pause = function () {

            if (!self.isPaused()) {
                console.log("Pausing");
                self.isPaused(true);
                //self.seconds(realsecs);
                window.clearTimeout(self.interval());
            } else {
                self.resume();
            }
        };

        self.doAction = function() {
            console.log("do Action");
        }

        self.reset = function () {
            console.log("Reset")
            window.clearTimeout(self.interval());
            // clear out everything
            self.intervalStates.length = 0;
            self.interval(0);
            self.rep(0);

            self.clock(self.cfg.initialValue);
            self.seconds(self.cfg.seconds);
            self.isRunning(false);
            self.isPaused(false);

        };

        self.resume = function () {
            console.log("Resuming");
            // this is resume
            self.isRunning(true);
            self.startTime(new Date());
            self.interval ( window.setInterval(self.run, 1000) );
            self.isPaused(false);
        };

        self.run = function () {
            console.log("Doing tick");

            // reduce the current interval time
            self.intervalStates[self.currentInterval()].start--;

            var val = self.intervalStates[self.currentInterval()].start;

            if (val > 0 && val <= 3){
                playBeep();
            }

            if (val == 0){

                var newCurrentInterval = self.currentInterval() + 1;
                self.currentInterval(newCurrentInterval);
            }

            if (self.currentInterval() < self.intervalStates.length){
                var currentIntervalState = self.intervalStates[self.currentInterval()];
                self.rep(currentIntervalState.rep);
                self.clock (currentIntervalState.name + "\n" +currentIntervalState.start);
                self.actionColor(currentIntervalState.actionColor);
            } else {

                console.log("clearing interval");
                window.clearTimeout(self.interval());
                self.clock(self.cfg.completeValue);
            }
        };

    };

    ko.applyBindings(new TimerVM());

});
