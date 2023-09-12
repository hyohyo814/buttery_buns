import html from "@elysiajs/html";
import { Elysia } from "elysia";
import * as elements from "typed-html";

const app = new Elysia()
  .use(html())
  .get("/", ({ html }) => html(
    <BaseHtml>
      <body class="flex w-full h-screen justify-center items-center text-4xl">
        <button hx-post="/clicked" hx-swap="outerHTML">
          button
        </button>
      </body>
    </BaseHtml>
  ))
  .post("/clicked", () => <div class="text-sky-500 text-4xl">Server response</div>)
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
</head>

${children}
`;

type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

const db: Todo[] = [
  { id: 1, content: "Learn the beth stack", completed: true },
  { id: 2, content: "Lean nvim", completed: true },
]

function TodoItem({ content, completed, id }: Todo) {
  return (
    <div class="flex flex-row space-x-3">
      <p>{content}</p>
      <input type="checkbox" checked={completed} />
      <button class="text-red-500">X</button>
    </div>
  )
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map(todo => (
        <TodoItem {...todo} />
      ))}
    </div>
  )
}
