namespace Shuriken {

    export class Entities {

        private shuriken: Shuriken;
        private game: any;
        private entities: IEntity[] = [];

        constructor(shuriken: Shuriken, game: any) {
            this.shuriken = shuriken;
            this.game = game;
        }

        public update(interval: number) {
            const entities = this.all();
            for (const entity of entities.filter((x: IEntity) => x.update != null)){
                    entity.update(interval);
            }
        }

        public all(Constructor?: FunctionConstructor) {
            if (Constructor != null) {
                const entities = [];
                for (const entity of this.entities.filter((x: IEntity) => x instanceof Constructor)){
                     entities.push(entity);
                }
                return entities;
            } else {
                return this.entities.slice(); // return shallow copy of array
            }
        }

        public create(Constructor: new (...args: any[]) => IEntity, settings: any) {
            const entity = new Constructor(this.game, settings || {});
            this.shuriken.collider.createEntity(entity);
            this.entities.push(entity);
            return entity;
        }

        public destroy(entity: IEntity) {
            for (let i = 0; i < this.entities.length; i++) {
                if (this.entities[i] === entity) {
                    this.shuriken.collider.destroyEntity(entity);
                    this.entities.splice(i, 1);
                    break;
                }
            }
        }
    }
}
