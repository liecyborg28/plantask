/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import PrivateComponent from "@/app/routes/private";
import axios from "axios";

export interface ListModel {
  title: string;
  tasks: TaskModel[];
}

export interface TaskModel {
  title: string;
  is_done: boolean;
}

export interface CategoryModel {
  title: string;
  lists: ListModel[];
}

function List({
  item,
  listIndex,
  categoryIndex,
  categories,
  editingListIndex,
  editingListTitle,
  setEditingListTitle,
  handleStartEditList,
  handleEditList,
  handleRemoveList,
  handleAddTaskToList,
  handleToggleTaskDone,
  handleEditTask,
  handleRemoveTask,
  handleMoveList,
}: any) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");

  return (
    <div className="card min-w-96 max-w-96 bg-base-100 shadow-sm max-h-min">
      <div className="card-body">
        <div className="flex justify-between items-center">
          {/* List Title */}
          <span className="text-lg font-bold">
            {editingListIndex?.cat === categoryIndex &&
            editingListIndex?.list === listIndex ? (
              <input
                value={editingListTitle}
                onChange={(e) => setEditingListTitle(e.target.value)}
                className="input input-sm input-bordered"
              />
            ) : (
              item.title
            )}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {editingListIndex?.cat === categoryIndex &&
            editingListIndex?.list === listIndex ? (
              <button
                onClick={() => handleEditList(categoryIndex, listIndex)}
                className="btn btn-sm btn-success">
                Save
              </button>
            ) : (
              <button
                onClick={() => handleStartEditList(categoryIndex, listIndex)}
                className="btn btn-sm btn-warning">
                Edit
              </button>
            )}

            <button
              onClick={() => handleRemoveList(categoryIndex, listIndex)}
              className="btn btn-sm btn-error">
              Remove
            </button>
          </div>
        </div>

        {/* Move List Dropdown */}
        <div className="mt-2">
          <select
            className="select select-bordered select-xs w-full"
            value={categoryIndex}
            onChange={(e) =>
              handleMoveList(categoryIndex, listIndex, Number(e.target.value))
            }>
            {categories.map((cat: CategoryModel, i: number) => (
              <option key={i} value={i}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* Task List */}
        <ul className="mt-3 flex flex-col gap-2 text-xs overflow-auto max-h-30">
          {item.tasks.map((task: TaskModel, i: number) => (
            <li key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.is_done}
                onChange={() =>
                  handleToggleTaskDone(categoryIndex, listIndex, i)
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
                          listIndex,
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
                      handleRemoveTask(categoryIndex, listIndex, i)
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
                handleAddTaskToList(
                  categoryIndex,
                  listIndex,
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

export default function Lists() {
  const [categories, setCategories] = useState<CategoryModel[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lists_data");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [categoryTitle, setCategoryTitle] = useState("");
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<
    number | null
  >(null);
  const [editingCategoryTitle, setEditingCategoryTitle] = useState("");

  const [listTitles, setListTitles] = useState<{ [key: number]: string }>({});
  const [editingListIndex, setEditingListIndex] = useState<{
    cat: number;
    list: number;
  } | null>(null);
  const [editingListTitle, setEditingListTitle] = useState("");

  useEffect(() => {
    localStorage.setItem("lists_data", JSON.stringify(categories));
  }, [categories]);

  // Category Actions
  function handleAddCategory() {
    if (!categoryTitle.trim()) return;
    const newCategory: CategoryModel = { title: categoryTitle, lists: [] };
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

  // List Actions
  // function handleAddList(categoryIndex: number) {
  //   const title = listTitles[categoryIndex] || "";
  //   if (!title.trim()) return;

  //   const newList: ListModel = { title, tasks: [] };

  //   setCategories((prev) =>
  //     prev.map((cat, i) =>
  //       i === categoryIndex ? { ...cat, lists: [...cat.lists, newList] } : cat
  //     )
  //   );

  //   setListTitles((prev) => ({ ...prev, [categoryIndex]: "" }));
  // }

  async function handleAddList(categoryIndex: number) {
    const title = listTitles[categoryIndex] || "";
    if (!title.trim()) return;

    // Tambahkan list kosong terlebih dahulu
    const newList: ListModel = { title, tasks: [] };
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex ? { ...cat, lists: [...cat.lists, newList] } : cat
      )
    );
    setListTitles((prev) => ({ ...prev, [categoryIndex]: "" }));

    // ======== Prompt AI untuk generate tasks ========
    const prompt = `
    Buatkan 3 sampai 5 task sederhana untuk daftar dengan judul: "${title}".
    Gunakan bahasa yang sama dengan judul list.
    Format output hanya array JSON murni, contoh:
    ["Task 1", "Task 2", "Task 3"]
  `;

    try {
      const res = await axios.post("/api/gemini", { prompt });
      let tasks: string[] = [];
      const text: string = res.data?.text || "";

      if (text) {
        try {
          tasks = JSON.parse(text);
        } catch {
          // fallback jika output AI tidak valid JSON
          tasks = text
            .replace(/[\[\]]/g, "")
            .split("\n")
            .map((t: string) => t.replace(/["',]/g, "").trim())
            .filter(Boolean);
        }
      }

      if (tasks.length > 0) {
        // update list terakhir di category dengan tasks dari AI
        setCategories((prev) =>
          prev.map((cat, i) =>
            i === categoryIndex
              ? {
                  ...cat,
                  lists: cat.lists.map((l, li) =>
                    li === cat.lists.length - 1
                      ? {
                          ...l,
                          tasks: tasks.map((t) => ({
                            title: t,
                            is_done: false,
                          })),
                        }
                      : l
                  ),
                }
              : cat
          )
        );
      }
    } catch (error: any) {
      console.error("Error fetch Gemini:", error);
    }
  }

  function handleRemoveList(categoryIndex: number, listIndex: number) {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? { ...cat, lists: cat.lists.filter((_, b) => b !== listIndex) }
          : cat
      )
    );
  }

  function handleStartEditList(categoryIndex: number, listIndex: number) {
    setEditingListIndex({ cat: categoryIndex, list: listIndex });
    setEditingListTitle(categories[categoryIndex].lists[listIndex].title);
  }

  function handleEditList(categoryIndex: number, listIndex: number) {
    if (!editingListTitle.trim()) return;
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              lists: cat.lists.map((b, bi) =>
                bi === listIndex ? { ...b, title: editingListTitle } : b
              ),
            }
          : cat
      )
    );
    setEditingListIndex(null);
    setEditingListTitle("");
  }

  function handleMoveList(
    fromCategory: number,
    listIndex: number,
    toCategory: number
  ) {
    if (fromCategory === toCategory) return;

    const listToMove = categories[fromCategory].lists[listIndex];

    setCategories((prev) => {
      const updated = [...prev];

      updated[fromCategory] = {
        ...updated[fromCategory],
        lists: updated[fromCategory].lists.filter((_, i) => i !== listIndex),
      };

      updated[toCategory] = {
        ...updated[toCategory],
        lists: [...updated[toCategory].lists, listToMove],
      };

      return updated;
    });
  }

  // Task Actions
  function handleAddTaskToList(
    categoryIndex: number,
    listIndex: number,
    taskTitle: string
  ) {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              lists: cat.lists.map((b, bi) =>
                bi === listIndex
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
    listIndex: number,
    taskIndex: number
  ) {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              lists: cat.lists.map((b, bi) =>
                bi === listIndex
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
    listIndex: number,
    taskIndex: number,
    newTitle: string
  ) {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              lists: cat.lists.map((b, bi) =>
                bi === listIndex
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
    listIndex: number,
    taskIndex: number
  ) {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              lists: cat.lists.map((b, bi) =>
                bi === listIndex
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
          {categories.length < 1 && (
            <div className="w-full flex justify-center items-center text-3xl">
              You haven’t created any lists yet
            </div>
          )}
          {categories.map((cat, catIdx) => (
            <div key={catIdx} className="flex flex-col gap-3 min-w-[400px]">
              <div className="flex gap-2 justify-between items-center">
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

              {/* Add List */}
              <div className="flex gap-2">
                <input
                  value={listTitles[catIdx] || ""}
                  onChange={(e) =>
                    setListTitles((prev) => ({
                      ...prev,
                      [catIdx]: e.target.value,
                    }))
                  }
                  type="text"
                  placeholder="New list title..."
                  className="input input-bordered input-sm flex-1"
                />
                <button
                  onClick={() => handleAddList(catIdx)}
                  className="btn btn-sm btn-primary">
                  + Add List
                </button>
              </div>

              {/* Lists */}
              {cat.lists.map((b, bIdx) => (
                <List
                  key={bIdx}
                  categoryIndex={catIdx}
                  listIndex={bIdx}
                  item={b}
                  categories={categories}
                  editingListIndex={editingListIndex}
                  editingListTitle={editingListTitle}
                  setEditingListTitle={setEditingListTitle}
                  handleStartEditList={handleStartEditList}
                  handleEditList={handleEditList}
                  handleRemoveList={handleRemoveList}
                  handleAddTaskToList={handleAddTaskToList}
                  handleToggleTaskDone={handleToggleTaskDone}
                  handleEditTask={handleEditTask}
                  handleRemoveTask={handleRemoveTask}
                  handleMoveList={handleMoveList}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </PrivateComponent>
  );
}
