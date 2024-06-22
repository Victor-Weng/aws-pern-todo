require('dotenv').config();
const express = require("express"); // Get the library
const app = express(); // make the app run express
const cors = require("cors"); // lets front end make requests to back end
const pool = require("./db"); // require the db.js file from parent folder

// middleware
app.use(cors());
app.use(express.json());

//ROUTES//

// create a todo

app.post("/todos", async(req, res) => {
    try {
        
        //console.log(req.body);

        const { description } = req.body; // equivalent to const description = req.body.description;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING * ", // Returning returns back the data
            [description] // this argument replaces the $1 part kinda like f-string
        ); 

        res.json(newTodo.rows[0]); // Access the rows column that is returned after POST (in postman)
    } catch (err) {
        console.error(err.message);
        
    }
})

// get all todos

app.get("/todos", async(req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
        
    }
});

// get a todo (specific todo)

app.get("/todos/:id", async(req,res) => { 
    // the :id slot if replaced in url by something else, gets returned
    // This can be used to access specific elements. Ex. :subject returns { subject: '2'} for
    // url /todos/2
    try {
        const { id } = req.params; // const id = req.params.id;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", 
            [id]);
        // WHERE makes it access only the specified row, NOT all rows by default,
        
        //console.log(req.params);

        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
        
    }
})

// update a todo

app.put("/todos/:id", async(req,res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2",
            [description, id]
        );

        res.json("Todo was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// delete a todo

app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params; // const id = req.params.id;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1",
            [id]
        );
        res.json("Todo was deleted!");
    } catch (err) {
        console.error(err.message)
    }
})

// set the port from environment variable or default to 5000
const port = process.env.SV_port || 5000;

app.listen(port, () => {
    console.log("server has started on port "+ port.toString());
});
