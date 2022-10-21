import fs from 'fs/promises'
import path from 'path'
import { components } from 'vuetify'
import { kebabCase } from './helpers/text'
import { generateComposableDataFromTypes, generateDirectiveDataFromTypes } from './types'
import Piscina from 'piscina'
import { addDescriptions, addDirectiveDescriptions, stringifyProps } from './utils'
import * as os from 'os'
import mkdirp from 'mkdirp'
import { createVeturApi } from './vetur'
import rimraf from 'rimraf'
import { createWebTypesApi } from './web-types'
import inspector from 'inspector'
import yargs from 'yargs'

const yar = yargs(process.argv.slice(2))
  .option('components', {
    type: 'array',
  })

const run = async () => {
  const argv = await yar.argv
  const locales = ['en']

  // Components
  const pool = new Piscina({
    filename: './src/worker.js',
    niceIncrement: 10,
    maxThreads: inspector.url() ? 1 : Math.max(1, Math.floor(Math.min(os.cpus().length / 2, os.freemem() / (1.1 * 1024 ** 3)))),
  })

  const template = await fs.readFile('./src/template.d.ts', 'utf-8')

  await mkdirp('./src/tmp')
  for (const component in components) {
    await fs.writeFile(`./src/tmp/${component}.d.ts`, template.replaceAll('__component__', component))
  }

  const outPath = path.resolve(__dirname, '../../docs/src/api/data/')

  const componentData = await Promise.all(
    Object.entries(components).map(([componentName, componentInstance]) => {
      if (argv.components && !argv.components.includes(componentName)) return null

      return pool.run(
        JSON.stringify({
          componentName,
          componentProps: stringifyProps(componentInstance.props),
          locales,
          outPath,
        })
      )
    }).filter(Boolean)
  )

  // Composables
  const composables = generateComposableDataFromTypes().map(composable => {
    const kebabName = kebabCase(composable.name)
    const source = kebabName.split('-')[1]
    addDescriptions(composable.name, composable.data, [source], locales)
    return { kebabName, ...composable }
  })

  for (const composable of composables) {
    await fs.writeFile(path.resolve(outPath, `${composable.kebabName}.json`), JSON.stringify(composable.data, null, 2))
  }

  // Directives
  const directives = generateDirectiveDataFromTypes().map(directive => {
    const kebabName = kebabCase(directive.name)
    addDirectiveDescriptions(directive.name, directive, [kebabName], locales)

    return { kebabName, ...directive }
  })

  for (const { kebabName, name, ...directive } of directives) {
    await fs.writeFile(path.resolve(outPath, `${kebabName}.json`), JSON.stringify(directive, null, 2))
  }

  rimraf.sync(path.resolve('./dist'))
  fs.mkdir(path.resolve('./dist'))
  createVeturApi(componentData)
  createWebTypesApi(componentData, directives)
  // rimraf.sync(path.resolve('./src/tmp'))
}

run()
