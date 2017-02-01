 var Game = function () {
     this.c = new Shuriken.Shuriken(this, "canvas", 500, 150, "#000");

     // paramour
     this.c.entities.create(Person, {
         center: {
             x: 250,
             y: 40
         },
         color: "#099"
     });

     // player
     this.c.entities.create(Person, {
         center: {
             x: 256,
             y: 110
         },
         color: "#f07",
         update: function () {
             if (this.c.inputter.isDown(Shuriken.KeyboardButton.UP_ARROW)) {
                 this.center.y -= 0.4;
             }
         },

         collision: function (other) {
             other.center.y = this.center.y; // follow the player
         }
     });
 };

 var Person = function (game, settings) {
     this.c = game.c;
     for (var i in settings) {
         this[i] = settings[i];
     }

     this.size = {
         width: 9,
         height: 9
     };
     this.draw = function (ctx) {
         ctx.fillStyle = settings.color;
         ctx.fillRect(this.center.x - this.size.width / 2,
             this.center.y - this.size.height / 2,
             this.size.width,
             this.size.height);
     };
 };

 window.addEventListener('load', function () {
     new Game();
 });