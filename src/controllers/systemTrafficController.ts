import { CollisionTrafficControler } from "./collisionTrafficController";
import { TrafficPriorityController } from "./priorityTrafficController";
import { RoadDirection, TrafficLightStatus } from "../models/enums";
import { SystemLoggController } from "./systemLoggController";
import { TrafficLight } from "../roadElements/trafficLight";
import { RoadGroup } from "../models/types";
import { state } from "../state";

export class SystemTrafficContoller {

    private pendingGroup: null | RoadGroup = null;
    private previousGroup: null | RoadGroup = null;
    private inTransition: boolean = false;

    private systemLoggController: SystemLoggController;
    private priorityTrafficController: TrafficPriorityController;
    private collisionTrafficController: CollisionTrafficControler;

    constructor(logger: SystemLoggController) {
        this.systemLoggController = logger;
        this.priorityTrafficController = new TrafficPriorityController();
        this.collisionTrafficController = new CollisionTrafficControler();
    }

    private updateTrafficLights(): void {

        const newGroup = this.priorityTrafficController.chooseLightsGroup(state.getCarQueues(), state.getTotalVehicles());
        
        //
        if(this.pendingGroup === null){
            this.pendingGroup = newGroup;
        };

        if (this.inTransition === true) { // switch to green
            this.applyGroupStatus(this.previousGroup, TrafficLightStatus.RED, false);
            this.applyGroupStatus(this.pendingGroup, TrafficLightStatus.GREEN, true);
            this.previousGroup = this.pendingGroup;
            this.pendingGroup = null;
            this.inTransition = false;
            return;
        }

        if (newGroup !== this.previousGroup) {
            if (this.previousGroup === null) { //first set
                this.previousGroup = newGroup;
                this.applyGroupStatus(this.previousGroup, TrafficLightStatus.GREEN, true);
            } else { // start swtiching
                this.applyGroupStatus(this.previousGroup, TrafficLightStatus.YELLOW, false);
                this.pendingGroup = newGroup;
                this.inTransition = true;
            }
        } else if (newGroup !== null) { // keep active
            this.applyGroupStatus(newGroup, TrafficLightStatus.GREEN, true);
        }
    }


    private applyGroupStatus(group: RoadGroup, status: TrafficLightStatus, conditionArrowStatus: boolean): void {
        if (group === "NS") {
            state.getRoad(RoadDirection.NORTH).changeTrafficLightStatus(status);
            state.getRoad(RoadDirection.SOUTH).changeTrafficLightStatus(status);
            state.getRoad(RoadDirection.EAST).changeConditionalArrowStatus(conditionArrowStatus);
            state.getRoad(RoadDirection.WEST).changeConditionalArrowStatus(conditionArrowStatus);
        } else if (group === "EW") {
            state.getRoad(RoadDirection.WEST).changeTrafficLightStatus(status);
            state.getRoad(RoadDirection.EAST).changeTrafficLightStatus(status);
            state.getRoad(RoadDirection.NORTH).changeConditionalArrowStatus(conditionArrowStatus);
            state.getRoad(RoadDirection.SOUTH).changeConditionalArrowStatus(conditionArrowStatus);
        }
    }

    public step(): void {

        this.updateTrafficLights();

        const leftVehicles: string[] = [];
        const canShiftCarFrom = [];
        
        let canShiftCar = false;

        for (const direction of Object.values(RoadDirection)) {
            const mainRoad = state.getRoad(direction);

            if(mainRoad.getTrafficLength() === 0) continue;
            
            if(this.canVehiclePassIntersection(direction)){
                canShiftCar = true;
                canShiftCarFrom.push(direction);
            }
            
            if(this.canVehiclePassIntersectionOnConditionalArrow(direction)){
                canShiftCar = true;
                canShiftCarFrom.push(direction);
            }
        }

        if(canShiftCar === true){
            canShiftCarFrom.forEach((direction) => {
                const shiftedVehicle = state.getRoad(direction).removeVehicle();
                leftVehicles.push(shiftedVehicle.getVehicleId());
            })
        }

        this.systemLoggController.addLogStep(leftVehicles);
    };

    private canVehiclePassIntersection(direction: RoadDirection): boolean {
        const mainRoad = state.getRoad(direction);
        const trafficLight = mainRoad.getTrafficLight();

        if (this.isTrafficLightGreenOrYellow(trafficLight) === false) return false;

        const vehicle = mainRoad.getFirstVehicle();

        return !this.collisionTrafficController.canVehicalBeBlock(vehicle, state.getCarQueues());
    };

    private canVehiclePassIntersectionOnConditionalArrow(direction: RoadDirection): boolean {
        const mainRoad = state.getRoad(direction);
        const trafficLight = mainRoad.getTrafficLight();

        if (trafficLight.getCondtionArrowStatus() === false) return false;

        const vehicle = mainRoad.getFirstVehicle();

        return this.collisionTrafficController.canVehicalMoveOnConditionArrow(vehicle, state.getCarQueues(), state.getTrafficLightStatuses());
    };

    private isTrafficLightGreenOrYellow(tl: TrafficLight): boolean {
        return (tl.getStatus() === TrafficLightStatus.GREEN || tl.getStatus() === TrafficLightStatus.YELLOW);
    };
}