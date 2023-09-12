import html from "@elysiajs/html";
import { Elysia } from "elysia";
import * as elements from "typed-html";

const app = new Elysia()
  .use(html())
  .get("/", ({ html }) => html(
    <BaseHtml>
      <body>
        <button hx-post="/clicked" hx-swap="outerHTML">
          button
        </button>
      </body>
    </BaseHtml>
  ))
  .post("/clicked", () => <div>Server response</div>)
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
</head>

${children}
`

