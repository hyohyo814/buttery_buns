import html from "@elysiajs/html";
import { Elysia, t } from "elysia";
import * as elements from "typed-html";
import { db } from "./db";
import { todos } from "./db/schema"; 
import { eq, like } from "drizzle-orm";

const app = new Elysia()
  .use(html())
  .get("/", ({ html }) => html(
    <BaseHtml>
      <body
        class="flex w-full h-screen justify-center items-center text-4xl"
        hx-get="/todos"
        hx-trigger="load"
        hx-swap="innerHtml"
      />
    </BaseHtml>
  ))
  .get("/todos", async () => {
    const data = await db.select().from(todos).all();
    
    return <TodoList todos={data} />
  })
  .post(
    "/todos/toggle/:id",  
    async ({ params }) => {
      const oldTodo = await db
        .select()
        .from(todos)
        .where(eq(todos.id, params.id))
        .get();
      const newTodo = await db
        .update(todos)
        .set({ completed: !oldTodo?.completed })
        .where(eq(todos.id, params.id))
        .returning()
        .get()
      return <TodoItem {...newTodo} />
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .delete(
    "/todos/:id",
    async ({ params }) => {
      await db.delete(todos).where(eq(todos.id, params.id)).run();
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .post(
    "/todos",
    async ({ body }) => {
      if (body.content.length === 0) {
        throw new Error("Content cannot be empty");
      } 
      const newTodo = await db.insert(todos).values(body).returning().get();
      return <TodoItem {...newTodo} />;
    },
    {
      body: t.Object({
        content: t.String(),
      }),
    }
  )
  .listen(3000);

console.log(`Elysia running at http://${app.server?.hostname}:${app.server?.port}`);

const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buttery Buns</title>
  <script src="https://unpkg.com/htmx.org@1.9.5"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
</head>

${children}
`;

type Todo = {
  id: number;
  content: string;
  completed: boolean;
};


function TodoItem({ content, completed, id }: Todo) {
  return (
    <div class="flex flex-row space-x-3">
      <p>{content}</p>
      <input
        type="checkbox"
        checked={completed}
        hx-post={`/todos/toggle/${id}`}
        hx-target="closest div"
        hx-swap="outerHTML"
      />
      <button
        class="text-red-500"
        hx-delete={`/todos/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      >
        X
      </button>
    </div>
  )
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      <TodoForm />
      {todos.map(todo => (
        <TodoItem {...todo} />
      ))}
    </div>
  )
}

function TodoForm() {
  return (
    <form
      class="flex flex-row space-x-3"
      hx-post="/todos"
      hx-swap="afterend"
      _="on submit target.reset()"
    >
      <input type="text" name="content" class="border border-black" />
      <button type="submit">Add</button>
    </form>
  )
}
