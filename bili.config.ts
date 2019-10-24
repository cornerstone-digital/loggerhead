import { Config } from 'bili'

const config: Config = {
  plugins: {
    typescript2: {
      // Override the config in `tsconfig.json`
      tsconfigOverride: {
        include: ['src']
      }
    }
  },
  input: 'src/index.ts',
  output: {
    fileName: 'loggerhead.[format].js',
    format: ['cjs', 'esm']
  }
}

export default config
