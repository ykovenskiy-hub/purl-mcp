export var ACTIONS: {
    goto: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    transition: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    show: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    hide: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    wait: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    set: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    reset: {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    "reset script": {
        description: string;
        longDescription: string;
        example: string;
        parameters: any[];
        notes: string;
    };
    endGame: {
        description: string;
        longDescription: string;
        example: string;
        parameters: any[];
        notes: string;
    };
    restart: {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            optional: boolean;
            description: string;
        }[];
        notes: string;
    };
    save: {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    load: {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    "delete save": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    return: {
        description: string;
        longDescription: string;
        example: string;
        parameters: any[];
        notes: string;
    };
    break: {
        description: string;
        longDescription: string;
        example: string;
        parameters: any[];
        notes: string;
    };
    clear: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    shout: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    "shout to": {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    press: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    release: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    openUrl: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    post: {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    fetch: {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    spawn: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    destroy: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    copy: {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    shake: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
    };
    vibrate: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
    };
    pulse: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
    };
    squeeze: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
    };
    bounce: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
    };
    spin: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
    };
    glow: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
    };
    screenshake: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
    };
    stop: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
    };
    play: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
    };
    pause: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
    };
    jump: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    impulse: {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    transport: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    moveTo: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    log: {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    foreach: {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    repeat: {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    "first...where": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    "action (custom)": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    "enable movable": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    "disable movable": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "enable jumpable": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    "disable jumpable": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "enable draggable": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    "disable draggable": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "enable keyboard": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    "enable click": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "enable gamepad": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "enable script": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "disable keyboard": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "disable click": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "disable gamepad": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "disable script": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "enable subject": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    "disable subject": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "enable follow": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    "enable avoid": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    "disable follow": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "enable zone": {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    "disable zone": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "enable blocking": {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    "disable blocking": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "enable sensor": {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    "disable sensor": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "enable phase": {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    "disable phase": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
    };
    "animate (group)": {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    "stop animate": {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    reveal: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        notes: string;
    };
    addtag: {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    removetag: {
        description: string;
        longDescription: string;
        example: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        notes: string;
    };
    rehide: {
        description: string;
        longDescription: string;
        example: string;
        parameters: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
    };
};
export namespace CAMERA_SCRIPTABLE_PROPERTIES {
    namespace x {
        let description: string;
        let type: string;
        let example: string;
    }
    namespace y {
        let description_1: string;
        export { description_1 as description };
        let type_1: string;
        export { type_1 as type };
        let example_1: string;
        export { example_1 as example };
    }
    namespace zoom {
        let description_2: string;
        export { description_2 as description };
        let type_2: string;
        export { type_2 as type };
        let example_2: string;
        export { example_2 as example };
    }
    namespace aspectRatio {
        let description_3: string;
        export { description_3 as description };
        let type_3: string;
        export { type_3 as type };
        let example_3: string;
        export { example_3 as example };
    }
    namespace viewportWidth {
        let description_4: string;
        export { description_4 as description };
        let type_4: string;
        export { type_4 as type };
        let example_4: string;
        export { example_4 as example };
    }
    namespace viewportHeight {
        let description_5: string;
        export { description_5 as description };
        let type_5: string;
        export { type_5 as type };
        let example_5: string;
        export { example_5 as example };
    }
    namespace subjectTransition {
        let description_6: string;
        export { description_6 as description };
        let type_6: string;
        export { type_6 as type };
        let example_6: string;
        export { example_6 as example };
    }
}
export var CELL_SCRIPTABLE_PROPERTIES: {
    backgroundColor: {
        description: string;
        type: string;
        example: string;
    };
    "gradient.color0": {
        description: string;
        type: string;
        example: string;
    };
    "gradient.color1": {
        description: string;
        type: string;
        example: string;
    };
    "gradient.angle": {
        description: string;
        type: string;
        example: string;
    };
    backgroundPattern: {
        description: string;
        type: string;
        example: string;
    };
    patternColor: {
        description: string;
        type: string;
        example: string;
    };
    patternScale: {
        description: string;
        type: string;
        example: string;
    };
    gravity: {
        description: string;
        type: string;
        example: string;
        notes: string;
    };
    wind: {
        description: string;
        type: string;
        example: string;
        notes: string;
    };
    windAngle: {
        description: string;
        type: string;
        example: string;
    };
    drag: {
        description: string;
        type: string;
        example: string;
        notes: string;
    };
    timeScale: {
        description: string;
        type: string;
        example: string;
    };
    width: {
        description: string;
        type: string;
        example: string;
    };
    height: {
        description: string;
        type: string;
        example: string;
    };
};
export namespace CONCEPTS {
    namespace objectVariables {
        let description_7: string;
        export { description_7 as description };
        export let longDescription: string;
        let example_7: string;
        export { example_7 as example };
        export let notes: string;
    }
    namespace componentChildAccess {
        let description_8: string;
        export { description_8 as description };
        let longDescription_1: string;
        export { longDescription_1 as longDescription };
        let example_8: string;
        export { example_8 as example };
        let notes_1: string;
        export { notes_1 as notes };
    }
    namespace messageParameters {
        let description_9: string;
        export { description_9 as description };
        let longDescription_2: string;
        export { longDescription_2 as longDescription };
        let example_9: string;
        export { example_9 as example };
        let notes_2: string;
        export { notes_2 as notes };
    }
    namespace spawnParameters {
        let description_10: string;
        export { description_10 as description };
        let longDescription_3: string;
        export { longDescription_3 as longDescription };
        let example_10: string;
        export { example_10 as example };
        let notes_3: string;
        export { notes_3 as notes };
    }
    namespace variableScopes {
        let description_11: string;
        export { description_11 as description };
        let longDescription_4: string;
        export { longDescription_4 as longDescription };
        let example_11: string;
        export { example_11 as example };
        let notes_4: string;
        export { notes_4 as notes };
    }
}
export namespace EVENTS {
    namespace onEnter {
        let description_12: string;
        export { description_12 as description };
        let longDescription_5: string;
        export { longDescription_5 as longDescription };
        export let validFor: string[];
        let example_12: string;
        export { example_12 as example };
        let notes_5: string;
        export { notes_5 as notes };
    }
    namespace onExit {
        let description_13: string;
        export { description_13 as description };
        let longDescription_6: string;
        export { longDescription_6 as longDescription };
        let validFor_1: string[];
        export { validFor_1 as validFor };
        let example_13: string;
        export { example_13 as example };
        let notes_6: string;
        export { notes_6 as notes };
    }
    namespace onClick {
        let description_14: string;
        export { description_14 as description };
        let longDescription_7: string;
        export { longDescription_7 as longDescription };
        let validFor_2: string[];
        export { validFor_2 as validFor };
        let example_14: string;
        export { example_14 as example };
        let notes_7: string;
        export { notes_7 as notes };
    }
    namespace onKeyDown {
        let description_15: string;
        export { description_15 as description };
        let longDescription_8: string;
        export { longDescription_8 as longDescription };
        let validFor_3: string[];
        export { validFor_3 as validFor };
        let example_15: string;
        export { example_15 as example };
        export let parameters: {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        }[];
        let notes_8: string;
        export { notes_8 as notes };
    }
    namespace onKeyUp {
        let description_16: string;
        export { description_16 as description };
        let longDescription_9: string;
        export { longDescription_9 as longDescription };
        let validFor_4: string[];
        export { validFor_4 as validFor };
        let example_16: string;
        export { example_16 as example };
        let parameters_1: {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        }[];
        export { parameters_1 as parameters };
        let notes_9: string;
        export { notes_9 as notes };
    }
    namespace onMessage {
        let description_17: string;
        export { description_17 as description };
        let longDescription_10: string;
        export { longDescription_10 as longDescription };
        let validFor_5: string[];
        export { validFor_5 as validFor };
        let example_17: string;
        export { example_17 as example };
        let parameters_2: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_2 as parameters };
        let notes_10: string;
        export { notes_10 as notes };
    }
    namespace onMessageFrom {
        let description_18: string;
        export { description_18 as description };
        let longDescription_11: string;
        export { longDescription_11 as longDescription };
        let validFor_6: string[];
        export { validFor_6 as validFor };
        let example_18: string;
        export { example_18 as example };
        let parameters_3: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_3 as parameters };
        let notes_11: string;
        export { notes_11 as notes };
    }
    namespace onOverlap {
        let description_19: string;
        export { description_19 as description };
        let longDescription_12: string;
        export { longDescription_12 as longDescription };
        let validFor_7: string[];
        export { validFor_7 as validFor };
        let example_19: string;
        export { example_19 as example };
        let notes_12: string;
        export { notes_12 as notes };
    }
    namespace onOverlapEnd {
        let description_20: string;
        export { description_20 as description };
        let longDescription_13: string;
        export { longDescription_13 as longDescription };
        let validFor_8: string[];
        export { validFor_8 as validFor };
        let example_20: string;
        export { example_20 as example };
        let notes_13: string;
        export { notes_13 as notes };
    }
    namespace onCollide {
        let description_21: string;
        export { description_21 as description };
        let longDescription_14: string;
        export { longDescription_14 as longDescription };
        let validFor_9: string[];
        export { validFor_9 as validFor };
        let example_21: string;
        export { example_21 as example };
        let notes_14: string;
        export { notes_14 as notes };
    }
    namespace onBreak {
        let description_22: string;
        export { description_22 as description };
        let longDescription_15: string;
        export { longDescription_15 as longDescription };
        let validFor_10: string[];
        export { validFor_10 as validFor };
        let example_22: string;
        export { example_22 as example };
        let notes_15: string;
        export { notes_15 as notes };
    }
    namespace onHover {
        let description_23: string;
        export { description_23 as description };
        let longDescription_16: string;
        export { longDescription_16 as longDescription };
        let validFor_11: string[];
        export { validFor_11 as validFor };
        let example_23: string;
        export { example_23 as example };
        let notes_16: string;
        export { notes_16 as notes };
    }
    namespace onHoverEnd {
        let description_24: string;
        export { description_24 as description };
        let longDescription_17: string;
        export { longDescription_17 as longDescription };
        let validFor_12: string[];
        export { validFor_12 as validFor };
        let example_24: string;
        export { example_24 as example };
        let notes_17: string;
        export { notes_17 as notes };
    }
    namespace onDragStart {
        let description_25: string;
        export { description_25 as description };
        let longDescription_18: string;
        export { longDescription_18 as longDescription };
        let validFor_13: string[];
        export { validFor_13 as validFor };
        let example_25: string;
        export { example_25 as example };
        let notes_18: string;
        export { notes_18 as notes };
    }
    namespace onDrag {
        let description_26: string;
        export { description_26 as description };
        let longDescription_19: string;
        export { longDescription_19 as longDescription };
        let validFor_14: string[];
        export { validFor_14 as validFor };
        let example_26: string;
        export { example_26 as example };
        let notes_19: string;
        export { notes_19 as notes };
    }
    namespace onDragEnd {
        let description_27: string;
        export { description_27 as description };
        let longDescription_20: string;
        export { longDescription_20 as longDescription };
        let validFor_15: string[];
        export { validFor_15 as validFor };
        let example_27: string;
        export { example_27 as example };
        let notes_20: string;
        export { notes_20 as notes };
    }
    namespace onMove {
        let description_28: string;
        export { description_28 as description };
        let longDescription_21: string;
        export { longDescription_21 as longDescription };
        let validFor_16: string[];
        export { validFor_16 as validFor };
        let example_28: string;
        export { example_28 as example };
        let notes_21: string;
        export { notes_21 as notes };
        let parameters_4: {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        }[];
        export { parameters_4 as parameters };
    }
    namespace onRotate {
        let description_29: string;
        export { description_29 as description };
        let longDescription_22: string;
        export { longDescription_22 as longDescription };
        let validFor_17: string[];
        export { validFor_17 as validFor };
        let example_29: string;
        export { example_29 as example };
        let notes_22: string;
        export { notes_22 as notes };
        let parameters_5: {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        }[];
        export { parameters_5 as parameters };
    }
    namespace onStop {
        let description_30: string;
        export { description_30 as description };
        let longDescription_23: string;
        export { longDescription_23 as longDescription };
        let validFor_18: string[];
        export { validFor_18 as validFor };
        let example_30: string;
        export { example_30 as example };
        let notes_23: string;
        export { notes_23 as notes };
    }
    namespace onArrive {
        let description_31: string;
        export { description_31 as description };
        let longDescription_24: string;
        export { longDescription_24 as longDescription };
        let validFor_19: string[];
        export { validFor_19 as validFor };
        let example_31: string;
        export { example_31 as example };
        let notes_24: string;
        export { notes_24 as notes };
    }
    namespace onStopRotate {
        let description_32: string;
        export { description_32 as description };
        let longDescription_25: string;
        export { longDescription_25 as longDescription };
        let validFor_20: string[];
        export { validFor_20 as validFor };
        let example_32: string;
        export { example_32 as example };
        let notes_25: string;
        export { notes_25 as notes };
    }
    namespace onBounds {
        let description_33: string;
        export { description_33 as description };
        let longDescription_26: string;
        export { longDescription_26 as longDescription };
        let validFor_21: string[];
        export { validFor_21 as validFor };
        let example_33: string;
        export { example_33 as example };
        let parameters_6: {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        }[];
        export { parameters_6 as parameters };
        let notes_26: string;
        export { notes_26 as notes };
    }
    namespace onAudioEnd {
        let description_34: string;
        export { description_34 as description };
        let longDescription_27: string;
        export { longDescription_27 as longDescription };
        let validFor_22: string[];
        export { validFor_22 as validFor };
        let example_34: string;
        export { example_34 as example };
        let parameters_7: any[];
        export { parameters_7 as parameters };
        let notes_27: string;
        export { notes_27 as notes };
    }
    namespace onTick {
        let description_35: string;
        export { description_35 as description };
        let longDescription_28: string;
        export { longDescription_28 as longDescription };
        let validFor_23: string[];
        export { validFor_23 as validFor };
        let example_35: string;
        export { example_35 as example };
        let notes_28: string;
        export { notes_28 as notes };
    }
    namespace onJump {
        let description_36: string;
        export { description_36 as description };
        let longDescription_29: string;
        export { longDescription_29 as longDescription };
        let validFor_24: string[];
        export { validFor_24 as validFor };
        let example_36: string;
        export { example_36 as example };
        let notes_29: string;
        export { notes_29 as notes };
    }
    namespace onLanding {
        let description_37: string;
        export { description_37 as description };
        let longDescription_30: string;
        export { longDescription_30 as longDescription };
        let validFor_25: string[];
        export { validFor_25 as validFor };
        let example_37: string;
        export { example_37 as example };
        let notes_30: string;
        export { notes_30 as notes };
    }
    namespace onSpawn {
        let description_38: string;
        export { description_38 as description };
        let longDescription_31: string;
        export { longDescription_31 as longDescription };
        let validFor_26: string[];
        export { validFor_26 as validFor };
        let example_38: string;
        export { example_38 as example };
        let parameters_8: {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        }[];
        export { parameters_8 as parameters };
        let notes_31: string;
        export { notes_31 as notes };
    }
    namespace onDestroy {
        let description_39: string;
        export { description_39 as description };
        let longDescription_32: string;
        export { longDescription_32 as longDescription };
        let validFor_27: string[];
        export { validFor_27 as validFor };
        let example_39: string;
        export { example_39 as example };
        let notes_32: string;
        export { notes_32 as notes };
    }
    namespace onSubmit {
        let description_40: string;
        export { description_40 as description };
        let longDescription_33: string;
        export { longDescription_33 as longDescription };
        let validFor_28: string[];
        export { validFor_28 as validFor };
        let example_40: string;
        export { example_40 as example };
        let notes_33: string;
        export { notes_33 as notes };
    }
    namespace onDefocus {
        let description_41: string;
        export { description_41 as description };
        let longDescription_34: string;
        export { longDescription_34 as longDescription };
        let validFor_29: string[];
        export { validFor_29 as validFor };
        let example_41: string;
        export { example_41 as example };
        let notes_34: string;
        export { notes_34 as notes };
    }
}
export var FILL_LAYER_PROPERTIES: {
    name: string;
    layerType: string;
    property: string;
    type: string;
    description: string;
    example: string;
}[];
export namespace FUNCTIONS {
    namespace visited {
        let description_42: string;
        export { description_42 as description };
        let longDescription_35: string;
        export { longDescription_35 as longDescription };
        let example_42: string;
        export { example_42 as example };
        let parameters_9: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_9 as parameters };
        export let returns: string;
    }
    namespace hasSave {
        let description_43: string;
        export { description_43 as description };
        let longDescription_36: string;
        export { longDescription_36 as longDescription };
        let example_43: string;
        export { example_43 as example };
        let parameters_10: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_10 as parameters };
        let returns_1: string;
        export { returns_1 as returns };
    }
    namespace visits {
        let description_44: string;
        export { description_44 as description };
        let longDescription_37: string;
        export { longDescription_37 as longDescription };
        let example_44: string;
        export { example_44 as example };
        let parameters_11: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_11 as parameters };
        let returns_2: string;
        export { returns_2 as returns };
    }
    namespace hasObject {
        let description_45: string;
        export { description_45 as description };
        let longDescription_38: string;
        export { longDescription_38 as longDescription };
        let example_45: string;
        export { example_45 as example };
        let parameters_12: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_12 as parameters };
        let returns_3: string;
        export { returns_3 as returns };
    }
    namespace get {
        let description_46: string;
        export { description_46 as description };
        let longDescription_39: string;
        export { longDescription_39 as longDescription };
        let example_46: string;
        export { example_46 as example };
        let parameters_13: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_13 as parameters };
        let returns_4: string;
        export { returns_4 as returns };
    }
    namespace random {
        let description_47: string;
        export { description_47 as description };
        let longDescription_40: string;
        export { longDescription_40 as longDescription };
        let example_47: string;
        export { example_47 as example };
        let parameters_14: {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        }[];
        export { parameters_14 as parameters };
        let returns_5: string;
        export { returns_5 as returns };
    }
    namespace floor {
        let description_48: string;
        export { description_48 as description };
        let longDescription_41: string;
        export { longDescription_41 as longDescription };
        let example_48: string;
        export { example_48 as example };
        let parameters_15: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_15 as parameters };
        let returns_6: string;
        export { returns_6 as returns };
    }
    namespace ceil {
        let description_49: string;
        export { description_49 as description };
        let longDescription_42: string;
        export { longDescription_42 as longDescription };
        let example_49: string;
        export { example_49 as example };
        let parameters_16: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_16 as parameters };
        let returns_7: string;
        export { returns_7 as returns };
    }
    namespace round {
        let description_50: string;
        export { description_50 as description };
        let longDescription_43: string;
        export { longDescription_43 as longDescription };
        let example_50: string;
        export { example_50 as example };
        let parameters_17: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_17 as parameters };
        let returns_8: string;
        export { returns_8 as returns };
    }
    namespace abs {
        let description_51: string;
        export { description_51 as description };
        let longDescription_44: string;
        export { longDescription_44 as longDescription };
        let example_51: string;
        export { example_51 as example };
        let parameters_18: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_18 as parameters };
        let returns_9: string;
        export { returns_9 as returns };
    }
    namespace min {
        let description_52: string;
        export { description_52 as description };
        let longDescription_45: string;
        export { longDescription_45 as longDescription };
        let example_52: string;
        export { example_52 as example };
        let parameters_19: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_19 as parameters };
        let returns_10: string;
        export { returns_10 as returns };
    }
    namespace max {
        let description_53: string;
        export { description_53 as description };
        let longDescription_46: string;
        export { longDescription_46 as longDescription };
        let example_53: string;
        export { example_53 as example };
        let parameters_20: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_20 as parameters };
        let returns_11: string;
        export { returns_11 as returns };
    }
    namespace sin {
        let description_54: string;
        export { description_54 as description };
        let longDescription_47: string;
        export { longDescription_47 as longDescription };
        let example_54: string;
        export { example_54 as example };
        let parameters_21: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_21 as parameters };
        let returns_12: string;
        export { returns_12 as returns };
    }
    namespace cos {
        let description_55: string;
        export { description_55 as description };
        let longDescription_48: string;
        export { longDescription_48 as longDescription };
        let example_55: string;
        export { example_55 as example };
        let parameters_22: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_22 as parameters };
        let returns_13: string;
        export { returns_13 as returns };
    }
    namespace atan2 {
        let description_56: string;
        export { description_56 as description };
        let longDescription_49: string;
        export { longDescription_49 as longDescription };
        let example_56: string;
        export { example_56 as example };
        let parameters_23: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_23 as parameters };
        let returns_14: string;
        export { returns_14 as returns };
    }
    namespace cardinal {
        let description_57: string;
        export { description_57 as description };
        let longDescription_50: string;
        export { longDescription_50 as longDescription };
        let example_57: string;
        export { example_57 as example };
        let parameters_24: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_24 as parameters };
        let returns_15: string;
        export { returns_15 as returns };
    }
    namespace length {
        let description_58: string;
        export { description_58 as description };
        let longDescription_51: string;
        export { longDescription_51 as longDescription };
        let example_58: string;
        export { example_58 as example };
        let parameters_25: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_25 as parameters };
        let returns_16: string;
        export { returns_16 as returns };
    }
    namespace range {
        let description_59: string;
        export { description_59 as description };
        let longDescription_52: string;
        export { longDescription_52 as longDescription };
        let example_59: string;
        export { example_59 as example };
        let parameters_26: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        export { parameters_26 as parameters };
        let returns_17: string;
        export { returns_17 as returns };
    }
    namespace shuffle {
        let description_60: string;
        export { description_60 as description };
        let longDescription_53: string;
        export { longDescription_53 as longDescription };
        let example_60: string;
        export { example_60 as example };
        let parameters_27: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_27 as parameters };
        let returns_18: string;
        export { returns_18 as returns };
    }
    namespace pick {
        let description_61: string;
        export { description_61 as description };
        let longDescription_54: string;
        export { longDescription_54 as longDescription };
        let example_61: string;
        export { example_61 as example };
        let parameters_28: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_28 as parameters };
        let returns_19: string;
        export { returns_19 as returns };
    }
    namespace isEmpty {
        let description_62: string;
        export { description_62 as description };
        let longDescription_55: string;
        export { longDescription_55 as longDescription };
        let example_62: string;
        export { example_62 as example };
        let parameters_29: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_29 as parameters };
        let returns_20: string;
        export { returns_20 as returns };
    }
    namespace emptyCells {
        let description_63: string;
        export { description_63 as description };
        let longDescription_56: string;
        export { longDescription_56 as longDescription };
        let example_63: string;
        export { example_63 as example };
        let parameters_30: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_30 as parameters };
        let returns_21: string;
        export { returns_21 as returns };
    }
    namespace cellsWhere {
        let description_64: string;
        export { description_64 as description };
        let longDescription_57: string;
        export { longDescription_57 as longDescription };
        let example_64: string;
        export { example_64 as example };
        let parameters_31: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_31 as parameters };
        let returns_22: string;
        export { returns_22 as returns };
        let notes_35: string;
        export { notes_35 as notes };
    }
    namespace floodfill {
        let description_65: string;
        export { description_65 as description };
        let longDescription_58: string;
        export { longDescription_58 as longDescription };
        let example_65: string;
        export { example_65 as example };
        let parameters_32: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        export { parameters_32 as parameters };
        let returns_23: string;
        export { returns_23 as returns };
        let notes_36: string;
        export { notes_36 as notes };
    }
    namespace minimax {
        let description_66: string;
        export { description_66 as description };
        let longDescription_59: string;
        export { longDescription_59 as longDescription };
        let example_66: string;
        export { example_66 as example };
        let parameters_33: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        export { parameters_33 as parameters };
        let returns_24: string;
        export { returns_24 as returns };
        let notes_37: string;
        export { notes_37 as notes };
    }
    namespace hash {
        let description_67: string;
        export { description_67 as description };
        let longDescription_60: string;
        export { longDescription_60 as longDescription };
        let example_67: string;
        export { example_67 as example };
        let parameters_34: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_34 as parameters };
        let returns_25: string;
        export { returns_25 as returns };
        let notes_38: string;
        export { notes_38 as notes };
    }
    namespace distance {
        let description_68: string;
        export { description_68 as description };
        let longDescription_61: string;
        export { longDescription_61 as longDescription };
        let example_68: string;
        export { example_68 as example };
        let parameters_35: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_35 as parameters };
        let returns_26: string;
        export { returns_26 as returns };
    }
    namespace randomFree {
        let description_69: string;
        export { description_69 as description };
        let longDescription_62: string;
        export { longDescription_62 as longDescription };
        let example_69: string;
        export { example_69 as example };
        let parameters_36: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        export { parameters_36 as parameters };
        let returns_27: string;
        export { returns_27 as returns };
        let notes_39: string;
        export { notes_39 as notes };
    }
    namespace nearby {
        let description_70: string;
        export { description_70 as description };
        let longDescription_63: string;
        export { longDescription_63 as longDescription };
        let example_70: string;
        export { example_70 as example };
        let parameters_37: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        export { parameters_37 as parameters };
        let returns_28: string;
        export { returns_28 as returns };
        let notes_40: string;
        export { notes_40 as notes };
    }
    namespace nearest {
        let description_71: string;
        export { description_71 as description };
        let longDescription_64: string;
        export { longDescription_64 as longDescription };
        let example_71: string;
        export { example_71 as example };
        let parameters_38: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        export { parameters_38 as parameters };
        let returns_29: string;
        export { returns_29 as returns };
        let notes_41: string;
        export { notes_41 as notes };
    }
    namespace intersects {
        let description_72: string;
        export { description_72 as description };
        let longDescription_65: string;
        export { longDescription_65 as longDescription };
        let example_72: string;
        export { example_72 as example };
        let parameters_39: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_39 as parameters };
        let returns_30: string;
        export { returns_30 as returns };
        let notes_42: string;
        export { notes_42 as notes };
    }
    namespace canSee {
        let description_73: string;
        export { description_73 as description };
        let longDescription_66: string;
        export { longDescription_66 as longDescription };
        let example_73: string;
        export { example_73 as example };
        let parameters_40: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        export { parameters_40 as parameters };
        let returns_31: string;
        export { returns_31 as returns };
        let notes_43: string;
        export { notes_43 as notes };
    }
    namespace pathfind {
        let description_74: string;
        export { description_74 as description };
        let longDescription_67: string;
        export { longDescription_67 as longDescription };
        let example_74: string;
        export { example_74 as example };
        let parameters_41: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        export { parameters_41 as parameters };
        let returns_32: string;
        export { returns_32 as returns };
        let notes_44: string;
        export { notes_44 as notes };
    }
    namespace generateMaze {
        let description_75: string;
        export { description_75 as description };
        let longDescription_68: string;
        export { longDescription_68 as longDescription };
        let example_75: string;
        export { example_75 as example };
        let parameters_42: ({
            name: string;
            type: string;
            description: string;
            optional?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        })[];
        export { parameters_42 as parameters };
        let returns_33: string;
        export { returns_33 as returns };
        let notes_45: string;
        export { notes_45 as notes };
    }
}
declare var OPERATORS2: {
    if: {
        description: string;
        example: string;
        category: string;
    };
    else: {
        description: string;
        example: string;
        category: string;
    };
    and: {
        description: string;
        example: string;
        category: string;
    };
    or: {
        description: string;
        example: string;
        category: string;
    };
    not: {
        description: string;
        example: string;
        category: string;
    };
    "==": {
        description: string;
        example: string;
        category: string;
    };
    "!=": {
        description: string;
        example: string;
        category: string;
    };
    ">": {
        description: string;
        example: string;
        category: string;
    };
    "<": {
        description: string;
        example: string;
        category: string;
    };
    ">=": {
        description: string;
        example: string;
        category: string;
    };
    "<=": {
        description: string;
        example: string;
        category: string;
    };
};
export namespace SCREEN_SCRIPTABLE_PROPERTIES {
    export namespace aspectRatio_1 {
        let description_76: string;
        export { description_76 as description };
        let type_7: string;
        export { type_7 as type };
        let example_76: string;
        export { example_76 as example };
    }
    export { aspectRatio_1 as aspectRatio };
    export namespace width {
        let description_77: string;
        export { description_77 as description };
        let type_8: string;
        export { type_8 as type };
        let example_77: string;
        export { example_77 as example };
    }
    export namespace height {
        let description_78: string;
        export { description_78 as description };
        let type_9: string;
        export { type_9 as type };
        let example_78: string;
        export { example_78 as example };
    }
}
export var SCRIPTABLE_PROPERTIES: {
    x: {
        description: string;
        type: string;
        example: string;
    };
    y: {
        description: string;
        type: string;
        example: string;
    };
    width: {
        description: string;
        type: string;
        example: string;
    };
    height: {
        description: string;
        type: string;
        example: string;
    };
    lineX1: {
        description: string;
        type: string;
        example: string;
    };
    lineY1: {
        description: string;
        type: string;
        example: string;
    };
    lineX2: {
        description: string;
        type: string;
        example: string;
    };
    lineY2: {
        description: string;
        type: string;
        example: string;
    };
    lineStartMarker: {
        description: string;
        type: string;
        example: string;
    };
    lineEndMarker: {
        description: string;
        type: string;
        example: string;
    };
    lineCap: {
        description: string;
        type: string;
        example: string;
    };
    visible: {
        description: string;
        type: string;
        example: string;
    };
    opacity: {
        description: string;
        type: string;
        example: string;
    };
    blendMode: {
        description: string;
        type: string;
        example: string;
    };
    strokeColor: {
        description: string;
        type: string;
        example: string;
    };
    strokeWidth: {
        description: string;
        type: string;
        example: string;
    };
    content: {
        description: string;
        type: string;
        example: string;
    };
    textColor: {
        description: string;
        type: string;
        example: string;
    };
    fontSize: {
        description: string;
        type: string;
        example: string;
    };
    editable: {
        description: string;
        type: string;
        example: string;
    };
    lineHeight: {
        description: string;
        type: string;
        example: string;
    };
    verticalAlign: {
        description: string;
        type: string;
        example: string;
        notes: string;
    };
    cornerRadius: {
        description: string;
        type: string;
        example: string;
    };
    shadowX: {
        description: string;
        type: string;
        example: string;
    };
    shadowY: {
        description: string;
        type: string;
        example: string;
    };
    shadowBlur: {
        description: string;
        type: string;
        example: string;
    };
    shadowColor: {
        description: string;
        type: string;
        example: string;
    };
    glowBlur: {
        description: string;
        type: string;
        example: string;
    };
    glowColor: {
        description: string;
        type: string;
        example: string;
    };
    glowIntensity: {
        description: string;
        type: string;
        example: string;
    };
    trail: {
        description: string;
        type: string;
        example: string;
    };
    trailLength: {
        description: string;
        type: string;
        example: string;
    };
    trailOpacity: {
        description: string;
        type: string;
        example: string;
    };
    trailColor: {
        description: string;
        type: string;
        example: string;
    };
    trailScale: {
        description: string;
        type: string;
        example: string;
    };
    trailWidth: {
        description: string;
        type: string;
        example: string;
    };
    trailFade: {
        description: string;
        type: string;
        example: string;
    };
    zIndex: {
        description: string;
        type: string;
        example: string;
    };
    rotation: {
        description: string;
        type: string;
        example: string;
    };
    flipX: {
        description: string;
        type: string;
        example: string;
    };
    flipY: {
        description: string;
        type: string;
        example: string;
    };
    state: {
        description: string;
        type: string;
        example: string;
    };
    rotatable: {
        description: string;
        type: string;
        example: string;
    };
    cellX: {
        description: string;
        type: string;
        example: string;
        readonly: boolean;
    };
    cellY: {
        description: string;
        type: string;
        example: string;
        readonly: boolean;
    };
    moving: {
        description: string;
        type: string;
        example: string;
        readonly: boolean;
    };
    direction: {
        description: string;
        type: string;
        example: string;
        readonly: boolean;
        notes: string;
    };
    velocityX: {
        description: string;
        type: string;
        example: string;
    };
    velocityY: {
        description: string;
        type: string;
        example: string;
    };
    angularVelocity: {
        description: string;
        type: string;
        example: string;
        readonly: boolean;
        notes: string;
    };
    moveAngle: {
        description: string;
        type: string;
        example: string;
        readonly: boolean;
        notes: string;
    };
    moveSpeed: {
        description: string;
        type: string;
        example: string;
        readonly: boolean;
    };
    followDistance: {
        description: string;
        type: string;
        example: string;
        notes: string;
    };
    spriteFrame: {
        description: string;
        type: string;
        example: string;
        notes: string;
    };
    tags: {
        description: string;
        type: string;
        example: string;
    };
    perspectiveX: {
        description: string;
        type: string;
        example: string;
    };
    perspectiveY: {
        description: string;
        type: string;
        example: string;
    };
    gravityScale: {
        description: string;
        type: string;
        example: string;
    };
    windScale: {
        description: string;
        type: string;
        example: string;
    };
    dragScale: {
        description: string;
        type: string;
        example: string;
    };
    timeScale: {
        description: string;
        type: string;
        example: string;
    };
    revealer: {
        description: string;
        type: string;
        example: string;
    };
    revealerRadius: {
        description: string;
        type: string;
        example: string;
    };
    revealerFade: {
        description: string;
        type: string;
        example: string;
    };
    revealerNoise: {
        description: string;
        type: string;
        example: string;
    };
    revealerShape: {
        description: string;
        type: string;
        example: string;
    };
    revealTags: {
        description: string;
        type: string;
        example: string;
    };
    revealerRehide: {
        description: string;
        type: string;
        example: string;
    };
    revealerRehideSpeed: {
        description: string;
        type: string;
        example: string;
    };
    revealerRehideGrowth: {
        description: string;
        type: string;
        example: string;
    };
    revealerRehideRate: {
        description: string;
        type: string;
        example: string;
    };
    revealerRehideStopThreshold: {
        description: string;
        type: string;
        example: string;
    };
    "keys.up": {
        description: string;
        type: string;
        example: string;
    };
    "keys.down": {
        description: string;
        type: string;
        example: string;
    };
    "keys.left": {
        description: string;
        type: string;
        example: string;
    };
    "keys.right": {
        description: string;
        type: string;
        example: string;
    };
    "keys.jump": {
        description: string;
        type: string;
        example: string;
    };
    pegType: {
        description: string;
        type: string;
        example: string;
    };
    pegDamping: {
        description: string;
        type: string;
        example: string;
    };
    pegBreakForce: {
        description: string;
        type: string;
        example: string;
    };
    springStiffness: {
        description: string;
        type: string;
        example: string;
    };
    springDamping: {
        description: string;
        type: string;
        example: string;
    };
    springBreakForce: {
        description: string;
        type: string;
        example: string;
    };
    startMarker: {
        description: string;
        type: string;
        example: string;
    };
    duration: {
        description: string;
        type: string;
        example: string;
    };
    buffered: {
        description: string;
        type: string;
        example: string;
    };
    spatial: {
        description: string;
        type: string;
        example: string;
    };
    spatialRange: {
        description: string;
        type: string;
        example: string;
    };
    emitterShape: {
        description: string;
        type: string;
        example: string;
    };
    emitterSizeMode: {
        description: string;
        type: string;
        example: string;
    };
    emitterRate: {
        description: string;
        type: string;
        example: string;
    };
    emitterBurst: {
        description: string;
        type: string;
        example: string;
    };
    particleLifetime: {
        description: string;
        type: string;
        example: string;
    };
    particleSpeedMin: {
        description: string;
        type: string;
        example: string;
    };
    particleSpeedMax: {
        description: string;
        type: string;
        example: string;
    };
    particleSpread: {
        description: string;
        type: string;
        example: string;
    };
    particleShape: {
        description: string;
        type: string;
        example: string;
    };
    particleTrailLength: {
        description: string;
        type: string;
        example: string;
    };
    particleSizeStart: {
        description: string;
        type: string;
        example: string;
    };
    particleSizeEnd: {
        description: string;
        type: string;
        example: string;
    };
    particleOpacityStart: {
        description: string;
        type: string;
        example: string;
    };
    particleOpacityEnd: {
        description: string;
        type: string;
        example: string;
    };
    particleColorA: {
        description: string;
        type: string;
        example: string;
    };
    particleColorB: {
        description: string;
        type: string;
        example: string;
    };
    particleColorEnd: {
        description: string;
        type: string;
        example: string;
    };
    particleGravityX: {
        description: string;
        type: string;
        example: string;
    };
    particleGravityY: {
        description: string;
        type: string;
        example: string;
    };
    particleDrag: {
        description: string;
        type: string;
        example: string;
    };
    emitterGlow: {
        description: string;
        type: string;
        example: string;
    };
    emitterGlowSize: {
        description: string;
        type: string;
        example: string;
    };
    emitterGlowFlicker: {
        description: string;
        type: string;
        example: string;
    };
};
export var TRANSITIONS: {
    fade: {
        description: string;
        validFor: string[];
    };
    scale: {
        description: string;
        validFor: string[];
    };
    "slide-up": {
        description: string;
        validFor: string[];
    };
    "slide-down": {
        description: string;
        validFor: string[];
    };
    "slide-left": {
        description: string;
        validFor: string[];
    };
    "slide-right": {
        description: string;
        validFor: string[];
    };
    zoom: {
        description: string;
        validFor: string[];
    };
    typewriter: {
        description: string;
        validFor: string[];
    };
    word: {
        description: string;
        validFor: string[];
    };
    scramble: {
        description: string;
        validFor: string[];
    };
    redact: {
        description: string;
        validFor: string[];
    };
};
export namespace VARIABLES {
    export namespace random_1 {
        let description_79: string;
        export { description_79 as description };
        let longDescription_69: string;
        export { longDescription_69 as longDescription };
        let example_79: string;
        export { example_79 as example };
        let type_10: string;
        export { type_10 as type };
    }
    export { random_1 as random };
    export namespace currentCell {
        let description_80: string;
        export { description_80 as description };
        let longDescription_70: string;
        export { longDescription_70 as longDescription };
        let example_80: string;
        export { example_80 as example };
        let type_11: string;
        export { type_11 as type };
    }
    export namespace clicks {
        let description_81: string;
        export { description_81 as description };
        let longDescription_71: string;
        export { longDescription_71 as longDescription };
        let example_81: string;
        export { example_81 as example };
        let type_12: string;
        export { type_12 as type };
    }
    export namespace clickX {
        let description_82: string;
        export { description_82 as description };
        let longDescription_72: string;
        export { longDescription_72 as longDescription };
        let example_82: string;
        export { example_82 as example };
        let type_13: string;
        export { type_13 as type };
    }
    export namespace clickY {
        let description_83: string;
        export { description_83 as description };
        let longDescription_73: string;
        export { longDescription_73 as longDescription };
        let example_83: string;
        export { example_83 as example };
        let type_14: string;
        export { type_14 as type };
    }
    export namespace deltaTime {
        let description_84: string;
        export { description_84 as description };
        let longDescription_74: string;
        export { longDescription_74 as longDescription };
        let example_84: string;
        export { example_84 as example };
        let type_15: string;
        export { type_15 as type };
    }
    export namespace other {
        let description_85: string;
        export { description_85 as description };
        let longDescription_75: string;
        export { longDescription_75 as longDescription };
        let example_85: string;
        export { example_85 as example };
        let type_16: string;
        export { type_16 as type };
    }
    export namespace newGame {
        let description_86: string;
        export { description_86 as description };
        let longDescription_76: string;
        export { longDescription_76 as longDescription };
        let example_86: string;
        export { example_86 as example };
        let type_17: string;
        export { type_17 as type };
    }
    export namespace self {
        let description_87: string;
        export { description_87 as description };
        let longDescription_77: string;
        export { longDescription_77 as longDescription };
        let example_87: string;
        export { example_87 as example };
        let type_18: string;
        export { type_18 as type };
    }
}
export function formatParseErrors(errors: any): any;
export function formatWarnings(warnings: any): any;
export function generateSyntaxReference(): string;
export function generateUserManual(): string;
export function parseEventScript(source: any): {
    events: ({
        event: string;
        key: any;
        message: any;
        from: any;
        direction: any;
        statements: any[];
    } | {
        event: string;
        statements: any[];
        key?: undefined;
        message?: undefined;
        from?: undefined;
        direction?: undefined;
    })[];
    actions: {
        name: any;
        statements: any[];
    }[];
    errors: any[];
};
export function parseScript(source: any): {
    statements: any[];
    errors: any[];
};
export function validateScriptReferences(events: any, objectNames: any, cellLabels: any): any[];
export { OPERATORS2 as OPERATORS };
