
# Traffic-Lights-Control-System

This project implements an intelligent traffic control algorithm that dynamically assigns priority to road groups at an intersection. The system balances vehicle queues using fuzzy logic, fairness weights, and a smooth transition mechanism while incorporating collision detection to prevent accidents.

### Short version algorithm description:

1. Updating Fairness Weights

At the beginning of each step, fairness weights are updated – roads that do not have a green light increase their weight to ensure that no road is neglected.

2. Group Selection Using Fuzzy Logic and Fairness  

The priority of each road is computed using a fuzzy logic function based on the proportion of vehicles waiting on that road compared to the total number of vehicles. This fuzzy value is then multiplied by the fairness weight of the road. The effective priorities for the NS (North-South) and EW (East-West) groups are summed, and the group with the higher effective priority is selected.

3. Traffic Light Switching


- For the first activation, the selected group’s lights are set to green.
- If the group remains the same, the green light is maintained.
- If a new group is selected (e.g., due to increased pedestrian flow), the system enters an “in transition” state: the previous group’s lights change to yellow (during which vehicles may still pass, but the yellow phase lasts one step) and then the new group’s lights switch to green.

4. Conditional Arrows


Roads that are not receiving green lights have conditional right-turn arrows enabled.

5. Checking Vehicle Movement Possibilities  

The system checks each road – for each vehicle, it evaluates if the vehicle can move:

- If a vehicle has a green light, it is allowed to go straight or turn right provided there is no risk of collision.
- If the vehicle intends to turn left, it must yield to oncoming traffic (i.e., the vehicle coming straight on the main road). If the conditions are met, the vehicle is allowed to proceed; otherwise, it must wait.
- If the vehicle is waiting on a road with a conditional arrow, it verifies that the main road is clear. If the conditions are met, the vehicle is allowed to proceed.

**Summary:**
In a real-world scenario, the best results are achieved by using machine learning. After the system is properly trained, it will provide the highest accuracy in assessing traffic intensity and prioritizing movements. It is also worth considering the use of a roundabout.


### 1. Algorithm Components

**Purpose**: 

Determine how “urgent” it is to serve a particular road based on the ratio of vehicles waiting on that road to the total number of vehicles at the intersection.

**How it works**

- Normalization: 

The function `fuzzyPriority(queueLength, totalVehicles)` calculates a normalized value (`norm = queueLength / totalVehicles`), which represents the fraction of the total vehicles waiting on that road. The value of norm lies between 0 and 1.

- Membership Functions:
Three membership functions are defined based on norm:
    - Low:
If norm ≤ 0.2, the membership value is 1 (full membership). For norm values between 0.2 and 0.4, the value decreases linearly to 0.
    - Medium:
This value increases linearly from 0 at norm = 0.2 to a maximum at norm = 0.5, then     decreases linearly back to 0 at norm = 0.8.
    - High:
For norm ≤ 0.6, the value is 0, then increases linearly to 1 at norm = 1.

- Aggregation: The final fuzzy priority is calculated as a weighted average:


[$priority=((low×0.3)+(medium×0.6)+(high×1.0))/(low+medium+high)$](https://latex.codecogs.com/svg.image?&space;priority=\frac{(low*0.3)&plus;(medium*0.6)&plus;(high*1.0)}{low&plus;medium&plus;high})
​

This value indicates how much a particular road should be served, with higher values corresponding to higher priority.

### 2. Fairness Weights

 **Purpose:**

Ensure that no road is neglected, even if it has a temporarily low number of vehicles. If a road waits too long without being served, its fairness weight increases.

**How It Works:**

 - Each road (represented by RoadDirection.NORTH, EAST, SOUTH, WEST) has an associated fairness weight, initially set to 1.
 - The function updateFairnessWeights(lights, queues):
    - Resets the weight to 1 for roads that have a green light (indicating they are being served).
    - Increases the weight (by a fixed increment, e.g., 0.1) for roads with waiting vehicles that are not currently served.
 - The increased weight boosts the effective priority of that road in subsequent calculations, ensuring fair distribution of green lights.

### 3. Group Selection (Choosing the Active Lights Group) ###

**Purpose:**  

Divide the intersection into two groups:

 - NS (North-South)
 - EW (East-West)

The algorithm determines which group should receive green lights based on the effective priorities calculated for each group.

How It Works:

 - Effective Priority Calculation:
For each group, the effective priority is computed as the sum of the fuzzy priorities of its roads multiplied by their respective fairness weights. For example:
    - For NS: `fuzzyPriority(queue.north.length, totalVehices) * fairnessWeights.north +
            fuzzyPriority(queue.south.length, totalVehices) * fairnessWeights.south;`
    - For EW: `fuzzyPriority(queue.east.length, totalVehices) * fairnessWeights.east +
            fuzzyPriority(queue.west.length, totalVehices) * fairnessWeights.west;`
 - Group Choice:  
The group with the higher effective priority is chosen to receive green lights. If both groups have an effective priority of 0 (i.e., no vehicles), the function returns null.
### 4. Traffic Light Transition Mechanism ###
**Purpose:**  

Smoothly switch green lights between groups, preventing abrupt changes by introducing a transitional yellow phase.

**How It Works:**

- The system maintains three key variables:
    - previousGroup – the group that was previously active.
    - pendingGroup – the group that is about to become active.
    - inTransition (boolean) – indicates if a transition phase is currently in progress.
- Transition Phases:
    - **No Change:**  
If the newly chosen group is the same as the previous group, the lights for that group remain green.
    - **Initiating a Transition:**  
If the chosen group differs from the previous group, the algorithm will sets the lights for the previous group to yellow or Marks the new group as pendingGroup and sets inTransition to true.
    - **Completing the Transition:**  
When in the next step the system detects inTransition is true, it switches the pending group’s lights to green, resets inTransition and updates previousGroup.
### 5. Collision Detection Integration###
**Purpose:**  

Prevent collisions by ensuring that a vehicle does not move if its intended movement could conflict with a vehicle on an opposing road.

**How It Works:**

- The CollisionTrafficController includes methods such as:
    - `canVehicalBeBlock()`: Checks if a vehicle must be blocked because the opposing road has a vehicle going straight.
    - `canVehicalMoveOnConditionArrow()`: Determines if a vehicle can proceed when conditional arrow statuses (e.g., for right turns) are active.

These checks occur before any vehicle is removed from its queue, ensuring that decisions are based on the current state of all queues.

---

###  **Installation**
1. Clone the repository
```sh
git clone https://github.com/michal513717/Traffic-Lights-Control-System.git
cd Traffic-Lights-Control-System
```

2. Install dependencies
```sh
npm install
```

3. Run the application
```sh
npm start <input.json> <output.json>
```


