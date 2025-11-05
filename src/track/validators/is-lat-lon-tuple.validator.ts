import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  isLatitude, // Note: This checks a string or number
  isLongitude,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsLonLatTupleConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(coordinates: string[], args: ValidationArguments) {
    if (!Array.isArray(coordinates)) {
      return false;
    }

    if (coordinates.length !== 2) {
      return false;
    }

    const [lon, lat] = coordinates;

    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return false;
    }

    return isLatitude(lat) && isLongitude(lon);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'Coordinates must be a tuple of two valid numbers in [longitude, latitude] format';
  }
}

/**
 * Validates a [latitude, longitude] numeric tuple.
 */
export function IsLonLatTuple(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsLonLatTupleConstraint,
    });
  };
}
