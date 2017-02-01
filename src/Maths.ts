namespace Shuriken {

  export class Maths {

    public static readonly RADIANS_TO_DEGREES = 0.01745;

    public static circlesIntersecting(obj1: IEntity, obj2: IEntity) {
      return Maths.distance(obj1.center, obj2.center) <
        obj1.size.width / 2 + obj2.size.width / 2;
    }

    public static rectanglesIntersecting(obj1: IEntityShape, obj2: IEntityShape) {
      if (!Maths.rotated(obj1) && !Maths.rotated(obj2)) {
        return this.unrotatedRectanglesIntersecting(obj1, obj2); // faster
      } else {
        return this.rotatedRectanglesIntersecting(obj1, obj2); // slower
      }
    }

    public static circleAndRectangleIntersecting(circleObj: IEntity, rectangleObj: IEntity) {
      const rectangleObjAngleRad = -Maths.getAngle(rectangleObj) * Maths.RADIANS_TO_DEGREES;

      const unrotatedCircleCenter = {
        x: Math.cos(rectangleObjAngleRad) *
        (circleObj.center.x - rectangleObj.center.x) -
        Math.sin(rectangleObjAngleRad) *
        (circleObj.center.y - rectangleObj.center.y) + rectangleObj.center.x,
        y: Math.sin(rectangleObjAngleRad) *
        (circleObj.center.x - rectangleObj.center.x) +
        Math.cos(rectangleObjAngleRad) *
        (circleObj.center.y - rectangleObj.center.y) + rectangleObj.center.y,
      };

      const closest = { x: 0, y: 0 };

      if (unrotatedCircleCenter.x < rectangleObj.center.x - rectangleObj.size.width / 2) {
        closest.x = rectangleObj.center.x - rectangleObj.size.width / 2;
      } else if (unrotatedCircleCenter.x > rectangleObj.center.x + rectangleObj.size.width / 2) {
        closest.x = rectangleObj.center.x + rectangleObj.size.width / 2;
      } else {
        closest.x = unrotatedCircleCenter.x;
      }

      if (unrotatedCircleCenter.y < rectangleObj.center.y - rectangleObj.size.height / 2) {
        closest.y = rectangleObj.center.y - rectangleObj.size.height / 2;
      } else if (unrotatedCircleCenter.y > rectangleObj.center.y + rectangleObj.size.height / 2) {
        closest.y = rectangleObj.center.y + rectangleObj.size.height / 2;
      } else {
        closest.y = unrotatedCircleCenter.y;
      }

      return this.distance(unrotatedCircleCenter, closest) < circleObj.size.width / 2;
    }

    public static unrotatedRectanglesIntersecting(obj1: IEntityShape, obj2: IEntityShape) {
      if (obj1.center.x + obj1.size.width / 2 < obj2.center.x - obj2.size.width / 2) {
        return false;
      } else if (obj1.center.x - obj1.size.width / 2 > obj2.center.x + obj2.size.width / 2) {
        return false;
      } else if (obj1.center.y - obj1.size.height / 2 > obj2.center.y + obj2.size.height / 2) {
        return false;
      } else if (obj1.center.y + obj1.size.height / 2 < obj2.center.y - obj2.size.height / 2) {
        return false;
      } else {
        return true;
      }
    }

    public static rotatedRectanglesIntersecting(obj1: IEntityShape, obj2: IEntityShape) {
      const obj1Normals = this.rectanglePerpendicularNormals(obj1);
      const obj2Normals = this.rectanglePerpendicularNormals(obj2);

      const obj1Corners = this.rectangleCorners(obj1);
      const obj2Corners = this.rectangleCorners(obj2);

      if (this.projectionsSeparate(
        this.getMinMaxProjection(obj1Corners, obj1Normals[1]),
        this.getMinMaxProjection(obj2Corners, obj1Normals[1]))) {
        return false;
      } else if (this.projectionsSeparate(
        this.getMinMaxProjection(obj1Corners, obj1Normals[0]),
        this.getMinMaxProjection(obj2Corners, obj1Normals[0]))) {
        return false;
      } else if (this.projectionsSeparate(
        this.getMinMaxProjection(obj1Corners, obj2Normals[1]),
        this.getMinMaxProjection(obj2Corners, obj2Normals[1]))) {
        return false;
      } else if (this.projectionsSeparate(
        this.getMinMaxProjection(obj1Corners, obj2Normals[0]),
        this.getMinMaxProjection(obj2Corners, obj2Normals[0]))) {
        return false;
      } else {
        return true;
      }
    }

    public static pointInsideObj(point: IPoint, obj: IEntity) {
      const objBoundingBox = Maths.getBoundingBox(obj);

      if (objBoundingBox === ColliderShape.RECTANGLE) {
        return this.pointInsideRectangle(point, obj);
      } else if (objBoundingBox === ColliderShape.CIRCLE) {
        return this.pointInsideCircle(point, obj);
      } else {
        throw new Error("Tried to see if point inside object with unsupported bounding box.");
      }
    }

    public static pointInsideRectangle(point: IPoint, obj: IEntity) {
      const c = Math.cos(-Maths.getAngle(obj) * Maths.RADIANS_TO_DEGREES);
      const s = Math.sin(-Maths.getAngle(obj) * Maths.RADIANS_TO_DEGREES);

      const rotatedX = obj.center.x + c *
        (point.x - obj.center.x) - s * (point.y - obj.center.y);
      const rotatedY = obj.center.y + s *
        (point.x - obj.center.x) + c * (point.y - obj.center.y);

      const leftX = obj.center.x - obj.size.width / 2;
      const rightX = obj.center.x + obj.size.width / 2;
      const topY = obj.center.y - obj.size.height / 2;
      const bottomY = obj.center.y + obj.size.height / 2;

      return leftX <= rotatedX && rotatedX <= rightX &&
        topY <= rotatedY && rotatedY <= bottomY;
    }

    public static pointInsideCircle(point: IPoint, obj: IEntity) {
      return this.distance(point, obj.center) <= obj.size.width / 2;
    }

    public static distance(point1: IPoint, point2: IPoint) {
      const x = point1.x - point2.x;
      const y = point1.y - point2.y;
      return Math.sqrt((x * x) + (y * y));
    }

    public static vectorTo(start: IPoint, end: IPoint) {
      return {
        x: end.x - start.x,
        y: end.y - start.y,
      };
    }

    public static magnitude(vector: IPoint) {
      return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    public static leftNormalizedNormal(vector: IPoint) {
      return {
        x: -vector.y,
        y: vector.x,
      };
    }

    public static dotProduct(vector1: IPoint, vector2: IPoint) {
      return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    public static unitVector(vector: IPoint) {
      return {
        x: vector.x / Maths.magnitude(vector),
        y: vector.y / Maths.magnitude(vector),
      };
    }

    public static projectionsSeparate(proj1: IMinMax, proj2: IMinMax) {
      return proj1.max < proj2.min || proj2.max < proj1.min;
    }

    public static getMinMaxProjection(objCorners: IPoint[], normal: IPoint) {
      let min = Maths.dotProduct(objCorners[0], normal);
      let max = Maths.dotProduct(objCorners[0], normal);

      for (let i = 1; i < objCorners.length; i++) {
        const current = Maths.dotProduct(objCorners[i], normal);
        if (min > current) {
          min = current;
        }

        if (current > max) {
          max = current;
        }
      }

      return { min, max };
    }

    public static rectangleCorners(obj: IEntityShape) {
      const corners = [ // unrotated
        { x: obj.center.x - obj.size.width / 2, y: obj.center.y - obj.size.height / 2 },
        { x: obj.center.x + obj.size.width / 2, y: obj.center.y - obj.size.height / 2 },
        { x: obj.center.x + obj.size.width / 2, y: obj.center.y + obj.size.height / 2 },
        { x: obj.center.x - obj.size.width / 2, y: obj.center.y + obj.size.height / 2 },
      ];

      const angle = Maths.getAngle(obj) * Maths.RADIANS_TO_DEGREES;

      for ( const corner of corners) {
        const xOffset = corner.x - obj.center.x;
        const yOffset = corner.y - obj.center.y;
        corner.x = obj.center.x +
          xOffset * Math.cos(angle) - yOffset * Math.sin(angle);
        corner.y = obj.center.y +
          xOffset * Math.sin(angle) + yOffset * Math.cos(angle);
      }

      return corners;
    }

    public static rectangleSideVectors(obj: IEntityShape) {
      const corners = this.rectangleCorners(obj);
      return [
        { x: corners[0].x - corners[1].x, y: corners[0].y - corners[1].y },
        { x: corners[1].x - corners[2].x, y: corners[1].y - corners[2].y },
        { x: corners[2].x - corners[3].x, y: corners[2].y - corners[3].y },
        { x: corners[3].x - corners[0].x, y: corners[3].y - corners[0].y },
      ];
    }

    public static rectanglePerpendicularNormals(obj: IEntityShape) {
      const sides = this.rectangleSideVectors(obj);
      return [
        Maths.leftNormalizedNormal(sides[0]),
        Maths.leftNormalizedNormal(sides[1]),
      ];
    }

    private static rotated(obj: IEntityShape) {
      return obj.angle !== undefined && obj.angle !== 0;
    }

    private static getAngle(obj: IEntityShape) {
      return obj.angle === undefined ? 0 : obj.angle;
    }

    private static getBoundingBox(obj: IEntityShape) {
      return obj.boundingBox || ColliderShape.RECTANGLE;
    }
  }
}
