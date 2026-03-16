import type { CellObject } from '../types/object';
import type { EventScript } from './scriptParser';
export interface ValidationWarning {
    message: string;
    line?: number;
}
/**
 * Validate that all references in script statements exist.
 * Returns an array of warning objects with messages and line numbers.
 */
export declare function validateScriptReferences(events: EventScript[], objectNames: string[], cellLabels: string[]): ValidationWarning[];
/**
 * Format warnings for display (with line numbers)
 */
export declare function formatWarnings(warnings: ValidationWarning[]): string[];
/**
 * Validate that events used in a script have their required object properties enabled.
 * Returns warnings for events that won't fire because the object is missing a required property.
 */
export declare function validateEventRequirements(events: EventScript[], currentObject?: CellObject): ValidationWarning[];
