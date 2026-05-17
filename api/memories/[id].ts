import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const id = Number(req.query.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const db = getDb();

  if (req.method === "PATCH") {
    const { editToken, message, imageData } = req.body ?? {};

    if (!editToken) {
      return res.status(400).json({ error: "editToken majburiy" });
    }

    try {
      const [existing] = await db
        .select()
        .from(memoriesTable)
        .where(eq(memoriesTable.id, id));

      if (!existing) {
        return res.status(404).json({ error: "Xotira topilmadi" });
      }
      if (existing.editToken !== editToken) {
        return res.status(403).json({ error: "Ruxsat yo'q" });
      }

      const updates: Record<string, unknown> = {};
      if (message !== undefined) updates.message = message;
      if (imageData !== undefined) updates.imageData = imageData ?? null;

      const [updated] = await db
        .update(memoriesTable)
        .set(updates)
        .where(eq(memoriesTable.id, id))
        .returning();

      return res.status(200).json({
        id: updated.id,
        name: updated.name,
        message: updated.message,
        imageData: updated.imageData,
        createdAt: updated.createdAt.toISOString(),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    const { editToken } = req.body ?? {};

    if (!editToken) {
      return res.status(400).json({ error: "editToken majburiy" });
    }

    try {
      const [existing] = await db
        .select()
        .from(memoriesTable)
        .where(eq(memoriesTable.id, id));

      if (!existing) {
        return res.status(404).json({ error: "Xotira topilmadi" });
      }
      if (existing.editToken !== editToken) {
        return res.status(403).json({ error: "Ruxsat yo'q" });
      }

      await db.delete(memoriesTable).where(eq(memoriesTable.id, id));
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
