import { EventEmitter } from 'eventemitter3';
import JsonSchema from '../JsonSchema';

export interface StepEventData<T extends Step> {
  step: T;
  previousStatus: StepStatus;
  date: Date;
}

export type StepEventHandler<T extends Step> = (e: StepEventData<T>) => any;

/**
 * Set of high-level status types, intended to have semantic meaning
 * for UI (color-coding, tips) and data (reporting and graphing).
 * Idea based on HTTP status codes
 *
 *  The intervals between each of the values can be used by custom implementations
 * for additional statuses
 *
 * Another advantage is that apart from 'blocked' in general steps are expected to move to higher-numbered statuses
 */
export enum StepStatus {
  /**
   * Indicates that the {@link Step} has been created and is unnassigned
   */
  'pending' = 0,
  /**
   * Indicates that the {@link Step} has been assigned to an executor and is pending initiation
   */
  'assigned' = 100,
  /**
   * Indicates that the {@link Step} has begun being executed
   */
  'in progress' = 200,
  /**
   * Indicates that the {@link Step} has finished successfully
   */
  'done' = 300,
  /**
   * Indicates that the {@link Step} has had its execution paused by a resolvable issue and can be resumed
   */
  'blocked' = 400,
  /**
   * Indicates that the {@link Step} has finished in an unpredicted and unrecoverable state
   */
  'error' = 500
}

export interface Step {
  status: StepStatus | number;
  /**
   * Set of config options that the Step requires
   * This is intended to be rendered as a <form> in a front-end application
   * for instance with http://schemaform.io/
   */
  getOptions: (...params: any[]) => JsonSchema;
  /**
   * Sets an object that is compatible with the Schema returned by {@link getOptions}
   * Implementations are expected to provide validation
   */
  setOptions: (options: object) => void;

  on(event: 'statusChange', handler: StepEventHandler<this>): this;
  on(event: 'done', handler: StepEventHandler<this>): this;

  /**
   * A Step needs to know how to execute itself,
   * however progress and results should be provided via events since they can involve human execution and so on
   */
  run(): void;

  /**
   * Returns the current Step's status, rounded down to the nearest StepStatus
   */
  getStatus(): StepStatus | number;

  // Step implementations would carry extra metadata needed for execution and UI
}

import BaseStep from './BaseStep';
export default BaseStep;
