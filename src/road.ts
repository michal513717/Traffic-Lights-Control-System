import { RoadDirection, TrafficLightStatus } from "./models/enums";
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

    public removeVehicle(): void {
        this.vehicles.shift();
    };

    public getTrafficLength(): number {
        return this.vehicles.length;
    };

    public changeTrafficLightStatus(status: TrafficLightStatus): void {

        console.info(`Road ${this.routeDirection} traffic light status changed to ${status}`);

        if(this.trafficLight.isConditionArrowOn() === true){
            console.info(`Road ${this.routeDirection} conditional arrow status changed to ${!this.trafficLight.getCondtionArrowStatus()}`);

            this.trafficLight.changeConditionArrow();
        }


        this.trafficLight.changeStatus(status);
    };
}