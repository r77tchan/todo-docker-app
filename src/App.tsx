import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const API_BASE_URL = "http://localhost:3000";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/todos`);

        if (!response.ok) {
          throw new Error(`Failed to fetch todos: ${response.status}`);
        }

        const data: { todos: Todo[] } = await response.json();
        setTodos(data.todos);
        setError("");
      } catch (error) {
        console.error(error);
        setError("Todoの取得に失敗しました");
      }
    };

    void loadTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!title.trim()) return;

    try {
      setError("");

      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add todo: ${response.status}`);
      }

      const data: { todo: Todo } = await response.json();
      setTodos([...todos, data.todo]);
      setTitle("");
    } catch (error) {
      console.error(error);
      setError("Todoの追加に失敗しました");
    }
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
                if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                  void handleAddTodo();
                }
              }}
              placeholder="新しいタスクを入力..."
              aria-label="新しいタスクを入力"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={() => void handleAddTodo()}
              className="cursor-pointer rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 active:scale-95"
            >
              追加
            </button>
          </div>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

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
