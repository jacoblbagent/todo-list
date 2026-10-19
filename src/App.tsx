import { useMemo, useState } from "react";
import type { Filter, Todo } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { TodoItem } from "./components/TodoItem";

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "done", label: "Done" },
];

export default function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("tasks/todo-list/v1", []);
  const [filter, setFilter] = useState<Filter>("all");
  const [text, setText] = useState("");

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim().slice(0, 300);
    if (!value) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: value, done: false }]);
    setText("");
  };

  const toggleTask = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTask = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const updateTask = (id: string, newText: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: newText } : t)));

  const clearDone = () => setTodos((prev) => prev.filter((t) => !t.done));

  const countFor = (f: Filter) =>
    f === "all" ? todos.length : todos.filter((t) => t.done === (f === "done")).length;

  const isShown = (t: Todo, f: Filter) => f === "all" || t.done === (f === "done");
  const shown = useMemo(() => todos.filter((t) => isShown(t, filter)), [todos, filter]);

  return (
    <main className="app">
      <div className="card">
        <h1 className="title">Todo List</h1>
        <p className="hint">Double-click a task to edit. Enter saves, Esc cancels.</p>

        <form className="add-form" onSubmit={addTask}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs doing?"
            aria-label="New task text"
            maxLength={300}
          />
          <button className="add-btn" type="submit">Add</button>
        </form>

        {todos.length > 0 && (
          <div className="toolbar">
            <nav className="filters" aria-label="Filter tasks by status">
              {FILTERS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={`filter-tab${filter === id ? " on" : ""}`}
                  onClick={() => setFilter(id)}
                  aria-pressed={filter === id}
                >
                  {label}
                  <span className="count-pill">{countFor(id)}</span>
                </button>
              ))}
            </nav>

            {countFor("done") > 0 && (
              <button type="button" className="clear-btn" onClick={clearDone}>
                Clear done
              </button>
            )}
          </div>
        )}

        {shown.length === 0 ? (
          <p className="empty">No {filter} tasks yet.</p>
        ) : (
          <ul className="list">
            {shown.map((t) => (
              <TodoItem
                key={t.id}
                todo={t}
                onToggle={() => toggleTask(t.id)}
                onDelete={() => deleteTask(t.id)}
                onUpdate={(text2) => updateTask(t.id, text2)}
              />
            ))}
          </ul>
        )}

        {todos.length > 0 && (
          <div className="foot">
            <span>{countFor("active")} left</span>
            <span>/</span>
            <span>{todos.length} total</span>
          </div>
        )}
      </div>

      <p className="site-notice">Local-only, data stays in this browser.</p>
    </main>
  );
}
