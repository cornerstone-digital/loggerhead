# loggerhead

Logging library with PCI compliance masking functionality built in.

Often when dealing with

## Installation

`yarn add @cornerstone-digital/loggerhead`

## How it works

`Loggerhead` is a wrapper around the npm module [debug](https://www.npmjs.com/package/debug) which adds support for enabling/disabling logging at certain levels based on the configuration.

The logger also has support for masking data within log files using either one of the default rules (see below) or using custom rules which can be configured within your configuration given on inititialisation of the logger.

## Installation

To install with yarn run:

```bash
yarn add @cornerstone-digital/loggerhead
```

To install with npm run:

```bash
npm -i @cornerstone-digital/loggerhead
```

## Supported Log Levels

```
OFF: 0 or LogLevels.OFF
FATAL: 1 or LogLevels.FATAL
ERROR: 2 or LogLevels.ERROR
WARN: 3 or LogLevels.WARN
INFO: 4 or LogLevels.INFO
DEBUG: 5 or LogLevels.DEBUG
TRACE: 6 or LogLevels.TRACE
ALL: 7 or LogLevels.ALL
```

## Usage

To initialise a logger instance you can use the below code:

```javascript
import Loggerhead, { LoggerheadConfig, LogLevels } from '@cornerstone-digital/loggerhead'

const loggerConfig: LoggerheadConfig = {
  namespace: 'MyLogger',
  enabled: true,
  level: LogLevels.ALL,
  timeStamp: true,
  timeStampFormat: 'YYYY-MM-DD HH:mm:ss',
  masking: {
    enabled: true,
    enableDefaults: {
      email: true /* Enable masking emails */,
      phone: true /* Enable masking phones */,
      postcode: true /* Enable masking postcodes */,
      password: true /* Enable masking passwords */,
      jwt: true /* Enable masking jwt tokens */
    },
    rules: [
      /* Exactly match a key based on it's name matching the matchValue */
      {
        name: 'id',
        type: 'Key',
        matchValue: 'myKeyName',
        replaceWith: '*********'
      },
      /* Match a key based on if it's name contains the matchValue */
      {
        name: 'id',
        type: 'KeyIncludes',
        matchValue: 'id',
        replaceWith: '*********'
      },
      /* Match a strings in a log based on RegExp */
      {
        name: 'myRegExpMatch',
        type: 'RegEx',
        matchValue: new RegExp(/\b(.*)\b/gi),
        replaceWith: '*********'
      }
    ]
  }
}

logger.info('My log')
```
