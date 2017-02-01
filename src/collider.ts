namespace Shuriken {

    export class Collider {

        private shuriken: Shuriken;
        private currentCollisionPairs: Array<[IEntity, IEntity]> = [];

        constructor(shuriken: Shuriken) {
            this.shuriken = shuriken;
        }

        public update() {
            this.currentCollisionPairs = [];
            const ent = this.shuriken.entities.all();
            for (let i = 0; i < ent.length; i++) {
                for (let j = i + 1; j < ent.length; j++) {
                    this.currentCollisionPairs.push([ent[i], ent[j]]);
                }
            }

            // test collisions
            while (this.currentCollisionPairs.length > 0) {
                const pair = this.currentCollisionPairs.shift();
                if (this.isColliding(pair[0], pair[1])) {
                    this.collision(pair[0], pair[1]);
                }
            }
        }

        public createEntity(entity: IEntity) {
            const allEntities = this.shuriken.entities.all();

            for (const e of allEntities) {
                if (e !== entity) { // decouple from when c.entities adds to _entities
                    this.currentCollisionPairs.push([e, entity]);
                }
            }
        }

        public destroyEntity(entity: IEntity) {
            // if coll detection happening, remove any pairs that include entity
            for (let i = this.currentCollisionPairs.length - 1; i >= 0; i--) {
                if (this.currentCollisionPairs[i][0] === entity ||
                    this.currentCollisionPairs[i][1] === entity) {
                    this.currentCollisionPairs.splice(i, 1);
                }
            }
        }

        public isColliding(obj1: IEntity, obj2: IEntity) {
            return obj1 !== obj2 &&
                this.isSetupForCollisions(obj1) &&
                this.isSetupForCollisions(obj2) &&
                this.isIntersecting(obj1, obj2);
        }

        public isIntersecting(obj1: IEntity, obj2: IEntity) {
            const obj1BoundingBox = this.getBoundingBox(obj1);
            const obj2BoundingBox = this.getBoundingBox(obj2);

            if (obj1BoundingBox === ColliderShape.RECTANGLE && obj2BoundingBox === ColliderShape.RECTANGLE) {
                return Maths.rectanglesIntersecting(obj1, obj2);
            } else if (obj1BoundingBox === ColliderShape.CIRCLE && obj2BoundingBox === ColliderShape.RECTANGLE) {
                return Maths.circleAndRectangleIntersecting(obj1, obj2);
            } else if (obj1BoundingBox === ColliderShape.RECTANGLE && obj2BoundingBox === ColliderShape.CIRCLE) {
                return Maths.circleAndRectangleIntersecting(obj2, obj1);
            } else if (obj1BoundingBox === ColliderShape.CIRCLE && obj2BoundingBox === ColliderShape.CIRCLE) {
                return Maths.circlesIntersecting(obj1, obj2);
            } else {
                throw new Error("Objects being collision tested have unsupported bounding box types.");
            }
        }

        private isSetupForCollisions(obj: IEntity) {
            return obj.center !== undefined && obj.size !== undefined;
        }

        private collision(entity1: IEntity, entity2: IEntity) {
            this.notifyEntityOfCollision(entity1, entity2);
            this.notifyEntityOfCollision(entity2, entity1);
        }

        // todo move on entity ??
        private getBoundingBox(obj: IEntity): ColliderShape {
            return obj.boundingBox || ColliderShape.RECTANGLE;
        }

        private notifyEntityOfCollision(entity: IEntity, other: IEntity) {
            if (entity.collision !== undefined) {
                entity.collision(other);
            }
        }

    }
}
