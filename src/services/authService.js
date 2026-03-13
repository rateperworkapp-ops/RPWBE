const prisma = require('../config/db');

const getUserByEmail = async (email) => prisma.user.findUnique({
  where: { email }
});

const createUser = async (email, passwordHash) => prisma.user.create({
  data: {
    email,
    password_hash: passwordHash
  },
  select: {
    id: true,
    email: true,
    created_at: true
  }
});

module.exports = {
  getUserByEmail,
  createUser
};
