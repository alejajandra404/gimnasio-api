import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.usuario.deleteMany();

  // las tres cuentas de prueba, ahora guardadas en MySQL.
  const passwordHash = await bcrypt.hash('gimnasio2026', 10);
  await prisma.usuario.createMany({
    data: [
      { correo: 'karla@itson.mx', passwordHash, rol: 'miembro', miembroId: 1 },
      { correo: 'ana@itson.mx', passwordHash, rol: 'entrenador' },
      { correo: 'admin@itson.mx', passwordHash, rol: 'admin' },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
