"use client";

import MainButton from "@/components/GeneralComponents/MainButton/main-button";
import { useEffect, useMemo, useState } from "react";
import ItemList from "../ItemList/item-list";
import { useToast } from "@/context/ToastContext";
import { useConfirm } from "@/context/ConfirmContext";

import styles from "./admin-controls.module.css";

export default function AdminControls({ type, items, children }) {
  const [itemsSearch, setItemsSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentItems, setCurrentItems] = useState(items);

  const { showToast } = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    setCurrentItems(items);
  }, [items]);

  const filteredItems = useMemo(() => {
    return currentItems.filter((item) => {
      return Object.values(item).some((val) => {
        if (Array.isArray(val)) {
          return val.some((el) =>
            String(el).toLowerCase().includes(itemsSearch.toLowerCase())
          );
        } else {
          return String(val).toLowerCase().includes(itemsSearch.toLowerCase());
        }
      });
    });
  }, [currentItems, itemsSearch]);

  const handleItemClick = (item) => {
    if (selectedItem && selectedItem.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  // Add Book
  const handleAdd = () => {
    if (!selectedItem) {
      showToast(`No ${type} selected.`, "warning");
      return;
    }
  };

  // Edit Book
  const handleEdit = async () => {
    if (!selectedItem) {
      showToast(`No ${type} selected.`, "warning");
      return;
    }

    const prevItems = [...currentItems];
    setCurrentItems((prev) =>
      prev.map((item) => (item.id === editedItem.id ? editedItem : item))
    );

    try {
      await updateBookInDb(editedItem);
    } catch (error) {
      showToast(
        `Failed to edit ${type.endsWith("s") ? type.slice(0, -1) : type}`,
        "error"
      );
      console.log(`Failed to edit: `, error);
      setCurrentItems(prevItems);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) {
      showToast(`No ${type} selected.`, "warning");
      return;
    }

    const confirmed = await confirm({
      title: `You're about to delete an item from ${type} table`,
      message:
        "This action will completely delete the item and all its references in the database.",
      buttonName: "Delete",
    });
    if (!confirmed) return;

    const prevItems = [...currentItems];
    setCurrentItems((prev) =>
      prev.filter((item) => item.id !== selectedItem.id)
    );

    try {
      await adminDeleteFromDb(type, selectedItem.id);
    } catch (error) {
      showToast(
        `Failed to delete ${type.endsWith("s") ? type.slice(0, -1) : type}`,
        "error"
      );
      console.log(`Failed to delete: `, error);
      setCurrentItems(prevItems);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} Search`}
          value={itemsSearch}
          onChange={(e) => setItemsSearch(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.buttonGroup}>
          <MainButton onClick={handleAdd}>
            <span>Add</span>
          </MainButton>
          <MainButton onClick={handleDelete}>
            <span>Delete</span>
          </MainButton>
          <MainButton onClick={handleEdit}>
            <span>Edit</span>
          </MainButton>
        </div>
      </div>

      <ItemList
        type={type}
        items={filteredItems}
        selectedItem={selectedItem}
        onItemClick={handleItemClick}
      >
        {children}
      </ItemList>
    </div>
  );
}
