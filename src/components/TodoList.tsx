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
      <TodoForm />
      {todos.map(todo => (
        <TodoItem {...todo} />
      ))}
    </div>
  )
}
