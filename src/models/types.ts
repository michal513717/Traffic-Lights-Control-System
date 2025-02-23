import { ActionType, RoadDirection } from "./enums";

export type Action = Step | AddVehicle;

export type Step = { type: ActionType.STEP };

export type AddVehicle = {
    type: ActionType.ADD_VEHICLE;
    vehicleId: string;
    startRoad: RoadDirection;
    endRoad: RoadDirection;
}