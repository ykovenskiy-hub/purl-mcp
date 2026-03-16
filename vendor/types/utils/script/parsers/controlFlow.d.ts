import type { Statement, IfStatement, ForeachStatement, RepeatStatement, FirstStatement } from '../../../types/script';
import type { ExpressionParserContext } from './expressions';
export interface ControlFlowParserContext extends ExpressionParserContext {
    skipOptional(type: string): boolean;
    skipNewlines(): void;
    loc(): {
        line: number;
    };
    parseStatement(): Statement | null;
}
export declare function parseBlock(ctx: ControlFlowParserContext, consumeColon?: boolean): Statement[];
export declare function parseIf(ctx: ControlFlowParserContext): IfStatement;
export declare function parseFirst(ctx: ControlFlowParserContext): FirstStatement;
/**
 * Parse foreach statement: foreach VAR in EXPR:
 * Examples:
 *   foreach line in lines:
 *     if all line.state == 1: ...
 *   foreach item in [#a, #b, #c]:
 *     show item
 */
export declare function parseForeach(ctx: ControlFlowParserContext): ForeachStatement;
/**
 * Parse repeat statement: repeat: or repeat N:
 * Examples:
 *   repeat:
 *     spawn "Snowflake" {x: random, y: 0}
 *     wait 100ms
 *   repeat 5:
 *     show Hint
 *     wait 1s
 *     hide Hint
 */
export declare function parseRepeat(ctx: ControlFlowParserContext): RepeatStatement;
