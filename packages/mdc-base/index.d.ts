/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

declare class MDCFoundation {
    public static cssClasses(): Object;

    public static strings(): Object;

    public static numbers(): Object;

    public static defaultAdapter(): Object;

    protected adapter_: Object;

    constructor(adapter: Object = {});

    public init(): void;

    public destroy(): void;
}

declare class MDCComponent {
    public static attachTo(root: Element): MDCComponent;

    protected root_: Element;
    protected foundation_: MDCFoundation;

    constructor(root: Element, foundation: MDCFoundation = undefined, ...args);
    public initialize(...args): void;
    public getDefaultFoundation(): MDCFoundation;
    public initialSyncWithDOM(): void;
    public destroy(): void;
    public listen(evtType: string, handler: EventHandlerNonNull): void;
    public unlisten(evtType: string, handler: EventHandlerNonNull): void;
    public emit(evtString: string, evtData: Object, shouldBubble = false): void;

}

