import type { GotoStatement, NextStatement, PrevStatement, WrapStatement, CellTransitionStatement, TransitionConfig } from '../../../types/script';
import type { ControlFlowParserContext } from './controlFlow';
export type NavigationParserContext = ControlFlowParserContext;
export declare function parseTransition(ctx: NavigationParserContext, validTypes: string[]): TransitionConfig | undefined;
export declare function parseGoto(ctx: NavigationParserContext): GotoStatement;
export declare function parseNext(ctx: NavigationParserContext): NextStatement;
export declare function parsePrev(ctx: NavigationParserContext): PrevStatement;
export declare function parseWrap(ctx: NavigationParserContext): WrapStatement;
export declare function parseCellTransition(ctx: NavigationParserContext): CellTransitionStatement;
