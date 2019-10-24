'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var tslib = require('tslib');
var debug = _interopDefault(require('debug'));
var dayjs = _interopDefault(require('dayjs'));
var AJV = _interopDefault(require('ajv'));
var flatUtil = _interopDefault(require('flat'));

(function (LogLevels) {
  LogLevels[LogLevels["OFF"] = 0] = "OFF";
  LogLevels[LogLevels["FATAL"] = 1] = "FATAL";
  LogLevels[LogLevels["ERROR"] = 2] = "ERROR";
  LogLevels[LogLevels["WARN"] = 3] = "WARN";
  LogLevels[LogLevels["INFO"] = 4] = "INFO";
  LogLevels[LogLevels["DEBUG"] = 5] = "DEBUG";
  LogLevels[LogLevels["TRACE"] = 6] = "TRACE";
  LogLevels[LogLevels["ALL"] = 7] = "ALL";
})(exports.LogLevels || (exports.LogLevels = {}));

var configSchema = {
  type: 'object',
  properties: {
    additionalProperties: true,
    namespace: {
      type: 'string',
      "default": ''
    },
    enabled: {
      type: 'boolean',
      "default": true
    },
    level: {
      "enum": [0, 1, 2, 3, 4, 5, 6, 7],
      "default": 2
    },
    timeStamp: {
      type: 'boolean',
      "default": true
    },
    timeStampFormat: {
      type: 'string',
      "default": 'YYYY-MM-DD HH:mm:ss'
    },
    masking: {
      "default": {},
      properties: {
        enabled: {
          type: 'boolean',
          "default": false
        },
        rules: {
          type: 'array',
          "default": [],
          items: [{
            type: 'object',
            "if": {
              properties: {
                name: {
                  "const": 'RegEx'
                }
              }
            },
            then: {
              properties: {
                matchValue: {
                  format: 'regex'
                }
              }
            },
            properties: {
              name: {
                type: 'string'
              },
              type: {
                "enum": ['Key', 'KeyIncludes', 'RegEx']
              },
              matchValue: {
                type: 'string'
              },
              replaceWith: {
                type: 'string'
              }
            }
          }]
        }
      }
    }
  }
};
var configValidator = new AJV({
  allErrors: true,
  useDefaults: true
});

var getConfig = function getConfig(config) {
  configValidator.validate(configSchema, config);

  if (configValidator.errors && Array.isArray(configValidator.errors)) {
    console.error(configValidator.errors);
    process.exit();
  }

  return config;
};

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var defaultRules = [{
  name: 'password',
  type: 'KeyIncludes',
  matchValue: 'password',
  replaceWith: '***********'
}, {
  name: 'email',
  type: 'RegEx',
  matchValue: new RegExp(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2}\b/gi),
  replaceWith: '***@****.***'
}, {
  name: 'phone',
  type: 'RegEx',
  matchValue: new RegExp(/\b(?:0|\+?44|\+?44\s)(?:\d\s?){9,12}\b/gi),
  replaceWith: '***** ******'
}, {
  name: 'postcode',
  type: 'RegEx',
  matchValue: new RegExp(/\b([A-PR-UWYZ][A-HK-Y0-9](?:[A-HJKS-UW0-9][ABEHMNPRV-Y0-9]?)?\s*[0-9][ABD-HJLNP-UW-Z]{2}|GIR\s*0AA)\b/gi),
  replaceWith: '**** ***'
}];
var defaultConfig = {
  enabled: false,
  enableDefaults: {
    email: false,
    phone: false,
    password: false,
    postcode: false
  },
  rules: []
};

var DataMaskingUtils = function () {
  function DataMaskingUtils(config) {
    var _this = this;

    this.config = defaultConfig;

    if (config && Array.isArray(config.rules)) {
      this.config = {
        enabled: config.enabled,
        rules: tslib.__spreadArrays(defaultConfig.rules, config.rules)
      };
    }

    if (config && config.enableDefaults) {
      this.config.enableDefaults = tslib.__assign(tslib.__assign({}, defaultConfig.enableDefaults), config.enableDefaults);
      defaultRules.forEach(function (defaultRule) {
        var enableRule = config.enableDefaults && config.enableDefaults[defaultRule.name];

        if (enableRule) {
          _this.config.rules = tslib.__spreadArrays(_this.config.rules, [defaultRule]);
        }
      });
    }

    return this;
  }

  DataMaskingUtils.prototype.isJson = function (item) {
    item = typeof item !== 'string' ? JSON.stringify(item) : item;

    try {
      item = JSON.parse(item);
    } catch (e) {
      return false;
    }

    if (_typeof(item) === 'object' && item !== null) {
      return true;
    }

    return false;
  };

  DataMaskingUtils.prototype.replaceKeyValues = function (input, maskingRule) {
    if (this.isJson(input)) {
      var flattened_1 = flatUtil(JSON.parse(input));
      Object.keys(flattened_1).forEach(function (key) {
        var endKey = key.split('.').pop();

        if (endKey) {
          if (maskingRule.type === 'Key' && endKey === maskingRule.matchValue) {
            flattened_1[key] = maskingRule.replaceWith;
          }

          if (maskingRule.type === 'KeyIncludes' && endKey.toLowerCase().includes(maskingRule.matchValue)) {
            flattened_1[key] = maskingRule.replaceWith;
          }
        }
      });
      var parsed = flatUtil.unflatten(flattened_1);
      return JSON.stringify(parsed);
    } else {
      return input;
    }
  };

  DataMaskingUtils.prototype.applyMaskingRules = function (input) {
    var _this = this;

    var cleaned = input;
    this.config.rules.forEach(function (maskingRule) {
      if (['Key', 'KeyIncludes'].includes(maskingRule.type)) {
        cleaned = _this.replaceKeyValues(cleaned, maskingRule);
      }

      if (maskingRule.type === 'RegEx') {
        if (cleaned.replace) {
          cleaned = cleaned.replace(maskingRule.matchValue, maskingRule.replaceWith);
        }
      }
    });
    return this.isJson(cleaned) ? JSON.parse(cleaned) : cleaned;
  };

  DataMaskingUtils.prototype.getConfig = function () {
    return this.config;
  };

  DataMaskingUtils.prototype.cleanseData = function (input) {
    if (!input) {
      return;
    }

    var data = this.isJson(input) ? JSON.stringify(input) : input;
    data = this.applyMaskingRules(data);
    return data;
  };

  return DataMaskingUtils;
}();

var Loggerhead = function () {
  function Loggerhead(config) {
    this.masker = null;
    var configObj = getConfig(config);
    this._config = configObj;
    this.instance = debug(configObj.namespace);
    this.instance.enabled = configObj.enabled;
    this.level = configObj.level;
    this.timestamp = configObj.timeStamp ? configObj.timeStamp : true;
    this.timestampFormat = configObj.timeStampFormat ? configObj.timeStampFormat : 'YYYY-MM-DD HH:mm:ss';

    if (this._config.masking && this._config.masking.enabled) {
      this.masker = new DataMaskingUtils(this._config.masking);
    }

    return this;
  }

  Loggerhead.prototype.getConfig = function () {
    return this._config;
  };

  Loggerhead.prototype.loggingEnabled = function () {
    return this._config.enabled;
  };

  Loggerhead.prototype.log = function (level) {
    var args = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }

    if (this.loggingEnabled() && this.level >= level) {
      args = this.cleanArgs.apply(this, args);
      args.unshift(exports.LogLevels[level]);
      this.timestamp && args.unshift(this.getTimestamp());
      this.instance.apply(this, tslib.__spreadArrays(['%j'], args));
    }
  };

  Loggerhead.prototype.trace = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this.log.apply(this, tslib.__spreadArrays([exports.LogLevels.TRACE], args));
  };

  Loggerhead.prototype.info = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this.log.apply(this, tslib.__spreadArrays([exports.LogLevels.INFO], args));
  };

  Loggerhead.prototype.debug = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this.log.apply(this, tslib.__spreadArrays([exports.LogLevels.DEBUG], args));
  };

  Loggerhead.prototype.warn = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this.log.apply(this, tslib.__spreadArrays([exports.LogLevels.WARN], args));
  };

  Loggerhead.prototype.error = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this.log.apply(this, tslib.__spreadArrays([exports.LogLevels.ERROR], args));
  };

  Loggerhead.prototype.fatal = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this.log.apply(this, tslib.__spreadArrays([exports.LogLevels.FATAL], args));
  };

  Loggerhead.prototype.cleanArgs = function () {
    var _this = this;

    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    if (this.masker && this._config.masking.enabled) {
      args = args.map(function (arg) {
        return _this.masker ? _this.masker.cleanseData(arg) : arg;
      });
      return args;
    } else {
      return args;
    }
  };

  Loggerhead.prototype.getTimestamp = function () {
    return dayjs().format(this.timestampFormat);
  };

  return Loggerhead;
}();

exports.default = Loggerhead;
