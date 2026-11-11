import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Iniciando el spawn de juegos en la base de datos...");

  await prisma.game.create({
    data: {
      name: "Overwatch 2",
      playtime_minutes: 1200,
      source: "MANUAL",
      status: "PLAYING",
    },
  });

  await prisma.game.create({
    data: {
      name: "Resident Evil 4 Remake",
      playtime_minutes: 0,
      source: "MANUAL",
      status: "BACKLOG",
    },
  });

  await prisma.game.create({
    data: {
      name: "Dota 2",
      playtime_minutes: 3500,
      source: "MANUAL",
      status: "PLAYING",
    },
  });

  await prisma.game.create({
    data: {
      name: "Wuthering Waves",
      playtime_minutes: 45,
      source: "MANUAL",
      status: "PLAYING",
    },
  });

  await prisma.game.create({
    data: {
      name: "Palworld",
      playtime_minutes: 2000,
      source: "MANUAL",
      status: "COMPLETED",
    },
  });

  console.log("¡Juegos inyectados con éxito!");
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
