import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import NotesItem from "./NotesItem";
import AddNote from "./AddNote";
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
  const history=useNavigate();
  const context = useContext(noteContext);
  const { notes, getAllNote, editNote } = context;
  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  useEffect(() => {
    if(localStorage.getItem('token')){
      getAllNote();
    }
    else{
      history('/login')
    }
    // eslint-disable-next-line
  }, []);

  const updateNote = (currentNote) => {
    
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
    ref.current.click();
   
  };

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleClick = (e) => {
    
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refclose.current.click();
    props.showAlert("Notes Updated Successfully","success");
  };

  const ref = useRef(null);
  const refclose = useRef(null);

  return (
    <>
      <AddNote showAlert={props.showAlert}/>

      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Notes
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="container">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    value={note.etitle || ""}
                    aria-describedby="emailHelp"
                    name="etitle"
                    onChange={handleChange}
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edescription"
                    value={note.edescription || ""}
                    name="edescription"
                    onChange={handleChange}
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    value={note.etag || ""}
                    name="etag"
                    onChange={handleChange}
                    minLength={5}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                ref={refclose}
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                disabled={note.etitle.length < 5 || note.edescription.length < 5 || note.etag.length<5}
                type="button"
                className="btn btn-primary"
                onClick={handleClick}
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <h1>View Note</h1>
        <div className="container">
          {notes.length===0 && 'No Notes to Display'}
        </div>
        {notes.map((note) => {
          return (
            <NotesItem key={note._id} note={note} showAlert={props.showAlert} updateNote={updateNote} />
          );
        })}
      </div>
    </>
  );
};
export default Notes;
