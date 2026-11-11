-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "steam_appid" INTEGER,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "playtime_minutes" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'backlog',
    "priority" INTEGER NOT NULL DEFAULT 2,
    "rating" INTEGER,
    "notes" TEXT,
    "started_at" DATETIME,
    "finished_at" DATETIME,
    "enriched_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Genres" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GameToGenres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GameToGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GameToGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Genres" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_steam_appid_key" ON "Game"("steam_appid");

-- CreateIndex
CREATE UNIQUE INDEX "Genres_name_key" ON "Genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_GameToGenres_AB_unique" ON "_GameToGenres"("A", "B");

-- CreateIndex
CREATE INDEX "_GameToGenres_B_index" ON "_GameToGenres"("B");
