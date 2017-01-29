namespace shuriken {

    export class Collider {

        public static readonly RECTANGLE = 0;
        public static readonly CIRCLE = 1;

        private _shuriken: Shuriken;
        private _currentCollisionPairs = [];

        constructor(shuriken: Shuriken) {
            this._shuriken = shuriken;
        }

        private isSetupForCollisions(obj) {
            return obj.center !== undefined && obj.size !== undefined;
        }

        public update() {
            this._currentCollisionPairs = [];
            let ent = this._shuriken.entities.all();
            for (var i = 0; i < ent.length; i++) {
                for (var j = i + 1; j < ent.length; j++) {
                    this._currentCollisionPairs.push([ent[i], ent[j]]);
                }
            }

            // test collisions
            while (this._currentCollisionPairs.length > 0) {
                var pair = this._currentCollisionPairs.shift();
                if (this.isColliding(pair[0], pair[1])) {
                    this.collision(pair[0], pair[1]);
                }
            }
        }

        private collision(entity1, entity2) {
            this.notifyEntityOfCollision(entity1, entity2);
            this.notifyEntityOfCollision(entity2, entity1);
        }

        public createEntity(entity) {
            var ent = this._shuriken.entities.all();
            for (var i = 0, len = ent.length; i < len; i++) {
                if (ent[i] !== entity) { // decouple from when c.entities adds to _entities
                    this._currentCollisionPairs.push([ent[i], entity]);
                }
            }
        }

        public destroyEntity(entity) {
            // if coll detection happening, remove any pairs that include entity
            for (var i = this._currentCollisionPairs.length - 1; i >= 0; i--) {
                if (this._currentCollisionPairs[i][0] === entity ||
                    this._currentCollisionPairs[i][1] === entity) {
                    this._currentCollisionPairs.splice(i, 1);
                }
            }
        }

        public isColliding(obj1, obj2) {
            return obj1 !== obj2 &&
                this.isSetupForCollisions(obj1) &&
                this.isSetupForCollisions(obj2) &&
                this.isIntersecting(obj1, obj2);
        }

        public isIntersecting(obj1, obj2) {
            var obj1BoundingBox = this.getBoundingBox(obj1);
            var obj2BoundingBox = this.getBoundingBox(obj2);

            if (obj1BoundingBox === Collider.RECTANGLE && obj2BoundingBox === Collider.RECTANGLE) {
                return Maths.rectanglesIntersecting(obj1, obj2);
            } else if (obj1BoundingBox === Collider.CIRCLE && obj2BoundingBox === Collider.RECTANGLE) {
                return Maths.circleAndRectangleIntersecting(obj1, obj2);
            } else if (obj1BoundingBox === Collider.RECTANGLE && obj2BoundingBox === Collider.CIRCLE) {
                return Maths.circleAndRectangleIntersecting(obj2, obj1);
            } else if (obj1BoundingBox === Collider.CIRCLE && obj2BoundingBox === Collider.CIRCLE) {
                return Maths.circlesIntersecting(obj1, obj2);
            } else {
                throw "Objects being collision tested have unsupported bounding box types."
            }
        }

        private getBoundingBox(obj) {
            return obj.boundingBox || Collider.RECTANGLE;
        }

        private notifyEntityOfCollision(entity, other) {
            if (entity.collision !== undefined) {
                entity.collision(other);
            }
        }

    }
}