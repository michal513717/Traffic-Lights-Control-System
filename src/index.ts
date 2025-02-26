import { SystemTrafficContoller } from './controllers/systemTrafficController';
import { SystemLoggController } from './controllers/systemLoggController';
import { RoadDirection, ActionType } from './models/enums';
import { Action, AddVehicle } from './models/types';
import { Vehicle } from './roadElements/vehicle';
import { Road } from './roadElements/road';
import { state } from './state';
import * as path from 'path';
import * as fs from 'fs';

class Game {

    private roads: Record<RoadDirection, Road>;
    private systemTrafficContoller: SystemTrafficContoller;
    private systemLoggContoller: SystemLoggController;
    private executeAction: Record<ActionType, Function> = {
        [ActionType.ADD_VEHICLE]: this.addVehicleAction.bind(this),
        [ActionType.STEP]: this.stepAction.bind(this)
    };

    constructor() {
        this.systemLoggContoller = new SystemLoggController();
        this.systemTrafficContoller = new SystemTrafficContoller(this.systemLoggContoller);
        this.roads = state.getRoads();
    }

    public setOutputFilePath(filePath: string): void {
        this.systemLoggContoller.setOutputFilePath(filePath);
    }

    public runSimulation(actions: Action[]): void {

        this.systemLoggContoller.clearStepStatuses();

        actions.forEach((action) => {
            this.executeAction[action.type](action);
        });

        console.log('Simulation completed');

        this.systemLoggContoller.printStepStatuses();

        this.systemLoggContoller.saveStepStatusesToFile();
    }

    private stepAction(): void {
        this.systemTrafficContoller.step();
    };

    private addVehicleAction(action: AddVehicle): void {
        this.roads[action.startRoad].addVehicle(
            new Vehicle(
                action.vehicleId,
                action.startRoad,
                action.endRoad
            )
        );
    };
}

const jsonFilePath = process.argv[2];

if (!jsonFilePath) {
    console.error("No file path provided");
    process.exit(1);
};

const fullPath = path.resolve(jsonFilePath);

if (!fs.existsSync(fullPath)) {
    console.error(`File ${fullPath} doesn't exist`);
    process.exit(1);
}

fs.readFile(fullPath, 'utf-8', (err, data) => {
    if (err) {
        console.error(`Error during opening file: ${err.message}`);
        process.exit(1);
    }

    try {
        const jsonData = JSON.parse(data);

        const outputFilePath = path.resolve(process.argv[3] || 'output.json');

        const game = new Game();

        game.setOutputFilePath(outputFilePath);

        game.runSimulation(jsonData.commands);

    } catch (err: any) {
        console.error(`Error during parsing file: ${err.message}`);
        process.exit(1);
    }
});
