import { serve } from "@hono/node-server";
import { Hono } from "hono";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const app = new Hono();

const todos: Todo[] = [];

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

/*
curl localhost:3000/todos
*/
app.get("/todos", (c) => {
  return c.json({ todos });
});

/*
curl -X POST -H "Content-Type: application/json" -d '{"title": "New Todo"}' localhost:3000/todos -v
*/
app.post("/todos", async (c) => {
  const { title } = await c.req.json();
  const newTodo: Todo = {
    id: todos.length + 1,
    title,
    completed: false,
  };
  todos.push(newTodo);
  return c.json({ todo: newTodo });
});

/*
curl -X PUT -H "Content-Type: application/json" -d '{"completed": true}' localhost:3000/todos/1
*/
app.put("/todos/:id", async (c) => {
  const { id } = c.req.param();
  const { completed } = await c.req.json();
  const todo = todos.find((t) => t.id === Number(id));

  if (!todo) {
    return c.notFound();
  }

  todo.completed = completed;
  return c.json({ todo });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
