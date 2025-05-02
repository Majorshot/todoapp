import { useState, useEffect } from "react";
import {
  Trash,
  Edit,
  CheckCircle,
  Plus,
  X,
  Save,
  AlertCircle,
} from "lucide-react";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [animation, setAnimation] = useState("");

  // Animation effect when todos change
  useEffect(() => {
    if (todos.length > 0) {
      setAnimation("animate-pulse");
      const timer = setTimeout(() => setAnimation(""), 500);
      return () => clearTimeout(timer);
    }
  }, [todos.length]);

  const handleAddTodo = () => {
    if (newTodo.trim() === "") {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000); // Hide warning after 3 seconds
      return;
    }

    const newTask = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      isNew: true, // For animation
    };

    setTodos([...todos, newTask]);
    setNewTodo("");
    setShowWarning(false);

    // Remove the "new" flag after animation completes
    setTimeout(() => {
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === newTask.id ? { ...todo, isNew: false } : todo
        )
      );
    }, 500);
  };

  const handleDelete = (id) => {
    // Find the task to be removed and mark it for deletion animation
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, deleting: true } : todo))
    );

    // Actually remove after animation completes
    setTimeout(() => {
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    }, 300);
  };

  const handleToggleComplete = (id) => {
    // If task is already completed, remove it
    const task = todos.find((todo) => todo.id === id);
    if (task && task.completed) {
      // Remove the task with animation
      handleDelete(id);
      return;
    }

    // Otherwise mark as completed with animation
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completing: true } : todo
      )
    );

    // Update completed status after brief animation
    setTimeout(() => {
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id
            ? { ...todo, completed: true, completing: false }
            : todo
        )
      );
    }, 300);
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    if (editText.trim() === "") {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: editText } : todo))
    );
    setEditingId(null);
    setShowWarning(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-800 to-indigo-950 flex flex-col transition-all duration-500 animate-gradient-x overflow-hidden">
      <div className="container mx-auto px-4 py-8 flex flex-col h-full max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 md:mb-8 text-white drop-shadow-lg animate-float">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            Todo App
          </span>
        </h1>

        <div className="bg-white bg-opacity-15 backdrop-blur-md p-4 md:p-6 rounded-xl shadow-2xl flex-1 flex flex-col border border-white border-opacity-20 transition-all duration-300 overflow-hidden">
          <div className="flex flex-col mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row group gap-2 sm:gap-0">
              <input
                type="text"
                className={`flex-1 border-2 ${
                  showWarning ? "border-red-400" : "border-white"
                } bg-white bg-opacity-80 rounded-lg sm:rounded-l-lg sm:rounded-r-none p-3 md:p-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 placeholder-gray-500 text-lg shadow-inner transition-all duration-300 group-hover:shadow-md`}
                placeholder="Add a new task"
                value={newTodo}
                onChange={(e) => {
                  setNewTodo(e.target.value);
                  if (showWarning) setShowWarning(false);
                }}
                onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
              />
              <button
                onClick={handleAddTodo}
                className="bg-yellow-500 text-gray-800 px-4 py-3 md:px-6 md:py-4 rounded-lg sm:rounded-l-none sm:rounded-r-lg hover:bg-yellow-400 flex items-center justify-center font-medium text-lg shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 active:scale-95"
              >
                <Plus
                  size={20}
                  className="mr-2 transform transition-transform group-hover:rotate-90 duration-300"
                />{" "}
                Add Task
              </button>
            </div>

            {showWarning && (
              <div className="flex items-center mt-2 text-red-600 bg-red-100 p-2 rounded-lg animate-slideDown">
                <AlertCircle size={16} className="mr-1 animate-pulse" />
                <span>Please enter a task before adding</span>
              </div>
            )}
          </div>

          <div className={`overflow-y-auto flex-1 ${animation} no-scrollbar`}>
            <ul className="grid gap-3 md:gap-4 pb-2">
              {todos.length === 0 && (
                <li className="text-white text-center py-6 md:py-8 bg-blue-400 bg-opacity-30 rounded-lg text-lg backdrop-blur-sm transition-all duration-300 hover:bg-opacity-40">
                  No tasks yet. Add one above!
                </li>
              )}

              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`p-3 md:p-5 border rounded-xl shadow-lg w-full flex flex-col 
                    ${
                      todo.completed
                        ? "bg-green-900 border-green-600 text-green-100"
                        : "bg-gray-800 bg-opacity-80 text-gray-100 border-gray-700"
                    } 
                    ${todo.isNew ? "animate-slideIn" : ""} 
                    ${
                      todo.deleting
                        ? "animate-slideOut opacity-0"
                        : "opacity-100"
                    } 
                    ${todo.completing ? "animate-completion" : ""}
                    transition-all duration-300 hover:shadow-xl transform hover:scale-[1.01]`}
                >
                  {editingId === todo.id ? (
                    <div className="flex flex-col animate-fadeIn">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                        <input
                          type="text"
                          className={`w-full sm:flex-1 border-2 ${
                            showWarning && editText.trim() === ""
                              ? "border-red-400"
                              : "border-gray-600"
                          } bg-gray-700 text-white rounded-lg p-2 sm:p-3 sm:mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-all duration-200 focus:shadow-inner placeholder-gray-400`}
                          value={editText}
                          onChange={(e) => {
                            setEditText(e.target.value);
                            if (showWarning) setShowWarning(false);
                          }}
                          autoFocus
                        />
                        <div className="flex w-full sm:w-auto gap-2 mt-2 sm:mt-0">
                          <button
                            onClick={() => saveEdit(todo.id)}
                            className="flex-1 sm:flex-initial bg-green-500 text-white p-2 sm:p-3 rounded-lg hover:bg-green-600 flex items-center justify-center transition-all duration-200 hover:shadow-md transform hover:scale-105 active:scale-95"
                          >
                            <Save size={18} className="mr-1" /> Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 sm:flex-initial bg-gray-500 text-white p-2 sm:p-3 rounded-lg hover:bg-gray-600 flex items-center justify-center transition-all duration-200 hover:shadow-md transform hover:scale-105 active:scale-95"
                          >
                            <X size={18} className="mr-1" /> Cancel
                          </button>
                        </div>
                      </div>

                      {showWarning && editText.trim() === "" && (
                        <div className="flex items-center mt-2 text-red-300 bg-red-900 p-2 rounded-lg animate-slideDown">
                          <AlertCircle
                            size={16}
                            className="mr-1 animate-pulse"
                          />
                          <span>Task cannot be empty</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="text-base md:text-xl font-medium mb-2 md:mb-3 pl-2 border-l-4 border-blue-500 py-2 px-3 bg-gray-900 rounded transition-all duration-300 hover:border-l-8 group">
                        <span
                          className={`${
                            todo.completed
                              ? "line-through text-gray-400"
                              : "text-gray-100"
                          } transition-all duration-300 break-words`}
                        >
                          {todo.text}
                        </span>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2 mt-2 md:mt-3">
                        <button
                          onClick={() => startEditing(todo.id, todo.text)}
                          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 flex items-center disabled:opacity-50 transition-all duration-200 hover:shadow-md transform hover:scale-105 active:scale-95 text-sm md:text-base"
                          disabled={todo.completed}
                        >
                          <Edit size={16} className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 flex items-center transition-all duration-200 hover:shadow-md transform hover:scale-105 active:scale-95 text-sm md:text-base"
                        >
                          <Trash size={16} className="mr-1" /> Remove
                        </button>
                        <button
                          onClick={() => handleToggleComplete(todo.id)}
                          className={`p-2 rounded-lg flex items-center ${
                            todo.completed
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gray-500 hover:bg-gray-600"
                          } text-white transition-all duration-200 hover:shadow-md transform hover:scale-105 active:scale-95 text-sm md:text-base`}
                        >
                          <CheckCircle size={16} className="mr-1" />{" "}
                          {todo.completed ? "Remove" : "Done"}
                        </button>
                      </div>
                    </div>
                  )}
                  {todo.completed && !editingId && (
                    <div className="mt-2 md:mt-3 text-xs md:text-sm text-green-300 font-medium bg-green-800 p-2 rounded-lg inline-flex items-center animate-pulse">
                      <CheckCircle size={14} className="mr-1" /> Task completed
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {todos.length > 0 && (
            <div className="mt-4 md:mt-6 text-center text-white text-opacity-80 text-xs md:text-sm animate-fadeIn">
              {todos.filter((t) => !t.completed).length} active task(s),{" "}
              {todos.filter((t) => t.completed).length} completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
