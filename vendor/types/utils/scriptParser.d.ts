import type { Statement } from '../types/script';
import type { EventType } from '../types/scriptRegistry';
export type { EventType } from '../types/scriptRegistry';
export { KEYWORDS } from './script/tokenizer';
export type { Token, TokenType } from './script/tokenizer';
export interface ParseError {
    message: string;
    line: number;
    column: number;
}
export interface ParseResult {
    statements: Statement[];
    errors: ParseError[];
}
export declare function parseScript(source: string): ParseResult;
export declare function formatParseErrors(errors: ParseError[]): string;
export interface EventScript {
    event: EventType;
    key?: string;
    message?: string;
    from?: string;
    direction?: string;
    statements: Statement[];
}
export interface ActionScript {
    name: string;
    statements: Statement[];
}
export interface EventScriptParseResult {
    events: EventScript[];
    actions: ActionScript[];
    errors: ParseError[];
}
/**
 * Parse a script that contains event blocks and action definitions.
 * If no event markers are found, assumes all statements belong to onEnter.
 *
 * Event blocks: onClick:, onEnter:, onExit:, onClick { ... }, etc.
 * Action blocks: action name:, action name { ... }
 */
export declare function parseEventScript(source: string): EventScriptParseResult;
