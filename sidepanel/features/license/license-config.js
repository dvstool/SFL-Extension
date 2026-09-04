/*
 * Public license client configuration.
 *
 * Keep this file free of secrets. After deploying the Worker, set `enabled` to
 * true and paste the Worker URL. The admin token belongs only in
 * sidepanel/admin.local.js, which is ignored by Git.
 */
window.SUNFLOWER_LICENSE_CONFIG = Object.freeze({
  enabled: true,
  apiBaseUrl: 'https://sunflower-tools-license.sfl-ext-sang.workers.dev'
});
