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
        parameters: never[];
        notes: string;
    };
    endGame: {
        description: string;
        longDescription: string;
        example: string;
        parameters: never[];
        notes: string;
    };
    restart: {
        description: string;
        longDescription: string;
        example: string;
        parameters: never[];
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
        parameters: never[];
        notes: string;
    };
    break: {
        description: string;
        longDescription: string;
        example: string;
        parameters: never[];
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
    "enable pageable": {
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
    next: {
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
    prev: {
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
    wrap: {
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
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
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
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
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
export namespace CELL_SCRIPTABLE_PROPERTIES {
    namespace backgroundColor {
        let description: string;
        let type: string;
        let example: string;
    }
    namespace backgroundPattern {
        let description_1: string;
        export { description_1 as description };
        let type_1: string;
        export { type_1 as type };
        let example_1: string;
        export { example_1 as example };
    }
    namespace patternColor {
        let description_2: string;
        export { description_2 as description };
        let type_2: string;
        export { type_2 as type };
        let example_2: string;
        export { example_2 as example };
    }
    namespace patternScale {
        let description_3: string;
        export { description_3 as description };
        let type_3: string;
        export { type_3 as type };
        let example_3: string;
        export { example_3 as example };
    }
    namespace gravity {
        let description_4: string;
        export { description_4 as description };
        let type_4: string;
        export { type_4 as type };
        let example_4: string;
        export { example_4 as example };
        export let notes: string;
    }
    namespace wind {
        let description_5: string;
        export { description_5 as description };
        let type_5: string;
        export { type_5 as type };
        let example_5: string;
        export { example_5 as example };
        let notes_1: string;
        export { notes_1 as notes };
    }
    namespace windAngle {
        let description_6: string;
        export { description_6 as description };
        let type_6: string;
        export { type_6 as type };
        let example_6: string;
        export { example_6 as example };
    }
    namespace airResistance {
        let description_7: string;
        export { description_7 as description };
        let type_7: string;
        export { type_7 as type };
        let example_7: string;
        export { example_7 as example };
        let notes_2: string;
        export { notes_2 as notes };
    }
    namespace timeScale {
        let description_8: string;
        export { description_8 as description };
        let type_8: string;
        export { type_8 as type };
        let example_8: string;
        export { example_8 as example };
    }
    namespace width {
        let description_9: string;
        export { description_9 as description };
        let type_9: string;
        export { type_9 as type };
        let example_9: string;
        export { example_9 as example };
    }
    namespace height {
        let description_10: string;
        export { description_10 as description };
        let type_10: string;
        export { type_10 as type };
        let example_10: string;
        export { example_10 as example };
    }
}
export namespace CONCEPTS {
    namespace objectVariables {
        let description_11: string;
        export { description_11 as description };
        export let longDescription: string;
        let example_11: string;
        export { example_11 as example };
        let notes_3: string;
        export { notes_3 as notes };
    }
    namespace componentChildAccess {
        let description_12: string;
        export { description_12 as description };
        let longDescription_1: string;
        export { longDescription_1 as longDescription };
        let example_12: string;
        export { example_12 as example };
        let notes_4: string;
        export { notes_4 as notes };
    }
    namespace messageParameters {
        let description_13: string;
        export { description_13 as description };
        let longDescription_2: string;
        export { longDescription_2 as longDescription };
        let example_13: string;
        export { example_13 as example };
        let notes_5: string;
        export { notes_5 as notes };
    }
    namespace spawnParameters {
        let description_14: string;
        export { description_14 as description };
        let longDescription_3: string;
        export { longDescription_3 as longDescription };
        let example_14: string;
        export { example_14 as example };
        let notes_6: string;
        export { notes_6 as notes };
    }
    namespace variableScopes {
        let description_15: string;
        export { description_15 as description };
        let longDescription_4: string;
        export { longDescription_4 as longDescription };
        let example_15: string;
        export { example_15 as example };
        let notes_7: string;
        export { notes_7 as notes };
    }
}
export namespace EVENTS {
    namespace onEnter {
        let description_16: string;
        export { description_16 as description };
        let longDescription_5: string;
        export { longDescription_5 as longDescription };
        export let validFor: string[];
        let example_16: string;
        export { example_16 as example };
        let notes_8: string;
        export { notes_8 as notes };
    }
    namespace onExit {
        let description_17: string;
        export { description_17 as description };
        let longDescription_6: string;
        export { longDescription_6 as longDescription };
        let validFor_1: string[];
        export { validFor_1 as validFor };
        let example_17: string;
        export { example_17 as example };
        let notes_9: string;
        export { notes_9 as notes };
    }
    namespace onClick {
        let description_18: string;
        export { description_18 as description };
        let longDescription_7: string;
        export { longDescription_7 as longDescription };
        let validFor_2: string[];
        export { validFor_2 as validFor };
        let example_18: string;
        export { example_18 as example };
        let notes_10: string;
        export { notes_10 as notes };
    }
    namespace onKeyDown {
        let description_19: string;
        export { description_19 as description };
        let longDescription_8: string;
        export { longDescription_8 as longDescription };
        let validFor_3: string[];
        export { validFor_3 as validFor };
        let example_19: string;
        export { example_19 as example };
        export let parameters: {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        }[];
        let notes_11: string;
        export { notes_11 as notes };
    }
    namespace onKeyUp {
        let description_20: string;
        export { description_20 as description };
        let longDescription_9: string;
        export { longDescription_9 as longDescription };
        let validFor_4: string[];
        export { validFor_4 as validFor };
        let example_20: string;
        export { example_20 as example };
        let parameters_1: {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        }[];
        export { parameters_1 as parameters };
        let notes_12: string;
        export { notes_12 as notes };
    }
    namespace onMessage {
        let description_21: string;
        export { description_21 as description };
        let longDescription_10: string;
        export { longDescription_10 as longDescription };
        let validFor_5: string[];
        export { validFor_5 as validFor };
        let example_21: string;
        export { example_21 as example };
        let parameters_2: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_2 as parameters };
        let notes_13: string;
        export { notes_13 as notes };
    }
    namespace onMessageFrom {
        let description_22: string;
        export { description_22 as description };
        let longDescription_11: string;
        export { longDescription_11 as longDescription };
        let validFor_6: string[];
        export { validFor_6 as validFor };
        let example_22: string;
        export { example_22 as example };
        let parameters_3: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_3 as parameters };
        let notes_14: string;
        export { notes_14 as notes };
    }
    namespace onOverlap {
        let description_23: string;
        export { description_23 as description };
        let longDescription_12: string;
        export { longDescription_12 as longDescription };
        let validFor_7: string[];
        export { validFor_7 as validFor };
        let example_23: string;
        export { example_23 as example };
        let notes_15: string;
        export { notes_15 as notes };
    }
    namespace onOverlapEnd {
        let description_24: string;
        export { description_24 as description };
        let longDescription_13: string;
        export { longDescription_13 as longDescription };
        let validFor_8: string[];
        export { validFor_8 as validFor };
        let example_24: string;
        export { example_24 as example };
        let notes_16: string;
        export { notes_16 as notes };
    }
    namespace onCollide {
        let description_25: string;
        export { description_25 as description };
        let longDescription_14: string;
        export { longDescription_14 as longDescription };
        let validFor_9: string[];
        export { validFor_9 as validFor };
        let example_25: string;
        export { example_25 as example };
        let notes_17: string;
        export { notes_17 as notes };
    }
    namespace onBreak {
        let description_26: string;
        export { description_26 as description };
        let longDescription_15: string;
        export { longDescription_15 as longDescription };
        let validFor_10: string[];
        export { validFor_10 as validFor };
        let example_26: string;
        export { example_26 as example };
        let notes_18: string;
        export { notes_18 as notes };
    }
    namespace onHover {
        let description_27: string;
        export { description_27 as description };
        let longDescription_16: string;
        export { longDescription_16 as longDescription };
        let validFor_11: string[];
        export { validFor_11 as validFor };
        let example_27: string;
        export { example_27 as example };
        let notes_19: string;
        export { notes_19 as notes };
    }
    namespace onHoverEnd {
        let description_28: string;
        export { description_28 as description };
        let longDescription_17: string;
        export { longDescription_17 as longDescription };
        let validFor_12: string[];
        export { validFor_12 as validFor };
        let example_28: string;
        export { example_28 as example };
        let notes_20: string;
        export { notes_20 as notes };
    }
    namespace onDragStart {
        let description_29: string;
        export { description_29 as description };
        let longDescription_18: string;
        export { longDescription_18 as longDescription };
        let validFor_13: string[];
        export { validFor_13 as validFor };
        let example_29: string;
        export { example_29 as example };
        let notes_21: string;
        export { notes_21 as notes };
    }
    namespace onDrag {
        let description_30: string;
        export { description_30 as description };
        let longDescription_19: string;
        export { longDescription_19 as longDescription };
        let validFor_14: string[];
        export { validFor_14 as validFor };
        let example_30: string;
        export { example_30 as example };
        let notes_22: string;
        export { notes_22 as notes };
    }
    namespace onDragEnd {
        let description_31: string;
        export { description_31 as description };
        let longDescription_20: string;
        export { longDescription_20 as longDescription };
        let validFor_15: string[];
        export { validFor_15 as validFor };
        let example_31: string;
        export { example_31 as example };
        let notes_23: string;
        export { notes_23 as notes };
    }
    namespace onMove {
        let description_32: string;
        export { description_32 as description };
        let longDescription_21: string;
        export { longDescription_21 as longDescription };
        let validFor_16: string[];
        export { validFor_16 as validFor };
        let example_32: string;
        export { example_32 as example };
        let notes_24: string;
        export { notes_24 as notes };
        let parameters_4: {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        }[];
        export { parameters_4 as parameters };
    }
    namespace onRotate {
        let description_33: string;
        export { description_33 as description };
        let longDescription_22: string;
        export { longDescription_22 as longDescription };
        let validFor_17: string[];
        export { validFor_17 as validFor };
        let example_33: string;
        export { example_33 as example };
        let notes_25: string;
        export { notes_25 as notes };
        let parameters_5: {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        }[];
        export { parameters_5 as parameters };
    }
    namespace onStop {
        let description_34: string;
        export { description_34 as description };
        let longDescription_23: string;
        export { longDescription_23 as longDescription };
        let validFor_18: string[];
        export { validFor_18 as validFor };
        let example_34: string;
        export { example_34 as example };
        let notes_26: string;
        export { notes_26 as notes };
    }
    namespace onStopRotate {
        let description_35: string;
        export { description_35 as description };
        let longDescription_24: string;
        export { longDescription_24 as longDescription };
        let validFor_19: string[];
        export { validFor_19 as validFor };
        let example_35: string;
        export { example_35 as example };
        let notes_27: string;
        export { notes_27 as notes };
    }
    namespace onTick {
        let description_36: string;
        export { description_36 as description };
        let longDescription_25: string;
        export { longDescription_25 as longDescription };
        let validFor_20: string[];
        export { validFor_20 as validFor };
        let example_36: string;
        export { example_36 as example };
        let notes_28: string;
        export { notes_28 as notes };
    }
    namespace onJump {
        let description_37: string;
        export { description_37 as description };
        let longDescription_26: string;
        export { longDescription_26 as longDescription };
        let validFor_21: string[];
        export { validFor_21 as validFor };
        let example_37: string;
        export { example_37 as example };
        let notes_29: string;
        export { notes_29 as notes };
    }
    namespace onLanding {
        let description_38: string;
        export { description_38 as description };
        let longDescription_27: string;
        export { longDescription_27 as longDescription };
        let validFor_22: string[];
        export { validFor_22 as validFor };
        let example_38: string;
        export { example_38 as example };
        let notes_30: string;
        export { notes_30 as notes };
    }
    namespace onSpawn {
        let description_39: string;
        export { description_39 as description };
        let longDescription_28: string;
        export { longDescription_28 as longDescription };
        let validFor_23: string[];
        export { validFor_23 as validFor };
        let example_39: string;
        export { example_39 as example };
        let parameters_6: {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        }[];
        export { parameters_6 as parameters };
        let notes_31: string;
        export { notes_31 as notes };
    }
    namespace onDestroy {
        let description_40: string;
        export { description_40 as description };
        let longDescription_29: string;
        export { longDescription_29 as longDescription };
        let validFor_24: string[];
        export { validFor_24 as validFor };
        let example_40: string;
        export { example_40 as example };
        let notes_32: string;
        export { notes_32 as notes };
    }
    namespace onSubmit {
        let description_41: string;
        export { description_41 as description };
        let longDescription_30: string;
        export { longDescription_30 as longDescription };
        let validFor_25: string[];
        export { validFor_25 as validFor };
        let example_41: string;
        export { example_41 as example };
        let notes_33: string;
        export { notes_33 as notes };
    }
    namespace onDefocus {
        let description_42: string;
        export { description_42 as description };
        let longDescription_31: string;
        export { longDescription_31 as longDescription };
        let validFor_26: string[];
        export { validFor_26 as validFor };
        let example_42: string;
        export { example_42 as example };
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
        let description_43: string;
        export { description_43 as description };
        let longDescription_32: string;
        export { longDescription_32 as longDescription };
        let example_43: string;
        export { example_43 as example };
        let parameters_7: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_7 as parameters };
        export let returns: string;
    }
    namespace hasSave {
        let description_44: string;
        export { description_44 as description };
        let longDescription_33: string;
        export { longDescription_33 as longDescription };
        let example_44: string;
        export { example_44 as example };
        let parameters_8: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_8 as parameters };
        let returns_1: string;
        export { returns_1 as returns };
    }
    namespace visits {
        let description_45: string;
        export { description_45 as description };
        let longDescription_34: string;
        export { longDescription_34 as longDescription };
        let example_45: string;
        export { example_45 as example };
        let parameters_9: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_9 as parameters };
        let returns_2: string;
        export { returns_2 as returns };
    }
    namespace hasObject {
        let description_46: string;
        export { description_46 as description };
        let longDescription_35: string;
        export { longDescription_35 as longDescription };
        let example_46: string;
        export { example_46 as example };
        let parameters_10: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_10 as parameters };
        let returns_3: string;
        export { returns_3 as returns };
    }
    namespace get {
        let description_47: string;
        export { description_47 as description };
        let longDescription_36: string;
        export { longDescription_36 as longDescription };
        let example_47: string;
        export { example_47 as example };
        let parameters_11: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_11 as parameters };
        let returns_4: string;
        export { returns_4 as returns };
    }
    namespace random {
        let description_48: string;
        export { description_48 as description };
        let longDescription_37: string;
        export { longDescription_37 as longDescription };
        let example_48: string;
        export { example_48 as example };
        let parameters_12: {
            name: string;
            type: string;
            description: string;
            optional: boolean;
        }[];
        export { parameters_12 as parameters };
        let returns_5: string;
        export { returns_5 as returns };
    }
    namespace floor {
        let description_49: string;
        export { description_49 as description };
        let longDescription_38: string;
        export { longDescription_38 as longDescription };
        let example_49: string;
        export { example_49 as example };
        let parameters_13: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_13 as parameters };
        let returns_6: string;
        export { returns_6 as returns };
    }
    namespace ceil {
        let description_50: string;
        export { description_50 as description };
        let longDescription_39: string;
        export { longDescription_39 as longDescription };
        let example_50: string;
        export { example_50 as example };
        let parameters_14: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_14 as parameters };
        let returns_7: string;
        export { returns_7 as returns };
    }
    namespace round {
        let description_51: string;
        export { description_51 as description };
        let longDescription_40: string;
        export { longDescription_40 as longDescription };
        let example_51: string;
        export { example_51 as example };
        let parameters_15: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_15 as parameters };
        let returns_8: string;
        export { returns_8 as returns };
    }
    namespace abs {
        let description_52: string;
        export { description_52 as description };
        let longDescription_41: string;
        export { longDescription_41 as longDescription };
        let example_52: string;
        export { example_52 as example };
        let parameters_16: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_16 as parameters };
        let returns_9: string;
        export { returns_9 as returns };
    }
    namespace min {
        let description_53: string;
        export { description_53 as description };
        let longDescription_42: string;
        export { longDescription_42 as longDescription };
        let example_53: string;
        export { example_53 as example };
        let parameters_17: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_17 as parameters };
        let returns_10: string;
        export { returns_10 as returns };
    }
    namespace max {
        let description_54: string;
        export { description_54 as description };
        let longDescription_43: string;
        export { longDescription_43 as longDescription };
        let example_54: string;
        export { example_54 as example };
        let parameters_18: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_18 as parameters };
        let returns_11: string;
        export { returns_11 as returns };
    }
    namespace sin {
        let description_55: string;
        export { description_55 as description };
        let longDescription_44: string;
        export { longDescription_44 as longDescription };
        let example_55: string;
        export { example_55 as example };
        let parameters_19: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_19 as parameters };
        let returns_12: string;
        export { returns_12 as returns };
    }
    namespace cos {
        let description_56: string;
        export { description_56 as description };
        let longDescription_45: string;
        export { longDescription_45 as longDescription };
        let example_56: string;
        export { example_56 as example };
        let parameters_20: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_20 as parameters };
        let returns_13: string;
        export { returns_13 as returns };
    }
    namespace atan2 {
        let description_57: string;
        export { description_57 as description };
        let longDescription_46: string;
        export { longDescription_46 as longDescription };
        let example_57: string;
        export { example_57 as example };
        let parameters_21: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_21 as parameters };
        let returns_14: string;
        export { returns_14 as returns };
    }
    namespace cardinal {
        let description_58: string;
        export { description_58 as description };
        let longDescription_47: string;
        export { longDescription_47 as longDescription };
        let example_58: string;
        export { example_58 as example };
        let parameters_22: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_22 as parameters };
        let returns_15: string;
        export { returns_15 as returns };
    }
    namespace length {
        let description_59: string;
        export { description_59 as description };
        let longDescription_48: string;
        export { longDescription_48 as longDescription };
        let example_59: string;
        export { example_59 as example };
        let parameters_23: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_23 as parameters };
        let returns_16: string;
        export { returns_16 as returns };
    }
    namespace range {
        let description_60: string;
        export { description_60 as description };
        let longDescription_49: string;
        export { longDescription_49 as longDescription };
        let example_60: string;
        export { example_60 as example };
        let parameters_24: ({
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
        export { parameters_24 as parameters };
        let returns_17: string;
        export { returns_17 as returns };
    }
    namespace shuffle {
        let description_61: string;
        export { description_61 as description };
        let longDescription_50: string;
        export { longDescription_50 as longDescription };
        let example_61: string;
        export { example_61 as example };
        let parameters_25: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_25 as parameters };
        let returns_18: string;
        export { returns_18 as returns };
    }
    namespace pick {
        let description_62: string;
        export { description_62 as description };
        let longDescription_51: string;
        export { longDescription_51 as longDescription };
        let example_62: string;
        export { example_62 as example };
        let parameters_26: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_26 as parameters };
        let returns_19: string;
        export { returns_19 as returns };
    }
    namespace isEmpty {
        let description_63: string;
        export { description_63 as description };
        let longDescription_52: string;
        export { longDescription_52 as longDescription };
        let example_63: string;
        export { example_63 as example };
        let parameters_27: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_27 as parameters };
        let returns_20: string;
        export { returns_20 as returns };
    }
    namespace emptyCells {
        let description_64: string;
        export { description_64 as description };
        let longDescription_53: string;
        export { longDescription_53 as longDescription };
        let example_64: string;
        export { example_64 as example };
        let parameters_28: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_28 as parameters };
        let returns_21: string;
        export { returns_21 as returns };
    }
    namespace cellsWhere {
        let description_65: string;
        export { description_65 as description };
        let longDescription_54: string;
        export { longDescription_54 as longDescription };
        let example_65: string;
        export { example_65 as example };
        let parameters_29: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_29 as parameters };
        let returns_22: string;
        export { returns_22 as returns };
        let notes_35: string;
        export { notes_35 as notes };
    }
    namespace floodfill {
        let description_66: string;
        export { description_66 as description };
        let longDescription_55: string;
        export { longDescription_55 as longDescription };
        let example_66: string;
        export { example_66 as example };
        let parameters_30: ({
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
        export { parameters_30 as parameters };
        let returns_23: string;
        export { returns_23 as returns };
        let notes_36: string;
        export { notes_36 as notes };
    }
    namespace minimax {
        let description_67: string;
        export { description_67 as description };
        let longDescription_56: string;
        export { longDescription_56 as longDescription };
        let example_67: string;
        export { example_67 as example };
        let parameters_31: ({
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
        export { parameters_31 as parameters };
        let returns_24: string;
        export { returns_24 as returns };
        let notes_37: string;
        export { notes_37 as notes };
    }
    namespace hash {
        let description_68: string;
        export { description_68 as description };
        let longDescription_57: string;
        export { longDescription_57 as longDescription };
        let example_68: string;
        export { example_68 as example };
        let parameters_32: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_32 as parameters };
        let returns_25: string;
        export { returns_25 as returns };
        let notes_38: string;
        export { notes_38 as notes };
    }
    namespace distance {
        let description_69: string;
        export { description_69 as description };
        let longDescription_58: string;
        export { longDescription_58 as longDescription };
        let example_69: string;
        export { example_69 as example };
        let parameters_33: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_33 as parameters };
        let returns_26: string;
        export { returns_26 as returns };
    }
    namespace nearby {
        let description_70: string;
        export { description_70 as description };
        let longDescription_59: string;
        export { longDescription_59 as longDescription };
        let example_70: string;
        export { example_70 as example };
        let parameters_34: ({
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
        export { parameters_34 as parameters };
        let returns_27: string;
        export { returns_27 as returns };
        let notes_39: string;
        export { notes_39 as notes };
    }
    namespace nearest {
        let description_71: string;
        export { description_71 as description };
        let longDescription_60: string;
        export { longDescription_60 as longDescription };
        let example_71: string;
        export { example_71 as example };
        let parameters_35: ({
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
        export { parameters_35 as parameters };
        let returns_28: string;
        export { returns_28 as returns };
        let notes_40: string;
        export { notes_40 as notes };
    }
    namespace intersects {
        let description_72: string;
        export { description_72 as description };
        let longDescription_61: string;
        export { longDescription_61 as longDescription };
        let example_72: string;
        export { example_72 as example };
        let parameters_36: {
            name: string;
            type: string;
            description: string;
        }[];
        export { parameters_36 as parameters };
        let returns_29: string;
        export { returns_29 as returns };
        let notes_41: string;
        export { notes_41 as notes };
    }
    namespace canSee {
        let description_73: string;
        export { description_73 as description };
        let longDescription_62: string;
        export { longDescription_62 as longDescription };
        let example_73: string;
        export { example_73 as example };
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
        let returns_30: string;
        export { returns_30 as returns };
        let notes_42: string;
        export { notes_42 as notes };
    }
    namespace pathfind {
        let description_74: string;
        export { description_74 as description };
        let longDescription_63: string;
        export { longDescription_63 as longDescription };
        let example_74: string;
        export { example_74 as example };
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
        let returns_31: string;
        export { returns_31 as returns };
        let notes_43: string;
        export { notes_43 as notes };
    }
    namespace generateMaze {
        let description_75: string;
        export { description_75 as description };
        let longDescription_64: string;
        export { longDescription_64 as longDescription };
        let example_75: string;
        export { example_75 as example };
        let parameters_39: ({
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
        export { parameters_39 as parameters };
        let returns_32: string;
        export { returns_32 as returns };
        let notes_44: string;
        export { notes_44 as notes };
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
export namespace SCRIPTABLE_PROPERTIES {
    export namespace x {
        let description_76: string;
        export { description_76 as description };
        let type_11: string;
        export { type_11 as type };
        let example_76: string;
        export { example_76 as example };
    }
    export namespace y {
        let description_77: string;
        export { description_77 as description };
        let type_12: string;
        export { type_12 as type };
        let example_77: string;
        export { example_77 as example };
    }
    export namespace width_1 {
        let description_78: string;
        export { description_78 as description };
        let type_13: string;
        export { type_13 as type };
        let example_78: string;
        export { example_78 as example };
    }
    export { width_1 as width };
    export namespace height_1 {
        let description_79: string;
        export { description_79 as description };
        let type_14: string;
        export { type_14 as type };
        let example_79: string;
        export { example_79 as example };
    }
    export { height_1 as height };
    export namespace lineX1 {
        let description_80: string;
        export { description_80 as description };
        let type_15: string;
        export { type_15 as type };
        let example_80: string;
        export { example_80 as example };
    }
    export namespace lineY1 {
        let description_81: string;
        export { description_81 as description };
        let type_16: string;
        export { type_16 as type };
        let example_81: string;
        export { example_81 as example };
    }
    export namespace lineX2 {
        let description_82: string;
        export { description_82 as description };
        let type_17: string;
        export { type_17 as type };
        let example_82: string;
        export { example_82 as example };
    }
    export namespace lineY2 {
        let description_83: string;
        export { description_83 as description };
        let type_18: string;
        export { type_18 as type };
        let example_83: string;
        export { example_83 as example };
    }
    export namespace lineStartMarker {
        let description_84: string;
        export { description_84 as description };
        let type_19: string;
        export { type_19 as type };
        let example_84: string;
        export { example_84 as example };
    }
    export namespace lineEndMarker {
        let description_85: string;
        export { description_85 as description };
        let type_20: string;
        export { type_20 as type };
        let example_85: string;
        export { example_85 as example };
    }
    export namespace lineCap {
        let description_86: string;
        export { description_86 as description };
        let type_21: string;
        export { type_21 as type };
        let example_86: string;
        export { example_86 as example };
    }
    export namespace visible {
        let description_87: string;
        export { description_87 as description };
        let type_22: string;
        export { type_22 as type };
        let example_87: string;
        export { example_87 as example };
    }
    export namespace opacity {
        let description_88: string;
        export { description_88 as description };
        let type_23: string;
        export { type_23 as type };
        let example_88: string;
        export { example_88 as example };
    }
    export namespace blendMode {
        let description_89: string;
        export { description_89 as description };
        let type_24: string;
        export { type_24 as type };
        let example_89: string;
        export { example_89 as example };
    }
    export namespace strokeColor {
        let description_90: string;
        export { description_90 as description };
        let type_25: string;
        export { type_25 as type };
        let example_90: string;
        export { example_90 as example };
    }
    export namespace strokeWidth {
        let description_91: string;
        export { description_91 as description };
        let type_26: string;
        export { type_26 as type };
        let example_91: string;
        export { example_91 as example };
    }
    export namespace content {
        let description_92: string;
        export { description_92 as description };
        let type_27: string;
        export { type_27 as type };
        let example_92: string;
        export { example_92 as example };
    }
    export namespace textColor {
        let description_93: string;
        export { description_93 as description };
        let type_28: string;
        export { type_28 as type };
        let example_93: string;
        export { example_93 as example };
    }
    export namespace fontSize {
        let description_94: string;
        export { description_94 as description };
        let type_29: string;
        export { type_29 as type };
        let example_94: string;
        export { example_94 as example };
    }
    export namespace editable {
        let description_95: string;
        export { description_95 as description };
        let type_30: string;
        export { type_30 as type };
        let example_95: string;
        export { example_95 as example };
    }
    export namespace lineHeight {
        let description_96: string;
        export { description_96 as description };
        let type_31: string;
        export { type_31 as type };
        let example_96: string;
        export { example_96 as example };
    }
    export namespace verticalAlign {
        let description_97: string;
        export { description_97 as description };
        let type_32: string;
        export { type_32 as type };
        let example_97: string;
        export { example_97 as example };
        let notes_45: string;
        export { notes_45 as notes };
    }
    export namespace cornerRadius {
        let description_98: string;
        export { description_98 as description };
        let type_33: string;
        export { type_33 as type };
        let example_98: string;
        export { example_98 as example };
    }
    export namespace shadowX {
        let description_99: string;
        export { description_99 as description };
        let type_34: string;
        export { type_34 as type };
        let example_99: string;
        export { example_99 as example };
    }
    export namespace shadowY {
        let description_100: string;
        export { description_100 as description };
        let type_35: string;
        export { type_35 as type };
        let example_100: string;
        export { example_100 as example };
    }
    export namespace shadowBlur {
        let description_101: string;
        export { description_101 as description };
        let type_36: string;
        export { type_36 as type };
        let example_101: string;
        export { example_101 as example };
    }
    export namespace shadowColor {
        let description_102: string;
        export { description_102 as description };
        let type_37: string;
        export { type_37 as type };
        let example_102: string;
        export { example_102 as example };
    }
    export namespace glowBlur {
        let description_103: string;
        export { description_103 as description };
        let type_38: string;
        export { type_38 as type };
        let example_103: string;
        export { example_103 as example };
    }
    export namespace glowColor {
        let description_104: string;
        export { description_104 as description };
        let type_39: string;
        export { type_39 as type };
        let example_104: string;
        export { example_104 as example };
    }
    export namespace glowIntensity {
        let description_105: string;
        export { description_105 as description };
        let type_40: string;
        export { type_40 as type };
        let example_105: string;
        export { example_105 as example };
    }
    export namespace trail {
        let description_106: string;
        export { description_106 as description };
        let type_41: string;
        export { type_41 as type };
        let example_106: string;
        export { example_106 as example };
    }
    export namespace trailLength {
        let description_107: string;
        export { description_107 as description };
        let type_42: string;
        export { type_42 as type };
        let example_107: string;
        export { example_107 as example };
    }
    export namespace trailOpacity {
        let description_108: string;
        export { description_108 as description };
        let type_43: string;
        export { type_43 as type };
        let example_108: string;
        export { example_108 as example };
    }
    export namespace trailColor {
        let description_109: string;
        export { description_109 as description };
        let type_44: string;
        export { type_44 as type };
        let example_109: string;
        export { example_109 as example };
    }
    export namespace trailScale {
        let description_110: string;
        export { description_110 as description };
        let type_45: string;
        export { type_45 as type };
        let example_110: string;
        export { example_110 as example };
    }
    export namespace trailSpacing {
        let description_111: string;
        export { description_111 as description };
        let type_46: string;
        export { type_46 as type };
        let example_111: string;
        export { example_111 as example };
    }
    export namespace zIndex {
        let description_112: string;
        export { description_112 as description };
        let type_47: string;
        export { type_47 as type };
        let example_112: string;
        export { example_112 as example };
    }
    export namespace rotation {
        let description_113: string;
        export { description_113 as description };
        let type_48: string;
        export { type_48 as type };
        let example_113: string;
        export { example_113 as example };
    }
    export namespace flipX {
        let description_114: string;
        export { description_114 as description };
        let type_49: string;
        export { type_49 as type };
        let example_114: string;
        export { example_114 as example };
    }
    export namespace flipY {
        let description_115: string;
        export { description_115 as description };
        let type_50: string;
        export { type_50 as type };
        let example_115: string;
        export { example_115 as example };
    }
    export namespace state {
        let description_116: string;
        export { description_116 as description };
        let type_51: string;
        export { type_51 as type };
        let example_116: string;
        export { example_116 as example };
    }
    export namespace rotatable {
        let description_117: string;
        export { description_117 as description };
        let type_52: string;
        export { type_52 as type };
        let example_117: string;
        export { example_117 as example };
    }
    export namespace cellX {
        let description_118: string;
        export { description_118 as description };
        let type_53: string;
        export { type_53 as type };
        let example_118: string;
        export { example_118 as example };
        export let readonly: boolean;
    }
    export namespace cellY {
        let description_119: string;
        export { description_119 as description };
        let type_54: string;
        export { type_54 as type };
        let example_119: string;
        export { example_119 as example };
        let readonly_1: boolean;
        export { readonly_1 as readonly };
    }
    export namespace moving {
        let description_120: string;
        export { description_120 as description };
        let type_55: string;
        export { type_55 as type };
        let example_120: string;
        export { example_120 as example };
        let readonly_2: boolean;
        export { readonly_2 as readonly };
    }
    export namespace direction {
        let description_121: string;
        export { description_121 as description };
        let type_56: string;
        export { type_56 as type };
        let example_121: string;
        export { example_121 as example };
        let readonly_3: boolean;
        export { readonly_3 as readonly };
        let notes_46: string;
        export { notes_46 as notes };
    }
    export namespace velocityX {
        let description_122: string;
        export { description_122 as description };
        let type_57: string;
        export { type_57 as type };
        let example_122: string;
        export { example_122 as example };
        let readonly_4: boolean;
        export { readonly_4 as readonly };
    }
    export namespace velocityY {
        let description_123: string;
        export { description_123 as description };
        let type_58: string;
        export { type_58 as type };
        let example_123: string;
        export { example_123 as example };
        let readonly_5: boolean;
        export { readonly_5 as readonly };
    }
    export namespace angularVelocity {
        let description_124: string;
        export { description_124 as description };
        let type_59: string;
        export { type_59 as type };
        let example_124: string;
        export { example_124 as example };
        let readonly_6: boolean;
        export { readonly_6 as readonly };
        let notes_47: string;
        export { notes_47 as notes };
    }
    export namespace moveAngle {
        let description_125: string;
        export { description_125 as description };
        let type_60: string;
        export { type_60 as type };
        let example_125: string;
        export { example_125 as example };
        let readonly_7: boolean;
        export { readonly_7 as readonly };
        let notes_48: string;
        export { notes_48 as notes };
    }
    export namespace moveSpeed {
        let description_126: string;
        export { description_126 as description };
        let type_61: string;
        export { type_61 as type };
        let example_126: string;
        export { example_126 as example };
        let readonly_8: boolean;
        export { readonly_8 as readonly };
    }
    export namespace spriteFrame {
        let description_127: string;
        export { description_127 as description };
        let type_62: string;
        export { type_62 as type };
        let example_127: string;
        export { example_127 as example };
        let notes_49: string;
        export { notes_49 as notes };
    }
    export namespace tags {
        let description_128: string;
        export { description_128 as description };
        let type_63: string;
        export { type_63 as type };
        let example_128: string;
        export { example_128 as example };
    }
    export namespace perspectiveX {
        let description_129: string;
        export { description_129 as description };
        let type_64: string;
        export { type_64 as type };
        let example_129: string;
        export { example_129 as example };
    }
    export namespace perspectiveY {
        let description_130: string;
        export { description_130 as description };
        let type_65: string;
        export { type_65 as type };
        let example_130: string;
        export { example_130 as example };
    }
    export namespace gravityScale {
        let description_131: string;
        export { description_131 as description };
        let type_66: string;
        export { type_66 as type };
        let example_131: string;
        export { example_131 as example };
    }
    export namespace windScale {
        let description_132: string;
        export { description_132 as description };
        let type_67: string;
        export { type_67 as type };
        let example_132: string;
        export { example_132 as example };
    }
    export namespace dragScale {
        let description_133: string;
        export { description_133 as description };
        let type_68: string;
        export { type_68 as type };
        let example_133: string;
        export { example_133 as example };
    }
    export namespace timeScale_1 {
        let description_134: string;
        export { description_134 as description };
        let type_69: string;
        export { type_69 as type };
        let example_134: string;
        export { example_134 as example };
    }
    export { timeScale_1 as timeScale };
    export namespace revealer {
        let description_135: string;
        export { description_135 as description };
        let type_70: string;
        export { type_70 as type };
        let example_135: string;
        export { example_135 as example };
    }
    export namespace revealerRadius {
        let description_136: string;
        export { description_136 as description };
        let type_71: string;
        export { type_71 as type };
        let example_136: string;
        export { example_136 as example };
    }
    export namespace revealerFade {
        let description_137: string;
        export { description_137 as description };
        let type_72: string;
        export { type_72 as type };
        let example_137: string;
        export { example_137 as example };
    }
    export namespace revealerNoise {
        let description_138: string;
        export { description_138 as description };
        let type_73: string;
        export { type_73 as type };
        let example_138: string;
        export { example_138 as example };
    }
    export namespace revealerShape {
        let description_139: string;
        export { description_139 as description };
        let type_74: string;
        export { type_74 as type };
        let example_139: string;
        export { example_139 as example };
    }
    export namespace revealerRehide {
        let description_140: string;
        export { description_140 as description };
        let type_75: string;
        export { type_75 as type };
        let example_140: string;
        export { example_140 as example };
    }
    export namespace revealerRehideSpeed {
        let description_141: string;
        export { description_141 as description };
        let type_76: string;
        export { type_76 as type };
        let example_141: string;
        export { example_141 as example };
    }
    export namespace revealerRehideGrowth {
        let description_142: string;
        export { description_142 as description };
        let type_77: string;
        export { type_77 as type };
        let example_142: string;
        export { example_142 as example };
    }
    export namespace revealerRehideRate {
        let description_143: string;
        export { description_143 as description };
        let type_78: string;
        export { type_78 as type };
        let example_143: string;
        export { example_143 as example };
    }
    export namespace revealerRehideStopThreshold {
        let description_144: string;
        export { description_144 as description };
        let type_79: string;
        export { type_79 as type };
        let example_144: string;
        export { example_144 as example };
    }
    export namespace pegType {
        let description_145: string;
        export { description_145 as description };
        let type_80: string;
        export { type_80 as type };
        let example_145: string;
        export { example_145 as example };
    }
    export namespace pegDamping {
        let description_146: string;
        export { description_146 as description };
        let type_81: string;
        export { type_81 as type };
        let example_146: string;
        export { example_146 as example };
    }
    export namespace pegBreakForce {
        let description_147: string;
        export { description_147 as description };
        let type_82: string;
        export { type_82 as type };
        let example_147: string;
        export { example_147 as example };
    }
    export namespace springStiffness {
        let description_148: string;
        export { description_148 as description };
        let type_83: string;
        export { type_83 as type };
        let example_148: string;
        export { example_148 as example };
    }
    export namespace springDamping {
        let description_149: string;
        export { description_149 as description };
        let type_84: string;
        export { type_84 as type };
        let example_149: string;
        export { example_149 as example };
    }
    export namespace springBreakForce {
        let description_150: string;
        export { description_150 as description };
        let type_85: string;
        export { type_85 as type };
        let example_150: string;
        export { example_150 as example };
    }
    export namespace startMarker {
        let description_151: string;
        export { description_151 as description };
        let type_86: string;
        export { type_86 as type };
        let example_151: string;
        export { example_151 as example };
    }
    export namespace duration {
        let description_152: string;
        export { description_152 as description };
        let type_87: string;
        export { type_87 as type };
        let example_152: string;
        export { example_152 as example };
    }
    export namespace buffered {
        let description_153: string;
        export { description_153 as description };
        let type_88: string;
        export { type_88 as type };
        let example_153: string;
        export { example_153 as example };
    }
    export namespace spatial {
        let description_154: string;
        export { description_154 as description };
        let type_89: string;
        export { type_89 as type };
        let example_154: string;
        export { example_154 as example };
    }
    export namespace spatialRange {
        let description_155: string;
        export { description_155 as description };
        let type_90: string;
        export { type_90 as type };
        let example_155: string;
        export { example_155 as example };
    }
    export namespace emitterShape {
        let description_156: string;
        export { description_156 as description };
        let type_91: string;
        export { type_91 as type };
        let example_156: string;
        export { example_156 as example };
    }
    export namespace emitterSizeMode {
        let description_157: string;
        export { description_157 as description };
        let type_92: string;
        export { type_92 as type };
        let example_157: string;
        export { example_157 as example };
    }
    export namespace emitterRate {
        let description_158: string;
        export { description_158 as description };
        let type_93: string;
        export { type_93 as type };
        let example_158: string;
        export { example_158 as example };
    }
    export namespace emitterBurst {
        let description_159: string;
        export { description_159 as description };
        let type_94: string;
        export { type_94 as type };
        let example_159: string;
        export { example_159 as example };
    }
    export namespace particleLifetime {
        let description_160: string;
        export { description_160 as description };
        let type_95: string;
        export { type_95 as type };
        let example_160: string;
        export { example_160 as example };
    }
    export namespace particleSpeedMin {
        let description_161: string;
        export { description_161 as description };
        let type_96: string;
        export { type_96 as type };
        let example_161: string;
        export { example_161 as example };
    }
    export namespace particleSpeedMax {
        let description_162: string;
        export { description_162 as description };
        let type_97: string;
        export { type_97 as type };
        let example_162: string;
        export { example_162 as example };
    }
    export namespace particleSpread {
        let description_163: string;
        export { description_163 as description };
        let type_98: string;
        export { type_98 as type };
        let example_163: string;
        export { example_163 as example };
    }
    export namespace particleShape {
        let description_164: string;
        export { description_164 as description };
        let type_99: string;
        export { type_99 as type };
        let example_164: string;
        export { example_164 as example };
    }
    export namespace particleTrailLength {
        let description_165: string;
        export { description_165 as description };
        let type_100: string;
        export { type_100 as type };
        let example_165: string;
        export { example_165 as example };
    }
    export namespace particleSizeStart {
        let description_166: string;
        export { description_166 as description };
        let type_101: string;
        export { type_101 as type };
        let example_166: string;
        export { example_166 as example };
    }
    export namespace particleSizeEnd {
        let description_167: string;
        export { description_167 as description };
        let type_102: string;
        export { type_102 as type };
        let example_167: string;
        export { example_167 as example };
    }
    export namespace particleOpacityStart {
        let description_168: string;
        export { description_168 as description };
        let type_103: string;
        export { type_103 as type };
        let example_168: string;
        export { example_168 as example };
    }
    export namespace particleOpacityEnd {
        let description_169: string;
        export { description_169 as description };
        let type_104: string;
        export { type_104 as type };
        let example_169: string;
        export { example_169 as example };
    }
    export namespace particleColorA {
        let description_170: string;
        export { description_170 as description };
        let type_105: string;
        export { type_105 as type };
        let example_170: string;
        export { example_170 as example };
    }
    export namespace particleColorB {
        let description_171: string;
        export { description_171 as description };
        let type_106: string;
        export { type_106 as type };
        let example_171: string;
        export { example_171 as example };
    }
    export namespace particleColorEnd {
        let description_172: string;
        export { description_172 as description };
        let type_107: string;
        export { type_107 as type };
        let example_172: string;
        export { example_172 as example };
    }
    export namespace particleGravityX {
        let description_173: string;
        export { description_173 as description };
        let type_108: string;
        export { type_108 as type };
        let example_173: string;
        export { example_173 as example };
    }
    export namespace particleGravityY {
        let description_174: string;
        export { description_174 as description };
        let type_109: string;
        export { type_109 as type };
        let example_174: string;
        export { example_174 as example };
    }
    export namespace particleDrag {
        let description_175: string;
        export { description_175 as description };
        let type_110: string;
        export { type_110 as type };
        let example_175: string;
        export { example_175 as example };
    }
    export namespace emitterGlow {
        let description_176: string;
        export { description_176 as description };
        let type_111: string;
        export { type_111 as type };
        let example_176: string;
        export { example_176 as example };
    }
    export namespace emitterGlowSize {
        let description_177: string;
        export { description_177 as description };
        let type_112: string;
        export { type_112 as type };
        let example_177: string;
        export { example_177 as example };
    }
    export namespace emitterGlowFlicker {
        let description_178: string;
        export { description_178 as description };
        let type_113: string;
        export { type_113 as type };
        let example_178: string;
        export { example_178 as example };
    }
}
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
};
export namespace VARIABLES {
    export namespace random_1 {
        let description_179: string;
        export { description_179 as description };
        let longDescription_65: string;
        export { longDescription_65 as longDescription };
        let example_179: string;
        export { example_179 as example };
        let type_114: string;
        export { type_114 as type };
    }
    export { random_1 as random };
    export namespace currentCell {
        let description_180: string;
        export { description_180 as description };
        let longDescription_66: string;
        export { longDescription_66 as longDescription };
        let example_180: string;
        export { example_180 as example };
        let type_115: string;
        export { type_115 as type };
    }
    export namespace clicks {
        let description_181: string;
        export { description_181 as description };
        let longDescription_67: string;
        export { longDescription_67 as longDescription };
        let example_181: string;
        export { example_181 as example };
        let type_116: string;
        export { type_116 as type };
    }
    export namespace clickX {
        let description_182: string;
        export { description_182 as description };
        let longDescription_68: string;
        export { longDescription_68 as longDescription };
        let example_182: string;
        export { example_182 as example };
        let type_117: string;
        export { type_117 as type };
    }
    export namespace clickY {
        let description_183: string;
        export { description_183 as description };
        let longDescription_69: string;
        export { longDescription_69 as longDescription };
        let example_183: string;
        export { example_183 as example };
        let type_118: string;
        export { type_118 as type };
    }
    export namespace deltaTime {
        let description_184: string;
        export { description_184 as description };
        let longDescription_70: string;
        export { longDescription_70 as longDescription };
        let example_184: string;
        export { example_184 as example };
        let type_119: string;
        export { type_119 as type };
    }
    export namespace other {
        let description_185: string;
        export { description_185 as description };
        let longDescription_71: string;
        export { longDescription_71 as longDescription };
        let example_185: string;
        export { example_185 as example };
        let type_120: string;
        export { type_120 as type };
    }
    export namespace newGame {
        let description_186: string;
        export { description_186 as description };
        let longDescription_72: string;
        export { longDescription_72 as longDescription };
        let example_186: string;
        export { example_186 as example };
        let type_121: string;
        export { type_121 as type };
    }
    export namespace self {
        let description_187: string;
        export { description_187 as description };
        let longDescription_73: string;
        export { longDescription_73 as longDescription };
        let example_187: string;
        export { example_187 as example };
        let type_122: string;
        export { type_122 as type };
    }
}
export function formatParseErrors(errors: any): any;
export function formatWarnings(warnings: any): any;
export function generateSyntaxReference(): string;
export function generateUserManual(): string;
export function parseEventScript(source: any): {
    events: ({
        event: string;
        key: undefined;
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
