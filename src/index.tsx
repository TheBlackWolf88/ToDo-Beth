import { Hono } from "hono";

const port = parseInt(process.env.PORT) || 3000;

const app = new Hono();

let todos: string[] = [];

const Layout = () => {
    return (<html>
        <head>
            <script src="https://unpkg.com/htmx.org@1.9.4" integrity="sha384-zUfuhFKKZCbHTY6aRR46gxiqszMk5tcHjsVFxnUo8VMus4kHGVdIYVbOYYNlKmHV" crossorigin="anonymous"></script>
            <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
        </head>
        <body>
            <TodoList todos={todos} />
            <TodoForm />
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
        <form hx-post="/addTodo" hx-swap="beforeend" hx-target="#todoList" _="on htmx:afterRequest reset() me">
            <input placeholder="More like Todone" name="todo" type="text" />
            <button>Add Todo</button>
        </form>
    )
}


app.get("/", (c) => {
    return c.html(<Layout />)

});

app.get("/try", (c) => {
    return c.html(<h1>nt</h1>)
});

app.post("/addTodo", async (c) => {
    const todoBody = await c.req.parseBody()
    const todo = todoBody.todo
    todos.push(todo)
    console.log(todos)
    return c.html(<li _="on click remove me">{todo}</li>)
});

console.log(`Running at http://localhost:${port}`);

export default {
    port,
    fetch: app.fetch,
};
