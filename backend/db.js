import { DataTypes, Sequelize } from "sequelize"

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './data.sqlite'
})

const User = sequelize.define('User', {
  // Model attributes are defined here
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  // Other model options go here
});


export async function initDatabase() {
  await User.sync()
}

export async function emailExist(email) {
  const data = await User.findOne({ where: { email: email } })
  if (data === null) {
    return false
  }
  return true
}

export async function newUser(email) {
  await User.create({
    email: email
  })
}
