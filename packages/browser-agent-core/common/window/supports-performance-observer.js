/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

export function supportsPerformanceObserver () {
  return (typeof self.PerformanceObserver === 'function');
}
