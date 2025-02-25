import { TrafficLightStatus, RoadDirection, ActionType } from './models/enums';
import { CarQueues } from './models/types';
import { Road } from './road';
import { TrafficLight } from './trafficLight';

class State {

    private roads: Record<RoadDirection, Road> = {
        [RoadDirection.NORTH]: new Road(RoadDirection.NORTH),
        [RoadDirection.SOUTH]: new Road(RoadDirection.SOUTH),
        [RoadDirection.EAST]: new Road(RoadDirection.EAST),
        [RoadDirection.WEST]: new Road(RoadDirection.WEST)
    };

    public getRoads(): Record<RoadDirection, Road> {
        return this.roads;
    };

    public getTotalVehicles(): number {
        return Object.values(this.roads).reduce((acc, road) => acc + road.getTrafficLength(), 0);
    };

    public getRoad(direction: RoadDirection): Road {
        return this.roads[direction];
    }

    public getCarQueues(): CarQueues {
        return {
            [RoadDirection.NORTH]: this.roads.north.getTraffic(),
            [RoadDirection.SOUTH]: this.roads.south.getTraffic(),
            [RoadDirection.EAST]: this.roads.east.getTraffic(),
            [RoadDirection.WEST]: this.roads.west.getTraffic()
        }
    };

    public getTrafficLightStatuses(): Record<RoadDirection, TrafficLightStatus> {
        return {
            [RoadDirection.NORTH]: this.roads.north.getTrafficLightStatus(),
            [RoadDirection.SOUTH]: this.roads.south.getTrafficLightStatus(),
            [RoadDirection.EAST]: this.roads.east.getTrafficLightStatus(),
            [RoadDirection.WEST]: this.roads.west.getTrafficLightStatus()
        }
    };
}

export const state = new State();