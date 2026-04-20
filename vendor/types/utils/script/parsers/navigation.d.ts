import type { GotoStatement, CellTransitionStatement, TransitionConfig } from '../../../types/script';
import type { ControlFlowParserContext } from './controlFlow';
export type NavigationParserContext = ControlFlowParserContext;
export declare function parseTransition(ctx: NavigationParserContext, validTypes: string[]): TransitionConfig | undefined;
export declare function parseGoto(ctx: NavigationParserContext): GotoStatement;
export declare function parseCellTransition(ctx: NavigationParserContext): CellTransitionStatement;
