import { Directions, RoadDirection, TrafficLightStatus } from "../models/enums";
import { CarQueues, ConditionArrowConflictPairs, ConfilictPairs, IntersectionTrafficLightStatus } from "../models/types";
import { Vehicle } from "../vehicle";

export class CollisionTrafficControler {

    private conflictPairs: Record<RoadDirection, ConfilictPairs> = {
        [RoadDirection.NORTH]: { to: RoadDirection.NORTH, opposingStraight: { start: RoadDirection.SOUTH, end: RoadDirection.NORTH } },
        [RoadDirection.SOUTH]: { to: RoadDirection.WEST, opposingStraight: { start: RoadDirection.NORTH, end: RoadDirection.SOUTH } },
        [RoadDirection.EAST]: { to: RoadDirection.SOUTH, opposingStraight: { start: RoadDirection.WEST, end: RoadDirection.EAST } },
        [RoadDirection.WEST]: { to: RoadDirection.NORTH, opposingStraight: { start: RoadDirection.EAST, end: RoadDirection.WEST } }
    }

    private conditionArrowConflicts: Record<RoadDirection, ConditionArrowConflictPairs> = {
        [RoadDirection.NORTH]: { conflicts: [RoadDirection.EAST, RoadDirection.SOUTH] },
        [RoadDirection.SOUTH]: { conflicts: [RoadDirection.WEST, RoadDirection.NORTH] },
        [RoadDirection.EAST]: { conflicts: [RoadDirection.SOUTH, RoadDirection.WEST] },
        [RoadDirection.WEST]: { conflicts: [RoadDirection.NORTH, RoadDirection.EAST]}
    };

    private rightTurnDirections: Record<RoadDirection, RoadDirection> ={
        [RoadDirection.NORTH]: RoadDirection.WEST,
        [RoadDirection.SOUTH]: RoadDirection.EAST,
        [RoadDirection.EAST]: RoadDirection.NORTH,
        [RoadDirection.WEST]: RoadDirection.SOUTH
    };

    public canVehicalBeBlock(vehicle: Vehicle, queues: CarQueues): boolean {

        const prConflict = this.conflictPairs[vehicle.getStartRoad()];
        const oppositingQueue = queues[prConflict.to];

        if (oppositingQueue.length === 0) {
            return false;
        }

        const oppositingVehicle = oppositingQueue[0];

        if (
            oppositingVehicle.getStartRoad() === prConflict.opposingStraight.start &&
            oppositingVehicle.getEndRoad() === prConflict.opposingStraight.end
        ) {
            return true;
        }

        return false;
    };

    public canVehicalMoveOnConditionArrow(vehical: Vehicle, queues: CarQueues, trafficLightsStatus: IntersectionTrafficLightStatus): boolean {

        const prConflict = this.conditionArrowConflicts[vehical.getStartRoad()];

        if(this.rightTurnDirections[vehical.getStartRoad()] !== vehical.getEndRoad()) return false;
        
        const hasConflict = prConflict.conflicts.some((direction) => {
            return trafficLightsStatus[direction] === TrafficLightStatus.GREEN &&
                   queues[direction].length > 0;
        });
    
        if (hasConflict) {
            return false;
        }
    
        return true;
    }
}