import { RoadDirection } from "./models/enums";

export class Vehicle {
    private vehicleId: string;
    private startRoad: RoadDirection;
    private endRoad: RoadDirection;

    constructor(vehicleId: string, startRoad: RoadDirection, endRoad: RoadDirection) {
        this.vehicleId = vehicleId;
        this.startRoad = startRoad;
        this.endRoad = endRoad;
    };

    public getVehicleId(): string {
        return this.vehicleId;
    };

    public getStartRoad(): RoadDirection {
        return this.startRoad;
    }

    public getEndRoad(): RoadDirection {
        return this.endRoad;
    }
};