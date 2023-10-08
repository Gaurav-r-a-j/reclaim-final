import { RequestHandler } from "express";
import NoteModel from "../model/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";
import users from "../model/user";


export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    // Remove the authentication check

    // Fetch notes without any user-specific filtering
    const notes = await NoteModel.find({}).exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Not a valid Note Id");
    }
    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    // if (!note.userId.equals(authenticatedUserId)) {
    //   throw createHttpError(401, "you can not access this note");
    // }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

interface CreateNoteBody {
  title?: string;
  text?: string;
  image?: string;
  campus: string;
  place?: string;
  tag?: string;
}



export const createNotes: RequestHandler = async (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;
  const image = req.body.image;
  const campus = req.body.campus;
  const place = req.body.place;
  const tag = req.body.tag;

  const { userId } = req;

  try {
    // Find the user using userId
    const user = await users.findById(userId).exec();

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    // Your validation logic or other operations here

    if (!title) {
      throw createHttpError(400, 'Note must have a title');
    }

    // Create a new note with userId
    const newNote = await NoteModel.create({
      userId: userId,
      title: title,
      text: text,
      image: image,
      campus: campus,
      place: place,
      tag: tag,
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

interface updateNoteParams {
  noteId: string;
}

interface updateNoteBody {
  title?: string;
  text?: string;
}

export const updatNote: RequestHandler<
  updateNoteParams,
  unknown,
  updateNoteBody,
  unknown
> = async (req, res, next) => {
  const noteId = req.params.noteId;
  const newTitle = req.body.title;
  const newText = req.body.text;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(404, "Invalid note id");
    }

    if (!newTitle) {
      throw createHttpError(400, "Note Must Have a title");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not Foound");
    }

    // if (!note.userId.equals(authenticatedUserId)) {
    //   throw createHttpError(401, "you can not access this note");
    // }

    note.title = newTitle;
    note.text = newText;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "invalid note id");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not Foound");
    }
    // if (!note.userId.equals(authenticatedUserId)) {
    //   throw createHttpError(401, "you can not access this note");
    // }

    await note.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
