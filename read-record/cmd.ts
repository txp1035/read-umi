import path from 'path'
import fs from 'fs'

const rootPath = path.join(__dirname, '../')

/**
 * 文件注释规范
 * READCODE-type:
 * READCODE-conclusion:
 * READCODE-
 * 目录注释规范
 * READCODE.md
 */

let allFile = 0
let readFile = 0


function getDirTree(beforePath: string,options?:{isRead:boolean}): object {
  const general = ['^.git$', '.test.ts$', '^read-record$', '^pnpm-lock.yaml$', '^LICENSE$', '.md$']
  const umi = ['^compiled$', '^fixtures$', '^examples$']
  const ignore = [
    ...general,
    ...umi
  ]
  const all = fs.readdirSync(beforePath)
  const isReadDir = options?.isRead || getIsRead(beforePath)

  const allList = all.filter(item => !ignore.find(ignoreItem => new RegExp(ignoreItem).test(item))).map(item => {
    const itemPath = path.join(beforePath, item)
    try {
      fs.lstatSync(itemPath).isDirectory()
      const dir = getDirTree(itemPath,{isRead:isReadDir})
      if (JSON.stringify(dir) !== '{}') {
        return [item, { dir, path: itemPath }]
      }
      return [item, { ignore: true }]
    } catch (error) {
      let isRead = false
      if (isReadDir) {
        isRead = true
        readFile = readFile + 1
      } else {
        allFile = allFile + 1
        if (getIsRead(itemPath)) {
          isRead = true
          readFile = readFile + 1
        }
      }
      return [item, { path: itemPath, isRead }]
    }
  }).filter(item => !item[1]?.ignore)
  return Object.fromEntries(allList)
}
function getIsRead(paths: string) {
  const tagName = 'READCODE'
  try {
    fs.lstatSync(paths).isDirectory()
    const all = fs.readdirSync(paths)
    const isRead = !!all.includes(`${tagName}.md`)
    return isRead
  } catch (error) {
    const str = fs.readFileSync(paths, { encoding: 'utf-8' })
    const start = [`^# ${tagName}`, `^// ${tagName}`, `^<!-- ${tagName}`,`^{\n  "${tagName}"`]
    let isRead = false;
    start.forEach(element => {
      if (new RegExp(element).test(str)) {
        isRead = true
      }
    });
    return isRead
  }
}
const tree = getDirTree(rootPath)
function getMd(obj: object, arr: string[]) {
  let str = '';
  Object.entries(obj).map(item => {
    str = str + `${arr.join('')}- ${item[0]}\n`
    if (item[1]?.dir) {
      str = str + getMd(item[1]?.dir, [...arr, '  '])
    }
  })
  return str
}
fs.writeFileSync(path.join(__dirname, 'tree.json'), JSON.stringify(tree))
const percent = (readFile/allFile*100).toFixed(2)
const statisticalPanel = `allFile: ${allFile}  readFile: ${readFile} percent: ${percent}%
`
fs.writeFileSync(path.join(__dirname, 'statistical.md'), statisticalPanel + getMd(tree, ['']))

