import * as elements from "typed-html";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";

type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

export function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      <button
        class=""
        id="row"
        _="
        on click toggle .text-red-500 on me
        "
      >
        Row
      </button>
      <button
        class=""
        id="column"
        _="
        on click toggle.text-blue-500 on me
        "
      >
        Column
      </button>
      <TodoForm />
      <input
        class="my-2 border border-black"
        placeholder="Filter..."
        _="on keyup show <div /> in #display
          when it's innerHTML.toLowerCase() contains my value.toLowerCase()"
      >
      </input>
      <div id="display">
        {todos.map(todo => (
          <TodoItem {...todo} />
        ))}
      </div>
    </div>
  )
}
