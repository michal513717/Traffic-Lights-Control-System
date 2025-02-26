import { RoadDirection, TrafficLightStatus } from "../models/enums";
import { TrafficLight } from "./trafficLight";
import { Vehicle } from "./vehicle";

export class Road {
    private routeDirection: RoadDirection;
    private trafficLight: TrafficLight;
    private vehicles: Vehicle[];

    constructor(routeDirection: RoadDirection) {
        this.trafficLight = new TrafficLight(TrafficLightStatus.RED);
        this.routeDirection = routeDirection;
        this.vehicles = [];
    };

    public initConditionalArrowStatus(status: boolean): void {
        this.trafficLight.changeConditionArrow(status);
    };

    public addVehicle(vehicle: Vehicle): void {

        console.info(`Added vehical ${vehicle.getVehicleId()} to road ${this.routeDirection}`);

        this.vehicles.push(vehicle);
    };

    public removeVehicle(): Vehicle {
        return this.vehicles.shift()!;
    };

    public getTrafficLength(): number {
        return this.vehicles.length;
    };

    public getRoadDirection(): RoadDirection {
        return this.routeDirection;
    };

    public getTrafficLight(): TrafficLight {
        return this.trafficLight;
    };

    public getTrafficLightStatus(): TrafficLightStatus {
        return this.getTrafficLight().getStatus();
    };

    public getTraffic(): Vehicle[] {
        return this.vehicles;
    };

    public getFirstVehicle(): Vehicle {
        return this.vehicles[0];
    };

    public changeTrafficLightStatus(status: TrafficLightStatus): void {

        console.info(`Road ${this.routeDirection} traffic light status changed to ${status}`);

        this.trafficLight.changeStatus(status);
    };

    public changeConditionalArrowStatus(status: boolean): void {
        if (this.trafficLight.isConditionArrowOn() === false) return;

        console.info(`Road ${this.routeDirection} conditional arrow status changed to ${!this.trafficLight.getCondtionArrowStatus()}`);

        this.trafficLight.changeConditionArrow(status);
    };
}