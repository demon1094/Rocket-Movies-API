const sqliteConnection = require('../database/sqlite')
const AppError = require('../utils/AppError')
const { hash, compare } = require('bcryptjs')

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    const database = await sqliteConnection()
    const checkUserExists = await database.get('SELECT * FROM users WHERE email = (?)', [email])

    if (checkUserExists) {
      throw new AppError('Este e-mail já está em uso')
    }

    const hashedPassword = await hash(password, 8)

    await database.run(`
      INSERT INTO users 
      (name, email, password)
      VALUES
      (?, ?, ?)
      `,
      [name, email, hashedPassword]
    )

    return response.status(201).json()
  }

  async update(request, response) {
    const { id } = request.params
    const { name, email, password, old_password } = request.body

    const database = await sqliteConnection()

    const user = await database.get('SELECT * FROM users WHERE id = (?)', [id])
    const userWithUpdatedEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email])

    if (!user) {
      throw new AppError('Usuário não encontrado')
    }

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Já existe uma conta cadastrada com o e-mail informado')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError('Você precisa informar a senha antiga')
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError('A senha antiga não confere')
      }

      user.password = await hash(password, 8)
    }

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, id]
    )

    return response.json()
  }

  async delete(request, response) {
    const { id, password } = request.query

    const database = await sqliteConnection()
    const user = await database.get('SELECT * FROM users WHERE id = (?)', [id])

    if (!user) {
      throw new AppError('Usuário não encontrado')
    }

    if (!password) {
      throw new AppError('Senha não informada')
    }

    const checkPassword = await compare(password, user.password)

    if (!checkPassword) {
      throw new AppError('Senha incorreta')
    }

    await database.run('DELETE FROM users WHERE id = (?)', [id])

    return response.json()
  }
}

module.exports = UsersController