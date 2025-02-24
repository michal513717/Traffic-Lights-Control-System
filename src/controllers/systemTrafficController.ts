import { CarQueues, RoadGroup } from "../models/types";
import { CollisionTrafficControler } from "./collisionTrafficController";
import { TrafficPriorityController } from "./priorityTrafficController";
import { state } from "../state";
import { RoadDirection, TrafficLightStatus } from "../models/enums";

export class SystemTrafficContoller {

    private pendingGroup: null | RoadGroup = null;
    private previousGroup: null | RoadGroup = null;
    private inTransition: boolean = false;

    private priorityTrafficController: TrafficPriorityController;
    private collisionTrafficController: CollisionTrafficControler;

    constructor() {
        this.priorityTrafficController = new TrafficPriorityController();
        this.collisionTrafficController = new CollisionTrafficControler();
    }

    public updateTrafficLights(): void {

        const newGroup = this.priorityTrafficController.chooseLightsGroup(state.getCarQueues(), state.getTotalVehicles());

        if(this.inTransition === true){ // switch to green
            this.applyGroupStatus(this.previousGroup, TrafficLightStatus.RED, false);
            this.applyGroupStatus(this.pendingGroup, TrafficLightStatus.GREEN, true);
            this.previousGroup = this.pendingGroup;
            this.pendingGroup = null;
            this.inTransition = false;
            return;
        }

        if (newGroup !== this.previousGroup){
            if(this.previousGroup === null){ //first set
                this.previousGroup = newGroup;
                this.applyGroupStatus(this.previousGroup, TrafficLightStatus.GREEN, true);
            } else { // start swtiching
                this.applyGroupStatus(this.previousGroup, TrafficLightStatus.YELLOW, false);
                this.pendingGroup = newGroup;
                this.inTransition = true;
            }
        } else if(newGroup !== null){ // keep active
            this.applyGroupStatus(newGroup, TrafficLightStatus.GREEN, true);
        }
    }


    private applyGroupStatus(group: RoadGroup, status: TrafficLightStatus, conditionArrowStatus: boolean): void {
        if(group === "NS"){
            state.getRoad(RoadDirection.NORTH).changeTrafficLightStatus(status);
            state.getRoad(RoadDirection.SOUTH).changeTrafficLightStatus(status);
            state.getRoad(RoadDirection.EAST).changeConditionalArrowStatus(conditionArrowStatus);
            state.getRoad(RoadDirection.WEST).changeConditionalArrowStatus(conditionArrowStatus);
        } else if(group === "EW"){
            state.getRoad(RoadDirection.WEST).changeTrafficLightStatus(status);
            state.getRoad(RoadDirection.EAST).changeTrafficLightStatus(status);
            state.getRoad(RoadDirection.NORTH).changeConditionalArrowStatus(conditionArrowStatus);
            state.getRoad(RoadDirection.SOUTH).changeConditionalArrowStatus(conditionArrowStatus);
        }
    }

}