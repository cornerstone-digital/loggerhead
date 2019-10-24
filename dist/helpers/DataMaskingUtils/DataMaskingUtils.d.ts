import { DataMaskingConfig } from '../../types/index.types';
declare class DataMaskingUtils {
    private config;
    constructor(config?: DataMaskingConfig);
    private isJson;
    private replaceKeyValues;
    private applyMaskingRules;
    getConfig(): DataMaskingConfig;
    cleanseData(input: any): any;
}
export default DataMaskingUtils;
//# sourceMappingURL=DataMaskingUtils.d.ts.map