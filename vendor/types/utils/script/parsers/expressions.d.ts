import type { Expression } from '../../../types/script';
import type { Token, TokenType } from '../tokenizer';
export interface ExpressionParserContext {
    peek(): Token;
    peekNext(): Token | null;
    advance(): Token;
    check(type: TokenType, value?: string): boolean;
    isAtEnd(): boolean;
    expect(type: TokenType, value?: string): void;
    error(message: string): void;
    tokens: Token[];
    pos: number;
}
export declare function parseExpression(ctx: ExpressionParserContext): Expression;
/**
 * Parse a unary expression (literal, variable, function call, unary prefix, parenthesized).
 * Does NOT consume binary operators — useful when parsing consecutive positional args
 * where `-` would be ambiguous between subtraction and negation.
 */
export declare function parseUnary(ctx: ExpressionParserContext): Expression;
export declare function parsePrimary(ctx: ExpressionParserContext): Expression;
export declare function parseIdentifierOrString(ctx: ExpressionParserContext): string;
/**
 * Parse a target that may be a cell reference: @Cell.Object or just Object
 * Returns { cell?: string, target: string }
 */
export declare function parseCellScopedTarget(ctx: ExpressionParserContext): {
    cell?: string;
    target: string;
};
