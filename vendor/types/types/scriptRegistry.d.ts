export interface EventDef {
    description: string;
    longDescription: string;
    validFor: ('cell' | 'object')[];
    example: string;
    notes?: string;
    parameters?: {
        name: string;
        type: string;
        description: string;
        optional?: boolean;
    }[];
}
export declare const EVENTS: {
    readonly onEnter: {
        readonly description: "When entering cell";
        readonly longDescription: "Triggers when the player navigates to this cell. Runs for the cell first, then objects in z-order. Useful for initializing state, showing welcome messages, or checking conditions.";
        readonly validFor: ["cell", "object"];
        readonly example: "onEnter:\n  show WelcomeMessage\n  wait 2000\n  hide WelcomeMessage";
        readonly notes: "Fires for cell, then objects in z-order. Use for setup logic when player arrives.";
    };
    readonly onExit: {
        readonly description: "When leaving cell";
        readonly longDescription: "Triggers when the player navigates away from this cell. Runs for the cell first, then objects in z-order. Useful for cleanup, saving state, or farewell messages.";
        readonly validFor: ["cell", "object"];
        readonly example: "onExit:\n  hide AllPanels\n  set lastVisited currentCell";
        readonly notes: "Fires for cell, then objects in z-order. Good for cleanup before leaving.";
    };
    readonly onClick: {
        readonly description: "When clicked";
        readonly longDescription: "Triggers when the element is clicked. For cells, triggers when clicking the canvas background. Multiple onClick blocks run sequentially (first click runs first block, second click runs second, etc.).";
        readonly validFor: ["cell", "object"];
        readonly example: "onClick:\n  show Panel1\nonClick:\n  hide Panel1\n  show Panel2";
        readonly notes: "Sequential blocks cycle through on repeated clicks. Use reset script to loop back.";
    };
    readonly onKeyDown: {
        readonly description: "When key pressed";
        readonly longDescription: "Triggers when a keyboard key is pressed while in this cell. Can optionally filter by specific key. Also fires for gamepad button presses — each button triggers both a gamepad-specific name and a keyboard equivalent.";
        readonly validFor: ["cell"];
        readonly example: "onKeyDown \"space\":\n  show HelpPanel\n\nonKeyDown:\n  hide HelpPanel";
        readonly parameters: [{
            readonly name: "key";
            readonly type: "string";
            readonly description: "Key to listen for (optional)";
            readonly optional: true;
        }];
        readonly notes: "Key names: \"space\", \"enter\", \"escape\", \"a\"-\"z\", \"0\"-\"9\", \"arrowup\", \"arrowdown\", etc. Gamepad buttons: \"gamepad-a\" (= Space), \"gamepad-b\" (= Escape), \"gamepad-x\" (= e), \"gamepad-y\" (= q), \"gamepad-up/down/left/right\" (= arrows).";
    };
    readonly onKeyUp: {
        readonly description: "When key released";
        readonly longDescription: "Triggers when a keyboard key is released. Can optionally filter by specific key. Often paired with onKeyDown for toggle behaviors. Also fires for gamepad button releases.";
        readonly validFor: ["cell"];
        readonly example: "onKeyUp \"escape\":\n  goto \"MainMenu\"";
        readonly parameters: [{
            readonly name: "key";
            readonly type: "string";
            readonly description: "Key to listen for (optional)";
            readonly optional: true;
        }];
        readonly notes: "Same key names as onKeyDown, including gamepad names.";
    };
    readonly onMessage: {
        readonly description: "When message received";
        readonly longDescription: "Triggers when a matching message is broadcast via shout. Messages are project-wide - any object in any cell can hear them. Objects CAN hear their own shouts (self-hearing is allowed), but infinite loops are blocked (shouting the same message from within its handler). Use `onMessageFrom` to filter by source. Parameters passed via `shout \"MSG\" {key: value}` are available as local variables in the handler (e.g., `shout \"DAMAGE\" {amount: 10}` makes `amount` available as a variable).";
        readonly validFor: ["cell", "object"];
        readonly example: "onMessage \"DAMAGE\":\n  set health health - amount\n  if health <= 0:\n    destroy self";
        readonly parameters: [{
            readonly name: "message";
            readonly type: "string";
            readonly description: "Message to listen for";
        }];
        readonly notes: "Project-wide broadcast. Self-hearing allowed, but same-message infinite loops blocked. Shout parameters become local variables in the handler.";
    };
    readonly onMessageFrom: {
        readonly description: "When message from specific source";
        readonly longDescription: "Like onMessage, but only triggers when the message comes from a specific object. Useful for filtering messages when multiple objects shout the same message type.";
        readonly validFor: ["cell", "object"];
        readonly example: "onMessageFrom Player \"MOVED\":\n  set lastPlayerPos Player.x\n\nonMessageFrom Controller \"GAME_OVER\":\n  show GameOverScreen";
        readonly parameters: [{
            readonly name: "source";
            readonly type: "string";
            readonly description: "Object name that must be the shouter";
        }, {
            readonly name: "message";
            readonly type: "string";
            readonly description: "Message to listen for";
        }];
        readonly notes: "Only fires if the specified object shouted the message.";
    };
    readonly onOverlap: {
        readonly description: "When overlap starts";
        readonly longDescription: "Triggers when this object begins overlapping another object. At least one object in the pair must have sensor enabled. The other object is accessible via the `other` variable — read properties with other.property, check tags with `if other hasTag #tag`, and read custom variables (e.g., other.score).";
        readonly validFor: ["object"];
        readonly example: "onOverlap:\n  if other hasTag #coin:\n    hide other\n    set score score + 1";
        readonly notes: "Requires sensor property. Fires once on overlap start. `other` references the overlapping object — access its properties and custom variables.";
    };
    readonly onOverlapEnd: {
        readonly description: "When overlap ends";
        readonly longDescription: "Triggers when this object stops overlapping another object that it was previously overlapping. The other object is accessible via the `other` variable — same access as onOverlap (other.property, other hasTag, other.customVar).";
        readonly validFor: ["object"];
        readonly example: "onOverlapEnd:\n  set inZone false";
        readonly notes: "Fires when objects that were overlapping separate. `other` references the departing object.";
    };
    readonly onCollide: {
        readonly description: "When collision occurs";
        readonly longDescription: "Triggers when this object collides with a blocking object. Unlike onOverlap (which requires sensor), onCollide fires when physics collision resolution happens. The other object is accessible via the `other` variable — read its properties with other.property (other.name, other.x, other.visible) or check tags with `if other hasTag #tag`. You can also read custom object variables from the other object (e.g., other.damage).";
        readonly validFor: ["object"];
        readonly example: "onCollide:\n  if other hasTag #missile:\n    set self.health self.health - other.damage\n    destroy other";
        readonly notes: "Fires on physical collision with blocking objects. `other` references the colliding object — access its properties and custom variables. Works on both movers and blockers.";
    };
    readonly onBreak: {
        readonly description: "When peg constraint breaks";
        readonly longDescription: "Triggers when a peg constraint breaks because the force exceeded its breakForce threshold. Only fires on peg objects with breakForce set.";
        readonly validFor: ["object"];
        readonly example: "onBreak:\n  spawn \"Sparks\" {x: self.x, y: self.y}\n  destroy self";
        readonly notes: "Only fires on peg objects when breakForce is exceeded.";
    };
    readonly onHover: {
        readonly description: "When mouse enters";
        readonly longDescription: "Triggers when the mouse cursor enters this object's bounds. Useful for hover effects, tooltips, or highlighting interactive elements.";
        readonly validFor: ["object"];
        readonly example: "onHover:\n  set opacity 0.8\n  show Tooltip";
        readonly notes: "Fires once when mouse enters. Pair with onHoverEnd for leave effects.";
    };
    readonly onHoverEnd: {
        readonly description: "When mouse leaves";
        readonly longDescription: "Triggers when the mouse cursor leaves this object's bounds after previously hovering over it. Use to reset hover effects.";
        readonly validFor: ["object"];
        readonly example: "onHoverEnd:\n  set opacity 1\n  hide Tooltip";
        readonly notes: "Fires once when mouse leaves. Only fires if onHover previously fired.";
    };
    readonly onDragStart: {
        readonly description: "When drag begins";
        readonly longDescription: "Triggers when the user starts dragging this object. Fires after the pointer has moved beyond the drag threshold (5 pixels). Works on any object with this script — if draggable is also enabled, the object moves with the pointer; otherwise only events fire (useful for slingshot, joystick, swipe gestures).";
        readonly validFor: ["object"];
        readonly example: "onDragStart:\n  set opacity 0.7\n  set self.z 1000";
        readonly notes: "Fires once when drag motion exceeds threshold. Add draggable for auto-move.";
    };
    readonly onDrag: {
        readonly description: "While being dragged";
        readonly longDescription: "Triggers continuously while this object is being dragged. Fires on each pointer move during drag. Use clickX/clickY to read the pointer position. If draggable is enabled, the object follows the pointer; otherwise the object stays put and only events fire.";
        readonly validFor: ["object"];
        readonly example: "onDrag:\n  if self.x < 0:\n    set self.x 0";
        readonly notes: "Fires repeatedly during drag motion. clickX/clickY available.";
    };
    readonly onDragEnd: {
        readonly description: "When drag ends";
        readonly longDescription: "Triggers when the user releases this object after dragging. Useful for snapping to position, validating drop location, launching with impulse, or resetting visual state.";
        readonly validFor: ["object"];
        readonly example: "onDragEnd:\n  set opacity 1\n  if self.x > 0.5:\n    set self.x 0.5";
        readonly notes: "Fires once when pointer is released after dragging.";
    };
    readonly onMove: {
        readonly description: "When movement direction changes";
        readonly longDescription: "Triggers when this object starts moving in a new direction. Fires each time the direction changes (up, down, left, right). For forward-axis objects, also fires with \"forward\" or \"backward\" relative to the object's facing direction.";
        readonly validFor: ["object"];
        readonly example: "onMove \"down\":\n  set self.state \"walkDown\"\nonMove \"forward\":\n  animate self \"walk\" loop resume";
        readonly notes: "Fires when direction changes. Use direction parameter to filter: \"up\", \"down\", \"left\", \"right\", \"forward\", \"backward\". Without parameter, fires for any direction change. Forward/backward only fire for forward-axis (tank-style) movement.";
        readonly parameters: [{
            readonly name: "direction";
            readonly type: "string";
            readonly description: "Filter by direction: \"up\", \"down\", \"left\", \"right\", \"forward\", \"backward\"";
            readonly optional: true;
        }];
    };
    readonly onRotate: {
        readonly description: "When rotation direction changes";
        readonly longDescription: "Triggers when this object starts rotating in a new direction. Fires each time the rotation direction changes (cw, ccw). Useful for triggering animations when steering.";
        readonly validFor: ["object"];
        readonly example: "onRotate \"cw\":\n  set self.state \"turnRight\"\nonRotate \"ccw\":\n  set self.state \"turnLeft\"";
        readonly notes: "Fires when rotation direction changes. Use direction parameter to filter: \"cw\" (clockwise), \"ccw\" (counter-clockwise). Without parameter, fires for any rotation change.";
        readonly parameters: [{
            readonly name: "direction";
            readonly type: "string";
            readonly description: "Filter by direction: \"cw\", \"ccw\"";
            readonly optional: true;
        }];
    };
    readonly onStop: {
        readonly description: "When movement stops";
        readonly longDescription: "Triggers when this object stops moving (velocity becomes zero). Useful for resetting to idle state, snapping to grid, or playing stop animations.";
        readonly validFor: ["object"];
        readonly example: "onStop:\n  set self.state \"idle\"";
        readonly notes: "Fires once when object comes to rest. Does not fire if object was already stopped.";
    };
    readonly onStopRotate: {
        readonly description: "When rotation stops";
        readonly longDescription: "Triggers when this object stops rotating. Useful for stopping rotation-linked animations or resetting state after steering.";
        readonly validFor: ["object"];
        readonly example: "onStopRotate:\n  stop animate self \"tracks\"";
        readonly notes: "Fires once when object stops rotating. Does not fire if object was already not rotating.";
    };
    readonly onTick: {
        readonly description: "Every physics frame";
        readonly longDescription: "Triggers every physics frame (typically 60fps). Use for continuous logic like smooth rotation, custom movement, or checking conditions each frame. The deltaTime variable is available with the time elapsed since the last frame in seconds.";
        readonly validFor: ["object"];
        readonly example: "onTick:\n  if turningLeft:\n    set self.rotation self.rotation - 180 * deltaTime";
        readonly notes: "Runs every frame — keep logic lightweight. Use deltaTime for frame-rate independent calculations. Avoid wait/repeat inside onTick.";
    };
    readonly onJump: {
        readonly description: "When object jumps";
        readonly longDescription: "Triggers when this object performs a jump (jump key pressed while grounded or with remaining multi-jumps). Useful for playing jump animations or sounds.";
        readonly validFor: ["object"];
        readonly example: "onJump:\n  set self.state \"jumping\"\n  shake self 100";
        readonly notes: "Fires when jump is triggered, not when moving upward. Requires jumpable property.";
    };
    readonly onLanding: {
        readonly description: "When object lands";
        readonly longDescription: "Triggers when this object lands on a surface after being airborne. Useful for playing landing animations, sounds, or resetting jump state.";
        readonly validFor: ["object"];
        readonly example: "onLanding:\n  set self.state \"idle\"\n  shake self 50";
        readonly notes: "Fires when transitioning from airborne to grounded. Does not fire if already on ground.";
    };
    readonly onSpawn: {
        readonly description: "When object is spawned";
        readonly longDescription: "Triggers when this object is created via the spawn command. Parameters passed to spawn via `spawn \"Name\" {key: value}` are available as local variables in the handler (e.g., `spawn \"Bullet\" {dir: 90, speed: 5}` makes `dir` and `speed` available). Use for initialization logic like setting position, color, or state. The special parameters `x` and `y` set spawn position directly.";
        readonly validFor: ["object"];
        readonly example: "onSpawn:\n  set self.rotation dir\n  enable self movable speed speed axis forward facing\n  set self.color.color color";
        readonly parameters: [{
            readonly name: "params";
            readonly type: "object";
            readonly description: "Parameters from spawn command become local variables: spawn \"Obj\" {key: value} → key is available in handler";
            readonly optional: true;
        }];
        readonly notes: "Only fires on spawned objects (created at runtime). Template objects do not fire onSpawn. Spawn parameters {x, y} set position; all other params become local variables.";
    };
    readonly onDestroy: {
        readonly description: "Before object is destroyed";
        readonly longDescription: "Triggers before a spawned object is removed via the destroy command. Use for cleanup, animations, or effects. The handler blocks destruction until complete, allowing animations to finish.";
        readonly validFor: ["object"];
        readonly example: "onDestroy:\n  shake self 200\n  wait 200";
        readonly notes: "Blocks destruction until handler completes. Only fires on spawned objects.";
    };
    readonly onSubmit: {
        readonly description: "When text input is submitted";
        readonly longDescription: "Triggers when the user presses Enter in an editable text field. The updated text is already stored in self.content when this fires.";
        readonly validFor: ["object"];
        readonly example: "onSubmit:\n  if self.content == \"open sesame\":\n    show SecretDoor";
        readonly notes: "Only fires on text objects with editable enabled.";
    };
    readonly onDefocus: {
        readonly description: "When text input loses focus";
        readonly longDescription: "Triggers when an editable text field loses focus (user clicks elsewhere or presses Escape). The updated text is already stored in self.content.";
        readonly validFor: ["object"];
        readonly example: "onDefocus:\n  if self.content == \"\":\n    set self.content \"Enter name...\"";
        readonly notes: "Only fires on text objects with editable enabled.";
    };
};
export type EventType = keyof typeof EVENTS;
export declare const COMBINED_EVENTS_INFO: {
    description: string;
    longDescription: string;
    example: string;
    notes: string;
};
export interface ActionDef {
    description: string;
    longDescription: string;
    example: string;
    parameters: {
        name: string;
        type: string;
        description: string;
        optional?: boolean;
    }[];
    notes?: string;
}
export declare const ACTIONS: {
    readonly goto: {
        readonly description: "Navigate to cell";
        readonly longDescription: "Navigates the player to a different cell. Can include a transition animation. The current cell's onExit runs first, then the target cell's onEnter. Supports directional navigation (north/east/south/west) based on map layout. Optional reset level: \"clean\" resets all objects but keeps variables, \"fresh\" resets everything (objects + variables).";
        readonly example: "goto \"NextRoom\" clean with fade 500";
        readonly parameters: [{
            readonly name: "cell";
            readonly type: "string";
            readonly description: "Cell name, or direction: north, east, south, west";
        }, {
            readonly name: "resetLevel";
            readonly type: "string";
            readonly description: "Reset level: \"clean\" (reset objects, keep vars) or \"fresh\" (reset everything)";
            readonly optional: true;
        }, {
            readonly name: "transition";
            readonly type: "transition";
            readonly description: "Animation type";
            readonly optional: true;
        }, {
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Duration in ms (default 300)";
            readonly optional: true;
        }];
        readonly notes: "Stops script execution. Use \"goto north\" etc. for map-based navigation. Reset levels: clean = reset objects/keep variables, fresh = reset everything.";
    };
    readonly transition: {
        readonly description: "Cell transition animation";
        readonly longDescription: "Plays a transition animation on the entire cell. Use in onEnter to animate the cell appearing, or in onExit to animate it leaving. Overrides any transition specified on the incoming goto command.";
        readonly example: "onEnter:\n  transition fade 500\n\nonExit:\n  transition slide-up 300";
        readonly parameters: [{
            readonly name: "type";
            readonly type: "transition";
            readonly description: "Animation type: fade, slide-up, slide-down, slide-left, slide-right, zoom";
        }, {
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Duration in ms (default 300)";
            readonly optional: true;
        }];
        readonly notes: "The transition direction (in/out) is determined by the event context (onEnter = in, onExit = out).";
    };
    readonly show: {
        readonly description: "Make visible";
        readonly longDescription: "Makes an object visible. Can include a transition animation. Use tags to show multiple objects at once.";
        readonly example: "show MyButton with fade 300";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name or #tag";
        }, {
            readonly name: "transition";
            readonly type: "transition";
            readonly description: "Animation type";
            readonly optional: true;
        }, {
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Duration in ms (default 300)";
            readonly optional: true;
        }];
        readonly notes: "Use #tagName to show all objects with that tag. Use self.ChildName to show a child of the current component.";
    };
    readonly hide: {
        readonly description: "Make hidden";
        readonly longDescription: "Hides an object. Can include a transition animation. Hidden objects are invisible in play mode but still exist.";
        readonly example: "hide ErrorMessage with fade 200";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name or #tag";
        }, {
            readonly name: "transition";
            readonly type: "transition";
            readonly description: "Animation type";
            readonly optional: true;
        }, {
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Duration in ms (default 300)";
            readonly optional: true;
        }];
        readonly notes: "Use #tagName to hide all objects with that tag. Use self.ChildName to hide a child of the current component.";
    };
    readonly wait: {
        readonly description: "Pause execution";
        readonly longDescription: "Pauses script execution for the specified duration, or until movement settles. Use \"wait movement\" to pause until all movable objects have stopped. Use \"wait movement self\" to wait only for the current object to stop - useful when many objects move independently.";
        readonly example: "wait 2000\nwait 2s\nwait movement\nwait movement self";
        readonly parameters: [{
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Time in milliseconds (or use \"2s\" for seconds), or \"movement\" to wait for dynamics";
        }, {
            readonly name: "target";
            readonly type: "string";
            readonly description: "Optional object name after \"movement\" — waits only for that object (e.g., \"self\")";
            readonly optional: true;
        }];
        readonly notes: "Use \"wait movement\" to wait for all objects, \"wait movement self\" to wait only for the current object.";
    };
    readonly set: {
        readonly description: "Set variable or property";
        readonly longDescription: "Sets a variable value or an object property. Variables can be scoped (session, game, local). Object properties change visual appearance at runtime. Use `over DURATION` for smooth tweening. When setting `state`, the state's delta is applied as a composable patch (only the changed properties are written). Optional spatial modifiers filter which properties are applied.";
        readonly example: "set score 100\nset game.highScore 999\nset Button1.opacity 0.5\nset self.opacity 0 over 500\nset self.fillColor \"#ff0000\" over 1000 ease-in-out\nset self.x 0.8 over 300 ease-out\nset self.state RED\nset self.state RED over 500\nset self.state RED position over 300 ease-out cw\nset self.state BLUE none\nset self.state BLUE position rotate\nset self.state BLUE offset\nset self.state next";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Variable name or Object.property";
        }, {
            readonly name: "value";
            readonly type: "any";
            readonly description: "Value to set (number, string, boolean, or expression)";
        }, {
            readonly name: "modifiers";
            readonly type: "string";
            readonly description: "For state only: none/position/rotate/scale/offset (spatial filter). Combinable. Optional.";
        }, {
            readonly name: "over";
            readonly type: "number";
            readonly description: "Tween duration in ms for smooth transition. Optional.";
            readonly optional: true;
        }, {
            readonly name: "easing";
            readonly type: "string";
            readonly description: "Easing function: linear, ease-in, ease-out, ease-in-out, ease-in-cubic, ease-out-cubic, ease-in-out-cubic. Optional.";
            readonly optional: true;
        }, {
            readonly name: "cw|ccw";
            readonly type: "keyword";
            readonly description: "For state tweens: force rotation direction. Optional.";
            readonly optional: true;
        }];
        readonly notes: "Scopes: session (default, cleared on reset), game (persists), local (persists forever). State modifiers: \"none\" excludes all spatial props, \"position\" includes x/y, \"rotate\" includes rotation/flip, \"scale\" includes width/height, \"offset\" includes offsetX/offsetY (relative displacement from reference position). Modifiers are combinable: \"position rotate\" includes both position and rotation properties. Tween: `set X.prop value over DURATION [easing]` smoothly transitions to the target. Fire-and-forget; script continues. A subsequent instant `set` cancels the tween. For state tweens, modifiers come before `over`.";
    };
    readonly reset: {
        readonly description: "Reset game state";
        readonly longDescription: "Resets variables, visit history, and/or objects. Different scopes clear different data. \"objects\" resets all objects on the current cell (positions, visibility, states, spawned objects) but keeps variables. \"fresh\" resets everything (objects + variables). Useful for restarting a game or clearing progress.";
        readonly example: "reset game";
        readonly parameters: [{
            readonly name: "scope";
            readonly type: "string";
            readonly description: "What to reset: \"session\", \"game\", \"all\", \"objects\", \"fresh\", or cell name";
        }];
        readonly notes: "\"session\" clears session vars + visits. \"game\" clears game vars. \"all\" clears everything. \"objects\" resets objects on current cell, keeps variables. \"fresh\" resets objects + variables on current cell.";
    };
    readonly 'reset script': {
        readonly description: "Reset click counter";
        readonly longDescription: "Resets the click counter for sequential onClick blocks back to the beginning. Allows onClick sequences to loop instead of stopping after the last block.";
        readonly example: "onClick:\n  show Step1\nonClick:\n  show Step2\nonClick:\n  hide Step2\n  reset script";
        readonly parameters: [];
        readonly notes: "Place at the end of a sequence to make it loop.";
    };
    readonly endGame: {
        readonly description: "Exit play mode";
        readonly longDescription: "Ends the game and exits play mode. In the studio, returns to build mode. In the player, stops the game.";
        readonly example: "onClick:\n  endGame";
        readonly parameters: [];
        readonly notes: "Use for \"quit game\" buttons or end-of-game flows.";
    };
    readonly restart: {
        readonly description: "Restart from start cell";
        readonly longDescription: "Navigates to the start cell and performs a full reset (objects + variables). Equivalent to \"goto StartCell fresh\". Use for \"game over / play again\" functionality.";
        readonly example: "onClick:\n  restart";
        readonly parameters: [];
        readonly notes: "Resets everything and goes back to the start cell. For staying on the current cell, use \"reset objects\" or \"reset fresh\" instead.";
    };
    readonly save: {
        readonly description: "Save game to named slot";
        readonly longDescription: "Saves the current game state (objects, variables, cell position) to a named save slot in localStorage. Overwrites any existing save in that slot.";
        readonly example: "onClick:\n  save \"checkpoint\"";
        readonly parameters: [{
            readonly name: "slotName";
            readonly type: "string";
            readonly description: "Name of the save slot";
        }];
        readonly notes: "Save slots persist across browser sessions. Use hasSave() to check if a slot exists before loading.";
    };
    readonly load: {
        readonly description: "Load game from named slot";
        readonly longDescription: "Restores game state from a previously saved slot. Navigates to the saved cell and restores all objects, variables, and visit history. Silently does nothing if the slot does not exist.";
        readonly example: "onClick:\n  if hasSave(\"checkpoint\"):\n    load \"checkpoint\"";
        readonly parameters: [{
            readonly name: "slotName";
            readonly type: "string";
            readonly description: "Name of the save slot to load";
        }];
        readonly notes: "Interrupts script execution and navigates to the saved cell. Like goto, no statements after load will execute.";
    };
    readonly 'delete save': {
        readonly description: "Delete a save slot";
        readonly longDescription: "Removes a named save slot from localStorage. Silently does nothing if the slot does not exist.";
        readonly example: "onClick:\n  delete save \"checkpoint\"";
        readonly parameters: [{
            readonly name: "slotName";
            readonly type: "string";
            readonly description: "Name of the save slot to delete";
        }];
        readonly notes: "Cannot be undone. Use to clear old saves or implement a \"New Game\" flow.";
    };
    readonly return: {
        readonly description: "Exit action/handler early";
        readonly longDescription: "Exits the current action or event handler immediately. Useful for early returns when a condition is met, avoiding deeply nested if statements. Does not stop other handlers from running.";
        readonly example: "action checkWin:\n  if not gameStarted:\n    return\n  // ... check win logic";
        readonly parameters: [];
        readonly notes: "Only exits the current action or handler, not the entire script.";
    };
    readonly break: {
        readonly description: "Exit loop early";
        readonly longDescription: "Exits the innermost foreach or repeat loop immediately. Useful when you find what you are looking for or want to stop a repeat loop based on a condition.";
        readonly example: "foreach item in items:\n  if item.found:\n    set result item\n    break";
        readonly parameters: [];
        readonly notes: "Only exits the innermost loop. Works in both foreach and repeat.";
    };
    readonly clear: {
        readonly description: "Clear grid cell data";
        readonly longDescription: "Clears data stored in grid cells. Can clear an entire grid or a specific cell. Grid cell data is runtime storage for arbitrary values per cell - separate from visual objects.";
        readonly example: "// Clear entire grid\nclear Board\n\n// Clear specific cell\nclear Board.cell[2][3]";
        readonly parameters: [{
            readonly name: "grid";
            readonly type: "string";
            readonly description: "Grid name";
        }, {
            readonly name: "cell[x][y]";
            readonly type: "cell coords";
            readonly description: "Optional: specific cell to clear";
            readonly optional: true;
        }];
        readonly notes: "Grid cell data is cleared automatically on reset(\"session\").";
    };
    readonly 'enable pageable': {
        readonly description: "Create pageable sequence";
        readonly longDescription: "Creates a pageable component that cycles through its children, showing one at a time. When created, the first item is shown and others are hidden. Use next/prev to navigate. You can either list items explicitly or omit the brackets to use the component's children order.";
        readonly example: "enable Slideshow pageable [Intro, Step1, Step2, Step3]\n// Or use children order:\nenable Slideshow pageable";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Component name, self, siblings, children, #tag";
        }, {
            readonly name: "items";
            readonly type: "string[]";
            readonly description: "List of object names to cycle through (optional - omit brackets to use component children)";
        }];
        readonly notes: "First item shown by default. Omit [items] to use the component's children sorted by z-index.";
    };
    readonly next: {
        readonly description: "Next pageable item";
        readonly longDescription: "Advances to the next item in a pageable. Hides the current item and shows the next one. Use \"wrap\" to loop from last to first, or \"else\" for end action.";
        readonly example: "next Slideshow with fade wrap";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Pageable name";
        }];
        readonly notes: "Add \"wrap\" to loop, or \"else <action>\" for end behavior.";
    };
    readonly prev: {
        readonly description: "Previous pageable item";
        readonly longDescription: "Goes back to the previous item in a pageable. Hides the current item and shows the previous one. Use \"wrap\" to loop from first to last, or \"else\" for start action.";
        readonly example: "prev Slideshow with fade wrap";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Pageable name";
        }];
        readonly notes: "Add \"wrap\" to loop, or \"else <action>\" for start behavior.";
    };
    readonly wrap: {
        readonly description: "Wrap pageable to first item";
        readonly longDescription: "Wraps a pageable back to its first item. Useful inside \"else\" blocks of next/prev to wrap AND perform additional actions.";
        readonly example: "next Slideshow else:\n  wrap Slideshow\n  show LoopIndicator";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Pageable name to wrap";
        }];
        readonly notes: "Can be used standalone or inside else blocks. Supports transitions: wrap Slideshow with fade";
    };
    readonly shout: {
        readonly description: "Broadcast message";
        readonly longDescription: "Broadcasts a message project-wide. Any object with a matching onMessage handler will react, regardless of which cell it is in. Objects CAN hear their own shouts, but infinite loops are blocked (cannot shout the same message from within its handler). Can include parameters that handlers can access as variables.";
        readonly example: "shout \"KEY_PICKED_UP\"\nshout \"DAMAGE\" {amount: 50, source: \"enemy\"}\nshout \"SCORE_CHANGED\" {newScore: score}";
        readonly parameters: [{
            readonly name: "message";
            readonly type: "string";
            readonly description: "Message to broadcast";
        }, {
            readonly name: "params";
            readonly type: "object";
            readonly description: "Parameters to pass {key: value}";
            readonly optional: true;
        }];
        readonly notes: "Parameters are accessed as variables in handler: `if amount > 10:`";
    };
    readonly 'shout to': {
        readonly description: "Send message to target";
        readonly longDescription: "Sends a message to a specific object or all objects with a tag. Only matching targets will receive the message. Useful for direct communication between known objects.";
        readonly example: "shout to Player \"HEAL\" {amount: 25}\nshout to #enemies \"FREEZE\"\nshout to HealthBar \"UPDATE\" {value: health}";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name or #tag";
        }, {
            readonly name: "message";
            readonly type: "string";
            readonly description: "Message to send";
        }, {
            readonly name: "params";
            readonly type: "object";
            readonly description: "Parameters to pass {key: value}";
            readonly optional: true;
        }];
        readonly notes: "Use #tagName to target all objects with that tag.";
    };
    readonly press: {
        readonly description: "Synthetic key press";
        readonly longDescription: "Injects a synthetic key-down event. When called from an object script, fires onKeyDown on that object only. When called from a cell script, fires globally. Use `on` to target a specific object. The key stays \"held\" until a matching `release` is called. If already held, this is a no-op.";
        readonly example: "press \"q\"\npress \"Space\"\npress \"e\" on EnemyTank";
        readonly parameters: [{
            readonly name: "key";
            readonly type: "string";
            readonly description: "Key name (e.g. \"q\", \"Space\", \"ArrowUp\")";
        }, {
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object to inject into (default: self)";
            readonly optional: true;
        }];
        readonly notes: "Works with existing onKeyDown handlers. Same object can receive both physical and synthetic key events.";
    };
    readonly release: {
        readonly description: "Synthetic key release";
        readonly longDescription: "Injects a synthetic key-up event. Clears the held state set by `press` and fires onKeyUp on the target object. If the key is not currently held, this is a no-op.";
        readonly example: "release \"q\"\nrelease \"Space\"\nrelease \"e\" on EnemyTank";
        readonly parameters: [{
            readonly name: "key";
            readonly type: "string";
            readonly description: "Key name matching a previous press";
        }, {
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object to target (default: self)";
            readonly optional: true;
        }];
        readonly notes: "All synthetic keys are auto-released on play mode exit.";
    };
    readonly post: {
        readonly description: "Send data to URL";
        readonly longDescription: "Sends JSON data to an external URL via HTTP POST. Use for submitting scores, saving progress, or integrating with external services. Sets httpError variable on failure.";
        readonly example: "post \"https://api.example.com/scores\" {name: playerName, score: finalScore}";
        readonly parameters: [{
            readonly name: "url";
            readonly type: "string";
            readonly description: "URL to send data to";
        }, {
            readonly name: "data";
            readonly type: "object";
            readonly description: "Data to send as JSON {key: value}";
        }];
        readonly notes: "Sets httpError variable if request fails. Requires CORS headers on receiving server.";
    };
    readonly fetch: {
        readonly description: "Get data from URL";
        readonly longDescription: "Fetches JSON data from an external URL via HTTP GET and stores it in a variable. Use for loading leaderboards, configurations, or dynamic content. Sets httpError variable on failure.";
        readonly example: "fetch \"https://api.example.com/scores\" into highscores";
        readonly parameters: [{
            readonly name: "url";
            readonly type: "string";
            readonly description: "URL to fetch data from";
        }, {
            readonly name: "variable";
            readonly type: "string";
            readonly description: "Variable name to store result";
        }];
        readonly notes: "Sets httpError variable if request fails. Requires CORS headers on server.";
    };
    readonly spawn: {
        readonly description: "Create runtime object from template";
        readonly longDescription: "Creates a new object at runtime by cloning a template object. The template is any existing object in the cell (typically hidden). Parameters are passed to the onSpawn handler on the spawned object. Spawned objects are cleared on reset(\"session\") or cell exit. Use `at AnchorName` to spawn at an anchor's position and rotation — if the anchor is inside a component, the spawned object becomes a child of that component.";
        readonly example: "spawn \"PieceTemplate\" {col: 3, row: 5, color: \"red\"}\nspawn \"Bullet\" at MuzzlePoint\nspawn \"Bullet\" at MuzzlePoint {vx: 1, vy: 0}";
        readonly parameters: [{
            readonly name: "template";
            readonly type: "string";
            readonly description: "Name of the template object to clone";
        }, {
            readonly name: "at";
            readonly type: "string";
            readonly description: "Anchor name — spawns at anchor position/rotation. If anchor is inside a component, spawned object becomes a child of that component";
            readonly optional: true;
        }, {
            readonly name: "params";
            readonly type: "object";
            readonly description: "Parameters passed to onSpawn handler {key: value}";
            readonly optional: true;
        }];
        readonly notes: "Template should be hidden (buildVisible: false). Spawned objects inherit template properties including scripts.";
    };
    readonly destroy: {
        readonly description: "Remove object from scene";
        readonly longDescription: "Removes an object from the scene. Works on both spawned and design-time objects. Fires onDestroy handler first and waits for it to complete (allowing death animations). Can include a transition animation. Design-time objects reappear on cell reset or restart; spawned objects do not.";
        readonly example: "destroy piece\ndestroy self\ndestroy Enemy with fade 300\ndestroy self with scale 200";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "object";
            readonly description: "The object to destroy (name, variable, self, other, #tag)";
        }, {
            readonly name: "transition";
            readonly type: "transition";
            readonly description: "Animation type";
            readonly optional: true;
        }, {
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Duration in ms (default 300)";
            readonly optional: true;
        }];
        readonly notes: "Design-time objects reappear on reset/restart. Use hide for temporary visibility changes.";
    };
    readonly copy: {
        readonly description: "Copy to clipboard";
        readonly longDescription: "Copies a value to the system clipboard. Must be triggered by a user action (onClick, onKeyDown, etc.) due to browser security requirements. Useful for sharing generated values, codes, or results.";
        readonly example: "onClick:\n  copy seed\n\nonClick:\n  copy Result.content";
        readonly parameters: [{
            readonly name: "value";
            readonly type: "any";
            readonly description: "Value to copy (variable, property, or expression)";
        }];
        readonly notes: "Only works from user-initiated events (onClick, onKeyDown). Fails silently from onEnter or timers.";
    };
    readonly shake: {
        readonly description: "Shake animation";
        readonly longDescription: "Plays a shake animation on the target object. The object shakes horizontally for the specified duration. Add `loop` to repeat the cycle indefinitely. Supports tags and all-type selectors.";
        readonly example: "shake Button 200\nshake self 500 loop\nshake #enemies 300";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, #tag, or all type";
        }, {
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Cycle duration in ms (default 300)";
            readonly optional: true;
        }, {
            readonly name: "loop";
            readonly type: "keyword";
            readonly description: "Repeat the cycle indefinitely";
            readonly optional: true;
        }];
    };
    readonly vibrate: {
        readonly description: "Vibrate animation";
        readonly longDescription: "Plays a rapid vibration animation on the target object. Higher frequency than shake. Add `loop` to repeat the cycle indefinitely. Supports tags and all-type selectors.";
        readonly example: "vibrate Phone 500\nvibrate self loop\nvibrate #alerts 200 loop";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, #tag, or all type";
        }, {
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Cycle duration in ms (default 300)";
            readonly optional: true;
        }, {
            readonly name: "loop";
            readonly type: "keyword";
            readonly description: "Repeat the cycle indefinitely";
            readonly optional: true;
        }];
    };
    readonly pulse: {
        readonly description: "Pulse animation";
        readonly longDescription: "Plays a pulsing scale animation on the target object. The object grows and shrinks rhythmically. Add `loop` to repeat the cycle indefinitely. Supports tags and all-type selectors.";
        readonly example: "pulse Heart 1000\npulse self 2000 loop\npulse #collectibles 500";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, #tag, or all type";
        }, {
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Cycle duration in ms (default 300)";
            readonly optional: true;
        }, {
            readonly name: "loop";
            readonly type: "keyword";
            readonly description: "Repeat the cycle indefinitely";
            readonly optional: true;
        }];
    };
    readonly squeeze: {
        readonly description: "Squeeze animation";
        readonly longDescription: "Plays a squash-and-stretch animation on the target object. The object compresses and expands. Add `loop` to repeat the cycle indefinitely. Supports tags and all-type selectors.";
        readonly example: "squeeze Slime 400\nsqueeze self 800 loop\nsqueeze #bouncy 300";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, #tag, or all type";
        }, {
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Cycle duration in ms (default 300)";
            readonly optional: true;
        }, {
            readonly name: "loop";
            readonly type: "keyword";
            readonly description: "Repeat the cycle indefinitely";
            readonly optional: true;
        }];
    };
    readonly bounce: {
        readonly description: "Bounce animation";
        readonly longDescription: "Plays a bouncing animation on the target object. The object moves up and down. Add `loop` to repeat the cycle indefinitely. Supports tags and all-type selectors.";
        readonly example: "bounce Ball 600\nbounce self 1000 loop\nbounce #items 400";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, #tag, or all type";
        }, {
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Cycle duration in ms (default 300)";
            readonly optional: true;
        }, {
            readonly name: "loop";
            readonly type: "keyword";
            readonly description: "Repeat the cycle indefinitely";
            readonly optional: true;
        }];
    };
    readonly spin: {
        readonly description: "Spin animation";
        readonly longDescription: "Plays a spinning rotation animation on the target object. The object rotates 360 degrees. Add `loop` to repeat the cycle indefinitely. On components, rotates the whole group as a unit; add `children` to apply per-child instead. Supports tags and all-type selectors.";
        readonly example: "spin Gear 1000\nspin self 2000 loop\nspin #wheels 500 loop cw\nspin MyComponent 1000 loop children";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, #tag, or all type";
        }, {
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Cycle duration in ms (default 300)";
            readonly optional: true;
        }, {
            readonly name: "loop";
            readonly type: "keyword";
            readonly description: "Repeat the cycle indefinitely";
            readonly optional: true;
        }, {
            readonly name: "children";
            readonly type: "keyword";
            readonly description: "Apply per-child on components (each child animates individually)";
            readonly optional: true;
        }];
    };
    readonly glow: {
        readonly description: "Glow animation";
        readonly longDescription: "Plays a pulsing glow effect on the target object. The glow radiates from the object edges. Add `loop` to repeat the cycle indefinitely. Optional color parameter. Supports tags and all-type selectors.";
        readonly example: "glow Button 1000\nglow self 2000 loop\nglow self 1500 loop \"#ff0000\"";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, #tag, or all type";
        }, {
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Cycle duration in ms (default 300)";
            readonly optional: true;
        }, {
            readonly name: "loop";
            readonly type: "keyword";
            readonly description: "Repeat the cycle indefinitely";
            readonly optional: true;
        }, {
            readonly name: "color";
            readonly type: "string";
            readonly description: "Glow color (default: object glowColor or white)";
            readonly optional: true;
        }];
    };
    readonly screenshake: {
        readonly description: "Screen shake effect";
        readonly longDescription: "Shakes the entire camera/viewport. Useful for impact, explosions, earthquakes. Supports intensity range (e.g., `1-5`) for ramping effects. Non-looping shakes naturally damp to zero. `stop screenshake` to stop.";
        readonly example: "screenshake 300\nscreenshake 500 loop\nscreenshake 200 5\nscreenshake 2000 1-5\nstop screenshake";
        readonly parameters: [{
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Duration in ms (default 300)";
        }, {
            readonly name: "intensity";
            readonly type: "number";
            readonly description: "Shake intensity or range A-B (default 3)";
            readonly optional: true;
        }, {
            readonly name: "loop";
            readonly type: "keyword";
            readonly description: "Repeat indefinitely";
            readonly optional: true;
        }];
    };
    readonly stop: {
        readonly description: "Stop animation or audio";
        readonly longDescription: "Stops any currently playing animation or audio on the target object. For audio, resets playback to the beginning. Supports tags and all-type selectors.";
        readonly example: "stop Gear\nstop #wheels\nstop Music";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, #tag, or all type";
        }];
    };
    readonly play: {
        readonly description: "Play audio";
        readonly longDescription: "Starts playback on an audio object. Optionally loop continuously. If audio was paused, resumes from the paused position.";
        readonly example: "play Music\nplay SoundEffect loop";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Audio object name";
        }, {
            readonly name: "loop";
            readonly type: "keyword";
            readonly description: "Loop playback continuously";
            readonly optional: true;
        }];
    };
    readonly pause: {
        readonly description: "Pause audio";
        readonly longDescription: "Pauses playback on an audio object. Playback position is preserved and can be resumed with play.";
        readonly example: "pause Music";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Audio object name";
        }];
    };
    readonly jump: {
        readonly description: "Trigger jump impulse";
        readonly longDescription: "Triggers a jump impulse on an object regardless of input. The object must have jumpable enabled. Bypasses key input and multi-jump counter — the designer explicitly controls when it fires.";
        readonly example: "jump self\njump Player\njump Player height 0.8";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, other, #tag";
        }, {
            readonly name: "height";
            readonly type: "number";
            readonly description: "Optional jump height override";
            readonly optional: true;
        }];
        readonly notes: "Object must have jumpable enabled (via properties panel or `enable Object jumpable`). Fires the onJump event.";
    };
    readonly impulse: {
        readonly description: "Add velocity to object";
        readonly longDescription: "Adds velocity to an object. Additive — accumulates with existing velocity. Use `set Object.velocityX` for absolute velocity. Object must be movable (have a RuntimeState).";
        readonly example: "impulse self 0.3 -0.5\nimpulse Ball random(-0.2, 0.2) -0.5\nimpulse #enemies 0.1 0";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, other, #tag";
        }, {
            readonly name: "vx";
            readonly type: "number";
            readonly description: "Velocity X to add (rightward positive)";
        }, {
            readonly name: "vy";
            readonly type: "number";
            readonly description: "Velocity Y to add (downward positive)";
        }];
    };
    readonly transport: {
        readonly description: "Smooth position tween";
        readonly longDescription: "Smoothly moves an object from its current position to target (x, y) over a duration. Real position updates each frame — sensors and overlaps fire during transit. Does not require movable. Physics is bypassed during transport.";
        readonly example: "transport self to 0.5 0.5 over 1000\ntransport Player to 0.2 0.8 over 500 ease-in-out\ntransport #enemies to Player.x Player.y over 300";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, other, #tag";
        }, {
            readonly name: "x";
            readonly type: "expression";
            readonly description: "Target X position (0-1)";
        }, {
            readonly name: "y";
            readonly type: "expression";
            readonly description: "Target Y position (0-1)";
        }, {
            readonly name: "duration";
            readonly type: "expression";
            readonly description: "Duration in milliseconds";
        }, {
            readonly name: "easing";
            readonly type: "string";
            readonly description: "Optional: ease-in, ease-out, ease-in-out, ease-in-cubic, ease-out-cubic, ease-in-out-cubic";
            readonly optional: true;
        }];
        readonly notes: "No collision — passes through blockers. Physics resumes after transport completes. New transport on same object replaces the old one. `set X.x` cancels transport.";
    };
    readonly moveTo: {
        readonly description: "Move to position or object (physical)";
        readonly longDescription: "Moves an object toward a target position or another object using its movable speed. Obeys physics — collides with blockers, affected by gravity. Object must have movable enabled. Fires onMove/onStop events.";
        readonly example: "moveTo self 0.5 0.5\nmoveTo Player 0.2 0.8\nmoveTo #enemies Player.x Player.y\nmoveTo self Checkpoint\nmoveTo #enemies Flag";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, other, #tag";
        }, {
            readonly name: "x or destination";
            readonly type: "expression";
            readonly description: "Target X (0-1), or object name to move toward";
        }, {
            readonly name: "y";
            readonly type: "expression";
            readonly description: "Target Y (0-1) — omit when using object name";
            readonly optional: true;
        }];
        readonly notes: "Uses movable speed. Collides normally. Arrival not guaranteed (walls may block). Keyboard/gamepad input overrides moveTo. When destination is an object name, its current position is used.";
    };
    readonly log: {
        readonly description: "Debug log";
        readonly longDescription: "Writes a message to the debug console. Useful for debugging scripts during development. Values and expressions are evaluated before logging.";
        readonly example: "log \"Player position: \" Player.x \", \" Player.y\nlog \"Score: \" score";
        readonly parameters: [{
            readonly name: "values";
            readonly type: "any...";
            readonly description: "Values to log (concatenated)";
        }];
        readonly notes: "Visible in the debug panel (View > Debug Console).";
    };
    readonly foreach: {
        readonly description: "Iterate over collection";
        readonly longDescription: "Loops over an array or tagged objects, executing the body for each item. The loop variable holds the current item. Use `break` to exit early.";
        readonly example: "foreach item in emptyCells(\"Board\"):\n  log item.x \", \" item.y\n\nforeach enemy in #enemies:\n  set enemy.opacity 0.5";
        readonly parameters: [{
            readonly name: "variable";
            readonly type: "string";
            readonly description: "Loop variable name";
        }, {
            readonly name: "collection";
            readonly type: "array|#tag";
            readonly description: "Array, function result, or #tag selector";
        }];
        readonly notes: "Use `break` to exit early. Avoid using \"cell\" as variable name (conflicts with grid syntax).";
    };
    readonly repeat: {
        readonly description: "Repeat block forever or N times";
        readonly longDescription: "Executes statements repeatedly. Without a count, loops forever until `break` or cell exit. The loop reads live variables each iteration — any variable set by another event (onClick, onMessage, etc.) is visible on the next iteration. Must contain `wait` in infinite loops to avoid freezing.";
        readonly example: "repeat:\n  spawn \"Particle\" {x: random, y: 0}\n  wait 100ms\n\nrepeat 3:\n  show Hint\n  wait 1s\n  hide Hint";
        readonly parameters: [{
            readonly name: "count";
            readonly type: "number";
            readonly description: "Optional iteration limit (omit for infinite)";
        }];
        readonly notes: "Use `break` to exit. Stops automatically on cell exit. Infinite loops without `wait` will freeze the browser.";
    };
    readonly 'first...where': {
        readonly description: "Find first matching tagged object";
        readonly longDescription: "Finds the first object with the given tag that matches a condition. Assigns it to a variable for use in subsequent statements. The dot before the property name is optional.";
        readonly example: "first #tiles where visible == true:\n  set found item\n  hide item\n\nfirst #enemies where health <= 0:\n  destroy item";
        readonly parameters: [{
            readonly name: "tag";
            readonly type: "#tag";
            readonly description: "Tag selector to search";
        }, {
            readonly name: "property";
            readonly type: "string";
            readonly description: "Property to check (dot optional)";
        }, {
            readonly name: "operator";
            readonly type: "string";
            readonly description: "Comparison operator";
        }, {
            readonly name: "value";
            readonly type: "any";
            readonly description: "Value to compare against";
        }];
        readonly notes: "The matched object is available as `item` inside the block.";
    };
    readonly 'action (custom)': {
        readonly description: "Define custom action";
        readonly longDescription: "Defines a reusable named action block that can be called from anywhere in the cell. Actions are cell-scoped subroutines — define once on any object (or the cell script), call with `do actionName` from any script. The caller's `self` is preserved.";
        readonly example: "// Define on any object:\naction dropPiece:\n  set Board.cell[col][row].owner currentPlayer\n  spawn \"Piece\" {col: col, row: row}\n\n// Call from any script in the cell:\ndo dropPiece\ndo checkWin";
        readonly parameters: [{
            readonly name: "name";
            readonly type: "string";
            readonly description: "Action name (no spaces)";
        }];
        readonly notes: "Variables are shared between caller and action. `self` refers to the calling object, not the defining object. First matching definition in the cell wins.";
    };
    readonly 'enable movable': {
        readonly description: "Enable movement";
        readonly longDescription: "Configures an object for dynamics-based movement. Supports continuous movement with speed/acceleration or grid-snapped movement. Supports multi-target (siblings, children, #tag).";
        readonly example: "enable Player movable speed 0.3\nenable Paddle movable speed 0.5 axis x\nenable Ball movable speed 0.3 path Track\nenable Ship movable speed 0.3 facing\nenable Tank movable speed 0.3 axis forward\nenable siblings movable speed 0.5\ndisable Player movable";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }, {
            readonly name: "config";
            readonly type: "keywords";
            readonly description: "speed N (0.1–2, default 0.3), acceleration N (0.1–20, default 10), deceleration N (0–1, default 0.15), style teleport|slide|fade|jump, axis x|y|forward, steer N (turn rate multiplier, default 1), path ObjectName, facing";
        }];
        readonly notes: "Defaults: speed 0.3, acceleration 10, deceleration 0.15. Deceleration is 0–1 where 0=no decel (coast forever), 1=instant stop. Typical values: 0.05 (icy), 0.15 (normal), 0.5 (heavy). Use axis x or axis y to constrain movement to one axis. Use axis forward for tank-style controls where up/down moves along the facing direction and left/right rotates the body (rotation rate proportional to speed). Use path ObjectName to constrain movement along a path/curve shape. Use facing to auto-rotate the object toward its movement direction (smooth lerp, right side = front at 0°). Mutually exclusive with rotatable physics.";
    };
    readonly 'disable movable': {
        readonly description: "Disable movement";
        readonly longDescription: "Removes movement capability from an object.";
        readonly example: "disable Player movable";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'enable jumpable': {
        readonly description: "Enable jumping";
        readonly longDescription: "Configures an object to jump when the jump key is pressed. Requires movable. Supports multi-jump and custom jump height.";
        readonly example: "enable Player jumpable height 0.8\nenable Player jumpable height 0.6 multijump 2\ndisable Player jumpable";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }, {
            readonly name: "config";
            readonly type: "keywords";
            readonly description: "height N (0.1–2, default 0.5), multijump N (1–5, default 1), key \"Key\"";
        }];
        readonly notes: "Requires movable. Jump key is Space by default. Height is in normalized units (1 = full canvas height).";
    };
    readonly 'disable jumpable': {
        readonly description: "Disable jumping";
        readonly longDescription: "Removes jump capability from an object.";
        readonly example: "disable Player jumpable";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'enable draggable': {
        readonly description: "Enable drag";
        readonly longDescription: "Makes an object draggable by the user. Options: once (single drag), collision (respect blockers), discrete (cell-by-cell), occupy (reject if cell taken).";
        readonly example: "enable Piece draggable\nenable Piece draggable discrete occupy collision";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }, {
            readonly name: "config";
            readonly type: "keywords";
            readonly description: "once, collision, discrete, occupy";
        }];
        readonly notes: "Fires onDragStart, onDrag, onDragEnd events.";
    };
    readonly 'disable draggable': {
        readonly description: "Disable drag";
        readonly longDescription: "Removes drag capability from an object.";
        readonly example: "disable Piece draggable";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'enable keyboard': {
        readonly description: "Enable keyboard input";
        readonly longDescription: "Adds keyboard input (WASD + arrows) to a movable object. Multiple input types can be active simultaneously.";
        readonly example: "enable Player keyboard";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
        readonly notes: "Keyboard + gamepad can be active at the same time. Click-to-move is used as fallback when no directional input.";
    };
    readonly 'enable click': {
        readonly description: "Enable click-to-move input";
        readonly longDescription: "Adds click-to-move input to a movable object. Object moves toward click position.";
        readonly example: "enable Player click";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'enable gamepad': {
        readonly description: "Enable gamepad input";
        readonly longDescription: "Adds gamepad input (left stick + D-pad) to a movable object. Multiple input types can be active simultaneously.";
        readonly example: "enable Player gamepad";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'enable script': {
        readonly description: "Enable script-only input";
        readonly longDescription: "Adds script input to a movable object. The object only receives synthetic keys via press/release — physical keyboard is ignored. Use for AI-controlled objects.";
        readonly example: "enable Tank script";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'disable keyboard': {
        readonly description: "Disable keyboard input";
        readonly longDescription: "Removes keyboard input from a movable object.";
        readonly example: "disable Player keyboard";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'disable click': {
        readonly description: "Disable click-to-move input";
        readonly longDescription: "Removes click-to-move input from a movable object.";
        readonly example: "disable Player click";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'disable gamepad': {
        readonly description: "Disable gamepad input";
        readonly longDescription: "Removes gamepad input from a movable object.";
        readonly example: "disable Player gamepad";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'disable script': {
        readonly description: "Disable script-only input";
        readonly longDescription: "Removes script input from a movable object.";
        readonly example: "disable Tank script";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'enable subject': {
        readonly description: "Enable camera follow";
        readonly longDescription: "Makes the camera follow the specified object. The viewport scrolls to keep the subject centered.";
        readonly example: "enable Player subject";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
        readonly notes: "Cell must be larger than viewport to see effect.";
    };
    readonly 'disable subject': {
        readonly description: "Disable camera follow";
        readonly longDescription: "Stops the camera from following the specified object.";
        readonly example: "disable Player subject";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'enable follow': {
        readonly description: "Follow a target object";
        readonly longDescription: "Makes a movable object autonomously steer toward a target. The object uses its existing movable config (speed, acceleration, axis constraint, collision). Manual input (keyboard, gamepad) overrides follow direction. With distance, the object maintains that gap — approaches when far, retreats when too close (shy follow). For steered objects (axis forward), the AI turns toward the target and drives forward instead of applying direct force. Arrival deceleration smoothly slows approach. Dead zone prevents fidgeting at the target distance.";
        readonly example: "enable Dog follow \"Player\"\nenable Dog follow \"Player\" distance 0.15\nenable Guard follow \"Player\" distance 0.2\nenable Tank follow \"Player\" arrival 0.15\nenable Tank follow \"Player\" delay 2000\nenable #enemies follow \"Player\"\ndisable Dog follow";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag (who follows)";
        }, {
            readonly name: "object";
            readonly type: "string";
            readonly description: "Target object name to follow (required)";
        }, {
            readonly name: "distance";
            readonly type: "number";
            readonly description: "Preferred distance to maintain (0–1, default: 0 = reach target). Object stops when within distance.";
        }, {
            readonly name: "deadZone";
            readonly type: "number";
            readonly description: "Stop within this distance of target (0–1, default: 0.03). Prevents fidgeting at the target distance.";
        }, {
            readonly name: "arrival";
            readonly type: "number";
            readonly description: "Begin decelerating within this distance of target (0–1, default: 0.12). Auto-scales to at least the follow distance.";
        }, {
            readonly name: "delay";
            readonly type: "number";
            readonly description: "Milliseconds to wait before follow activates (default: 0). Gives target time to build a path.";
        }, {
            readonly name: "pathfinding";
            readonly type: "flag";
            readonly description: "Reserved for future obstacle avoidance";
        }];
        readonly notes: "Requires movable. For steered objects (axis forward), uses steering logic — turns toward target and drives forward. For free-moving objects, applies direct force. Dead zone and arrival deceleration apply to both modes. Use avoid instead of follow to only flee from target.";
    };
    readonly 'enable avoid': {
        readonly description: "Avoid a target object";
        readonly longDescription: "Makes a movable object autonomously steer away from a target. When distance is set, the object only flees when closer than that distance. For steered objects (axis forward), the AI turns away from the target and drives forward. IMPORTANT: always specify a distance — without it, the object flees forever and never stops.";
        readonly example: "enable Enemy avoid \"Player\" distance 0.3\nenable Enemy avoid \"Player\" distance 0.5 arrival 0.1\ndisable Enemy follow";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag (who avoids)";
        }, {
            readonly name: "object";
            readonly type: "string";
            readonly description: "Target object name to avoid (required)";
        }, {
            readonly name: "distance";
            readonly type: "number";
            readonly description: "Awareness radius — flee only when closer than this (0.1–1, default: 0 = always flee). Always specify this for avoid.";
        }, {
            readonly name: "deadZone";
            readonly type: "number";
            readonly description: "Stop within this distance of safe zone (0–1, default: 0.015).";
        }, {
            readonly name: "arrival";
            readonly type: "number";
            readonly description: "Begin decelerating within this distance of safe zone (0–1, default: 0.08).";
        }];
        readonly notes: "Requires movable. Always specify distance for avoid (e.g. 0.3) so the object stops fleeing once far enough away. Without distance, the object flees indefinitely. disable X follow stops both follow and avoid.";
    };
    readonly 'disable follow': {
        readonly description: "Stop following/avoiding";
        readonly longDescription: "Removes follow or avoid behavior from an object.";
        readonly example: "disable Dog follow";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'enable zone': {
        readonly description: "Create a physics zone";
        readonly longDescription: "Makes an object act as a physics zone — a region where physics rules differ from the cell defaults. Objects whose center point falls inside the zone get overridden physics. Any omitted parameter uses the cell default. Smallest zone wins when multiple zones overlap. Per-object modifiers (gravityScale, windScale, dragScale) still apply as multipliers on top of zone values.";
        readonly example: "enable WaterRegion zone gravity 0.3 airResistance 0.8\nenable WindTunnel zone wind 5 windAngle 0\nenable IcePatch zone friction 0\nenable Conveyor zone flowX 0.3\nenable SpacePocket zone gravity 0 airResistance 0\nenable WaterRegion zone gravity 0.3 affects #swimmer\nenable WindTunnel zone wind 5 affects #light #paper";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }, {
            readonly name: "gravity";
            readonly type: "number";
            readonly description: "Override cell gravity (0–10, 0 = weightless, default 1)";
            readonly optional: true;
        }, {
            readonly name: "wind";
            readonly type: "number";
            readonly description: "Override cell wind magnitude (0–10)";
            readonly optional: true;
        }, {
            readonly name: "windAngle";
            readonly type: "number";
            readonly description: "Override cell wind direction in degrees (0=right, 90=down, 0–360)";
            readonly optional: true;
        }, {
            readonly name: "airResistance";
            readonly type: "number";
            readonly description: "Override cell drag coefficient (0–1, 0=vacuum, 1=thick)";
            readonly optional: true;
        }, {
            readonly name: "friction";
            readonly type: "number";
            readonly description: "Override contact friction (0–1, 0=ice, 1=sticky)";
            readonly optional: true;
        }, {
            readonly name: "flowX";
            readonly type: "number";
            readonly description: "Constant horizontal drift in units/sec (-2 to 2, mass-independent)";
            readonly optional: true;
        }, {
            readonly name: "flowY";
            readonly type: "number";
            readonly description: "Constant vertical drift in units/sec (-2 to 2, mass-independent)";
            readonly optional: true;
        }, {
            readonly name: "affects";
            readonly type: "string";
            readonly description: "One or more #tags — zone only affects objects with a matching tag (omit for all objects)";
            readonly optional: true;
        }];
        readonly notes: "Zone object needs a collision shape (any rectangle, polygon, ellipse, or path). Flow is velocity (mass-independent drift like conveyors/currents). Wind is force (mass-dependent acceleration). Re-enable with new values to change zone config dynamically. Use `affects #tag` to filter which objects are affected (OR logic — any matching tag qualifies). Omit affects for all objects (default).";
    };
    readonly 'disable zone': {
        readonly description: "Deactivate a physics zone";
        readonly longDescription: "Removes zone behavior from an object. Physics reverts to cell defaults for objects that were inside.";
        readonly example: "disable WaterRegion zone";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'enable blocking': {
        readonly description: "Enable collision blocking on an object";
        readonly longDescription: "Makes an object block other objects from passing through it. Optionally filter by tags so only certain movers are blocked.";
        readonly example: "enable Wall blocking\nenable Wall blocking affects #tank #player\nenable #walls blocking affects #tank";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }, {
            readonly name: "affects";
            readonly type: "string";
            readonly description: "One or more #tags — only blocks movers with a matching tag (omit to block all)";
            readonly optional: true;
        }];
        readonly notes: "Object needs a collision shape. Use `affects #tag` for selective blocking (OR logic). Omit affects to block everything (default).";
    };
    readonly 'disable blocking': {
        readonly description: "Disable collision blocking";
        readonly longDescription: "Removes blocking behavior from an object. Other objects can now pass through it.";
        readonly example: "disable Wall blocking";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'enable sensor': {
        readonly description: "Enable overlap detection on an object";
        readonly longDescription: "Makes an object detect overlaps with other objects, firing onOverlap/onOverlapEnd events. Optionally filter by tags so only certain objects trigger overlap events.";
        readonly example: "enable Goal sensor\nenable Goal sensor affects #ball\nenable #detectors sensor affects #player";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }, {
            readonly name: "affects";
            readonly type: "string";
            readonly description: "One or more #tags — only detects objects with a matching tag (omit to detect all)";
            readonly optional: true;
        }];
        readonly notes: "Object needs a collision shape. Use `affects #tag` for selective sensing (OR logic). Omit affects to sense everything (default).";
    };
    readonly 'disable sensor': {
        readonly description: "Disable overlap detection";
        readonly longDescription: "Removes sensor behavior from an object. Overlap events will no longer fire.";
        readonly example: "disable Goal sensor";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'enable phase': {
        readonly description: "Enable phasing through blockers";
        readonly longDescription: "Makes an object pass through blocking objects. Without affects, phases through everything. With affects, only phases through blockers that have a matching tag.";
        readonly example: "enable Bullet phase\nenable Bullet phase affects #boundary\nenable self phase affects #wall #fence";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }, {
            readonly name: "affects";
            readonly type: "string";
            readonly description: "One or more #tags — only phases through blockers with a matching tag (omit to phase through all)";
            readonly optional: true;
        }];
        readonly notes: "Use `affects #tag` for selective phasing (OR logic). Without affects, object ignores all collisions.";
    };
    readonly 'disable phase': {
        readonly description: "Disable phasing (resume normal collisions)";
        readonly longDescription: "Removes phasing from an object. It will collide with blockers normally again.";
        readonly example: "disable Bullet phase";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, siblings, children, parent, #tag";
        }];
    };
    readonly 'animate (group)': {
        readonly description: "Animate through a state group";
        readonly longDescription: "Plays a state group animation — cycling through the group's states in order. Frame mode snaps between states at a given FPS. Tween mode smoothly interpolates between states. Rotation uses shortest-path by default; use cw/ccw to force direction.";
        readonly example: "animate self \"walk\"\nanimate self \"walk\" fps 12\nanimate self \"walk\" once\nanimate self \"walk\" pingpong\nanimate self \"hover\" duration 500\nanimate self \"hover\" duration 300 ease-in-out\nanimate self \"spin\" loop cw\nanimate self \"walk\" loop resume\nanimate self \"run\" loop exclusive\nanimate self \"walk\" reverse\nanimate Button \"hover\" duration 200 loop";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, #tag, or all type";
        }, {
            readonly name: "group";
            readonly type: "string";
            readonly description: "State group name (in quotes)";
        }, {
            readonly name: "fps";
            readonly type: "number";
            readonly description: "Frames per second — frame mode (overrides group default)";
            readonly optional: true;
        }, {
            readonly name: "duration";
            readonly type: "number";
            readonly description: "Milliseconds per transition step — tween mode (overrides group default)";
            readonly optional: true;
        }, {
            readonly name: "easing";
            readonly type: "string";
            readonly description: "Easing function: linear, ease-in, ease-out, ease-in-out, ease-in-cubic, ease-out-cubic, ease-in-out-cubic";
            readonly optional: true;
        }, {
            readonly name: "loop|once|pingpong";
            readonly type: "keyword";
            readonly description: "Play mode (default: loop)";
            readonly optional: true;
        }, {
            readonly name: "cw|ccw";
            readonly type: "keyword";
            readonly description: "Force rotation direction: cw (clockwise) or ccw (counter-clockwise). Default: shortest path.";
            readonly optional: true;
        }, {
            readonly name: "resume";
            readonly type: "keyword";
            readonly description: "Tween from current visual state to first frame instead of snapping. Smooth transition into the animation.";
            readonly optional: true;
        }, {
            readonly name: "exclusive";
            readonly type: "keyword";
            readonly description: "Stop all other group animations on this object before starting. Use for directional sprites where only one animation should play at a time.";
            readonly optional: true;
        }, {
            readonly name: "reverse";
            readonly type: "keyword";
            readonly description: "Reverse the state order at play time. A group with states A→B→C plays as C→B→A.";
            readonly optional: true;
        }];
        readonly notes: "By default, multiple group animations can run concurrently on the same object. Use `exclusive` to stop all other group animations before starting. Manual `set state` also stops running animation. Frame mode uses fps; tween mode uses duration + easing. cw/ccw only affects tween mode rotation interpolation.";
    };
    readonly 'stop animate': {
        readonly description: "Stop state group animation";
        readonly longDescription: "Stops a running state group animation on the target object. The object stays at its current visual state.";
        readonly example: "stop animate self\nstop animate Button\nstop animate #enemies";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Object name, self, #tag, or all type";
        }];
        readonly notes: "Object retains its current appearance. Different from `stop` which stops procedural animations (shake, pulse, etc.).";
    };
    readonly reveal: {
        readonly description: "Reveal area on mask";
        readonly longDescription: "Makes a circular area of a mask transparent, revealing objects underneath. Coordinates are relative to the mask's top-left corner, using the same scale as the mask's width/height. Use to create fog-of-war effects, digging mechanics, or destructible terrain.";
        readonly example: "reveal Mask1 0.2 0.2\nreveal Mask1 0.5 0.5 0.1\nreveal Mask1 self.x self.y 0.05 0.02";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Mask object name";
        }, {
            readonly name: "x";
            readonly type: "expression";
            readonly description: "X position relative to mask (0 = left edge)";
        }, {
            readonly name: "y";
            readonly type: "expression";
            readonly description: "Y position relative to mask (0 = top edge)";
        }, {
            readonly name: "radius";
            readonly type: "expression";
            readonly description: "Reveal radius in mask-relative units (optional, uses mask default)";
            readonly optional: true;
        }, {
            readonly name: "fade";
            readonly type: "expression";
            readonly description: "Edge fade width in mask-relative units (optional, uses mask default)";
            readonly optional: true;
        }];
        readonly notes: "Coordinates use the mask's coordinate system (0,0 = top-left of mask, maskWidth,maskHeight = bottom-right). Radius and fade are in the same units.";
    };
    readonly rehide: {
        readonly description: "Rehide (restore fog) on a mask";
        readonly longDescription: "Resets a mask or specific revealer layer back to fully opaque (hidden). Without a revealer name, resets the entire mask. With a revealer name, resets only that revealer's trail.";
        readonly example: "rehide Mask1\nrehide Mask1 Player";
        readonly parameters: [{
            readonly name: "target";
            readonly type: "string";
            readonly description: "Mask object name";
        }, {
            readonly name: "revealer";
            readonly type: "string";
            readonly description: "Revealer object name (optional, resets all if omitted)";
            readonly optional: true;
        }];
    };
};
export type ActionType = keyof typeof ACTIONS;
export interface TransitionDef {
    description: string;
    validFor: ('goto' | 'show' | 'hide' | 'destroy')[];
}
export declare const TRANSITIONS: {
    readonly fade: {
        readonly description: "Fade in/out";
        readonly validFor: ["goto", "show", "hide", "destroy"];
    };
    readonly scale: {
        readonly description: "Scale up/down";
        readonly validFor: ["show", "hide", "destroy"];
    };
    readonly 'slide-up': {
        readonly description: "Slide upward";
        readonly validFor: ["goto", "show", "hide", "destroy"];
    };
    readonly 'slide-down': {
        readonly description: "Slide downward";
        readonly validFor: ["goto", "show", "hide", "destroy"];
    };
    readonly 'slide-left': {
        readonly description: "Slide left";
        readonly validFor: ["goto"];
    };
    readonly 'slide-right': {
        readonly description: "Slide right";
        readonly validFor: ["goto"];
    };
    readonly zoom: {
        readonly description: "Zoom in/out";
        readonly validFor: ["goto"];
    };
};
export type TransitionType = keyof typeof TRANSITIONS;
export interface FunctionDef {
    description: string;
    longDescription: string;
    example: string;
    parameters: {
        name: string;
        type: string;
        description: string;
        optional?: boolean;
    }[];
    returns: string;
    notes?: string;
}
export declare const FUNCTIONS: {
    readonly visited: {
        readonly description: "Cell has been visited";
        readonly longDescription: "Returns true if the specified cell has been visited at least once. Use \"this\" for the current cell.";
        readonly example: "if visited(\"SecretRoom\"):";
        readonly parameters: [{
            readonly name: "cell";
            readonly type: "string";
            readonly description: "Cell name or \"this\"";
        }];
        readonly returns: "boolean";
    };
    readonly hasSave: {
        readonly description: "Check if save slot exists";
        readonly longDescription: "Returns true if a named save slot exists. Use to conditionally show a \"Continue\" button or check before loading.";
        readonly example: "if hasSave(\"checkpoint\"):";
        readonly parameters: [{
            readonly name: "slotName";
            readonly type: "string";
            readonly description: "Name of the save slot to check";
        }];
        readonly returns: "boolean";
    };
    readonly visits: {
        readonly description: "Visit count";
        readonly longDescription: "Returns the number of times a cell has been visited. Useful for showing different content on repeat visits.";
        readonly example: "if visits(\"this\") > 1:";
        readonly parameters: [{
            readonly name: "cell";
            readonly type: "string";
            readonly description: "Cell name or \"this\"";
        }];
        readonly returns: "number";
    };
    readonly hasObject: {
        readonly description: "Cell has object";
        readonly longDescription: "Returns true if the current cell contains an object with the specified name.";
        readonly example: "if hasObject(\"Key\"):";
        readonly parameters: [{
            readonly name: "name";
            readonly type: "string";
            readonly description: "Object name to check for";
        }];
        readonly returns: "boolean";
    };
    readonly get: {
        readonly description: "Get variable value";
        readonly longDescription: "Returns the value of a stored variable. Useful when the variable name is dynamic or stored in another variable.";
        readonly example: "if get(\"score\") > 100:";
        readonly parameters: [{
            readonly name: "key";
            readonly type: "string";
            readonly description: "Variable name";
        }];
        readonly returns: "any";
    };
    readonly random: {
        readonly description: "Random number";
        readonly longDescription: "random() returns 0-1 float. random(min, max) returns random integer from min to max (inclusive).";
        readonly example: "set roll random(1, 6)";
        readonly parameters: [{
            readonly name: "min";
            readonly type: "number";
            readonly description: "Minimum value (inclusive)";
            readonly optional: true;
        }, {
            readonly name: "max";
            readonly type: "number";
            readonly description: "Maximum value (inclusive)";
            readonly optional: true;
        }];
        readonly returns: "number";
    };
    readonly floor: {
        readonly description: "Round down";
        readonly longDescription: "Returns the largest integer less than or equal to the given number.";
        readonly example: "set whole floor(3.7)  // 3";
        readonly parameters: [{
            readonly name: "value";
            readonly type: "number";
            readonly description: "Number to round down";
        }];
        readonly returns: "number";
    };
    readonly ceil: {
        readonly description: "Round up";
        readonly longDescription: "Returns the smallest integer greater than or equal to the given number.";
        readonly example: "set whole ceil(3.2)  // 4";
        readonly parameters: [{
            readonly name: "value";
            readonly type: "number";
            readonly description: "Number to round up";
        }];
        readonly returns: "number";
    };
    readonly round: {
        readonly description: "Round to nearest";
        readonly longDescription: "Returns the value rounded to the nearest integer.";
        readonly example: "set whole round(3.5)  // 4";
        readonly parameters: [{
            readonly name: "value";
            readonly type: "number";
            readonly description: "Number to round";
        }];
        readonly returns: "number";
    };
    readonly abs: {
        readonly description: "Absolute value";
        readonly longDescription: "Returns the absolute (non-negative) value of a number.";
        readonly example: "set dist abs(x - targetX)";
        readonly parameters: [{
            readonly name: "value";
            readonly type: "number";
            readonly description: "Number to get absolute value of";
        }];
        readonly returns: "number";
    };
    readonly min: {
        readonly description: "Minimum value";
        readonly longDescription: "Returns the smallest of the given numbers.";
        readonly example: "set lowest min(a, b, c)";
        readonly parameters: [{
            readonly name: "values";
            readonly type: "number...";
            readonly description: "Numbers to compare";
        }];
        readonly returns: "number";
    };
    readonly max: {
        readonly description: "Maximum value";
        readonly longDescription: "Returns the largest of the given numbers.";
        readonly example: "set highest max(a, b, c)";
        readonly parameters: [{
            readonly name: "values";
            readonly type: "number...";
            readonly description: "Numbers to compare";
        }];
        readonly returns: "number";
    };
    readonly sin: {
        readonly description: "Sine (degrees)";
        readonly longDescription: "Returns the sine of an angle in degrees. Useful for converting rotation to directional velocity.";
        readonly example: "set vx cos(self.rotation) * speed\nset vy sin(self.rotation) * speed";
        readonly parameters: [{
            readonly name: "degrees";
            readonly type: "number";
            readonly description: "Angle in degrees";
        }];
        readonly returns: "number";
    };
    readonly cos: {
        readonly description: "Cosine (degrees)";
        readonly longDescription: "Returns the cosine of an angle in degrees. Useful for converting rotation to directional velocity.";
        readonly example: "set vx cos(self.rotation) * speed";
        readonly parameters: [{
            readonly name: "degrees";
            readonly type: "number";
            readonly description: "Angle in degrees";
        }];
        readonly returns: "number";
    };
    readonly atan2: {
        readonly description: "Angle from coordinates";
        readonly longDescription: "Returns the angle in degrees from the positive X axis to the point (x, y). Useful for calculating the angle between two objects.";
        readonly example: "set angle atan2(target.y - self.y, target.x - self.x)";
        readonly parameters: [{
            readonly name: "y";
            readonly type: "number";
            readonly description: "Y component";
        }, {
            readonly name: "x";
            readonly type: "number";
            readonly description: "X component";
        }];
        readonly returns: "number";
    };
    readonly cardinal: {
        readonly description: "Angle to cardinal direction";
        readonly longDescription: "Converts an angle (in degrees) to a cardinal direction string: \"right\" (0°), \"down\" (90°), \"left\" (180°), \"up\" (270°). Useful for setting object states based on movement angle.";
        readonly example: "set self.state cardinal(moveAngle)";
        readonly parameters: [{
            readonly name: "angle";
            readonly type: "number";
            readonly description: "Angle in degrees (0=right, 90=down, 180=left, 270=up)";
        }];
        readonly returns: "string";
    };
    readonly length: {
        readonly description: "Array/string length";
        readonly longDescription: "Returns the number of elements in an array or characters in a string.";
        readonly example: "if length(items) > 0:";
        readonly parameters: [{
            readonly name: "value";
            readonly type: "array|string";
            readonly description: "Array or string to measure";
        }];
        readonly returns: "number";
    };
    readonly range: {
        readonly description: "Generate number sequence";
        readonly longDescription: "range(n) returns [0..n-1]. range(min, max) returns [min..max] (inclusive).";
        readonly example: "foreach i in range(0, 5):";
        readonly parameters: [{
            readonly name: "min_or_count";
            readonly type: "number";
            readonly description: "Count (1 arg) or start value (2 args)";
        }, {
            readonly name: "max";
            readonly type: "number";
            readonly description: "End value (inclusive)";
            readonly optional: true;
        }];
        readonly returns: "array";
    };
    readonly shuffle: {
        readonly description: "Randomize array";
        readonly longDescription: "Returns a new array with the elements in random order.";
        readonly example: "set deck shuffle(cards)";
        readonly parameters: [{
            readonly name: "array";
            readonly type: "array";
            readonly description: "Array to shuffle";
        }];
        readonly returns: "array";
    };
    readonly pick: {
        readonly description: "Random element";
        readonly longDescription: "Returns a random element from the array.";
        readonly example: "set winner pick(players)";
        readonly parameters: [{
            readonly name: "array";
            readonly type: "array";
            readonly description: "Array to pick from";
        }];
        readonly returns: "any";
    };
    readonly isEmpty: {
        readonly description: "Check grid cell empty";
        readonly longDescription: "Returns true if the specified grid cell has no movable objects.";
        readonly example: "if isEmpty(\"Grid1\", 2, 3):";
        readonly parameters: [{
            readonly name: "grid";
            readonly type: "string";
            readonly description: "Grid name";
        }, {
            readonly name: "x";
            readonly type: "number";
            readonly description: "Column (0-indexed)";
        }, {
            readonly name: "y";
            readonly type: "number";
            readonly description: "Row (0-indexed)";
        }];
        readonly returns: "boolean";
    };
    readonly emptyCells: {
        readonly description: "Get empty grid cells";
        readonly longDescription: "Returns an array of {x, y} objects for all empty cells in the grid. Checks for objects with cellX/cellY properties.";
        readonly example: "set available emptyCells(\"Grid1\")";
        readonly parameters: [{
            readonly name: "grid";
            readonly type: "string";
            readonly description: "Grid name";
        }];
        readonly returns: "array";
    };
    readonly cellsWhere: {
        readonly description: "Find grid cells by data";
        readonly longDescription: "Returns an array of {x, y} objects for all cells in the grid where the stored data matches the condition. Uses grid cell data storage, not object positions.";
        readonly example: "// Find cells marked as \"red\"\nset redCells cellsWhere(\"Board\", \"color\", \"==\", \"red\")\n\n// Find cells owned by player 1\nset p1Cells cellsWhere(\"Board\", \"owner\", \"==\", 1)";
        readonly parameters: [{
            readonly name: "grid";
            readonly type: "string";
            readonly description: "Grid name";
        }, {
            readonly name: "property";
            readonly type: "string";
            readonly description: "Cell data property to check";
        }, {
            readonly name: "operator";
            readonly type: "string";
            readonly description: "Comparison: ==, !=, >, <, >=, <=";
        }, {
            readonly name: "value";
            readonly type: "any";
            readonly description: "Value to compare against";
        }];
        readonly returns: "array";
        readonly notes: "Works with grid cell data set via set Grid.cell[x][y].property syntax.";
    };
    readonly floodfill: {
        readonly description: "Find connected grid cells";
        readonly longDescription: "Returns all cells connected to the starting cell through cells matching the criteria. Supports 4-way (cardinal only) or 8-way (cardinal + diagonal) adjacency. Useful for connectivity checking, match-3 games, territory control, and determining if removing a piece would create islands.";
        readonly example: "// Find all cells connected through occupied cells (8-way default)\nset connected floodfill(\"GRID\", 4, 4, \"occupied\", true)\n\n// 4-way connectivity (cardinal directions only)\nset connected floodfill(\"GRID\", 4, 4, \"occupied\", true, 4)\n\n// Match-3: find connected same-color cells\nset cluster floodfill(\"Board\", clickX, clickY, \"color\", \"red\")\nif length(cluster) >= 3:\n  // Clear the cluster";
        readonly parameters: [{
            readonly name: "grid";
            readonly type: "string";
            readonly description: "Grid name";
        }, {
            readonly name: "startX";
            readonly type: "number";
            readonly description: "Starting column (0-indexed)";
        }, {
            readonly name: "startY";
            readonly type: "number";
            readonly description: "Starting row (0-indexed)";
        }, {
            readonly name: "property";
            readonly type: "string";
            readonly description: "Cell data property to match (default: \"occupied\")";
            readonly optional: true;
        }, {
            readonly name: "value";
            readonly type: "any";
            readonly description: "Value to match (default: true)";
            readonly optional: true;
        }, {
            readonly name: "connectivity";
            readonly type: "number";
            readonly description: "4 (cardinal) or 8 (cardinal + diagonal, default)";
            readonly optional: true;
        }];
        readonly returns: "array";
        readonly notes: "Returns array of {x, y} objects. Uses grid cell data, not object positions. Empty array if start cell doesn't match.";
    };
    readonly minimax: {
        readonly description: "AI best move (minimax)";
        readonly longDescription: "Uses minimax algorithm with alpha-beta pruning to find the optimal move for grid-based games like Connect4, Tic-tac-toe, etc. Returns the best column index for the AI player.";
        readonly example: "// Connect4 AI move\nset bestCol minimax(\"Board\", \"owner\", \"YELLOW\", \"RED\", 4)\nset col bestCol\nStart.dropPiece\n\n// Tic-tac-toe (3x3, win=3)\nset bestCol minimax(\"Grid\", \"mark\", \"O\", \"X\", 6, 0, 3)";
        readonly parameters: [{
            readonly name: "grid";
            readonly type: "string";
            readonly description: "Grid name";
        }, {
            readonly name: "property";
            readonly type: "string";
            readonly description: "Cell data property for ownership";
        }, {
            readonly name: "aiPlayer";
            readonly type: "any";
            readonly description: "AI player value (e.g., \"YELLOW\")";
        }, {
            readonly name: "humanPlayer";
            readonly type: "any";
            readonly description: "Human player value (e.g., \"RED\")";
        }, {
            readonly name: "depth";
            readonly type: "number";
            readonly description: "Search depth (4-6 recommended)";
        }, {
            readonly name: "emptyValue";
            readonly type: "any";
            readonly description: "Empty cell value (default: 0)";
            readonly optional: true;
        }, {
            readonly name: "winLength";
            readonly type: "number";
            readonly description: "Pieces to win (default: 4)";
            readonly optional: true;
        }];
        readonly returns: "number";
        readonly notes: "Higher depth = stronger but slower. Depth 4-5 is good for Connect4. Returns -1 if no valid move.";
    };
    readonly hash: {
        readonly description: "Hash values to integer";
        readonly longDescription: "Computes a hash value from one or more inputs. Use #tag.property to hash arrays of values from tagged objects. Useful for deterministic pseudo-random seeds.";
        readonly example: "// Hash ball positions\nset seed hash(#balls.x, #balls.y)\n\n// Hash single values\nset id hash(x, y, z)\n\n// Hash any properties\nset seed hash(#pieces.cellX, #pieces.cellY)";
        readonly parameters: [{
            readonly name: "values";
            readonly type: "any...";
            readonly description: "Values to hash: numbers, strings, arrays (from #tag.property)";
        }];
        readonly returns: "number";
        readonly notes: "Arrays are hashed element by element.";
    };
    readonly distance: {
        readonly description: "Distance between objects";
        readonly longDescription: "Returns the Euclidean distance between two objects in normalized coordinates (0–1). Works with self, other, object names, and UUIDs.";
        readonly example: "if distance(self, Enemy) < 0.2:\n  impulse self 0 -0.5";
        readonly parameters: [{
            readonly name: "objectA";
            readonly type: "object";
            readonly description: "First object (self, other, or name)";
        }, {
            readonly name: "objectB";
            readonly type: "object";
            readonly description: "Second object (self, other, or name)";
        }];
        readonly returns: "number";
    };
    readonly nearby: {
        readonly description: "Objects within radius";
        readonly longDescription: "Returns all objects within the given radius of the reference object, sorted by distance. Optional tag filter. Each result has name, x, y, and distance properties.";
        readonly example: "set enemies nearby(self, 0.2, #enemy)\nif length(enemies) > 0:\n  set closest enemies[0]";
        readonly parameters: [{
            readonly name: "object";
            readonly type: "object";
            readonly description: "Center object (self, other, or name)";
        }, {
            readonly name: "radius";
            readonly type: "number";
            readonly description: "Search radius (normalized coords)";
        }, {
            readonly name: "tag";
            readonly type: "tag";
            readonly description: "Optional tag filter (#tag)";
            readonly optional: true;
        }];
        readonly returns: "array";
        readonly notes: "Returns array of {name, x, y, distance}. Excludes the reference object.";
    };
    readonly nearest: {
        readonly description: "Closest matching object";
        readonly longDescription: "Returns the Nth closest object to a reference point, optionally filtered by tag, name, or sibling. Can measure from an object or from x/y coordinates. Returns {name, x, y, distance} or 0 if no match.";
        readonly example: "set target nearest(self, #coin)\nif target != 0:\n  set dx target.x - self.x\n\n// Check spawn position is clear\nset sx random\nset sy random\nif nearest(sx, sy, #enemy).distance > 0.1:\n  spawn \"Enemy\" {x: sx, y: sy}\n\n// 2nd nearest enemy\nset second nearest(self, #enemy, 2)";
        readonly parameters: [{
            readonly name: "ref";
            readonly type: "object|number";
            readonly description: "Reference object (self, other, name) or X coordinate";
        }, {
            readonly name: "y/selector";
            readonly type: "number|string";
            readonly description: "Y coordinate (if ref is X) or selector (#tag, name, \"sibling\")";
        }, {
            readonly name: "selector/rank";
            readonly type: "string|number";
            readonly description: "Selector (if using x/y) or rank (default 1)";
            readonly optional: true;
        }, {
            readonly name: "rank";
            readonly type: "number";
            readonly description: "Nth nearest (default 1, only when using x/y)";
            readonly optional: true;
        }];
        readonly returns: "object|0";
        readonly notes: "Returns {name, x, y, distance} or 0. Use \"sibling\" selector for same-component children. Rank 2 = second nearest, etc.";
    };
    readonly intersects: {
        readonly description: "Collision shape overlap";
        readonly longDescription: "Tests if two objects' collision shapes overlap using SAT (Separating Axis Theorem). Supports tag matching to test against multiple objects.";
        readonly example: "if intersects(Sword, Enemy):\n  destroy Enemy\nif intersects(self, #coin):\n  set score score + 1";
        readonly parameters: [{
            readonly name: "objectA";
            readonly type: "object";
            readonly description: "First object (self, other, or name)";
        }, {
            readonly name: "objectB";
            readonly type: "object|tag";
            readonly description: "Second object or #tag (returns true if any tagged object intersects)";
        }];
        readonly returns: "boolean";
        readonly notes: "Objects must have collision shapes (be in the dynamics engine). Returns false if shapes missing.";
    };
    readonly canSee: {
        readonly description: "Line of sight on grid";
        readonly longDescription: "Checks if there is a clear line of sight between two grid cells. Uses Bresenham line algorithm. Cells with the blocker property set to a truthy value block sight.";
        readonly example: "if canSee(\"Grid\", self.cellX, self.cellY, Player.cellX, Player.cellY, \"wall\"):\n  shout \"SPOTTED\"";
        readonly parameters: [{
            readonly name: "grid";
            readonly type: "string";
            readonly description: "Grid name";
        }, {
            readonly name: "x1";
            readonly type: "number";
            readonly description: "Start column";
        }, {
            readonly name: "y1";
            readonly type: "number";
            readonly description: "Start row";
        }, {
            readonly name: "x2";
            readonly type: "number";
            readonly description: "End column";
        }, {
            readonly name: "y2";
            readonly type: "number";
            readonly description: "End row";
        }, {
            readonly name: "blockerProp";
            readonly type: "string";
            readonly description: "Cell data property that blocks sight (default: \"wall\")";
            readonly optional: true;
        }];
        readonly returns: "boolean";
        readonly notes: "Uses grid cell data. Set wall cells: set Grid.cell[x][y].wall true";
    };
    readonly pathfind: {
        readonly description: "A* pathfinding on grid";
        readonly longDescription: "Finds the shortest path between two grid cells using A* algorithm. Returns array of {x, y} waypoints (excluding start, including goal). Empty array if no path exists.";
        readonly example: "set path pathfind(\"Grid\", self.cellX, self.cellY, Goal.cellX, Goal.cellY, \"wall\")\nif length(path) > 0:\n  set nextStep path[0]";
        readonly parameters: [{
            readonly name: "grid";
            readonly type: "string";
            readonly description: "Grid name";
        }, {
            readonly name: "x1";
            readonly type: "number";
            readonly description: "Start column";
        }, {
            readonly name: "y1";
            readonly type: "number";
            readonly description: "Start row";
        }, {
            readonly name: "x2";
            readonly type: "number";
            readonly description: "End column";
        }, {
            readonly name: "y2";
            readonly type: "number";
            readonly description: "End row";
        }, {
            readonly name: "blockerProp";
            readonly type: "string";
            readonly description: "Cell data property that blocks movement (default: \"wall\")";
            readonly optional: true;
        }];
        readonly returns: "array";
        readonly notes: "Cardinal movement only (4-way). Uses grid cell data for obstacles.";
    };
    readonly generateMaze: {
        readonly description: "Generate maze on grid";
        readonly longDescription: "Generates a random maze on a grid using recursive backtracker algorithm. Sets cell data to mark walls and passages. Works best with odd-dimension grids (walls on even coords, passages on odd).";
        readonly example: "generateMaze(\"Grid\", \"wall\")\n// Grid.cell[x][y].wall is now true for walls, false for passages";
        readonly parameters: [{
            readonly name: "grid";
            readonly type: "string";
            readonly description: "Grid name";
        }, {
            readonly name: "wallProp";
            readonly type: "string";
            readonly description: "Cell data property for walls (default: \"wall\")";
            readonly optional: true;
        }];
        readonly returns: "number";
        readonly notes: "Returns count of passage cells. Uses grid cell data storage.";
    };
};
export type FunctionType = keyof typeof FUNCTIONS;
export interface VariableDef {
    description: string;
    longDescription: string;
    example: string;
    type: string;
}
export declare const VARIABLES: {
    readonly random: {
        readonly description: "Random 0-1 value";
        readonly longDescription: "Returns a fresh random number between 0 and 1 each time it's accessed. Useful for probability-based events.";
        readonly example: "if random < 0.5:";
        readonly type: "number";
    };
    readonly currentCell: {
        readonly description: "Current cell name";
        readonly longDescription: "Returns the label/name of the current cell. Useful for conditional logic based on location.";
        readonly example: "if currentCell == \"Start\":";
        readonly type: "string";
    };
    readonly clicks: {
        readonly description: "Click count";
        readonly longDescription: "Returns how many times the current element has been clicked in this session. Useful for tracking progress through sequential content.";
        readonly example: "if clicks == 3:";
        readonly type: "number";
    };
    readonly clickX: {
        readonly description: "Pointer X in world units";
        readonly longDescription: "Returns the X coordinate (in world units) of the pointer when the current event was triggered. Available in onClick, onDragStart, onDrag, onDragEnd, onHover, and onHoverEnd handlers. Returns 0 if no pointer position is available.";
        readonly example: "set marker.x clickX";
        readonly type: "number";
    };
    readonly clickY: {
        readonly description: "Pointer Y in world units";
        readonly longDescription: "Returns the Y coordinate (in world units) of the pointer when the current event was triggered. Available in onClick, onDragStart, onDrag, onDragEnd, onHover, and onHoverEnd handlers. Returns 0 if no pointer position is available.";
        readonly example: "set marker.y clickY";
        readonly type: "number";
    };
    readonly deltaTime: {
        readonly description: "Frame time in seconds";
        readonly longDescription: "Time elapsed since the last physics frame, in seconds. Available in onTick handlers. Use for frame-rate independent calculations: multiply speeds and rates by deltaTime.";
        readonly example: "set self.rotation self.rotation + 180 * deltaTime";
        readonly type: "number";
    };
    readonly other: {
        readonly description: "Other object in collision/overlap";
        readonly longDescription: "References the other object involved in a collision or overlap event. Available in onCollide, onOverlap, and onOverlapEnd handlers. Access properties with other.property (e.g., other.name, other.x, other.visible). Can also read custom object variables with other.varName. Use with hasTag to check tags: `if other hasTag #enemy`.";
        readonly example: "if other hasTag #missile:\n  set health health - 1";
        readonly type: "object";
    };
    readonly newGame: {
        readonly description: "True on fresh start, false on save restore";
        readonly longDescription: "Boolean that is true when the game starts normally and false when restoring from a saved game. Use in onEnter to skip initialization that should only happen on fresh starts (e.g., spawning objects, setting initial positions). Prevents duplicate objects or reset state when loading a save.";
        readonly example: "onEnter:\n  if newGame:\n    spawn \"Enemy\" {x: 0.5, y: 0.5}";
        readonly type: "boolean";
    };
    readonly self: {
        readonly description: "Reference to current object";
        readonly longDescription: "References the object running the script. Use self.property to read/write built-in properties (x, y, rotation, visible, etc.) or custom object variables. Custom variables: `set self.health 100` stores a per-instance variable called \"health\" on this object. Any property name not in the built-in list becomes an object variable. For components, access children with self.ChildName.property (e.g., self.Turret.rotation).";
        readonly example: "set self.health 100\nif self.health <= 0:\n  destroy self";
        readonly type: "object";
    };
};
export type VariableType = keyof typeof VARIABLES;
export interface ConceptDef {
    description: string;
    longDescription: string;
    example: string;
    notes?: string;
}
export declare const CONCEPTS: {
    readonly objectVariables: {
        readonly description: "Custom per-instance variables on objects";
        readonly longDescription: "Any property name that isn't a built-in scriptable property becomes a custom object variable stored per instance. Use `set self.health 100` to create/update and `self.health` to read. These survive across events within a session. Other objects can read them too: `set score Enemy.health`. In collision/overlap handlers, use `other.varName` to read the other object's custom variables.";
        readonly example: "set self.health 100\nset self.ammo 30\nif self.health <= 0:\n  destroy self\n\n// Reading from another object\nset display.content Enemy.health\n\n// In onCollide handler\nonCollide:\n  if other hasTag #bullet:\n    set self.health self.health - other.damage";
        readonly notes: "Object variables are session-scoped (cleared on reset). They are distinct from session/game/local variables which are global.";
    };
    readonly componentChildAccess: {
        readonly description: "Access component children from parent script";
        readonly longDescription: "In a component's script, access child objects using `self.ChildName.property` paths. This lets parent scripts control children (e.g., a Tank component rotating its Turret child). Works for both reading and writing properties and custom variables on children.";
        readonly example: "// In Tank component script:\nset self.Turret.rotation aimAngle\nset self.Barrel.visible true\nif self.Turret.ammo <= 0:\n  set self.Turret.state \"empty\"";
        readonly notes: "Child names are the object names within the component. Only works from the parent component's own script.";
    };
    readonly messageParameters: {
        readonly description: "Passing data through shout messages";
        readonly longDescription: "The `shout` command can include parameters as key-value pairs: `shout \"MSG\" {key: value}`. In the receiving `onMessage` handler, these parameters are available as local variables. This is the primary way to pass data between objects.";
        readonly example: "// Sender:\nshout \"DAMAGE\" {amount: 25, type: \"fire\"}\n\n// Receiver:\nonMessage \"DAMAGE\":\n  set self.health self.health - amount\n  if type == \"fire\":\n    set self.state \"burning\"";
        readonly notes: "Parameters are only available inside the onMessage handler that receives them. They do not persist after the handler runs.";
    };
    readonly spawnParameters: {
        readonly description: "Passing data to spawned objects";
        readonly longDescription: "The `spawn` command can include parameters: `spawn \"Name\" {key: value}`. In the spawned object's `onSpawn` handler, these parameters are available as local variables. Special parameters: `x` and `y` set the spawn position directly.";
        readonly example: "// Spawner:\nspawn \"Bullet\" {x: self.x, y: self.y, dir: self.rotation, speed: 5, damage: 10}\n\n// Spawned object's onSpawn handler:\nonSpawn:\n  set self.rotation dir\n  set self.damage damage\n  enable self movable speed speed axis forward facing";
        readonly notes: "Spawn params are local to onSpawn. Store them as object variables (set self.varName param) to use in other handlers.";
    };
    readonly variableScopes: {
        readonly description: "Session, game, and local variable scopes";
        readonly longDescription: "Variables have three scopes: session (default, cleared on reset), game (persists across resets but not page reload), and local (persists in browser localStorage forever). Use prefix to choose scope: `set score 10` (session), `set game.score 10` (game), `set local.highscore 100` (local). All scopes are global — accessible from any object or cell.";
        readonly example: "set score 10          // session scope — cleared on reset/restart\nset game.lives 3      // game scope — survives reset, lost on page reload\nset local.bestTime 42 // local scope — persists in localStorage forever";
        readonly notes: "Object variables (self.x) are different from scoped variables (score, game.x, local.x). Object variables are per-instance; scoped variables are global.";
    };
};
export interface OperatorDef {
    description: string;
    example: string;
    category: 'control' | 'comparison' | 'logical';
}
export declare const OPERATORS: {
    readonly if: {
        readonly description: "Conditional block";
        readonly example: "if score > 10:";
        readonly category: "control";
    };
    readonly else: {
        readonly description: "Alternative block";
        readonly example: "else:";
        readonly category: "control";
    };
    readonly and: {
        readonly description: "Both must be true";
        readonly example: "if hasKey and doorOpen:";
        readonly category: "logical";
    };
    readonly or: {
        readonly description: "Either can be true";
        readonly example: "if hasKey or hasCard:";
        readonly category: "logical";
    };
    readonly not: {
        readonly description: "Negate condition";
        readonly example: "if not visited(\"Room\"):";
        readonly category: "logical";
    };
    readonly '==': {
        readonly description: "Equal to";
        readonly example: "if score == 100:";
        readonly category: "comparison";
    };
    readonly '!=': {
        readonly description: "Not equal to";
        readonly example: "if state != \"done\":";
        readonly category: "comparison";
    };
    readonly '>': {
        readonly description: "Greater than";
        readonly example: "if score > 50:";
        readonly category: "comparison";
    };
    readonly '<': {
        readonly description: "Less than";
        readonly example: "if health < 20:";
        readonly category: "comparison";
    };
    readonly '>=': {
        readonly description: "Greater or equal";
        readonly example: "if level >= 5:";
        readonly category: "comparison";
    };
    readonly '<=': {
        readonly description: "Less or equal";
        readonly example: "if tries <= 3:";
        readonly category: "comparison";
    };
};
export type OperatorType = keyof typeof OPERATORS;
export interface PropertyDef {
    description: string;
    type: 'number' | 'string' | 'boolean' | 'color' | 'array';
    example: string;
    notes?: string;
    readonly?: boolean;
}
export declare const SCRIPTABLE_PROPERTIES: {
    readonly x: {
        readonly description: "Horizontal position";
        readonly type: "number";
        readonly example: "set Box.x 0.5";
    };
    readonly y: {
        readonly description: "Vertical position";
        readonly type: "number";
        readonly example: "set Box.y 0.25";
    };
    readonly width: {
        readonly description: "Width";
        readonly type: "number";
        readonly example: "set Box.width 0.3";
    };
    readonly height: {
        readonly description: "Height";
        readonly type: "number";
        readonly example: "set Box.height 0.2";
    };
    readonly lineX1: {
        readonly description: "Line start X";
        readonly type: "number";
        readonly example: "set self.lineX1 0.1";
    };
    readonly lineY1: {
        readonly description: "Line start Y";
        readonly type: "number";
        readonly example: "set self.lineY1 0.2";
    };
    readonly lineX2: {
        readonly description: "Line end X";
        readonly type: "number";
        readonly example: "set self.lineX2 0.9";
    };
    readonly lineY2: {
        readonly description: "Line end Y";
        readonly type: "number";
        readonly example: "set self.lineY2 0.8";
    };
    readonly lineStartMarker: {
        readonly description: "Line start marker: none, arrow, circle, square, diamond";
        readonly type: "string";
        readonly example: "set self.lineStartMarker \"arrow\"";
    };
    readonly lineEndMarker: {
        readonly description: "Line end marker: none, arrow, circle, square, diamond";
        readonly type: "string";
        readonly example: "set self.lineEndMarker \"arrow\"";
    };
    readonly lineCap: {
        readonly description: "Line cap style: butt, round, square";
        readonly type: "string";
        readonly example: "set self.lineCap \"round\"";
    };
    readonly visible: {
        readonly description: "Visibility";
        readonly type: "boolean";
        readonly example: "set Box.visible false";
    };
    readonly opacity: {
        readonly description: "Opacity (0-1)";
        readonly type: "number";
        readonly example: "set Box.opacity 0.5";
    };
    readonly blendMode: {
        readonly description: "Blend mode (normal, multiply, screen, overlay, darken, lighten, color-dodge, color-burn)";
        readonly type: "string";
        readonly example: "set Shadow.blendMode \"multiply\"";
    };
    readonly strokeColor: {
        readonly description: "Border color";
        readonly type: "color";
        readonly example: "set Box.strokeColor \"#000\"";
    };
    readonly strokeWidth: {
        readonly description: "Border width";
        readonly type: "number";
        readonly example: "set Box.strokeWidth 2";
    };
    readonly content: {
        readonly description: "Text content";
        readonly type: "string";
        readonly example: "set Text1.content \"Hello\"";
    };
    readonly textColor: {
        readonly description: "Text color";
        readonly type: "color";
        readonly example: "set Text1.textColor \"#fff\"";
    };
    readonly fontSize: {
        readonly description: "Font size (textbox: fixed size, text: unused)";
        readonly type: "number";
        readonly example: "set TextBox1.fontSize 2";
    };
    readonly editable: {
        readonly description: "Allow typing at runtime (text only)";
        readonly type: "boolean";
        readonly example: "set Text1.editable true";
    };
    readonly lineHeight: {
        readonly description: "Line spacing multiplier (textbox only, default 1.3)";
        readonly type: "number";
        readonly example: "set TextBox1.lineHeight 1.5";
    };
    readonly verticalAlign: {
        readonly description: "Vertical text alignment (textbox only)";
        readonly type: "string";
        readonly example: "set TextBox1.verticalAlign \"center\"";
        readonly notes: "\"top\", \"center\", \"bottom\"";
    };
    readonly cornerRadius: {
        readonly description: "Corner radius";
        readonly type: "number";
        readonly example: "set Box.cornerRadius 10";
    };
    readonly shadowX: {
        readonly description: "Shadow X offset";
        readonly type: "number";
        readonly example: "set Box.shadowX 4";
    };
    readonly shadowY: {
        readonly description: "Shadow Y offset";
        readonly type: "number";
        readonly example: "set Box.shadowY 4";
    };
    readonly shadowBlur: {
        readonly description: "Shadow blur";
        readonly type: "number";
        readonly example: "set Box.shadowBlur 8";
    };
    readonly shadowColor: {
        readonly description: "Shadow color";
        readonly type: "color";
        readonly example: "set Box.shadowColor \"rgba(0,0,0,0.5)\"";
    };
    readonly glowBlur: {
        readonly description: "Glow spread radius";
        readonly type: "number";
        readonly example: "set Box.glowBlur 10";
    };
    readonly glowColor: {
        readonly description: "Glow color";
        readonly type: "color";
        readonly example: "set Box.glowColor \"#ff0000\"";
    };
    readonly glowIntensity: {
        readonly description: "Glow intensity (1-10, higher = more solid)";
        readonly type: "number";
        readonly example: "set Box.glowIntensity 5";
    };
    readonly trail: {
        readonly description: "Enable motion trail";
        readonly type: "boolean";
        readonly example: "set Player.trail true";
    };
    readonly trailLength: {
        readonly description: "Trail length in frames (default 20)";
        readonly type: "number";
        readonly example: "set Player.trailLength 30";
    };
    readonly trailOpacity: {
        readonly description: "Trail starting opacity (default 0.3)";
        readonly type: "number";
        readonly example: "set Player.trailOpacity 0.5";
    };
    readonly trailColor: {
        readonly description: "Trail color (default: object fill)";
        readonly type: "color";
        readonly example: "set Player.trailColor \"#00ffff\"";
    };
    readonly trailScale: {
        readonly description: "Trail point scale (default 0.8)";
        readonly type: "number";
        readonly example: "set Player.trailScale 0.6";
    };
    readonly trailSpacing: {
        readonly description: "Min distance between trail points (default 0)";
        readonly type: "number";
        readonly example: "set Player.trailSpacing 0.02";
    };
    readonly zIndex: {
        readonly description: "Layer order";
        readonly type: "number";
        readonly example: "set Box.zIndex 10";
    };
    readonly rotation: {
        readonly description: "Rotation angle (0-360)";
        readonly type: "number";
        readonly example: "set Box.rotation 45";
    };
    readonly flipX: {
        readonly description: "Horizontal flip";
        readonly type: "boolean";
        readonly example: "set Box.flipX true";
    };
    readonly flipY: {
        readonly description: "Vertical flip";
        readonly type: "boolean";
        readonly example: "set Box.flipY true";
    };
    readonly state: {
        readonly description: "Component state";
        readonly type: "string";
        readonly example: "set Button.state \"hover\"";
    };
    readonly rotatable: {
        readonly description: "Enable angular physics (tipping, torque)";
        readonly type: "boolean";
        readonly example: "set Box.rotatable true";
    };
    readonly cellX: {
        readonly description: "Grid column position";
        readonly type: "number";
        readonly example: "if Player.cellX == 3:";
        readonly readonly: true;
    };
    readonly cellY: {
        readonly description: "Grid row position";
        readonly type: "number";
        readonly example: "if Player.cellY == 2:";
        readonly readonly: true;
    };
    readonly moving: {
        readonly description: "Is object moving";
        readonly type: "boolean";
        readonly example: "if Player.moving:";
        readonly readonly: true;
    };
    readonly direction: {
        readonly description: "Movement direction";
        readonly type: "string";
        readonly example: "if Player.direction == \"down\":";
        readonly readonly: true;
        readonly notes: "\"up\", \"down\", \"left\", \"right\", \"none\"";
    };
    readonly velocityX: {
        readonly description: "Horizontal velocity";
        readonly type: "number";
        readonly example: "if Player.velocityX > 0:";
        readonly readonly: true;
    };
    readonly velocityY: {
        readonly description: "Vertical velocity";
        readonly type: "number";
        readonly example: "if Player.velocityY > 0:";
        readonly readonly: true;
    };
    readonly angularVelocity: {
        readonly description: "Rotation speed (deg/sec)";
        readonly type: "number";
        readonly example: "if Box.angularVelocity > 10:";
        readonly readonly: true;
        readonly notes: "Only available on rotatable objects";
    };
    readonly moveAngle: {
        readonly description: "Movement angle (degrees)";
        readonly type: "number";
        readonly example: "set self.rotation moveAngle";
        readonly readonly: true;
        readonly notes: "0=right, 90=down, 180=left, 270=up, -1=not moving";
    };
    readonly moveSpeed: {
        readonly description: "Movement speed magnitude";
        readonly type: "number";
        readonly example: "if Player.moveSpeed > 0.5:";
        readonly readonly: true;
    };
    readonly spriteFrame: {
        readonly description: "Current sprite sheet frame (0-based)";
        readonly type: "number";
        readonly example: "set self.spriteFrame 3";
        readonly notes: "Only affects objects with sprite sheet image fills (spriteColumns/spriteRows > 1)";
    };
    readonly tags: {
        readonly description: "Object tags (array of strings)";
        readonly type: "array";
        readonly example: "set self.tags [\"tile\", \"clickable\"]";
    };
    readonly perspectiveX: {
        readonly description: "Perspective vanishing point X (0-2)";
        readonly type: "number";
        readonly example: "set Box.perspectiveX 0.5";
    };
    readonly perspectiveY: {
        readonly description: "Perspective vanishing point Y (0-2)";
        readonly type: "number";
        readonly example: "set Box.perspectiveY 0.5";
    };
    readonly gravityScale: {
        readonly description: "Gravity multiplier (0=weightless, 1=normal, 2=heavy)";
        readonly type: "number";
        readonly example: "set self.gravityScale 0.5";
    };
    readonly windScale: {
        readonly description: "Wind multiplier (0=immune, 1=normal, 2=extra)";
        readonly type: "number";
        readonly example: "set self.windScale 2";
    };
    readonly dragScale: {
        readonly description: "Air resistance multiplier (0=no drag, 1=normal, 2=heavy drag)";
        readonly type: "number";
        readonly example: "set self.dragScale 0.5";
    };
    readonly timeScale: {
        readonly description: "Per-object time scale override (0=frozen, 0.5=half speed, 1=normal, 2=double). Overrides Cell.timeScale for this object";
        readonly type: "number";
        readonly example: "set self.timeScale 0";
    };
    readonly revealer: {
        readonly description: "Auto-reveal overlapping masks as object moves";
        readonly type: "boolean";
        readonly example: "set Player.revealer true";
    };
    readonly revealerRadius: {
        readonly description: "Reveal radius override (mask-relative units)";
        readonly type: "number";
        readonly example: "set Player.revealerRadius 0.08";
    };
    readonly revealerFade: {
        readonly description: "Reveal fade override (mask-relative units)";
        readonly type: "number";
        readonly example: "set Player.revealerFade 0.03";
    };
    readonly revealerNoise: {
        readonly description: "Reveal noise override (0=smooth, 1=max)";
        readonly type: "number";
        readonly example: "set Player.revealerNoise 0.4";
    };
    readonly revealerShape: {
        readonly description: "Reveal shape: circle or rect";
        readonly type: "string";
        readonly example: "set Player.revealerShape rect";
    };
    readonly revealerRehide: {
        readonly description: "Enable auto-rehide (fog returns when revealer moves away)";
        readonly type: "boolean";
        readonly example: "set Player.revealerRehide true";
    };
    readonly revealerRehideSpeed: {
        readonly description: "Rehide speed (0=instant, higher=slower)";
        readonly type: "number";
        readonly example: "set Player.revealerRehideSpeed 2";
    };
    readonly revealerRehideGrowth: {
        readonly description: "Rehide growth factor";
        readonly type: "number";
        readonly example: "set Player.revealerRehideGrowth 1";
    };
    readonly revealerRehideRate: {
        readonly description: "Rehide speed multiplier (1=normal, 2=twice as fast)";
        readonly type: "number";
        readonly example: "set Player.revealerRehideRate 2";
    };
    readonly revealerRehideStopThreshold: {
        readonly description: "Pause rehide when stopped briefly (seconds, 0=disabled)";
        readonly type: "number";
        readonly example: "set Player.revealerRehideStopThreshold 0.5";
    };
    readonly pegType: {
        readonly description: "Constraint type: pin or weld";
        readonly type: "string";
        readonly example: "set Peg1.pegType \"weld\"";
    };
    readonly pegDamping: {
        readonly description: "Swing friction (0 = swings forever, 1 = stops quickly)";
        readonly type: "number";
        readonly example: "set Peg1.pegDamping 0.5";
    };
    readonly pegBreakForce: {
        readonly description: "Force threshold to break the connection";
        readonly type: "number";
        readonly example: "set Peg1.pegBreakForce 100";
    };
    readonly springStiffness: {
        readonly description: "Spring stiffness (0 = rigid rod, higher = more elastic)";
        readonly type: "number";
        readonly example: "set Spring1.springStiffness 30";
    };
    readonly springDamping: {
        readonly description: "Spring energy dissipation";
        readonly type: "number";
        readonly example: "set Spring1.springDamping 2";
    };
    readonly springBreakForce: {
        readonly description: "Force threshold to break the spring";
        readonly type: "number";
        readonly example: "set Spring1.springBreakForce 100";
    };
    readonly startMarker: {
        readonly description: "Audio start position in seconds";
        readonly type: "number";
        readonly example: "set Music.startMarker 5";
    };
    readonly duration: {
        readonly description: "Audio playback duration in seconds from start marker (0 = play to end)";
        readonly type: "number";
        readonly example: "set Music.duration 10";
    };
    readonly buffered: {
        readonly description: "Independent playback per instance via AudioBuffer (default: true for SFX audioType)";
        readonly type: "boolean";
        readonly example: "set Gunshot.buffered true";
    };
    readonly spatial: {
        readonly description: "Distance-based volume attenuation from camera subject";
        readonly type: "boolean";
        readonly example: "set EngineSound.spatial true";
    };
    readonly spatialRange: {
        readonly description: "Distance (0-1 canvas units) at which spatial volume reaches 0 (default 1.0)";
        readonly type: "number";
        readonly example: "set EngineSound.spatialRange 0.5";
    };
    readonly emitterShape: {
        readonly description: "Emitter shape: circle (outward from center) or rectangle (inward from top edge)";
        readonly type: "string";
        readonly example: "set MyEmitter.emitterShape \"circle\"";
    };
    readonly emitterSizeMode: {
        readonly description: "Size mode: \"contain\" = particles die at shape boundary, \"area\" = spawn within shape";
        readonly type: "string";
        readonly example: "set MyEmitter.emitterSizeMode \"contain\"";
    };
    readonly emitterRate: {
        readonly description: "Particles emitted per second (default 10)";
        readonly type: "number";
        readonly example: "set MyEmitter.emitterRate 20";
    };
    readonly emitterBurst: {
        readonly description: "One-shot burst: set to N to emit N particles immediately (auto-resets to 0)";
        readonly type: "number";
        readonly example: "set MyEmitter.emitterBurst 30";
    };
    readonly particleLifetime: {
        readonly description: "Particle lifetime in ms (default 1000)";
        readonly type: "number";
        readonly example: "set MyEmitter.particleLifetime 2000";
    };
    readonly particleSpeedMin: {
        readonly description: "Min particle speed in canvas-units/sec (default 0.1)";
        readonly type: "number";
        readonly example: "set MyEmitter.particleSpeedMin 0.05";
    };
    readonly particleSpeedMax: {
        readonly description: "Max particle speed in canvas-units/sec (default 0.3)";
        readonly type: "number";
        readonly example: "set MyEmitter.particleSpeedMax 0.5";
    };
    readonly particleSpread: {
        readonly description: "Angle divergence in degrees from base direction (default 30)";
        readonly type: "number";
        readonly example: "set MyEmitter.particleSpread 45";
    };
    readonly particleShape: {
        readonly description: "Particle shape: circle, square, or line (default circle)";
        readonly type: "string";
        readonly example: "set MyEmitter.particleShape \"line\"";
    };
    readonly particleTrailLength: {
        readonly description: "Number of past positions for trail effect (0=off, default 0)";
        readonly type: "number";
        readonly example: "set MyEmitter.particleTrailLength 5";
    };
    readonly particleSizeStart: {
        readonly description: "Particle starting size in px (default 6)";
        readonly type: "number";
        readonly example: "set MyEmitter.particleSizeStart 10";
    };
    readonly particleSizeEnd: {
        readonly description: "Particle ending size in px (default 2)";
        readonly type: "number";
        readonly example: "set MyEmitter.particleSizeEnd 0";
    };
    readonly particleOpacityStart: {
        readonly description: "Particle starting opacity 0-1 (default 1)";
        readonly type: "number";
        readonly example: "set MyEmitter.particleOpacityStart 0.8";
    };
    readonly particleOpacityEnd: {
        readonly description: "Particle ending opacity 0-1 (default 0)";
        readonly type: "number";
        readonly example: "set MyEmitter.particleOpacityEnd 0";
    };
    readonly particleColorA: {
        readonly description: "Spawn color range start — each particle gets random color between A and B (default #ffffff)";
        readonly type: "color";
        readonly example: "set MyEmitter.particleColorA \"#ff4400\"";
    };
    readonly particleColorB: {
        readonly description: "Spawn color range end (default #ffffff)";
        readonly type: "color";
        readonly example: "set MyEmitter.particleColorB \"#ffaa00\"";
    };
    readonly particleColorEnd: {
        readonly description: "Optional color particles fade to over lifetime";
        readonly type: "color";
        readonly example: "set MyEmitter.particleColorEnd \"#000000\"";
    };
    readonly particleGravityX: {
        readonly description: "World-space gravity X in canvas-units/sec² (default 0)";
        readonly type: "number";
        readonly example: "set MyEmitter.particleGravityX 0.1";
    };
    readonly particleGravityY: {
        readonly description: "World-space gravity Y in canvas-units/sec² (default 0)";
        readonly type: "number";
        readonly example: "set MyEmitter.particleGravityY 0.2";
    };
    readonly particleDrag: {
        readonly description: "Velocity damping 0-1 per second (default 0)";
        readonly type: "number";
        readonly example: "set MyEmitter.particleDrag 0.5";
    };
    readonly emitterGlow: {
        readonly description: "Halo glow intensity 0-1 (default 0 = off)";
        readonly type: "number";
        readonly example: "set MyEmitter.emitterGlow 0.6";
    };
    readonly emitterGlowSize: {
        readonly description: "Halo size multiplier relative to emitter shape (default 1.5)";
        readonly type: "number";
        readonly example: "set MyEmitter.emitterGlowSize 2";
    };
    readonly emitterGlowFlicker: {
        readonly description: "Halo flicker amplitude 0-1 (default 0 = steady)";
        readonly type: "number";
        readonly example: "set MyEmitter.emitterGlowFlicker 0.3";
    };
};
export declare const CELL_SCRIPTABLE_PROPERTIES: {
    readonly backgroundColor: {
        readonly description: "Cell background color";
        readonly type: "color";
        readonly example: "set Cell.backgroundColor \"#ff0000\"";
    };
    readonly backgroundPattern: {
        readonly description: "Cell background pattern";
        readonly type: "string";
        readonly example: "set Cell.backgroundPattern \"grid\"";
    };
    readonly patternColor: {
        readonly description: "Pattern overlay color";
        readonly type: "color";
        readonly example: "set Cell.patternColor \"rgba(0,0,0,0.2)\"";
    };
    readonly patternScale: {
        readonly description: "Pattern scale (0.5-2)";
        readonly type: "number";
        readonly example: "set Cell.patternScale 1.5";
    };
    readonly gravity: {
        readonly description: "Vertical force for dynamics (0 = none)";
        readonly type: "number";
        readonly example: "set Cell.gravity 0.5";
        readonly notes: "Applies to movable objects";
    };
    readonly wind: {
        readonly description: "Wind magnitude (0 = none)";
        readonly type: "number";
        readonly example: "set Cell.wind 0.5";
        readonly notes: "Direction set by windAngle";
    };
    readonly windAngle: {
        readonly description: "Wind direction in degrees (0 = right, 90 = down, 180 = left, 270 = up)";
        readonly type: "number";
        readonly example: "set Cell.windAngle 90";
    };
    readonly airResistance: {
        readonly description: "Drag coefficient (0 = vacuum, 0.1 = air, 1 = water-like)";
        readonly type: "number";
        readonly example: "set Cell.airResistance 0.1";
        readonly notes: "Creates natural terminal velocity: v_terminal ≈ gravity / airResistance";
    };
    readonly timeScale: {
        readonly description: "Time scale for all objects (0=paused, 0.5=half speed, 1=normal, 2=double). Per-object timeScale overrides this";
        readonly type: "number";
        readonly example: "set Cell.timeScale 0";
    };
    readonly width: {
        readonly description: "Canvas width in world units (read-only)";
        readonly type: "number";
        readonly example: "Cell.width";
    };
    readonly height: {
        readonly description: "Canvas height in world units (read-only)";
        readonly type: "number";
        readonly example: "Cell.height";
    };
};
export declare const CAMERA_SCRIPTABLE_PROPERTIES: {
    readonly x: {
        readonly description: "Camera center X in world coordinates";
        readonly type: "number";
        readonly example: "set Camera.x 1.5";
    };
    readonly y: {
        readonly description: "Camera center Y in world coordinates";
        readonly type: "number";
        readonly example: "set Camera.y 0.5";
    };
    readonly zoom: {
        readonly description: "Camera zoom level (1 = default, 2 = 2x closer)";
        readonly type: "number";
        readonly example: "set Camera.zoom 2";
    };
    readonly aspectRatio: {
        readonly description: "Camera viewport aspect ratio (width/height). Set to Screen.aspectRatio to fill screen";
        readonly type: "number";
        readonly example: "set Camera.aspectRatio 1.78";
    };
    readonly viewportWidth: {
        readonly description: "Visible width in world units (read-only)";
        readonly type: "number";
        readonly example: "Camera.viewportWidth";
    };
    readonly viewportHeight: {
        readonly description: "Visible height in world units (read-only)";
        readonly type: "number";
        readonly example: "Camera.viewportHeight";
    };
    readonly subjectTransition: {
        readonly description: "Duration in ms for smooth pan when switching subjects (0 = snap)";
        readonly type: "number";
        readonly example: "set Camera.subjectTransition 500";
    };
};
export declare const SCREEN_SCRIPTABLE_PROPERTIES: {
    readonly aspectRatio: {
        readonly description: "Actual device/window aspect ratio (width/height)";
        readonly type: "number";
        readonly example: "Screen.aspectRatio";
    };
    readonly width: {
        readonly description: "Window width in pixels (read-only)";
        readonly type: "number";
        readonly example: "Screen.width";
    };
    readonly height: {
        readonly description: "Window height in pixels (read-only)";
        readonly type: "number";
        readonly example: "Screen.height";
    };
};
export type ScriptablePropertyType = keyof typeof SCRIPTABLE_PROPERTIES;
export declare function getAllScriptablePropertyNames(): ScriptablePropertyType[];
export interface FillLayerPropertyDef {
    name: string;
    layerType: string;
    property: string;
    type: 'number' | 'string' | 'boolean' | 'color';
    description: string;
    example: string;
}
export declare const FILL_LAYER_PROPERTIES: FillLayerPropertyDef[];
export declare function getAllFillLayerPropertyNames(): string[];
/**
 * Generate short syntax reference for the reference panel
 */
export declare function generateSyntaxReference(): string;
/**
 * Generate full user manual in markdown format
 */
export declare function generateUserManual(): string;
export declare const BUILTIN_ACTIONS: {
    name: string;
    description: "Navigate to cell" | "Cell transition animation" | "Make visible" | "Make hidden" | "Pause execution" | "Set variable or property" | "Reset game state" | "Reset click counter" | "Exit play mode" | "Restart from start cell" | "Save game to named slot" | "Load game from named slot" | "Delete a save slot" | "Exit action/handler early" | "Exit loop early" | "Clear grid cell data" | "Create pageable sequence" | "Next pageable item" | "Previous pageable item" | "Wrap pageable to first item" | "Broadcast message" | "Send message to target" | "Synthetic key press" | "Synthetic key release" | "Send data to URL" | "Get data from URL" | "Create runtime object from template" | "Remove object from scene" | "Copy to clipboard" | "Shake animation" | "Vibrate animation" | "Pulse animation" | "Squeeze animation" | "Bounce animation" | "Spin animation" | "Glow animation" | "Screen shake effect" | "Stop animation or audio" | "Play audio" | "Pause audio" | "Trigger jump impulse" | "Add velocity to object" | "Smooth position tween" | "Move to position or object (physical)" | "Debug log" | "Iterate over collection" | "Repeat block forever or N times" | "Find first matching tagged object" | "Define custom action" | "Enable movement" | "Disable movement" | "Enable jumping" | "Disable jumping" | "Enable drag" | "Disable drag" | "Enable keyboard input" | "Enable click-to-move input" | "Enable gamepad input" | "Enable script-only input" | "Disable keyboard input" | "Disable click-to-move input" | "Disable gamepad input" | "Disable script-only input" | "Enable camera follow" | "Disable camera follow" | "Follow a target object" | "Avoid a target object" | "Stop following/avoiding" | "Create a physics zone" | "Deactivate a physics zone" | "Enable collision blocking on an object" | "Disable collision blocking" | "Enable overlap detection on an object" | "Disable overlap detection" | "Enable phasing through blockers" | "Disable phasing (resume normal collisions)" | "Animate through a state group" | "Stop state group animation" | "Reveal area on mask" | "Rehide (restore fog) on a mask";
    example: "goto \"NextRoom\" clean with fade 500" | "onEnter:\n  transition fade 500\n\nonExit:\n  transition slide-up 300" | "show MyButton with fade 300" | "hide ErrorMessage with fade 200" | "wait 2000\nwait 2s\nwait movement\nwait movement self" | "set score 100\nset game.highScore 999\nset Button1.opacity 0.5\nset self.opacity 0 over 500\nset self.fillColor \"#ff0000\" over 1000 ease-in-out\nset self.x 0.8 over 300 ease-out\nset self.state RED\nset self.state RED over 500\nset self.state RED position over 300 ease-out cw\nset self.state BLUE none\nset self.state BLUE position rotate\nset self.state BLUE offset\nset self.state next" | "reset game" | "onClick:\n  show Step1\nonClick:\n  show Step2\nonClick:\n  hide Step2\n  reset script" | "onClick:\n  endGame" | "onClick:\n  restart" | "onClick:\n  save \"checkpoint\"" | "onClick:\n  if hasSave(\"checkpoint\"):\n    load \"checkpoint\"" | "onClick:\n  delete save \"checkpoint\"" | "action checkWin:\n  if not gameStarted:\n    return\n  // ... check win logic" | "foreach item in items:\n  if item.found:\n    set result item\n    break" | "// Clear entire grid\nclear Board\n\n// Clear specific cell\nclear Board.cell[2][3]" | "enable Slideshow pageable [Intro, Step1, Step2, Step3]\n// Or use children order:\nenable Slideshow pageable" | "next Slideshow with fade wrap" | "prev Slideshow with fade wrap" | "next Slideshow else:\n  wrap Slideshow\n  show LoopIndicator" | "shout \"KEY_PICKED_UP\"\nshout \"DAMAGE\" {amount: 50, source: \"enemy\"}\nshout \"SCORE_CHANGED\" {newScore: score}" | "shout to Player \"HEAL\" {amount: 25}\nshout to #enemies \"FREEZE\"\nshout to HealthBar \"UPDATE\" {value: health}" | "press \"q\"\npress \"Space\"\npress \"e\" on EnemyTank" | "release \"q\"\nrelease \"Space\"\nrelease \"e\" on EnemyTank" | "post \"https://api.example.com/scores\" {name: playerName, score: finalScore}" | "fetch \"https://api.example.com/scores\" into highscores" | "spawn \"PieceTemplate\" {col: 3, row: 5, color: \"red\"}\nspawn \"Bullet\" at MuzzlePoint\nspawn \"Bullet\" at MuzzlePoint {vx: 1, vy: 0}" | "destroy piece\ndestroy self\ndestroy Enemy with fade 300\ndestroy self with scale 200" | "onClick:\n  copy seed\n\nonClick:\n  copy Result.content" | "shake Button 200\nshake self 500 loop\nshake #enemies 300" | "vibrate Phone 500\nvibrate self loop\nvibrate #alerts 200 loop" | "pulse Heart 1000\npulse self 2000 loop\npulse #collectibles 500" | "squeeze Slime 400\nsqueeze self 800 loop\nsqueeze #bouncy 300" | "bounce Ball 600\nbounce self 1000 loop\nbounce #items 400" | "spin Gear 1000\nspin self 2000 loop\nspin #wheels 500 loop cw\nspin MyComponent 1000 loop children" | "glow Button 1000\nglow self 2000 loop\nglow self 1500 loop \"#ff0000\"" | "screenshake 300\nscreenshake 500 loop\nscreenshake 200 5\nscreenshake 2000 1-5\nstop screenshake" | "stop Gear\nstop #wheels\nstop Music" | "play Music\nplay SoundEffect loop" | "pause Music" | "jump self\njump Player\njump Player height 0.8" | "impulse self 0.3 -0.5\nimpulse Ball random(-0.2, 0.2) -0.5\nimpulse #enemies 0.1 0" | "transport self to 0.5 0.5 over 1000\ntransport Player to 0.2 0.8 over 500 ease-in-out\ntransport #enemies to Player.x Player.y over 300" | "moveTo self 0.5 0.5\nmoveTo Player 0.2 0.8\nmoveTo #enemies Player.x Player.y\nmoveTo self Checkpoint\nmoveTo #enemies Flag" | "log \"Player position: \" Player.x \", \" Player.y\nlog \"Score: \" score" | "foreach item in emptyCells(\"Board\"):\n  log item.x \", \" item.y\n\nforeach enemy in #enemies:\n  set enemy.opacity 0.5" | "repeat:\n  spawn \"Particle\" {x: random, y: 0}\n  wait 100ms\n\nrepeat 3:\n  show Hint\n  wait 1s\n  hide Hint" | "first #tiles where visible == true:\n  set found item\n  hide item\n\nfirst #enemies where health <= 0:\n  destroy item" | "// Define on any object:\naction dropPiece:\n  set Board.cell[col][row].owner currentPlayer\n  spawn \"Piece\" {col: col, row: row}\n\n// Call from any script in the cell:\ndo dropPiece\ndo checkWin" | "enable Player movable speed 0.3\nenable Paddle movable speed 0.5 axis x\nenable Ball movable speed 0.3 path Track\nenable Ship movable speed 0.3 facing\nenable Tank movable speed 0.3 axis forward\nenable siblings movable speed 0.5\ndisable Player movable" | "disable Player movable" | "enable Player jumpable height 0.8\nenable Player jumpable height 0.6 multijump 2\ndisable Player jumpable" | "disable Player jumpable" | "enable Piece draggable\nenable Piece draggable discrete occupy collision" | "disable Piece draggable" | "enable Player keyboard" | "enable Player click" | "enable Player gamepad" | "enable Tank script" | "disable Player keyboard" | "disable Player click" | "disable Player gamepad" | "disable Tank script" | "enable Player subject" | "disable Player subject" | "enable Dog follow \"Player\"\nenable Dog follow \"Player\" distance 0.15\nenable Guard follow \"Player\" distance 0.2\nenable Tank follow \"Player\" arrival 0.15\nenable Tank follow \"Player\" delay 2000\nenable #enemies follow \"Player\"\ndisable Dog follow" | "enable Enemy avoid \"Player\" distance 0.3\nenable Enemy avoid \"Player\" distance 0.5 arrival 0.1\ndisable Enemy follow" | "disable Dog follow" | "enable WaterRegion zone gravity 0.3 airResistance 0.8\nenable WindTunnel zone wind 5 windAngle 0\nenable IcePatch zone friction 0\nenable Conveyor zone flowX 0.3\nenable SpacePocket zone gravity 0 airResistance 0\nenable WaterRegion zone gravity 0.3 affects #swimmer\nenable WindTunnel zone wind 5 affects #light #paper" | "disable WaterRegion zone" | "enable Wall blocking\nenable Wall blocking affects #tank #player\nenable #walls blocking affects #tank" | "disable Wall blocking" | "enable Goal sensor\nenable Goal sensor affects #ball\nenable #detectors sensor affects #player" | "disable Goal sensor" | "enable Bullet phase\nenable Bullet phase affects #boundary\nenable self phase affects #wall #fence" | "disable Bullet phase" | "animate self \"walk\"\nanimate self \"walk\" fps 12\nanimate self \"walk\" once\nanimate self \"walk\" pingpong\nanimate self \"hover\" duration 500\nanimate self \"hover\" duration 300 ease-in-out\nanimate self \"spin\" loop cw\nanimate self \"walk\" loop resume\nanimate self \"run\" loop exclusive\nanimate self \"walk\" reverse\nanimate Button \"hover\" duration 200 loop" | "stop animate self\nstop animate Button\nstop animate #enemies" | "reveal Mask1 0.2 0.2\nreveal Mask1 0.5 0.5 0.1\nreveal Mask1 self.x self.y 0.05 0.02" | "rehide Mask1\nrehide Mask1 Player";
    args: [] | [{
        readonly name: "cell";
        readonly type: "string";
        readonly description: "Cell name, or direction: north, east, south, west";
    }, {
        readonly name: "resetLevel";
        readonly type: "string";
        readonly description: "Reset level: \"clean\" (reset objects, keep vars) or \"fresh\" (reset everything)";
        readonly optional: true;
    }, {
        readonly name: "transition";
        readonly type: "transition";
        readonly description: "Animation type";
        readonly optional: true;
    }, {
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Duration in ms (default 300)";
        readonly optional: true;
    }] | [{
        readonly name: "type";
        readonly type: "transition";
        readonly description: "Animation type: fade, slide-up, slide-down, slide-left, slide-right, zoom";
    }, {
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Duration in ms (default 300)";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name or #tag";
    }, {
        readonly name: "transition";
        readonly type: "transition";
        readonly description: "Animation type";
        readonly optional: true;
    }, {
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Duration in ms (default 300)";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name or #tag";
    }, {
        readonly name: "transition";
        readonly type: "transition";
        readonly description: "Animation type";
        readonly optional: true;
    }, {
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Duration in ms (default 300)";
        readonly optional: true;
    }] | [{
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Time in milliseconds (or use \"2s\" for seconds), or \"movement\" to wait for dynamics";
    }, {
        readonly name: "target";
        readonly type: "string";
        readonly description: "Optional object name after \"movement\" — waits only for that object (e.g., \"self\")";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Variable name or Object.property";
    }, {
        readonly name: "value";
        readonly type: "any";
        readonly description: "Value to set (number, string, boolean, or expression)";
    }, {
        readonly name: "modifiers";
        readonly type: "string";
        readonly description: "For state only: none/position/rotate/scale/offset (spatial filter). Combinable. Optional.";
    }, {
        readonly name: "over";
        readonly type: "number";
        readonly description: "Tween duration in ms for smooth transition. Optional.";
        readonly optional: true;
    }, {
        readonly name: "easing";
        readonly type: "string";
        readonly description: "Easing function: linear, ease-in, ease-out, ease-in-out, ease-in-cubic, ease-out-cubic, ease-in-out-cubic. Optional.";
        readonly optional: true;
    }, {
        readonly name: "cw|ccw";
        readonly type: "keyword";
        readonly description: "For state tweens: force rotation direction. Optional.";
        readonly optional: true;
    }] | [{
        readonly name: "scope";
        readonly type: "string";
        readonly description: "What to reset: \"session\", \"game\", \"all\", \"objects\", \"fresh\", or cell name";
    }] | [{
        readonly name: "slotName";
        readonly type: "string";
        readonly description: "Name of the save slot";
    }] | [{
        readonly name: "slotName";
        readonly type: "string";
        readonly description: "Name of the save slot to load";
    }] | [{
        readonly name: "slotName";
        readonly type: "string";
        readonly description: "Name of the save slot to delete";
    }] | [{
        readonly name: "grid";
        readonly type: "string";
        readonly description: "Grid name";
    }, {
        readonly name: "cell[x][y]";
        readonly type: "cell coords";
        readonly description: "Optional: specific cell to clear";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Component name, self, siblings, children, #tag";
    }, {
        readonly name: "items";
        readonly type: "string[]";
        readonly description: "List of object names to cycle through (optional - omit brackets to use component children)";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Pageable name";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Pageable name";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Pageable name to wrap";
    }] | [{
        readonly name: "message";
        readonly type: "string";
        readonly description: "Message to broadcast";
    }, {
        readonly name: "params";
        readonly type: "object";
        readonly description: "Parameters to pass {key: value}";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name or #tag";
    }, {
        readonly name: "message";
        readonly type: "string";
        readonly description: "Message to send";
    }, {
        readonly name: "params";
        readonly type: "object";
        readonly description: "Parameters to pass {key: value}";
        readonly optional: true;
    }] | [{
        readonly name: "key";
        readonly type: "string";
        readonly description: "Key name (e.g. \"q\", \"Space\", \"ArrowUp\")";
    }, {
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object to inject into (default: self)";
        readonly optional: true;
    }] | [{
        readonly name: "key";
        readonly type: "string";
        readonly description: "Key name matching a previous press";
    }, {
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object to target (default: self)";
        readonly optional: true;
    }] | [{
        readonly name: "url";
        readonly type: "string";
        readonly description: "URL to send data to";
    }, {
        readonly name: "data";
        readonly type: "object";
        readonly description: "Data to send as JSON {key: value}";
    }] | [{
        readonly name: "url";
        readonly type: "string";
        readonly description: "URL to fetch data from";
    }, {
        readonly name: "variable";
        readonly type: "string";
        readonly description: "Variable name to store result";
    }] | [{
        readonly name: "template";
        readonly type: "string";
        readonly description: "Name of the template object to clone";
    }, {
        readonly name: "at";
        readonly type: "string";
        readonly description: "Anchor name — spawns at anchor position/rotation. If anchor is inside a component, spawned object becomes a child of that component";
        readonly optional: true;
    }, {
        readonly name: "params";
        readonly type: "object";
        readonly description: "Parameters passed to onSpawn handler {key: value}";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "object";
        readonly description: "The object to destroy (name, variable, self, other, #tag)";
    }, {
        readonly name: "transition";
        readonly type: "transition";
        readonly description: "Animation type";
        readonly optional: true;
    }, {
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Duration in ms (default 300)";
        readonly optional: true;
    }] | [{
        readonly name: "value";
        readonly type: "any";
        readonly description: "Value to copy (variable, property, or expression)";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, #tag, or all type";
    }, {
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Cycle duration in ms (default 300)";
        readonly optional: true;
    }, {
        readonly name: "loop";
        readonly type: "keyword";
        readonly description: "Repeat the cycle indefinitely";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, #tag, or all type";
    }, {
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Cycle duration in ms (default 300)";
        readonly optional: true;
    }, {
        readonly name: "loop";
        readonly type: "keyword";
        readonly description: "Repeat the cycle indefinitely";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, #tag, or all type";
    }, {
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Cycle duration in ms (default 300)";
        readonly optional: true;
    }, {
        readonly name: "loop";
        readonly type: "keyword";
        readonly description: "Repeat the cycle indefinitely";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, #tag, or all type";
    }, {
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Cycle duration in ms (default 300)";
        readonly optional: true;
    }, {
        readonly name: "loop";
        readonly type: "keyword";
        readonly description: "Repeat the cycle indefinitely";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, #tag, or all type";
    }, {
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Cycle duration in ms (default 300)";
        readonly optional: true;
    }, {
        readonly name: "loop";
        readonly type: "keyword";
        readonly description: "Repeat the cycle indefinitely";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, #tag, or all type";
    }, {
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Cycle duration in ms (default 300)";
        readonly optional: true;
    }, {
        readonly name: "loop";
        readonly type: "keyword";
        readonly description: "Repeat the cycle indefinitely";
        readonly optional: true;
    }, {
        readonly name: "children";
        readonly type: "keyword";
        readonly description: "Apply per-child on components (each child animates individually)";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, #tag, or all type";
    }, {
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Cycle duration in ms (default 300)";
        readonly optional: true;
    }, {
        readonly name: "loop";
        readonly type: "keyword";
        readonly description: "Repeat the cycle indefinitely";
        readonly optional: true;
    }, {
        readonly name: "color";
        readonly type: "string";
        readonly description: "Glow color (default: object glowColor or white)";
        readonly optional: true;
    }] | [{
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Duration in ms (default 300)";
    }, {
        readonly name: "intensity";
        readonly type: "number";
        readonly description: "Shake intensity or range A-B (default 3)";
        readonly optional: true;
    }, {
        readonly name: "loop";
        readonly type: "keyword";
        readonly description: "Repeat indefinitely";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, #tag, or all type";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Audio object name";
    }, {
        readonly name: "loop";
        readonly type: "keyword";
        readonly description: "Loop playback continuously";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Audio object name";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, other, #tag";
    }, {
        readonly name: "height";
        readonly type: "number";
        readonly description: "Optional jump height override";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, other, #tag";
    }, {
        readonly name: "vx";
        readonly type: "number";
        readonly description: "Velocity X to add (rightward positive)";
    }, {
        readonly name: "vy";
        readonly type: "number";
        readonly description: "Velocity Y to add (downward positive)";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, other, #tag";
    }, {
        readonly name: "x";
        readonly type: "expression";
        readonly description: "Target X position (0-1)";
    }, {
        readonly name: "y";
        readonly type: "expression";
        readonly description: "Target Y position (0-1)";
    }, {
        readonly name: "duration";
        readonly type: "expression";
        readonly description: "Duration in milliseconds";
    }, {
        readonly name: "easing";
        readonly type: "string";
        readonly description: "Optional: ease-in, ease-out, ease-in-out, ease-in-cubic, ease-out-cubic, ease-in-out-cubic";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, other, #tag";
    }, {
        readonly name: "x or destination";
        readonly type: "expression";
        readonly description: "Target X (0-1), or object name to move toward";
    }, {
        readonly name: "y";
        readonly type: "expression";
        readonly description: "Target Y (0-1) — omit when using object name";
        readonly optional: true;
    }] | [{
        readonly name: "values";
        readonly type: "any...";
        readonly description: "Values to log (concatenated)";
    }] | [{
        readonly name: "variable";
        readonly type: "string";
        readonly description: "Loop variable name";
    }, {
        readonly name: "collection";
        readonly type: "array|#tag";
        readonly description: "Array, function result, or #tag selector";
    }] | [{
        readonly name: "count";
        readonly type: "number";
        readonly description: "Optional iteration limit (omit for infinite)";
    }] | [{
        readonly name: "tag";
        readonly type: "#tag";
        readonly description: "Tag selector to search";
    }, {
        readonly name: "property";
        readonly type: "string";
        readonly description: "Property to check (dot optional)";
    }, {
        readonly name: "operator";
        readonly type: "string";
        readonly description: "Comparison operator";
    }, {
        readonly name: "value";
        readonly type: "any";
        readonly description: "Value to compare against";
    }] | [{
        readonly name: "name";
        readonly type: "string";
        readonly description: "Action name (no spaces)";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }, {
        readonly name: "config";
        readonly type: "keywords";
        readonly description: "speed N (0.1–2, default 0.3), acceleration N (0.1–20, default 10), deceleration N (0–1, default 0.15), style teleport|slide|fade|jump, axis x|y|forward, steer N (turn rate multiplier, default 1), path ObjectName, facing";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }, {
        readonly name: "config";
        readonly type: "keywords";
        readonly description: "height N (0.1–2, default 0.5), multijump N (1–5, default 1), key \"Key\"";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }, {
        readonly name: "config";
        readonly type: "keywords";
        readonly description: "once, collision, discrete, occupy";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag (who follows)";
    }, {
        readonly name: "object";
        readonly type: "string";
        readonly description: "Target object name to follow (required)";
    }, {
        readonly name: "distance";
        readonly type: "number";
        readonly description: "Preferred distance to maintain (0–1, default: 0 = reach target). Object stops when within distance.";
    }, {
        readonly name: "deadZone";
        readonly type: "number";
        readonly description: "Stop within this distance of target (0–1, default: 0.03). Prevents fidgeting at the target distance.";
    }, {
        readonly name: "arrival";
        readonly type: "number";
        readonly description: "Begin decelerating within this distance of target (0–1, default: 0.12). Auto-scales to at least the follow distance.";
    }, {
        readonly name: "delay";
        readonly type: "number";
        readonly description: "Milliseconds to wait before follow activates (default: 0). Gives target time to build a path.";
    }, {
        readonly name: "pathfinding";
        readonly type: "flag";
        readonly description: "Reserved for future obstacle avoidance";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag (who avoids)";
    }, {
        readonly name: "object";
        readonly type: "string";
        readonly description: "Target object name to avoid (required)";
    }, {
        readonly name: "distance";
        readonly type: "number";
        readonly description: "Awareness radius — flee only when closer than this (0.1–1, default: 0 = always flee). Always specify this for avoid.";
    }, {
        readonly name: "deadZone";
        readonly type: "number";
        readonly description: "Stop within this distance of safe zone (0–1, default: 0.015).";
    }, {
        readonly name: "arrival";
        readonly type: "number";
        readonly description: "Begin decelerating within this distance of safe zone (0–1, default: 0.08).";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }, {
        readonly name: "gravity";
        readonly type: "number";
        readonly description: "Override cell gravity (0–10, 0 = weightless, default 1)";
        readonly optional: true;
    }, {
        readonly name: "wind";
        readonly type: "number";
        readonly description: "Override cell wind magnitude (0–10)";
        readonly optional: true;
    }, {
        readonly name: "windAngle";
        readonly type: "number";
        readonly description: "Override cell wind direction in degrees (0=right, 90=down, 0–360)";
        readonly optional: true;
    }, {
        readonly name: "airResistance";
        readonly type: "number";
        readonly description: "Override cell drag coefficient (0–1, 0=vacuum, 1=thick)";
        readonly optional: true;
    }, {
        readonly name: "friction";
        readonly type: "number";
        readonly description: "Override contact friction (0–1, 0=ice, 1=sticky)";
        readonly optional: true;
    }, {
        readonly name: "flowX";
        readonly type: "number";
        readonly description: "Constant horizontal drift in units/sec (-2 to 2, mass-independent)";
        readonly optional: true;
    }, {
        readonly name: "flowY";
        readonly type: "number";
        readonly description: "Constant vertical drift in units/sec (-2 to 2, mass-independent)";
        readonly optional: true;
    }, {
        readonly name: "affects";
        readonly type: "string";
        readonly description: "One or more #tags — zone only affects objects with a matching tag (omit for all objects)";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }, {
        readonly name: "affects";
        readonly type: "string";
        readonly description: "One or more #tags — only blocks movers with a matching tag (omit to block all)";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }, {
        readonly name: "affects";
        readonly type: "string";
        readonly description: "One or more #tags — only detects objects with a matching tag (omit to detect all)";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }, {
        readonly name: "affects";
        readonly type: "string";
        readonly description: "One or more #tags — only phases through blockers with a matching tag (omit to phase through all)";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, siblings, children, parent, #tag";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, #tag, or all type";
    }, {
        readonly name: "group";
        readonly type: "string";
        readonly description: "State group name (in quotes)";
    }, {
        readonly name: "fps";
        readonly type: "number";
        readonly description: "Frames per second — frame mode (overrides group default)";
        readonly optional: true;
    }, {
        readonly name: "duration";
        readonly type: "number";
        readonly description: "Milliseconds per transition step — tween mode (overrides group default)";
        readonly optional: true;
    }, {
        readonly name: "easing";
        readonly type: "string";
        readonly description: "Easing function: linear, ease-in, ease-out, ease-in-out, ease-in-cubic, ease-out-cubic, ease-in-out-cubic";
        readonly optional: true;
    }, {
        readonly name: "loop|once|pingpong";
        readonly type: "keyword";
        readonly description: "Play mode (default: loop)";
        readonly optional: true;
    }, {
        readonly name: "cw|ccw";
        readonly type: "keyword";
        readonly description: "Force rotation direction: cw (clockwise) or ccw (counter-clockwise). Default: shortest path.";
        readonly optional: true;
    }, {
        readonly name: "resume";
        readonly type: "keyword";
        readonly description: "Tween from current visual state to first frame instead of snapping. Smooth transition into the animation.";
        readonly optional: true;
    }, {
        readonly name: "exclusive";
        readonly type: "keyword";
        readonly description: "Stop all other group animations on this object before starting. Use for directional sprites where only one animation should play at a time.";
        readonly optional: true;
    }, {
        readonly name: "reverse";
        readonly type: "keyword";
        readonly description: "Reverse the state order at play time. A group with states A→B→C plays as C→B→A.";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Object name, self, #tag, or all type";
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Mask object name";
    }, {
        readonly name: "x";
        readonly type: "expression";
        readonly description: "X position relative to mask (0 = left edge)";
    }, {
        readonly name: "y";
        readonly type: "expression";
        readonly description: "Y position relative to mask (0 = top edge)";
    }, {
        readonly name: "radius";
        readonly type: "expression";
        readonly description: "Reveal radius in mask-relative units (optional, uses mask default)";
        readonly optional: true;
    }, {
        readonly name: "fade";
        readonly type: "expression";
        readonly description: "Edge fade width in mask-relative units (optional, uses mask default)";
        readonly optional: true;
    }] | [{
        readonly name: "target";
        readonly type: "string";
        readonly description: "Mask object name";
    }, {
        readonly name: "revealer";
        readonly type: "string";
        readonly description: "Revealer object name (optional, resets all if omitted)";
        readonly optional: true;
    }];
}[];
export declare const BUILTIN_FUNCTIONS: {
    name: string;
    description: "Cell has been visited" | "Check if save slot exists" | "Visit count" | "Cell has object" | "Get variable value" | "Random number" | "Round down" | "Round up" | "Round to nearest" | "Absolute value" | "Minimum value" | "Maximum value" | "Sine (degrees)" | "Cosine (degrees)" | "Angle from coordinates" | "Angle to cardinal direction" | "Array/string length" | "Generate number sequence" | "Randomize array" | "Random element" | "Check grid cell empty" | "Get empty grid cells" | "Find grid cells by data" | "Find connected grid cells" | "AI best move (minimax)" | "Hash values to integer" | "Distance between objects" | "Objects within radius" | "Closest matching object" | "Collision shape overlap" | "Line of sight on grid" | "A* pathfinding on grid" | "Generate maze on grid";
    example: "if visited(\"SecretRoom\"):" | "if hasSave(\"checkpoint\"):" | "if visits(\"this\") > 1:" | "if hasObject(\"Key\"):" | "if get(\"score\") > 100:" | "set roll random(1, 6)" | "set whole floor(3.7)  // 3" | "set whole ceil(3.2)  // 4" | "set whole round(3.5)  // 4" | "set dist abs(x - targetX)" | "set lowest min(a, b, c)" | "set highest max(a, b, c)" | "set vx cos(self.rotation) * speed\nset vy sin(self.rotation) * speed" | "set vx cos(self.rotation) * speed" | "set angle atan2(target.y - self.y, target.x - self.x)" | "set self.state cardinal(moveAngle)" | "if length(items) > 0:" | "foreach i in range(0, 5):" | "set deck shuffle(cards)" | "set winner pick(players)" | "if isEmpty(\"Grid1\", 2, 3):" | "set available emptyCells(\"Grid1\")" | "// Find cells marked as \"red\"\nset redCells cellsWhere(\"Board\", \"color\", \"==\", \"red\")\n\n// Find cells owned by player 1\nset p1Cells cellsWhere(\"Board\", \"owner\", \"==\", 1)" | "// Find all cells connected through occupied cells (8-way default)\nset connected floodfill(\"GRID\", 4, 4, \"occupied\", true)\n\n// 4-way connectivity (cardinal directions only)\nset connected floodfill(\"GRID\", 4, 4, \"occupied\", true, 4)\n\n// Match-3: find connected same-color cells\nset cluster floodfill(\"Board\", clickX, clickY, \"color\", \"red\")\nif length(cluster) >= 3:\n  // Clear the cluster" | "// Connect4 AI move\nset bestCol minimax(\"Board\", \"owner\", \"YELLOW\", \"RED\", 4)\nset col bestCol\nStart.dropPiece\n\n// Tic-tac-toe (3x3, win=3)\nset bestCol minimax(\"Grid\", \"mark\", \"O\", \"X\", 6, 0, 3)" | "// Hash ball positions\nset seed hash(#balls.x, #balls.y)\n\n// Hash single values\nset id hash(x, y, z)\n\n// Hash any properties\nset seed hash(#pieces.cellX, #pieces.cellY)" | "if distance(self, Enemy) < 0.2:\n  impulse self 0 -0.5" | "set enemies nearby(self, 0.2, #enemy)\nif length(enemies) > 0:\n  set closest enemies[0]" | "set target nearest(self, #coin)\nif target != 0:\n  set dx target.x - self.x\n\n// Check spawn position is clear\nset sx random\nset sy random\nif nearest(sx, sy, #enemy).distance > 0.1:\n  spawn \"Enemy\" {x: sx, y: sy}\n\n// 2nd nearest enemy\nset second nearest(self, #enemy, 2)" | "if intersects(Sword, Enemy):\n  destroy Enemy\nif intersects(self, #coin):\n  set score score + 1" | "if canSee(\"Grid\", self.cellX, self.cellY, Player.cellX, Player.cellY, \"wall\"):\n  shout \"SPOTTED\"" | "set path pathfind(\"Grid\", self.cellX, self.cellY, Goal.cellX, Goal.cellY, \"wall\")\nif length(path) > 0:\n  set nextStep path[0]" | "generateMaze(\"Grid\", \"wall\")\n// Grid.cell[x][y].wall is now true for walls, false for passages";
    args: [{
        readonly name: "cell";
        readonly type: "string";
        readonly description: "Cell name or \"this\"";
    }] | [{
        readonly name: "slotName";
        readonly type: "string";
        readonly description: "Name of the save slot to check";
    }] | [{
        readonly name: "cell";
        readonly type: "string";
        readonly description: "Cell name or \"this\"";
    }] | [{
        readonly name: "name";
        readonly type: "string";
        readonly description: "Object name to check for";
    }] | [{
        readonly name: "key";
        readonly type: "string";
        readonly description: "Variable name";
    }] | [{
        readonly name: "min";
        readonly type: "number";
        readonly description: "Minimum value (inclusive)";
        readonly optional: true;
    }, {
        readonly name: "max";
        readonly type: "number";
        readonly description: "Maximum value (inclusive)";
        readonly optional: true;
    }] | [{
        readonly name: "value";
        readonly type: "number";
        readonly description: "Number to round down";
    }] | [{
        readonly name: "value";
        readonly type: "number";
        readonly description: "Number to round up";
    }] | [{
        readonly name: "value";
        readonly type: "number";
        readonly description: "Number to round";
    }] | [{
        readonly name: "value";
        readonly type: "number";
        readonly description: "Number to get absolute value of";
    }] | [{
        readonly name: "values";
        readonly type: "number...";
        readonly description: "Numbers to compare";
    }] | [{
        readonly name: "values";
        readonly type: "number...";
        readonly description: "Numbers to compare";
    }] | [{
        readonly name: "degrees";
        readonly type: "number";
        readonly description: "Angle in degrees";
    }] | [{
        readonly name: "degrees";
        readonly type: "number";
        readonly description: "Angle in degrees";
    }] | [{
        readonly name: "y";
        readonly type: "number";
        readonly description: "Y component";
    }, {
        readonly name: "x";
        readonly type: "number";
        readonly description: "X component";
    }] | [{
        readonly name: "angle";
        readonly type: "number";
        readonly description: "Angle in degrees (0=right, 90=down, 180=left, 270=up)";
    }] | [{
        readonly name: "value";
        readonly type: "array|string";
        readonly description: "Array or string to measure";
    }] | [{
        readonly name: "min_or_count";
        readonly type: "number";
        readonly description: "Count (1 arg) or start value (2 args)";
    }, {
        readonly name: "max";
        readonly type: "number";
        readonly description: "End value (inclusive)";
        readonly optional: true;
    }] | [{
        readonly name: "array";
        readonly type: "array";
        readonly description: "Array to shuffle";
    }] | [{
        readonly name: "array";
        readonly type: "array";
        readonly description: "Array to pick from";
    }] | [{
        readonly name: "grid";
        readonly type: "string";
        readonly description: "Grid name";
    }, {
        readonly name: "x";
        readonly type: "number";
        readonly description: "Column (0-indexed)";
    }, {
        readonly name: "y";
        readonly type: "number";
        readonly description: "Row (0-indexed)";
    }] | [{
        readonly name: "grid";
        readonly type: "string";
        readonly description: "Grid name";
    }] | [{
        readonly name: "grid";
        readonly type: "string";
        readonly description: "Grid name";
    }, {
        readonly name: "property";
        readonly type: "string";
        readonly description: "Cell data property to check";
    }, {
        readonly name: "operator";
        readonly type: "string";
        readonly description: "Comparison: ==, !=, >, <, >=, <=";
    }, {
        readonly name: "value";
        readonly type: "any";
        readonly description: "Value to compare against";
    }] | [{
        readonly name: "grid";
        readonly type: "string";
        readonly description: "Grid name";
    }, {
        readonly name: "startX";
        readonly type: "number";
        readonly description: "Starting column (0-indexed)";
    }, {
        readonly name: "startY";
        readonly type: "number";
        readonly description: "Starting row (0-indexed)";
    }, {
        readonly name: "property";
        readonly type: "string";
        readonly description: "Cell data property to match (default: \"occupied\")";
        readonly optional: true;
    }, {
        readonly name: "value";
        readonly type: "any";
        readonly description: "Value to match (default: true)";
        readonly optional: true;
    }, {
        readonly name: "connectivity";
        readonly type: "number";
        readonly description: "4 (cardinal) or 8 (cardinal + diagonal, default)";
        readonly optional: true;
    }] | [{
        readonly name: "grid";
        readonly type: "string";
        readonly description: "Grid name";
    }, {
        readonly name: "property";
        readonly type: "string";
        readonly description: "Cell data property for ownership";
    }, {
        readonly name: "aiPlayer";
        readonly type: "any";
        readonly description: "AI player value (e.g., \"YELLOW\")";
    }, {
        readonly name: "humanPlayer";
        readonly type: "any";
        readonly description: "Human player value (e.g., \"RED\")";
    }, {
        readonly name: "depth";
        readonly type: "number";
        readonly description: "Search depth (4-6 recommended)";
    }, {
        readonly name: "emptyValue";
        readonly type: "any";
        readonly description: "Empty cell value (default: 0)";
        readonly optional: true;
    }, {
        readonly name: "winLength";
        readonly type: "number";
        readonly description: "Pieces to win (default: 4)";
        readonly optional: true;
    }] | [{
        readonly name: "values";
        readonly type: "any...";
        readonly description: "Values to hash: numbers, strings, arrays (from #tag.property)";
    }] | [{
        readonly name: "objectA";
        readonly type: "object";
        readonly description: "First object (self, other, or name)";
    }, {
        readonly name: "objectB";
        readonly type: "object";
        readonly description: "Second object (self, other, or name)";
    }] | [{
        readonly name: "object";
        readonly type: "object";
        readonly description: "Center object (self, other, or name)";
    }, {
        readonly name: "radius";
        readonly type: "number";
        readonly description: "Search radius (normalized coords)";
    }, {
        readonly name: "tag";
        readonly type: "tag";
        readonly description: "Optional tag filter (#tag)";
        readonly optional: true;
    }] | [{
        readonly name: "ref";
        readonly type: "object|number";
        readonly description: "Reference object (self, other, name) or X coordinate";
    }, {
        readonly name: "y/selector";
        readonly type: "number|string";
        readonly description: "Y coordinate (if ref is X) or selector (#tag, name, \"sibling\")";
    }, {
        readonly name: "selector/rank";
        readonly type: "string|number";
        readonly description: "Selector (if using x/y) or rank (default 1)";
        readonly optional: true;
    }, {
        readonly name: "rank";
        readonly type: "number";
        readonly description: "Nth nearest (default 1, only when using x/y)";
        readonly optional: true;
    }] | [{
        readonly name: "objectA";
        readonly type: "object";
        readonly description: "First object (self, other, or name)";
    }, {
        readonly name: "objectB";
        readonly type: "object|tag";
        readonly description: "Second object or #tag (returns true if any tagged object intersects)";
    }] | [{
        readonly name: "grid";
        readonly type: "string";
        readonly description: "Grid name";
    }, {
        readonly name: "x1";
        readonly type: "number";
        readonly description: "Start column";
    }, {
        readonly name: "y1";
        readonly type: "number";
        readonly description: "Start row";
    }, {
        readonly name: "x2";
        readonly type: "number";
        readonly description: "End column";
    }, {
        readonly name: "y2";
        readonly type: "number";
        readonly description: "End row";
    }, {
        readonly name: "blockerProp";
        readonly type: "string";
        readonly description: "Cell data property that blocks sight (default: \"wall\")";
        readonly optional: true;
    }] | [{
        readonly name: "grid";
        readonly type: "string";
        readonly description: "Grid name";
    }, {
        readonly name: "x1";
        readonly type: "number";
        readonly description: "Start column";
    }, {
        readonly name: "y1";
        readonly type: "number";
        readonly description: "Start row";
    }, {
        readonly name: "x2";
        readonly type: "number";
        readonly description: "End column";
    }, {
        readonly name: "y2";
        readonly type: "number";
        readonly description: "End row";
    }, {
        readonly name: "blockerProp";
        readonly type: "string";
        readonly description: "Cell data property that blocks movement (default: \"wall\")";
        readonly optional: true;
    }] | [{
        readonly name: "grid";
        readonly type: "string";
        readonly description: "Grid name";
    }, {
        readonly name: "wallProp";
        readonly type: "string";
        readonly description: "Cell data property for walls (default: \"wall\")";
        readonly optional: true;
    }];
    returns: "string" | "number" | "boolean" | "array" | "any" | "object|0";
}[];
export declare const BUILTIN_VARIABLES: {
    name: string;
    description: "Random 0-1 value" | "Current cell name" | "Click count" | "Pointer X in world units" | "Pointer Y in world units" | "Frame time in seconds" | "Other object in collision/overlap" | "True on fresh start, false on save restore" | "Reference to current object";
    example: "if random < 0.5:" | "if currentCell == \"Start\":" | "if clicks == 3:" | "set marker.x clickX" | "set marker.y clickY" | "set self.rotation self.rotation + 180 * deltaTime" | "if other hasTag #missile:\n  set health health - 1" | "onEnter:\n  if newGame:\n    spawn \"Enemy\" {x: 0.5, y: 0.5}" | "set self.health 100\nif self.health <= 0:\n  destroy self";
}[];
export declare const LOGIC_OPERATORS: {
    name: string;
    description: "Conditional block" | "Alternative block" | "Both must be true" | "Either can be true" | "Negate condition" | "Equal to" | "Not equal to" | "Greater than" | "Less than" | "Greater or equal" | "Less or equal";
    example: "if score > 10:" | "else:" | "if hasKey and doorOpen:" | "if hasKey or hasCard:" | "if not visited(\"Room\"):" | "if score == 100:" | "if state != \"done\":" | "if score > 50:" | "if health < 20:" | "if level >= 5:" | "if tries <= 3:";
}[];
export declare const EVENT_SNIPPETS: {
    name: string;
    description: "When entering cell" | "When leaving cell" | "When clicked" | "When key pressed" | "When key released" | "When message received" | "When message from specific source" | "When overlap starts" | "When overlap ends" | "When collision occurs" | "When peg constraint breaks" | "When mouse enters" | "When mouse leaves" | "When drag begins" | "While being dragged" | "When drag ends" | "When movement direction changes" | "When rotation direction changes" | "When movement stops" | "When rotation stops" | "Every physics frame" | "When object jumps" | "When object lands" | "When object is spawned" | "Before object is destroyed" | "When text input is submitted" | "When text input loses focus";
    snippet: string;
    validFor: ["cell", "object"] | ["cell"] | ["object"];
}[];
interface SyntaxMenuItem {
    type: 'item';
    label: string;
    onClick?: () => void;
}
interface SyntaxMenuSubmenu {
    type: 'submenu';
    label: string;
    items: SyntaxMenuEntry[];
}
interface SyntaxMenuDivider {
    type: 'divider';
}
export type SyntaxMenuEntry = SyntaxMenuItem | SyntaxMenuSubmenu | SyntaxMenuDivider;
/**
 * Build context menu entries for the script editor syntax browser.
 * Auto-generated from registry data - self-updating when registry changes.
 */
export declare function buildSyntaxMenuEntries(onInsert: (snippet: string) => void, context?: {
    tags?: string[];
    localObjects?: string[];
    globalObjects?: {
        cellName: string;
        objectName: string;
    }[];
    customActions?: string[];
}): SyntaxMenuEntry[];
export {};
