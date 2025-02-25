

export class SystemLoggController {
    private stepStatuses: { leftVehicles: string[] }[] = [];

    public addLogStep(data: string[]): void {
        this.stepStatuses.push({
            leftVehicles: data
        });
    };

    public getStepStatuses(): { leftVehicles: string[] }[] {
        return this.stepStatuses;
    };

    public printStepStatuses(): void {
        const output = {
            stepStatuses: this.stepStatuses
        };

        console.log("\Result:\n", JSON.stringify(output, null, 2));
    };
}