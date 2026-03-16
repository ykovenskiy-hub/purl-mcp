import type { EnableStatement, DisableStatement } from '../../../types/script';
import type { ControlFlowParserContext } from './controlFlow';
export type EnableDisableParserContext = ControlFlowParserContext;
export declare function parseEnable(ctx: EnableDisableParserContext): EnableStatement;
export declare function parseDisable(ctx: EnableDisableParserContext): DisableStatement;
