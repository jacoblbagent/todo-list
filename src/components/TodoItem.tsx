import { useEffect, useRef, useState } from "react";
import type { Todo } from "../types";

type Props = {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (text: string) => void;
};

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    const value = draft.trim().slice(0, 300);
    if (!value) onDelete();
    else if (value !== todo.text) onUpdate(value);
    setEditing(false);
  };

  return (
    <li className={`todo-item${todo.done ? " is-done" : ""}${editing ? " editing" : ""}`}>
      <input type="checkbox" checked={todo.done} onChange={onToggle} aria-label={`Mark "${todo.text}" as ${todo.done ? "active" : "done"}`} />

      {editing ? (
        <input
          ref={inputRef}
          className="edit-input"
          value={draft}
          maxLength={300}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            else if (e.key === "Escape") {
              setDraft(todo.text);
              setEditing(false);
            }
          }}
        />
      ) : (
        <span className="text" onDoubleClick={() => setEditing(true)} title={todo.text}>
          {todo.text}
        </span>
      )}

      {!editing && (
        <button type="button" className="del" onClick={onDelete} aria-label={`Delete "${todo.text}"`}>
          &times;
        </button>
      )}
    </li>
  );
}
