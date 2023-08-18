import { Hono } from "hono";


const port = parseInt(process.env.PORT) || 3000;

const app = new Hono();

let todos: string[] = [];

const Layout = () => {
    return (
        <html lang="en">
            <head>
                <script src="https://unpkg.com/htmx.org@1.9.4" integrity="sha384-zUfuhFKKZCbHTY6aRR46gxiqszMk5tcHjsVFxnUo8VMus4kHGVdIYVbOYYNlKmHV" crossorigin="anonymous"></script>
                <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                <div class="h-screen w-screen flex justify-center align-middle bg-zinc-700">
                <TodoList todos={todos} />
                <TodoForm />
                </div>
            </body>
        </html>)
}

const TodoList = (todos: { todos: string[] }) => {
    return (
        <ul id="todoList">
            {
                todos.todos.map((todo) => {
                    <li _="on click remove me">{todo}</li>
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


app.get("/", (c) => {
    return c.html(<Layout />)

});

app.post("/addTodo", async (c) => {
    const todoBody = await c.req.parseBody()
    const todo = todoBody.todo
    if (todo == "") {
        return
    }
    todos.push(todo)
    console.log(todos)
    return c.html(<li _="on click remove me" class="text-green-500">{todo}</li>)
});

console.log(`Running at http://localhost:${port}`);

export default {
    port,
    fetch: app.fetch,
};
