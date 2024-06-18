const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// Route 1: Get all notes using Get "/api/notes/fetchallnotes" Login Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
  res.json(notes);
     } catch (error) {
        console.log(error.message)
        res.status(500).send("internal server error");
    }
  
});

// Route 2: Add a new notes using Post "/api/notes/addnote" Login Required
router.post("/addnote",fetchuser,
  [
    body("title", "Enter a Valid Title").isLength({ min: 3 }),
    body("description", "description must be min 5 char").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // if there are errors return bad request and Errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("internal server error");
    }
  }
);

// Route 3: Update an existing notes using Put "/api/notes/updatenote" Login Required
router.put("/updatenote/:id",fetchuser,async (req, res) => {
    const{title,description,tag}=req.body;
    try {
        
    
    // create a newNote Object
    const newnote={};
    if(title){newnote.title=title};
    if(description){newnote.description=description};
    if(tag){newnote.tag=tag};

    // Find the note to be updated to update
    let note=await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    }

    note=await Note.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
    res.json({note})
} catch (error) {
    console.log(error.message);
    res.status(500).send("internal server error");
  }
  })


 // Route 4: Delete an existing notes using Delete "/api/notes/deletenote" Login Required
router.delete("/deletenote/:id",fetchuser,async (req, res) => {
    try {
        
    // Find the note to be Deleted  to delete
    let note=await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}
    
    // Allow deletion only if user owns this note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    }

    note=await Note.findByIdAndDelete(req.params.id)
    res.json({"Success":"note has been deleted",note:note})
} catch (error) {
    console.log(error.message);
    res.status(500).send("internal server error");
  }
  })

module.exports = router;
