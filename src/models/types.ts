import { Vehicle } from "../vehicle";
import { ActionType, RoadDirection, TrafficLightStatus } from "./enums";

export type Action = Step | AddVehicle;

export type Step = { type: ActionType.STEP };

export type AddVehicle = {
    type: ActionType.ADD_VEHICLE;
    vehicleId: string;
    startRoad: RoadDirection;
    endRoad: RoadDirection;
};

export type ConfilictPairs = {
    to: RoadDirection;
    opposingStraight: {
        start: RoadDirection;
        end: RoadDirection;
    };
};

export type ConditionArrowConflictPairs = {
    conflicts: RoadDirection[];
}

export type IntersectionTrafficLightStatus = Record<RoadDirection, TrafficLightStatus>;
export type RoadGroup = "NS" | "EW" | null;
export type CarQueues = Record<RoadDirection, Vehicle[]>;