import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ThreeMegPhotoValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('Validating three megabyte image', metadata);
    // if (!value.originalname.match(/\.(jpg|jpeg|png)$/)) {
    //   throw new Error('Only image files (JPEG, JPG, PNG) are allowed.');
    // }
    const threeMeg = 3*1000*1000;
    return true // value.size < threeMeg;
  }
}