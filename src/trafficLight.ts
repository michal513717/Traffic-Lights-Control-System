import { TrafficLightStatus } from "./models/enums";

export class TrafficLight {
    private conditionArrow: boolean | null;
    private status: TrafficLightStatus;

    constructor(status: TrafficLightStatus) {
        this.conditionArrow = false;
        this.status = status;
    };

    public changeStatus(status: TrafficLightStatus): void {
        this.status = status;
    };

    public changeConditionArrow(status?: boolean): void {

        if(status !== undefined) {
            this.conditionArrow = status;
            return;
        };

        this.conditionArrow = !this.conditionArrow;
    };

    public isConditionArrowOn(): boolean {
        return this.conditionArrow !== null;
    }

    public getCondtionArrowStatus(): boolean | null {
        return this.conditionArrow;
    }

    public getStatus(): TrafficLightStatus {
        return this.status;
    };
}