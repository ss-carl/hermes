call local-env.cmd
REM call prod-env.cmd
npm run devserver
REM docker run -ti --rm --name=hermes -p9000:9000 -v .:/app ^
REM  -eHERMES_USERNAME^
REM  -eHERMES_PASSWORD^
REM  -eHERMES_BASE_URL^
REM  -eNODE_ENV^
REM  -eNEW_RELIC_LICENSE_KEY^
REM  -eNEW_RELIC_APP_NAME^
REM  -eSENTRY_ENVIRONMENT^
REM  -eSENTRY_DSN^
REM  -eSENTRY_RELEASE^
REM  46fd3cb345a9