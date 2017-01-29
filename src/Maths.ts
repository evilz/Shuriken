namespace shuriken {

  export class Maths {

    public static circlesIntersecting(obj1, obj2) {
      return Maths.distance(obj1.center, obj2.center) <
        obj1.size.x / 2 + obj2.size.x / 2;
    }

    public static rectanglesIntersecting(obj1, obj2) {
      if (!Maths.rotated(obj1) && !Maths.rotated(obj2)) {
        return this.unrotatedRectanglesIntersecting(obj1, obj2); // faster
      } else {
        return this.rotatedRectanglesIntersecting(obj1, obj2); // slower
      }
    }

    public static circleAndRectangleIntersecting(circleObj, rectangleObj) {
      var rectangleObjAngleRad = -Maths.getAngle(rectangleObj) * Maths.RADIANS_TO_DEGREES;

      var unrotatedCircleCenter = {
        x: Math.cos(rectangleObjAngleRad) *
        (circleObj.center.x - rectangleObj.center.x) -
        Math.sin(rectangleObjAngleRad) *
        (circleObj.center.y - rectangleObj.center.y) + rectangleObj.center.x,
        y: Math.sin(rectangleObjAngleRad) *
        (circleObj.center.x - rectangleObj.center.x) +
        Math.cos(rectangleObjAngleRad) *
        (circleObj.center.y - rectangleObj.center.y) + rectangleObj.center.y
      };

      var closest = { x: 0, y: 0 };

      if (unrotatedCircleCenter.x < rectangleObj.center.x - rectangleObj.size.x / 2) {
        closest.x = rectangleObj.center.x - rectangleObj.size.x / 2;
      } else if (unrotatedCircleCenter.x > rectangleObj.center.x + rectangleObj.size.x / 2) {
        closest.x = rectangleObj.center.x + rectangleObj.size.x / 2;
      } else {
        closest.x = unrotatedCircleCenter.x;
      }

      if (unrotatedCircleCenter.y < rectangleObj.center.y - rectangleObj.size.y / 2) {
        closest.y = rectangleObj.center.y - rectangleObj.size.y / 2;
      } else if (unrotatedCircleCenter.y > rectangleObj.center.y + rectangleObj.size.y / 2) {
        closest.y = rectangleObj.center.y + rectangleObj.size.y / 2;
      } else {
        closest.y = unrotatedCircleCenter.y;
      }

      return this.distance(unrotatedCircleCenter, closest) < circleObj.size.x / 2;
    }

    public static unrotatedRectanglesIntersecting(obj1, obj2) {
      if (obj1.center.x + obj1.size.x / 2 < obj2.center.x - obj2.size.x / 2) {
        return false;
      } else if (obj1.center.x - obj1.size.x / 2 > obj2.center.x + obj2.size.x / 2) {
        return false;
      } else if (obj1.center.y - obj1.size.y / 2 > obj2.center.y + obj2.size.y / 2) {
        return false;
      } else if (obj1.center.y + obj1.size.y / 2 < obj2.center.y - obj2.size.y / 2) {
        return false
      } else {
        return true;
      }
    }

    public static rotatedRectanglesIntersecting(obj1, obj2) {
      var obj1Normals = this.rectanglePerpendicularNormals(obj1);
      var obj2Normals = this.rectanglePerpendicularNormals(obj2);

      var obj1Corners = this.rectangleCorners(obj1);
      var obj2Corners = this.rectangleCorners(obj2);

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

    public static pointInsideObj(point, obj) {
      var objBoundingBox = Maths.getBoundingBox(obj);

      if (objBoundingBox === Collider.RECTANGLE) {
        return this.pointInsideRectangle(point, obj);
      } else if (objBoundingBox === Collider.CIRCLE) {
        return this.pointInsideCircle(point, obj);
      } else {
        throw "Tried to see if point inside object with unsupported bounding box.";
      }
    }

    public static pointInsideRectangle(point, obj) {
      var c = Math.cos(-Maths.getAngle(obj) * Maths.RADIANS_TO_DEGREES);
      var s = Math.sin(-Maths.getAngle(obj) * Maths.RADIANS_TO_DEGREES);

      var rotatedX = obj.center.x + c *
        (point.x - obj.center.x) - s * (point.y - obj.center.y);
      var rotatedY = obj.center.y + s *
        (point.x - obj.center.x) + c * (point.y - obj.center.y);

      var leftX = obj.center.x - obj.size.x / 2;
      var rightX = obj.center.x + obj.size.x / 2;
      var topY = obj.center.y - obj.size.y / 2;
      var bottomY = obj.center.y + obj.size.y / 2;

      return leftX <= rotatedX && rotatedX <= rightX &&
        topY <= rotatedY && rotatedY <= bottomY;
    }

    public static pointInsideCircle(point, obj) {
      return this.distance(point, obj.center) <= obj.size.x / 2;
    }

    public static distance(point1, point2) {
      var x = point1.x - point2.x;
      var y = point1.y - point2.y;
      return Math.sqrt((x * x) + (y * y));
    }

    public static vectorTo(start, end) {
      return {
        x: end.x - start.x,
        y: end.y - start.y
      };
    }

    public static magnitude(vector) {
      return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    public static leftNormalizedNormal(vector) {
      return {
        x: -vector.y,
        y: vector.x
      };
    }

    public static dotProduct(vector1, vector2) {
      return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    public static unitVector(vector) {
      return {
        x: vector.x / Maths.magnitude(vector),
        y: vector.y / Maths.magnitude(vector)
      };
    }

    public static projectionsSeparate(proj1, proj2) {
      return proj1.max < proj2.min || proj2.max < proj1.min;
    }

    public static getMinMaxProjection(objCorners, normal) {
      var min = Maths.dotProduct(objCorners[0], normal);
      var max = Maths.dotProduct(objCorners[0], normal);

      for (var i = 1; i < objCorners.length; i++) {
        var current = Maths.dotProduct(objCorners[i], normal);
        if (min > current) {
          min = current;
        }

        if (current > max) {
          max = current;
        }
      }

      return { min: min, max: max };
    }

    public static rectangleCorners(obj) {
      var corners = [ // unrotated
        { x: obj.center.x - obj.size.x / 2, y: obj.center.y - obj.size.y / 2 },
        { x: obj.center.x + obj.size.x / 2, y: obj.center.y - obj.size.y / 2 },
        { x: obj.center.x + obj.size.x / 2, y: obj.center.y + obj.size.y / 2 },
        { x: obj.center.x - obj.size.x / 2, y: obj.center.y + obj.size.y / 2 }
      ];

      var angle = Maths.getAngle(obj) * Maths.RADIANS_TO_DEGREES;

      for (var i = 0; i < corners.length; i++) {
        var xOffset = corners[i].x - obj.center.x;
        var yOffset = corners[i].y - obj.center.y;
        corners[i].x = obj.center.x +
          xOffset * Math.cos(angle) - yOffset * Math.sin(angle);
        corners[i].y = obj.center.y +
          xOffset * Math.sin(angle) + yOffset * Math.cos(angle);
      }

      return corners;
    }

    public static rectangleSideVectors(obj) {
      var corners = this.rectangleCorners(obj);
      return [
        { x: corners[0].x - corners[1].x, y: corners[0].y - corners[1].y },
        { x: corners[1].x - corners[2].x, y: corners[1].y - corners[2].y },
        { x: corners[2].x - corners[3].x, y: corners[2].y - corners[3].y },
        { x: corners[3].x - corners[0].x, y: corners[3].y - corners[0].y }
      ];
    }

    public static rectanglePerpendicularNormals(obj) {
      var sides = this.rectangleSideVectors(obj);
      return [
        Maths.leftNormalizedNormal(sides[0]),
        Maths.leftNormalizedNormal(sides[1])
      ];
    }


    private static rotated(obj) {
      return obj.angle !== undefined && obj.angle !== 0;
    }

    private static getAngle = function (obj) {
      return obj.angle === undefined ? 0 : obj.angle;
    }


    public static getBoundingBox(obj) {
      return obj.boundingBox || Collider.RECTANGLE;
    }


    public static readonly RADIANS_TO_DEGREES = 0.01745;
  }
}