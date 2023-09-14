import html from "@elysiajs/html";
import { Elysia, t } from "elysia";
import * as elements from "typed-html";
import { db } from "./db";
import { todos } from "./db/schema"; 
import { eq } from "drizzle-orm";
import { TodoItem } from "./components/TodoItem";
import { TodoList } from "./components/TodoList";

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

