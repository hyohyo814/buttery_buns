import * as elements from "typed-html";

type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

export function TodoItem({ content, completed, id }: Todo) {
  return (
    <div class="flex flex-row space-x-3">
      <input
        id={`checkbox/${id}`}
        class="peer hidden"
        type="checkbox"
        checked={completed}
        hx-post={`/todos/toggle/${id}`}
        hx-target="closest div"
        hx-swap="outerHTML"
      />
      <label
        for={`checkbox/${id}`}
        id={`item/${id}`}
        class="h-full w-full
        peer-checked:text-pink-500 hover:bg-sky-500"
      >
        {content}
      </label>
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
