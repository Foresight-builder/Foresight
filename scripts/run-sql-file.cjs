// 使用 pg 直连 Postgres，执行指定的 SQL 文件内容
require('dotenv/config')

let Client
try {
  Client = require('pg').Client
} catch (e) {
  console.error('未找到 pg 依赖，请先运行: npm i pg')
  process.exit(1)
}

const fs = require('fs')
const path = require('path')

// 读取连接字符串：优先 SUPABASE_DB_URL，其次 SUPABASE_CONNECTION_STRING
const connectionString =
  process.env.SUPABASE_DB_URL || process.env.SUPABASE_CONNECTION_STRING

if (!connectionString) {
  console.error('缺少数据库连接字符串 SUPABASE_DB_URL')
  process.exit(1)
}

// 从命令行参数读取SQL文件路径
const fileArg = process.argv[2]
if (!fileArg) {
  console.error('用法: node scripts/run-sql-file.cjs <sql-file-path>')
  process.exit(1)
}

const sqlPath = path.resolve(process.cwd(), fileArg)
if (!fs.existsSync(sqlPath)) {
  console.error('SQL 文件不存在:', sqlPath)
  process.exit(1)
}

const sql = fs.readFileSync(sqlPath, 'utf8')

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })

async function main() {
  try {
    await client.connect()
    console.log('已连接 Postgres')
    console.log('执行文件:', sqlPath)
    await client.query(sql)
    console.log('SQL 执行完成')
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error('执行 SQL 失败:', err?.message || err)
  process.exit(1)
})