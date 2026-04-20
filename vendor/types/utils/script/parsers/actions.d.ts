import type { ShowStatement, HideStatement, WaitStatement, ShoutStatement, PostStatement, FetchStatement, LogStatement, AnimateStatement, StopAnimationStatement, ActionCallStatement, ClearGridStatement, SpawnStatement, DestroyStatement, CopyStatement, AnimateGroupStatement, StopAnimateGroupStatement, PlayStatement, PauseStatement, JumpStatement, ImpulseStatement, ScreenshakeStatement, RevealStatement, RehideStatement, TransportStatement, MoveToStatement, PressStatement, ReleaseStatement, AddTagStatement, RemoveTagStatement, OpenUrlStatement } from '../../../types/script';
import type { ControlFlowParserContext } from './controlFlow';
export type ActionsParserContext = ControlFlowParserContext;
export declare function parseShow(ctx: ActionsParserContext): ShowStatement;
export declare function parseHide(ctx: ActionsParserContext): HideStatement;
export declare function parseWait(ctx: ActionsParserContext): WaitStatement;
/**
 * Parse shout statements:
 *   shout "message"
 *   shout "message" {param: value}
 *   shout to Target "message"
 *   shout to #tag "message" {param: value}
 */
export declare function parseShout(ctx: ActionsParserContext): ShoutStatement;
/**
 * Parse post statement: post "url" {key: value, ...}
 */
export declare function parsePost(ctx: ActionsParserContext): PostStatement;
/**
 * Parse fetch statement: fetch "url" into variableName
 */
export declare function parseFetch(ctx: ActionsParserContext): FetchStatement;
/**
 * Parse log statement: log expr1, expr2, ...
 * Examples:
 *   log "hello"
 *   log turn
 *   log "turn is" turn
 *   log lines
 */
export declare function parseLog(ctx: ActionsParserContext): LogStatement;
/**
 * Parse openUrl statement: openUrl "https://..." [newTab]
 * URL can be any expression (string literal, variable, concatenation).
 */
export declare function parseOpenUrl(ctx: ActionsParserContext): OpenUrlStatement;
/**
 * Parse animate statement: shake/vibrate/pulse/squeeze/bounce/spin target duration [params]
 * Examples:
 *   shake self 300
 *   shake Button1 500 10
 *   vibrate self loop
 *   vibrate self loop 1
 *   pulse self 200
 *   pulse StatusLight loop 1.3
 *   squeeze self 400
 *   squeeze self 400 vertical
 *   bounce self 500
 *   bounce self 500 40
 *   spin self 1000
 *   spin self 1000 ccw
 */
export declare function parseAnimate(ctx: ActionsParserContext): AnimateStatement;
/**
 * Parse stop animation statement: stop target [animation]
 * Examples:
 *   stop self           # stop all animations on self
 *   stop self pulse     # stop only pulse animation
 *   stop Button1        # stop all animations on Button1
 *   stop Button1 shake  # stop only shake animation on Button1
 */
export declare function parseStopAnimation(ctx: ActionsParserContext): StopAnimationStatement;
/**
 * Parse action call: do actionName or do Object.actionName
 * Examples:
 *   do flash         → implicit self
 *   do self.toggle   → explicit self
 *   do Board.drop    → explicit target
 */
export declare function parseActionCall(ctx: ActionsParserContext): ActionCallStatement;
/**
 * Parse clear statement: clear Grid or clear Grid.cell[x][y]
 * Examples:
 *   clear Board           # Clear all cell data for grid "Board"
 *   clear Board.cell[0][0] # Clear data at specific cell
 *   clear Board.cell[x][y] # Clear data at dynamic cell position
 */
export declare function parseClearGrid(ctx: ActionsParserContext): ClearGridStatement;
/**
 * Parse spawn statement: spawn "TemplateName" {param: value, ...}
 * Examples:
 *   spawn "Piece"
 *   spawn "Piece" {col: 3, row: 5}
 *   spawn "PieceTemplate" {col: x, row: y, color: "red"}
 */
export declare function parseSpawn(ctx: ActionsParserContext): SpawnStatement;
/**
 * Parse destroy statement: destroy target
 * Examples:
 *   destroy piece
 *   destroy self
 */
export declare function parseDestroy(ctx: ActionsParserContext): DestroyStatement;
/**
 * Parse copy statement: copy value
 * Examples:
 *   copy seed
 *   copy Result.content
 *   copy hash(x, y)
 */
export declare function parseCopy(ctx: ActionsParserContext): CopyStatement;
/**
 * Parse animate group statement: animate target "group" [fps N] [loop|once|pingpong]
 * Examples:
 *   animate self "walk"
 *   animate self "walk" fps 12
 *   animate self "walk" once
 *   animate self "walk" pingpong
 *   animate Button "hover" fps 4
 *   animate #enemies "alert" fps 4
 */
export declare function parseAnimateGroup(ctx: ActionsParserContext): AnimateGroupStatement;
/**
 * Parse stop animate group statement: stop animate target
 * Examples:
 *   stop animate self
 *   stop animate Button
 *   stop animate #enemies
 */
export declare function parseStopAnimateGroup(ctx: ActionsParserContext): StopAnimateGroupStatement;
/**
 * Parse play statement: play Target [loop] [fadeIn N]
 * Examples: play Music, play SoundEffect loop, play Music fadeIn 2000
 */
export declare function parsePlay(ctx: ActionsParserContext): PlayStatement;
/**
 * Parse pause statement: pause Target [fadeOut N]
 * Examples: pause Music, pause Music fadeOut 2000
 */
export declare function parsePause(ctx: ActionsParserContext): PauseStatement;
/**
 * Parse jump statement: jump Target [height N]
 * Examples:
 *   jump self
 *   jump Player
 *   jump Player height 0.8
 *   jump #enemies
 */
export declare function parseImpulse(ctx: ActionsParserContext): ImpulseStatement;
export declare function parseJump(ctx: ActionsParserContext): JumpStatement;
/**
 * Parse screenshake statement:
 *   screenshake 300              # 300ms, default intensity
 *   screenshake 500 loop         # looping
 *   screenshake 200 5            # intensity 5
 *   screenshake 2000 1-5         # ramp from 1 to 5
 *   screenshake 2000 5-1 loop    # ramp with loop
 *   screenshake loop             # loop with default duration
 */
export declare function parseScreenshake(ctx: ActionsParserContext): ScreenshakeStatement;
export declare function parseReveal(ctx: ActionsParserContext): RevealStatement;
/**
 * Parse rehide statement:
 *   rehide MaskName            — reset all revealer layers for mask
 *   rehide MaskName Player     — reset only Player's layer
 */
export declare function parseRehide(ctx: ActionsParserContext): RehideStatement;
/**
 * Parse transport statement: transport TARGET to X Y over DURATION [easing]
 * Examples:
 *   transport self to 0.5 0.5 over 1000
 *   transport Player to 0.2 0.8 over 500 ease-in-out
 *   transport #enemies to Player.x Player.y over 300
 */
export declare function parseTransport(ctx: ActionsParserContext): TransportStatement;
/**
 * Parse moveTo statement: moveTo TARGET X Y  or  moveTo TARGET DESTINATION
 * Examples:
 *   moveTo self 0.5 0.5
 *   moveTo Player 0.2 0.8
 *   moveTo #enemies Player.x Player.y
 *   moveTo self Checkpoint          ← move toward named object's position
 *   moveTo #enemies Flag            ← all tagged move toward Flag
 */
export declare function parseMoveTo(ctx: ActionsParserContext): MoveToStatement;
/**
 * Parse press statement: press "key" [on Target]
 * Examples:
 *   press "q"              → inject keyDown on self
 *   press "Space" on Tank  → inject keyDown on Tank
 */
export declare function parsePress(ctx: ActionsParserContext): PressStatement;
/**
 * Parse release statement: release "key" [on Target]
 * Examples:
 *   release "q"              → inject keyUp on self
 *   release "Space" on Tank  → inject keyUp on Tank
 */
export declare function parseRelease(ctx: ActionsParserContext): ReleaseStatement;
/**
 * Parse addTag statement: addTag target #tag
 * Examples:
 *   addTag self #enemy
 *   addTag Player #active
 *   addTag #sprites #visible
 */
export declare function parseAddTag(ctx: ActionsParserContext): AddTagStatement;
export declare function parseRemoveTag(ctx: ActionsParserContext): RemoveTagStatement;
