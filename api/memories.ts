import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

const memoriesTable = pgTable("memories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  message: text("message").notNull(),
  imageData: text("image_data"),
  editToken: text("edit_token").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql);
}

async function ensureTable() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    CREATE TABLE IF NOT EXISTS memories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      image_data TEXT,
      edit_token TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await ensureTable();
  const db = getDb();

  if (req.method === "GET") {
    try {
      const rows = await db
        .select({
          id: memoriesTable.id,
          name: memoriesTable.name,
          message: memoriesTable.message,
          imageData: memoriesTable.imageData,
          createdAt: memoriesTable.createdAt,
        })
        .from(memoriesTable)
        .orderBy(memoriesTable.createdAt);

      return res.status(200).json(
        rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))
      );
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    const { name, message, imageData } = req.body ?? {};

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Ism majburiy" });
    }
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "Xotira matni majburiy" });
    }

    const editToken = randomUUID();

    try {
      const [row] = await db
        .insert(memoriesTable)
        .values({
          name: name.trim(),
          message: message.trim(),
          imageData: imageData ?? null,
          editToken,
        })
        .returning();

      return res.status(201).json({
        id: row.id,
        name: row.name,
        message: row.message,
        imageData: row.imageData,
        createdAt: row.createdAt.toISOString(),
        editToken: row.editToken,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
