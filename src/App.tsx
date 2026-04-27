import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch("https://localhost:3000/todos");
    const data = await response.json();
    setTodos(data);
  };

  const handleAddTodo = async () => {
    if (!title.trim()) return;

    const response = await fetch("https://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
    const data = await response.json();

    setTodos([...todos, { id: todos.length + 1, title, completed: false }]);
    setTitle("");
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
            📝 Todoアプリ
          </h1>

          <div className="mb-6 flex gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !(e.nativeEvent as any).isComposing) {
                  handleAddTodo();
                }
              }}
              placeholder="新しいタスクを入力..."
              aria-label="新しいタスクを入力"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleAddTodo}
              className="cursor-pointer rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 active:scale-95"
            >
              追加
            </button>
          </div>

          {todos.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p className="text-lg">タスクがありません</p>
              <p className="text-sm">新しいタスクを追加してください</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {todos.map((todo) => (
                <label>
                  <li
                    key={todo.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${todo.completed ? "border-gray-200 bg-gray-50" : "border-gray-300 bg-white hover:border-blue-300"} `}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo.id)}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600"
                    />
                    <span
                      className={`flex-1 ${todo.completed ? "text-gray-500 line-through" : "text-gray-800"}`}
                    >
                      {todo.title}
                    </span>
                  </li>
                </label>
              ))}
            </ul>
          )}

          {todos.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <p className="text-center text-sm text-gray-600">
                完了済み: {todos.filter((todo) => todo.completed).length} /{" "}
                {todos.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
