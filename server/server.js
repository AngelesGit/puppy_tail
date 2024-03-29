require('dotenv').config()
const { Sequelize } = require('sequelize')
const express = require('express')

const app = express()

const port = process.env.PORT || 3000
const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS


const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: 'localhost',
  dialect: 'postgres'
})

async function main() {
  try {
    await sequelize.sync({ force: true })
    app.listen(port, () => console.log(`Server running on port ${port}...`))
  }
  catch (error) {
    console.log('Unable to connect to the database:', error)
  }
}

main()