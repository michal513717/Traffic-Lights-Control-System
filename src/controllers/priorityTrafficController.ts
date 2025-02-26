import { CarQueues, IntersectionTrafficLightStatus, RoadGroup } from "../models/types";
import { RoadDirection, TrafficLightStatus } from "../models/enums";

export class TrafficPriorityController {

    private fairnessWeights: Record<RoadDirection, number> = {
        [RoadDirection.NORTH]: 1,
        [RoadDirection.EAST]: 1,
        [RoadDirection.SOUTH]: 1,
        [RoadDirection.WEST]: 1
    };

    public fuzzyPriority(queueLength: number, totalVehicles: number): number {
        if (totalVehicles === 0) return 0;
        const norm = queueLength / totalVehicles; // norm ∈ [0, 1]
        const low = norm <= 0.2 ? 1 : (norm <= 0.4 ? (0.4 - norm) / 0.2 : 0);
        let medium = 0;
        if (norm > 0.2 && norm <= 0.5) {
            medium = (norm - 0.2) / 0.3;
        } else if (norm > 0.5 && norm < 0.8) {
            medium = (0.8 - norm) / 0.3;
        }
        const high = norm <= 0.6 ? 0 : (norm - 0.6) / 0.4;
        const numerator = low * 0.3 + medium * 0.6 + high * 1.0;
        const denominator = low + medium + high;
        return denominator === 0 ? 0 : numerator / denominator;
    };

    public updateFairnessWeights(lights: IntersectionTrafficLightStatus, queues: CarQueues): void {
        for (const road of Object.values(RoadDirection)) {
            if (lights[road] === TrafficLightStatus.GREEN) {
                this.fairnessWeights[road] = 1;
            } else if (queues[road].length > 0) {
                this.fairnessWeights[road] += 0.1;
            }
        }
    };

    public getFairnessWeights(): Record<RoadDirection, number> {
        return this.fairnessWeights;
    };

    public chooseLightsGroup(queue: CarQueues, totalVehices: number): RoadGroup {

        const fairnessWeights = this.getFairnessWeights();

        const nsEffective =
            this.fuzzyPriority(queue.north.length, totalVehices) * fairnessWeights.north +
            this.fuzzyPriority(queue.south.length, totalVehices) * fairnessWeights.south;
        const ewEffective =
            this.fuzzyPriority(queue.east.length, totalVehices) * fairnessWeights.east +
            this.fuzzyPriority(queue.west.length, totalVehices) * fairnessWeights.west;
        if (nsEffective === 0 && ewEffective === 0) return null;
        return nsEffective >= ewEffective ? "NS" : "EW";
    };
}