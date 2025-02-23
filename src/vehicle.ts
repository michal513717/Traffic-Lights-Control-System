export class Vehicle {
    private vehicleId: string;
    private startRoad: string;
    private endRoad: string;

    constructor(vehicleId: string, startRoad: string, endRoad: string) {
        this.vehicleId = vehicleId;
        this.startRoad = startRoad;
        this.endRoad = endRoad;
    };

    public getVehicleId(): string {
        return this.vehicleId;
    };
};