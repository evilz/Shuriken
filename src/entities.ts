namespace shuriken {

    export class Entities {

        private _shuriken: Shuriken;
        private _game;
        private _entities = [];

        constructor(shuriken: Shuriken, game) {
            this._shuriken = shuriken;
            this._game = game;
        }

        public update(interval: number) {
            let entities = this.all();
            for (var i = 0, len = entities.length; i < len; i++) {
                if (entities[i].update !== undefined) {
                    entities[i].update(interval);
                }
            }
        }

        public all(Constructor?) {
            if (Constructor === undefined) {
                return this._entities.slice(); // return shallow copy of array
            }
            else {
                let entities = [];
                for (var i = 0; i < this._entities.length; i++) {
                    if (this._entities[i] instanceof Constructor) {
                        entities.push(this._entities[i]);
                    }
                }
                return entities;
            }
        }

        public create(Constructor, settings) {
            let entity = new Constructor(this._game, settings || {});
            this._shuriken.collider.createEntity(entity);
            this._entities.push(entity);
            return entity;
        }

        public destroy(entity) {
            for (var i = 0; i < this._entities.length; i++) {
                if (this._entities[i] === entity) {
                    this._shuriken.collider.destroyEntity(entity);
                    this._entities.splice(i, 1);
                    break;
                }
            }
        }
    }
}