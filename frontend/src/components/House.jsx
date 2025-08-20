import axios from 'axios';
import React, { useEffect, useState } from 'react'
import NoteModel from './NoteModel';
import { useLocation } from 'react-router-dom';

const House = () => {
    const [notes, setNotes] = useState([])
    const [error, setError] = useState("");
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [editNote, setEditNote] = useState(null);
    const location = useLocation();
   


    const fetchNotes = async () => {
        try{
            const token = localStorage.getItem("token");
            if(!token) {
                setError("No authentication token found. Please login")
                return;
            }
            const searchParams = new URLSearchParams(location.search);
            const search = searchParams.get("search") || "";

            const {data} = await axios.get("/api/notes", {
                headers: {Authorization: `Bearer ${token}`},
            });
            const filteredNotes = search 
            ? data.filter(
                (note) => 
                    note.title.toLowerCase().includes(search.toLowerCase 
                        ()) || 
                        note.description.toLowerCase().includes(search.
                            toLowerCase()) 
                        ) 
                        : data;
            setNotes(filteredNotes)
            console.log(data);
        } catch (err) {
            setError("Failed to fetch notes")
        }
    };

    const handleEdit = (note) => {
        setEditNote(note);
        setIsModelOpen(true);
    }

    useEffect(() => {
        fetchNotes()
    }, [location.search]);

    const handleSaveNote = (newNote) => {
        if (editNote) {
            setNotes(notes.map((note) => note._id === newNote._id ? newNote : note))
        } else{
            setNotes([...notes, newNote]);
        }
        setEditNote(null);
        setIsModelOpen(false);
    }

    const handleDelete = async (id) => {
        try{
            const token = localStorage.getItem("token");
            if(!token) {
                setError("No authentication token found. Please login")
                return;
            }
            await axios.delete(`/api/notes/${id}`,{
            headers: {Authorization: `Bearer ${token}`},
            } );
            setNotes(notes.filter((note) => note._id !== id))

        } catch (err) {
            setError("Fail to delete note")

        }
    }

  return (
    <div className='container mx-auto px-4 py-8 min-h-screen bg-pink-200'>
        {error && <p className='text-red-400 mb-4'>{error}</p>}
        <NoteModel isOpen={isModelOpen} onClose={() => {
            setIsModelOpen(false);
            setEditNote(null);
            
        }}
        note={editNote}
        onSave={handleSaveNote}
        />
        <button onClick={() => setIsModelOpen(true)} className='fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white text-3xl rounded-full shadow-lg hover:bg-blue-800 flex items-center justify-center'>
            <span className='flex items-center justify-center h-full w-full pb-1'>+</span>
        </button>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {notes.map((note) =>(
                <div className='bg-blue-200 p-4 rounded-lg shadow-md' key={note._id}>
                    <h3 className='text-lg font-medium text-purple-600 mb-2'>{note.title}</h3>
                    <p className='text-gray-700 mb-4'>{note.description}</p>
                    <p className='text-sm text-gray-500 mb-4'>{new Date(note.updatedAt).toLocaleString()}</p>
                    <div className='flex space-x-2'>
                        <button onClick={() => handleEdit(note)}className='bg-violet-400 text-white px-3 py-2 rounded-md hover:bg-blue-500 text-gray-700'>Edit</button>
                         <button onClick={() => handleDelete(note._id)} className='bg-red-400 text-white px-3 py-2 rounded-md hover:bg-red-600 text-gray-700'>Delete</button>
                    </div>

                </div>
            ))}
        </div>
    </div>
  )
}

export default House