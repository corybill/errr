#!/usr/bin/env bash
# Local release: run the full test suite, then publish to npm.
# Usage:
#   npm run publish:npm
#   npm run publish:npm -- --dry-run
#   npm run publish:npm -- --tag beta
set -euo pipefail
cd "$(dirname "$0")/.."
npm test
exec npm publish "$@"
