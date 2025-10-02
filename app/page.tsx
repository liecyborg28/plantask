/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import PrivateComponent from "@/app/routes/private";

export interface BoardModel {
  title: string;
  tasks: TaskModel[];
}

export interface TaskModel {
  title: string;
  is_done: boolean;
}

export interface CategoryModel {
  title: string;
  boards: BoardModel[];
}

function Board({
  item,
  boardIndex,
  categoryIndex,
  editingBoardIndex,
  editingBoardTitle,
  setEditingBoardTitle,
  handleStartEditBoard,
  handleEditBoard,
  handleRemoveBoard,
  handleAddTaskToBoard,
  handleToggleTaskDone,
  handleEditTask,
  handleRemoveTask,
}: any) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");

  return (
    <div className="card min-w-96 max-w-96 bg-base-100 shadow-sm max-h-min">
      <div className="card-body">
        <div className="flex justify-between items-center">
          {/* Board Title */}
          <span className="text-lg font-bold">
            {editingBoardIndex?.cat === categoryIndex &&
            editingBoardIndex?.board === boardIndex ? (
              <input
                value={editingBoardTitle}
                onChange={(e) => setEditingBoardTitle(e.target.value)}
                className="input input-sm input-bordered"
              />
            ) : (
              item.title
            )}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {editingBoardIndex?.cat === categoryIndex &&
            editingBoardIndex?.board === boardIndex ? (
              <button
                onClick={() => handleEditBoard(categoryIndex, boardIndex)}
                className="btn btn-sm btn-success">
                Save
              </button>
            ) : (
              <button
                onClick={() => handleStartEditBoard(categoryIndex, boardIndex)}
                className="btn btn-sm btn-warning">
                Edit
              </button>
            )}

            <button
              onClick={() => handleRemoveBoard(categoryIndex, boardIndex)}
              className="btn btn-sm btn-error">
              Remove
            </button>
          </div>
        </div>

        {/* Task List */}
        <ul className="mt-3 flex flex-col gap-2 text-xs overflow-auto max-h-30">
          {item.tasks.map((task: TaskModel, i: number) => (
            <li key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.is_done}
                onChange={() =>
                  handleToggleTaskDone(categoryIndex, boardIndex, i)
                }
                className="checkbox checkbox-sm"
              />

              {editingTaskIndex === i ? (
                <>
                  <input
                    value={editingTaskTitle}
                    onChange={(e) => setEditingTaskTitle(e.target.value)}
                    className="input input-sm input-bordered flex-1"
                  />
                  <button
                    onClick={() => {
                      if (editingTaskTitle.trim()) {
                        handleEditTask(
                          categoryIndex,
                          boardIndex,
                          i,
                          editingTaskTitle.trim()
                        );
                        setEditingTaskIndex(null);
                        setEditingTaskTitle("");
                      }
                    }}
                    className="btn btn-xs btn-outline btn-success">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingTaskIndex(null);
                      setEditingTaskTitle("");
                    }}
                    className="btn btn-xs btn-outline btn-warning">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`flex-1 ${
                      task.is_done ? "line-through text-gray-400" : ""
                    }`}>
                    {task.title}
                  </span>
                  <button
                    onClick={() => {
                      setEditingTaskIndex(i);
                      setEditingTaskTitle(task.title);
                    }}
                    className="btn btn-ghost btn-xs btn-circle text-warning">
                    ✏️
                  </button>
                  <button
                    onClick={() =>
                      handleRemoveTask(categoryIndex, boardIndex, i)
                    }
                    className="btn btn-ghost btn-xs btn-circle text-error">
                    ❌
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Add Task */}
        <div className="mt-3 flex gap-2">
          <input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            type="text"
            placeholder="New task..."
            className="input input-sm input-bordered flex-1"
          />
          <button
            onClick={() => {
              if (newTaskTitle.trim()) {
                handleAddTaskToBoard(
                  categoryIndex,
                  boardIndex,
                  newTaskTitle.trim()
                );
                setNewTaskTitle("");
              }
            }}
            className="btn btn-sm btn-primary">
            + Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Boards() {
  // ✅ Load langsung dari localStorage saat inisialisasi
  const [categories, setCategories] = useState<CategoryModel[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("boards_data");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [categoryTitle, setCategoryTitle] = useState("");
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<
    number | null
  >(null);
  const [editingCategoryTitle, setEditingCategoryTitle] = useState("");

  // boardTitles per kategori
  const [boardTitles, setBoardTitles] = useState<{ [key: number]: string }>({});
  const [editingBoardIndex, setEditingBoardIndex] = useState<{
    cat: number;
    board: number;
  } | null>(null);
  const [editingBoardTitle, setEditingBoardTitle] = useState("");

  // ✅ Save ke localStorage tiap kali categories berubah
  useEffect(() => {
    localStorage.setItem("boards_data", JSON.stringify(categories));
  }, [categories]);

  // Category Actions
  function handleAddCategory() {
    if (!categoryTitle.trim()) return;
    const newCategory: CategoryModel = { title: categoryTitle, boards: [] };
    setCategories((prev) => [...prev, newCategory]);
    setCategoryTitle("");
  }

  function handleRemoveCategory(index: number) {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  }

  function handleStartEditCategory(index: number) {
    setEditingCategoryIndex(index);
    setEditingCategoryTitle(categories[index].title);
  }

  function handleEditCategory(index: number) {
    if (!editingCategoryTitle.trim()) return;
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === index ? { ...cat, title: editingCategoryTitle } : cat
      )
    );
    setEditingCategoryIndex(null);
    setEditingCategoryTitle("");
  }

  // Board Actions
  function handleAddBoard(categoryIndex: number) {
    const title = boardTitles[categoryIndex] || "";
    if (!title.trim()) return;

    const newBoard: BoardModel = { title, tasks: [] };

    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? { ...cat, boards: [...cat.boards, newBoard] }
          : cat
      )
    );

    setBoardTitles((prev) => ({ ...prev, [categoryIndex]: "" }));
  }

  function handleRemoveBoard(categoryIndex: number, boardIndex: number) {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? { ...cat, boards: cat.boards.filter((_, b) => b !== boardIndex) }
          : cat
      )
    );
  }

  function handleStartEditBoard(categoryIndex: number, boardIndex: number) {
    setEditingBoardIndex({ cat: categoryIndex, board: boardIndex });
    setEditingBoardTitle(categories[categoryIndex].boards[boardIndex].title);
  }

  function handleEditBoard(categoryIndex: number, boardIndex: number) {
    if (!editingBoardTitle.trim()) return;
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              boards: cat.boards.map((b, bi) =>
                bi === boardIndex ? { ...b, title: editingBoardTitle } : b
              ),
            }
          : cat
      )
    );
    setEditingBoardIndex(null);
    setEditingBoardTitle("");
  }

  // Task Actions
  function handleAddTaskToBoard(
    categoryIndex: number,
    boardIndex: number,
    taskTitle: string
  ) {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              boards: cat.boards.map((b, bi) =>
                bi === boardIndex
                  ? {
                      ...b,
                      tasks: [...b.tasks, { title: taskTitle, is_done: false }],
                    }
                  : b
              ),
            }
          : cat
      )
    );
  }

  function handleToggleTaskDone(
    categoryIndex: number,
    boardIndex: number,
    taskIndex: number
  ) {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              boards: cat.boards.map((b, bi) =>
                bi === boardIndex
                  ? {
                      ...b,
                      tasks: b.tasks.map((t, ti) =>
                        ti === taskIndex ? { ...t, is_done: !t.is_done } : t
                      ),
                    }
                  : b
              ),
            }
          : cat
      )
    );
  }

  function handleEditTask(
    categoryIndex: number,
    boardIndex: number,
    taskIndex: number,
    newTitle: string
  ) {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              boards: cat.boards.map((b, bi) =>
                bi === boardIndex
                  ? {
                      ...b,
                      tasks: b.tasks.map((t, ti) =>
                        ti === taskIndex ? { ...t, title: newTitle } : t
                      ),
                    }
                  : b
              ),
            }
          : cat
      )
    );
  }

  function handleRemoveTask(
    categoryIndex: number,
    boardIndex: number,
    taskIndex: number
  ) {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              boards: cat.boards.map((b, bi) =>
                bi === boardIndex
                  ? { ...b, tasks: b.tasks.filter((_, ti) => ti !== taskIndex) }
                  : b
              ),
            }
          : cat
      )
    );
  }

  return (
    <PrivateComponent>
      <div className="flex flex-col w-full h-[calc(100vh-64px)] bg-slate-800">
        {/* Add Category */}
        <div className="font-bold p-4 text-3xl flex gap-3">
          <input
            value={categoryTitle}
            onChange={(e) => setCategoryTitle(e.target.value)}
            type="text"
            placeholder="Type category title ..."
            className="input input-primary"
          />
          <button onClick={handleAddCategory} className="btn btn-accent">
            + Add Category
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-row gap-6 p-4 w-full h-[calc(100vh)] overflow-auto">
          {categories.map((cat, catIdx) => (
            <div key={catIdx} className="flex flex-col gap-3 min-w-[400px]">
              <div className="flex justify-between items-center">
                {editingCategoryIndex === catIdx ? (
                  <input
                    value={editingCategoryTitle}
                    onChange={(e) => setEditingCategoryTitle(e.target.value)}
                    className="input input-bordered input-sm"
                  />
                ) : (
                  <h2 className="text-xl font-bold">{cat.title}</h2>
                )}

                <div className="flex gap-2">
                  {editingCategoryIndex === catIdx ? (
                    <button
                      onClick={() => handleEditCategory(catIdx)}
                      className="btn btn-sm btn-success">
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartEditCategory(catIdx)}
                      className="btn btn-sm btn-warning">
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => handleRemoveCategory(catIdx)}
                    className="btn btn-sm btn-error">
                    Remove
                  </button>
                </div>
              </div>

              {/* Add Board */}
              <div className="flex gap-2">
                <input
                  value={boardTitles[catIdx] || ""}
                  onChange={(e) =>
                    setBoardTitles((prev) => ({
                      ...prev,
                      [catIdx]: e.target.value,
                    }))
                  }
                  type="text"
                  placeholder="New board title..."
                  className="input input-bordered input-sm flex-1"
                />
                <button
                  onClick={() => handleAddBoard(catIdx)}
                  className="btn btn-sm btn-primary">
                  + Add Board
                </button>
              </div>

              {/* Boards */}
              {cat.boards.map((b, bIdx) => (
                <Board
                  key={bIdx}
                  categoryIndex={catIdx}
                  boardIndex={bIdx}
                  item={b}
                  editingBoardIndex={editingBoardIndex}
                  editingBoardTitle={editingBoardTitle}
                  setEditingBoardTitle={setEditingBoardTitle}
                  handleStartEditBoard={handleStartEditBoard}
                  handleEditBoard={handleEditBoard}
                  handleRemoveBoard={handleRemoveBoard}
                  handleAddTaskToBoard={handleAddTaskToBoard}
                  handleToggleTaskDone={handleToggleTaskDone}
                  handleEditTask={handleEditTask}
                  handleRemoveTask={handleRemoveTask}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </PrivateComponent>
  );
}
