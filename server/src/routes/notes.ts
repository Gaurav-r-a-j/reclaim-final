import express from "express";
import * as NotesController from "../controllers/notes";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get("/getnotes", NotesController.getNotes);

router.post("/create", requiresAuth, NotesController.createNotes);

router.get("/:noteId", requiresAuth, NotesController.getNote);

router.patch("/:noteId", NotesController.updatNote);

router.delete("/:noteId", requiresAuth, NotesController.deleteNote);

export default router;
