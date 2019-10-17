// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
interface LoggerheadConfig {}

export default class Loggerhead {
  private _config: LoggerheadConfig
  constructor(config: LoggerheadConfig) {
    this._config = config
  }
}
