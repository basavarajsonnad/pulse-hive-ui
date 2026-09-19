"use client";

import { useRef, useState } from "react";
import { Input, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { IEditableCellProps } from "./types";
import styles from "./styles/EditableCell.module.scss";

export default function EditableCell({
  value,
  label,
  onSave,
  options,
  children,
}: IEditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  // Enter/Esc unmount the field, which can also fire blur — only finish once.
  const finished = useRef(false);

  const handleOnStart = () => {
    finished.current = false;
    setDraft(value);
    setEditing(true);
  };

  const handleOnCommit = (next: string) => {
    if (finished.current) return;
    finished.current = true;
    setEditing(false);
    const trimmed = next.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
  };

  const handleOnCancel = () => {
    finished.current = true;
    setEditing(false);
  };

  if (editing) {
    return options ? (
      <Select
        size="small"
        autoFocus
        defaultOpen
        className={styles.field}
        aria-label={`Edit ${label}`}
        value={draft}
        options={options.map((option) => ({ value: option, label: option }))}
        onChange={handleOnCommit}
        onBlur={handleOnCancel}
      />
    ) : (
      <Input
        size="small"
        autoFocus
        className={styles.field}
        aria-label={`Edit ${label}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onPressEnter={() => handleOnCommit(draft)}
        onBlur={() => handleOnCommit(draft)}
        onKeyDown={(e) => e.key === "Escape" && handleOnCancel()}
      />
    );
  }

  return (
    <span className={styles.cell}>
      {children}
      <button
        type="button"
        className={styles.pencil}
        aria-label={`Edit ${label}`}
        onClick={handleOnStart}
      >
        <EditOutlined />
      </button>
    </span>
  );
}
