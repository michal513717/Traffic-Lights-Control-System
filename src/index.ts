import { TrafficLightStatus, RoadDirection, ActionType } from './models/enums';
import { Action, AddVehicle } from './models/types';
import { Road } from './road';
// import fs from 'fs';
import { Vehicle } from './vehicle';
import { runSimulation } from './a';
import { state } from './state';
import { SystemTrafficContoller } from './controllers/systemTrafficController';
import { SystemLoggController } from './controllers/systemLoggController';

class Game {

    private roads: Record<RoadDirection, Road>;
    private systemTrafficContoller: SystemTrafficContoller;
    private systemLoggContoller: SystemLoggController;
    private executeAction: Record<ActionType, Function> = {
        [ActionType.ADD_VEHICLE]: this.addVehicleAction.bind(this),
        [ActionType.STEP]: this.stepAction.bind(this)
    };

    constructor(){
        this.systemLoggContoller = new SystemLoggController();
        this.systemTrafficContoller = new SystemTrafficContoller(this.systemLoggContoller);
        this.roads = state.getRoads();
    }

    public runSimulation(actions: Action[]): void {

        actions.forEach((action) => {
            this.executeAction[action.type](action);
        });

        console.log('Simulation completed');

        this.systemLoggContoller.printStepStatuses();
    }

    private stepAction(): void{
        this.systemTrafficContoller.step();
    };

    private addVehicleAction(action: AddVehicle): void{
        this.roads[action.startRoad].addVehicle(
            new Vehicle(
                action.vehicleId,
                action.startRoad,
                action.endRoad
            )
        );
    };
}

(async () => {
    // const game = new Game();
    // await game.start();
    //@ts-ignore TMP for beteer debugger
    window.game = new Game();

        // runSimulation(
        //     [
        //       { "type": "addVehicle", "vehicleId": "vehicle1", "startRoad": "north", "endRoad": "south" },
        //       { "type": "addVehicle", "vehicleId": "vehicle2", "startRoad": "south", "endRoad": "north" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "addVehicle", "vehicleId": "vehicle3", "startRoad": "east", "endRoad": "west" },
        //       { "type": "addVehicle", "vehicleId": "vehicle4", "startRoad": "west", "endRoad": "east" },
        //       { "type": "addVehicle", "vehicleId": "vehicle9", "startRoad": "west", "endRoad": "north" },
        //       { "type": "addVehicle", "vehicleId": "vehicle10", "startRoad": "west", "endRoad": "north" },
        //       { "type": "addVehicle", "vehicleId": "vehicle5", "startRoad": "north", "endRoad": "south" },
        //       { "type": "addVehicle", "vehicleId": "vehicle6", "startRoad": "south", "endRoad": "north" },
        //       { "type": "addVehicle", "vehicleId": "vehicle11", "startRoad": "west", "endRoad": "north" },
        //       { "type": "addVehicle", "vehicleId": "vehicle7", "startRoad": "east", "endRoad": "west" },
        //       { "type": "addVehicle", "vehicleId": "vehicle8", "startRoad": "west", "endRoad": "east" },
        //       { "type": "addVehicle", "vehicleId": "vehicle10", "startRoad": "west", "endRoad": "north" },
        //       { "type": "addVehicle", "vehicleId": "vehicle12", "startRoad": "west", "endRoad": "north" },
        //       { "type": "addVehicle", "vehicleId": "vehicle13", "startRoad": "west", "endRoad": "north" },
        //       { "type": "addVehicle", "vehicleId": "vehicle18", "startRoad": "north", "endRoad": "south" },
        //       { "type": "addVehicle", "vehicleId": "vehicle14", "startRoad": "west", "endRoad": "north" },
        //       { "type": "addVehicle", "vehicleId": "vehicle19", "startRoad": "north", "endRoad": "south" },
        //       { "type": "addVehicle", "vehicleId": "vehicle20", "startRoad": "north", "endRoad": "south" },
        //       { "type": "addVehicle", "vehicleId": "vehicle15", "startRoad": "west", "endRoad": "north" },
        //       { "type": "addVehicle", "vehicleId": "vehicle16", "startRoad": "west", "endRoad": "north" },
        //       { "type": "addVehicle", "vehicleId": "vehicle17", "startRoad": "west", "endRoad": "north" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },  
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },  
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" },
        //       { "type": "step" }
        //     ]
        //   );

    // runSimulation(
    [
            {
                "type": "addVehicle",
                "vehicleId": "vehicle1",
                "startRoad": "south",
                "endRoad": "north"
            },
            {
                "type": "addVehicle",
                "vehicleId": "vehicle2",
                "startRoad": "north",
                "endRoad": "south"
            },
            {
                "type": "step"
            },
            {
                "type": "step"
            },
            {
                "type": "addVehicle",
                "vehicleId": "vehicle3",
                "startRoad": "west",
                "endRoad": "south"
            },
            {
                "type": "addVehicle",
                "vehicleId": "vehicle4",
                "startRoad": "west",
                "endRoad": "south"
            },
            {
                "type": "step"
            },
            {
                "type": "step"
            }
        ]

})();