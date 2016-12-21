/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const eventTypeMap = {
  animationstart: {
    noPrefix: 'animationstart',
    webkitPrefix: 'webkitAnimationStart',
  },
  animationend: {
    noPrefix: 'animationend',
    webkitPrefix: 'webkitAnimationEnd',
  },
  animationiteration: {
    noPrefix: 'animationiteration',
    webkitPrefix: 'webkitAnimationIteration',
  },
  transitionend: {
    noPrefix: 'transitionend',
    webkitPrefix: 'webkitTransitionEnd',
  },
};

const cssPropertyMap = {
  transform: {
    noPrefix: 'transform',
    webkitPrefix: '-webkit-transform',
  },
  transition: {
    noPrefix: 'transition',
    webkitPrefix: '-webkit-transition',
  },
  animation: {
    noPrefix: 'animation',
    webkitPrefix: '-webkit-prefix',
  },
};

function isNode(obj) {
  return (
    typeof Node === "object" ? 
      obj instanceof Node : 
      obj && typeof obj === "object" && 
      typeof obj.nodeType === "number" && 
      typeof obj.nodeName==="string"
  );
}

// Helper function to determine browser prefix for CSS3 animation events
// and property names
// 
// Parameters:
// windowObject: Object -- Contains Document with a `createElement()` method 
// eventType: string -- The type of animation
// mapType: string -- Map to source. Can be jsEvent or cssProperty
//
// returns the value of the event as a string, prefixed if
// necessary. If proper arguments are not supplied, this function will return
// the property or event type without webkit prefix.
//
export function getAnimationEventName(windowObj, eventType) {
  const map = eventType in eventTypeMap ? eventTypeMap : cssPropertyMap;
  
  if (windowObj !== window || isNode(windowObj.document)) {
    return map[eventType].noPrefix;
  }

  const el = windowObj.document.createElement('div');
  
  return eventType in el.style ? map[eventType].noPrefix : map[eventType].webkitPrefix;
}
