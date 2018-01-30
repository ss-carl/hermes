const required_env_var = (name) => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment variable ${name} must be set`)
  }
  return value
}

const environment = {
  runManualTests: process.env.RUN_MANUAL_TESTS,
  is_production: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 9000,
  git_sha: process.env.GITSHA,
  hermes_client_id: process.env.HERMES_CLIENT_ID || 697,
  hermes_client_name: process.env.HERMES_CLIENT_NAME || 'Shipstation',
  hermes_username: required_env_var('HERMES_USERNAME'),
  hermes_password: required_env_var('HERMES_PASSWORD'),
  hermes_base_url: required_env_var('HERMES_BASE_URL'),
}

if (environment.is_production) {
  required_env_var('NEW_RELIC_LICENSE_KEY')
  required_env_var('NEW_RELIC_APP_NAME')
  required_env_var('SENTRY_ENVIRONMENT')
  required_env_var('SENTRY_DSN')
  required_env_var('SENTRY_RELEASE')
}

module.exports = environment
