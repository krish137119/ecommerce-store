# Runs Vite (web) + Express (api) together WITHOUT the npm.cmd batch wrapper.
# Reason: `npm run dev` runs inside npm.cmd, which is a Windows batch file, so
# Ctrl+C triggers cmd.exe's "Terminate batch job (Y/N)?" prompt. Running the same
# processes directly through node.exe makes Ctrl+C exit cleanly with no prompt.
# Usage (PowerShell):  .\dev.ps1
# Usage (cmd):         powershell -ExecutionPolicy Bypass -File dev.ps1

$ErrorActionPreference = "Stop"

& node node_modules/concurrently/dist/bin/index.js `
  -n web,api `
  -c cyan,magenta `
  "node node_modules/vite/bin/vite.js" `
  "node --watch server/index.js"

exit $LASTEXITCODE
