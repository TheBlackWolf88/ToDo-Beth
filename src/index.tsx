import { Hono } from "hono";

import { v4 as uuidv4 } from 'uuid'

import { createClient } from "@libsql/client";

import 'dotenv/config'

const port = parseInt(process.env.PORT) || 3000;

const app = new Hono();

const client = createClient({
    url: process.env.DB_URL,
    authToken: process.env.DB_TOKEN
})
interface Todo {
    id: string,
    name: string,
    isComplete: boolean
}

let todos: Todo[] = [];

const checkboxStyle = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-4"

const Layout = () => {
    return (
        <html lang="en">
            <head>
                <script src="https://unpkg.com/htmx.org@1.9.4" integrity="sha384-zUfuhFKKZCbHTY6aRR46gxiqszMk5tcHjsVFxnUo8VMus4kHGVdIYVbOYYNlKmHV" crossorigin="anonymous"></script>
                <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                <div class="h-screen w-screen bg-zinc-700 overflow-auto">
                    <h1 class="text-center text-6xl text-white font-bold mt-2">TodoHTMX</h1>
                    <h2 class="text-center text-4xl text-white italic mt-2">Da best</h2>
                    <div class="flex justify-center mt-12">
                        <TodoList todos={todos} />
                    </div>
                    <div class="flex justify-center">
                        <TodoForm />
                    </div>
                </div>
            </body>
        </html>)
}

const TodoList = (todos: { todos: Todo[] }) => {
    return (
        <ul id="todoList">
            {
                todos.todos.map((todo) => {
                    <TodoItem {...todo} />    
                })
            }
        </ul>
    )
}

const TodoForm = () => {
    return (
        <form hx-post="/addTodo" hx-swap="beforeend" hx-target="#todoList" _="on htmx:afterRequest reset() me" class="h-fit mt-12">
            <ul>
                <li><input placeholder="More like Todone" name="todo" type="text" class="bg-zinc-500 text-white rounded-md p-4" /></li>
                <li class="flex justify-center mt-4"><button class="bg-green-400 text-white border-2 border-green-600 p-4">Add Todo</button></li>
            </ul>
        </form>
    )
}

const TodoItem = (todo: Todo) => {
    return (
        <li class="text-green-500" hx-target="this">
            <input type="checkbox" value={todo.isComplete} class={checkboxStyle} hx-patch={"/updateTodo/" + todo.id} hx-swap="none" />
            {todo.name}
            <button hx-delete={"/deleteTodo/" + todo.id} class="ml-4">🗑</button>
        </li>
    )
}

app.get("/", (c) => {
    return c.html(<Layout />)

});

app.post("/addTodo", async (c) => {
    const todoBody = await c.req.parseBody()
    const todo: Todo = { id: uuidv4(), name: todoBody.todo, isComplete: false }
    if (todo.name == "") {
        return
    }
    todos.push(todo)
    return c.html(<TodoItem {...todo} />)
});

app.delete("/deleteTodo/:id", async (c) => {
    const id = c.req.param('id')
    todos = todos.filter((todo) => todo.id != id)
    console.log(todos)
    return (c.body("", 200))
})

app.patch("/updateTodo/:id", async (c) => {
    const id = c.req.param('id')
    const index = todos.findIndex((todo) => todo.id == id)
    todos[index].isComplete = !todos[index].isComplete
    console.log(todos)
    return c.body("", 200)
})



console.log(`Running at http://localhost:${port}`);

export default {
    port,
    fetch: app.fetch,
};
