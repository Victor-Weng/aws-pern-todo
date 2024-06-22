import React, {Fragment, useEffect, useState } from "react";

import EditTodo from "./EditTodo";

const ListTodos = () => {

    const [todos, setTodos] = useState([]);

    // Delete Todo function

    const deleteTodo = async (id) => {
        try {
            const deleteTodo = await fetch(`${process.env.REACT_APP_API_URL}/todos/${id}`, {
                method: "DELETE"
            });

            //console.log(deleteTodo);
            
            setTodos(todos.filter(todo => todo.todo_id !== id)); 
            // Filter spits out every other todo other than the id one you want to delete

        } catch (err) {
            console.error(err.message);
        }
    }

    const getTodos = async () => {
        try {
            
            const response = await fetch(`${process.env.REACT_APP_API_URL}/todos`); // GET request
            const jsonData = await response.json()

            setTodos(jsonData);


        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getTodos();
    }, []); // the [] makes it only do one request

    //console.log(`CONSOLE: ${process.env.REACT_APP_API_URL}`);
    //console.log(todos);

    return <Fragment>
        {" "}
        <table class="table mt-5 test-center">
    <thead>
      <tr>
        <th>Description</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
        {/*<tr>
        <td>John</td>
        <td>Doe</td>
        <td>john@example.com</td>
      </tr>*/}
      {todos.map(todo => (
        <tr key={todo.todo_id}> {/* unique todo*/}
            <td>{todo.description}</td>
            <td>
                <EditTodo todo={todo}/>
            </td>
            <td>
                <button className="btn btn-danger" onClick={() => deleteTodo(todo.todo_id)}>Delete</button>
            </td>
        </tr>
      ))}
    </tbody>
  </table>
    </Fragment>;
};

export default ListTodos;