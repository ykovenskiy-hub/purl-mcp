export type TokenType = 'KEYWORD' | 'IDENTIFIER' | 'NUMBER' | 'STRING' | 'OPERATOR' | 'LPAREN' | 'RPAREN' | 'LBRACKET' | 'RBRACKET' | 'LBRACE' | 'RBRACE' | 'COMMA' | 'COLON' | 'DOT' | 'AT' | 'TAG' | 'NEWLINE' | 'INDENT' | 'DEDENT' | 'EOF';
export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}
export declare const KEYWORDS: readonly string[];
export declare const INPUT_TYPES: readonly ["keyboard", "click", "gamepad", "script"];
export declare const ANIMATION_KEYWORDS: readonly ["shake", "vibrate", "pulse", "squeeze", "bounce", "spin", "glow"];
export declare const TYPE_SELECTORS: Record<string, string>;
export declare function tokenize(source: string): Token[];
