/**
 * Dynamics Module
 *
 * Public API for the dynamics/movement system.
 * Import only from this file - internal modules are implementation details.
 */
export { dynamicsEngine, DynamicsEngine } from './engine';
export type { DynamicsObject, MovableConfig, JumpableConfig, KeyMapping, MovementState, StateUpdate, GridConfig, DynamicsCallbacks, InputType, InputBinding, OverlapEvent, CollideEvent, MoveEvent, ZoneConfig, PegConstraintDef, PegConstraintType, PegBreakEvent, } from './types';
export { DEFAULT_KEY_MAPPING, DEFAULT_PLAYER_KEYS } from './types';
export { inputState } from './inputState';
export { getMovementState, getCellX, getCellY, getAnimationOpacity, getAnimationScale, isAnimating, isObjectMoving, isAnyObjectMoving, clearRuntimeStates, drainMovementEvents, getDebugBreadcrumbs, } from './movement/index';
export type { MovementEvent } from './movement/index';
