import base from './base'

const allConfigModules = import.meta.glob('@/config/**/*.ts')
if (!window.allConfigModules) {
    window.allConfigModules = allConfigModules
}

const config = async () => window.allConfigModules[`/src/config/m-${process.env.CODE_ENV || 'dev'}.ts`]
const index = Object.assign(base, config)

console.log(`/src/config/m-${process.env.CODE_ENV || 'dev'}.ts`, index)
export default index