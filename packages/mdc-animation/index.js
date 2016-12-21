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
  animation: {
    noPrefix: 'animation',
    webkitPrefix: '-webkit-animation',
  },
  transform: {
    noPrefix: 'transform',
    webkitPrefix: '-webkit-transform',
  },
  transition: {
    noPrefix: 'transition',
    webkitPrefix: '-webkit-transition',
  },
};

function hasNode(windowObj) {
  return (windowObj.document !== undefined && windowObj.document.createElement !== undefined);
}

function eventFound(eventType) {
  return (eventType in eventTypeMap || eventType in cssPropertyMap);
}

// If 'animation' or 'transition' exist as style property, webkit prefix isn't necessary. Since we are unable to
// see the event types on the element, we must rely on its corresponding style object properties.
function getJavaScriptEventName(eventType, map, el) {
  switch (eventType) {
    case 'animationstart':
    case 'animationend':
    case 'animationiteration':
      return 'animation' in el.style ? map[eventType].noPrefix : map[eventType].webkitPrefix;
    case 'transitionend':
      return 'transition' in el.style ? map[eventType].noPrefix : map[eventType].webkitPrefix;
    default:
      return map[eventType].noPrefix;
  }
}

// Helper function to determine browser prefix for CSS3 animation events
// and property names
//
// Parameters:
// windowObject: Object -- Contains Document with a `createElement()` method
// eventType: string -- The type of animation
//
// returns the value of the event as a string, prefixed if necessary.
// If proper arguments are not supplied, this function will return
// the property or event type without webkit prefix.
//
export function getAnimationEventName(windowObj, eventType) {
  if (!hasNode(windowObj) || !eventFound(eventType)) {
    return eventType;
  }

  const map = eventType in eventTypeMap ? eventTypeMap : cssPropertyMap;
  const el = windowObj.document.createElement('div');
  let eventName = '';

  if (map === eventTypeMap) {
    eventName = getJavaScriptEventName(eventType, map, el);
  } else {
    eventName = map[eventType].noPrefix in el.style ? map[eventType].noPrefix : map[eventType].webkitPrefix;
  }

  return eventName;
}
