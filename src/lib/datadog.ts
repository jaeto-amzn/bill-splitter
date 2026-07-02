import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';

/**
 * Initializes Datadog Real User Monitoring (RUM).
 *
 * `applicationId` and `clientToken` are public identifiers designed to be
 * embedded in client-side code — they are not secrets. `service`, `env`, and
 * `version` are read from Vite env vars so the same build config works across
 * environments (see .env / import.meta.env).
 */
export function initDatadog(): void {
  datadogRum.init({
    applicationId: '84ce73f5-fa51-482b-82e3-71b76f0b4d66',
    clientToken: 'pub915eb7d93773613530c120e6712efa7e',
    site: 'us5.datadoghq.com',
    service: import.meta.env.VITE_DD_SERVICE ?? 'bill-splitter',
    env: import.meta.env.VITE_DD_ENV ?? (import.meta.env.DEV ? 'dev' : 'prod'),
    version: import.meta.env.VITE_DD_VERSION ?? '0.1.0',
    sessionSampleRate: 100, // capture 100% of sessions
    sessionReplaySampleRate: 20, // capture 20% of sessions with replay
    // Mask all text/inputs in Session Replay by default. This site renders
    // diner names, item descriptions, and dollar amounts as DOM nodes; without
    // masking they would be uploaded to Datadog verbatim. 'mask' redacts text
    // and input content while preserving layout/interaction data.
    defaultPrivacyLevel: 'mask',
    trackResources: true, // Enable Resource tracking
    trackUserInteractions: true, // Enable Action tracking
    trackLongTasks: true, // Enable Long Tasks tracking
    plugins: [reactPlugin({ router: false })],
  });
}
