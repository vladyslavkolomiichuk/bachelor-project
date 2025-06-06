"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import {
  addWordToDb,
  deleteWordFromDb,
  getDictionaryWords,
  updateWordToDb,
} from "@/lib/db/dictionary";
import { useToast } from "@/context/ToastContext";
import { useConfirm } from "@/context/ConfirmContext";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import CircleButton from "../GeneralComponents/CircleButton/circle-button";
import { useRouter } from "nextjs13-progress";
import { useUser } from "@/context/UserContext";
import WordPreviewSkeleton from "../Loading/Components/word-preview-skeleton";

import styles from "./dictionary.module.css";

export default function Dictionary() {
  const [words, setWords] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newWord, setNewWord] = useState({
    word: "",
    meaning: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedWord, setEditedWord] = useState({
    word: "",
    meaning: "",
    category: "",
    date: "",
  });

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      const userWords = await getDictionaryWords(userId);
      setWords(userWords);
      setLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [userId]);

  const [isPending, startTransition] = useTransition();

  const { showToast } = useToast();
  const confirm = useConfirm();

  const [filterDate, setFilterDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const categories = useMemo(() => {
    const cats = new Set(words.map((item) => item.category).filter(Boolean));
    return Array.from(cats);
  }, [words]);

  const filteredWords = useMemo(() => {
    return words.filter((word) => {
      const matchDate = filterDate
        ? new Date(word.date).toLocaleDateString() ===
          new Date(filterDate).toLocaleDateString()
        : true;
      const matchCategory = filterCategory
        ? word.category === filterCategory
        : true;
      return matchDate && matchCategory;
    });
  }, [words, filterDate, filterCategory]);

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    if (!newWord.word.trim() || !newWord.meaning.trim()) {
      showToast("Word and meaning are required", "warning");
      return;
    }

    const tempId = Date.now() * -1;
    setWords((prev) => [
      {
        id: tempId,
        ...newWord,
        word: newWord.word,
        meaning: newWord.meaning,
      },
      ...prev,
    ]);
    setAdding(false);

    startTransition(async () => {
      try {
        const savedWord = await addWordToDb(
          userId,
          newWord.word,
          newWord.meaning,
          newWord.category,
          newWord.date
        );
        setWords((prev) =>
          prev.map((word) => (word.id === tempId ? savedWord : word))
        );
      } catch (error) {
        showToast("Failed to add word. Try later", "error");
        setWords((prev) => prev.filter((word) => word.id !== tempId));
      }
    });

    setNewWord({
      word: "",
      meaning: "",
      category: "",
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: "You're about to delete this word from your dictionary",
      message: "This action will remove the word from your dictionary.",
      buttonName: "Delete",
    });
    if (!confirmed) return;

    const prevWords = words;

    setWords((prev) => prev.filter((word) => word.id !== id));

    startTransition(async () => {
      try {
        await deleteWordFromDb(id);
      } catch (error) {
        showToast(`Failed to delete word. Try later.`, "error");
        setWords(prevWords);
      }
    });
  };

  const handleEdit = (id) => {
    const wordToEdit = words.find((item) => item.id === id);
    setIsEditing(id);
    setEditedWord({
      word: wordToEdit.word,
      meaning: wordToEdit.meaning,
      category: wordToEdit.category,
      date: wordToEdit.date,
    });
  };

  const handleUpdate = async (id) => {
    setWords((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              word: editedWord.word,
              meaning: editedWord.meaning,
              category: editedWord.category,
              date: editedWord.date,
            }
          : item
      )
    );
    setIsEditing(null);

    startTransition(async () => {
      try {
        await updateWordToDb(
          userId,
          id,
          editedWord.word,
          editedWord.meaning,
          editedWord.category,
          editedWord.date
        );
      } catch (error) {
        showToast("Failed to update changes. Try later", "error");
        setWords((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  word: item.word,
                  meaning: item.meaning,
                  category: item.category,
                  date: item.date,
                }
              : item
          )
        );
      }
    });
  };

  return (
    <div className={styles.container}>
      <p className={styles.description}>
        You can add unknown words or phrases to this interactive dictionary,
        track your progress in learning them, and learn more about them
      </p>

      <div className={styles.filters}>
        <input
          type="date"
          value={filterDate}
          onChange={(event) => setFilterDate(event.target.value)}
          className={styles.filterInput}
          placeholder="Select date"
        />
        <select
          value={filterCategory}
          onChange={(event) => setFilterCategory(event.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th>Word</th>
            <th>Meaning</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
          {adding && (
            <tr className={styles.addRow}>
              <td>
                <input
                  required
                  value={newWord.word}
                  onChange={(event) =>
                    setNewWord({ ...newWord, word: event.target.value })
                  }
                  className={styles.newWordInput}
                  placeholder="Word"
                />
              </td>
              <td>
                <input
                  required
                  value={newWord.meaning}
                  onChange={(event) =>
                    setNewWord({ ...newWord, meaning: event.target.value })
                  }
                  className={styles.newWordInput}
                  placeholder="Meaning"
                />
              </td>
              <td>
                <input
                  value={newWord.category}
                  onChange={(event) =>
                    setNewWord({ ...newWord, category: event.target.value })
                  }
                  className={styles.newWordInput}
                  placeholder="Category"
                />
              </td>
              <td>
                <input
                  type="date"
                  value={newWord.date}
                  onChange={(event) =>
                    setNewWord({ ...newWord, date: event.target.value })
                  }
                  className={styles.newWordInput}
                />
              </td>
              <td>
                <button
                  onClick={handleAddSubmit}
                  className={styles.actionButton}
                  type="button"
                >
                  <Save />
                </button>
                <button
                  onClick={() => setAdding(false)}
                  className={styles.actionButton}
                  type="button"
                >
                  <X />
                </button>
              </td>
            </tr>
          )}
        </thead>
        <tbody>
          {!loading ? (
            filteredWords.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.noData}>
                  Nothing found
                </td>
              </tr>
            ) : (
              filteredWords.map(({ id, word, meaning, category, date }) => (
                <tr key={id} className={styles.row}>
                  <td>
                    {isEditing === id ? (
                      <input
                        type="text"
                        value={editedWord.word}
                        onChange={(event) =>
                          setEditedWord({
                            ...editedWord,
                            word: event.target.value,
                          })
                        }
                        className={styles.newWordInput}
                      />
                    ) : (
                      word
                    )}
                  </td>
                  <td>
                    {isEditing === id ? (
                      <input
                        type="text"
                        value={editedWord.meaning}
                        onChange={(event) =>
                          setEditedWord({
                            ...editedWord,
                            meaning: event.target.value,
                          })
                        }
                        className={styles.newWordInput}
                      />
                    ) : (
                      meaning
                    )}
                  </td>
                  <td>
                    {isEditing === id ? (
                      <input
                        type="text"
                        value={editedWord.category}
                        onChange={(event) =>
                          setEditedWord({
                            ...editedWord,
                            category: event.target.value,
                          })
                        }
                        className={styles.newWordInput}
                      />
                    ) : (
                      category
                    )}
                  </td>
                  <td>
                    {isEditing === id ? (
                      <input
                        type="date"
                        value={editedWord.date}
                        onChange={(event) =>
                          setEditedWord({
                            ...editedWord,
                            date: event.target.value,
                          })
                        }
                        className={styles.newWordInput}
                      />
                    ) : (
                      new Date(date).toLocaleDateString()
                    )}
                  </td>
                  <td>
                    {isEditing === id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdate(id)}
                          className={styles.actionButton}
                        >
                          <Save />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(null)}
                          className={styles.actionButton}
                        >
                          <X />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={() => handleEdit(id)}
                        >
                          <Pencil />
                        </button>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={() => handleDelete(id)}
                        >
                          <Trash2 />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )
          ) : (
            <tr className={styles.row}>
              <WordPreviewSkeleton />
            </tr>
          )}
        </tbody>
      </table>

      <CircleButton
        type="button"
        colorType="success"
        onClick={() => setAdding((prev) => !prev)}
      >
        <Plus />
      </CircleButton>
    </div>
  );
}
