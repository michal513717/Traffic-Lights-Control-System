import * as fs from 'fs';

export class SystemLoggController {
    private stepStatuses: { leftVehicles: string[] }[] = [];
    private outputFilePath: string = '';

    public addLogStep(data: string[]): void {
        this.stepStatuses.push({
            leftVehicles: data
        });
    };

    public setOutputFilePath(filePath: string): void {
        this.outputFilePath = filePath;
    };

    public getStepStatuses(): { leftVehicles: string[] }[] {
        return this.stepStatuses;
    };

    public clearStepStatuses(): void {
        this.stepStatuses = [];
    };

    public printStepStatuses(): void {
        const output = {
            stepStatuses: this.stepStatuses
        };

        console.log("\Result:\n", JSON.stringify(output, null, 2));
    };

    public saveStepStatusesToFile(): void {
        const output = {
            stepStatuses: this.stepStatuses
        };

        if(this.outputFilePath === ''){
            this.outputFilePath = 'output.json';
        };

        if(this.outputFilePath.split('.').pop() !== 'json'){
            this.outputFilePath += '.json';
        }

        fs.writeFile(this.outputFilePath, JSON.stringify(output, null, 2), (err) => {
            if (err) {
                console.error(`Error during saving file: ${err.message}`);
                process.exit(1);
            }
        });
    };
}