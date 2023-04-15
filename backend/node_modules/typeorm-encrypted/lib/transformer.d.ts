import { ValueTransformer, FindOperator } from 'typeorm';
import { EncryptionOptions } from './options';
export declare class EncryptionTransformer implements ValueTransformer {
    private options;
    constructor(options: EncryptionOptions);
    from(value?: string | null): string | undefined;
    to(value?: string | FindOperator<any> | null): string | FindOperator<any> | undefined;
}
export declare class JSONEncryptionTransformer implements ValueTransformer {
    private options;
    constructor(options: EncryptionOptions);
    from(value?: null | any): any | undefined;
    to(value?: any | FindOperator<any> | null): Object | FindOperator<any> | undefined;
}
