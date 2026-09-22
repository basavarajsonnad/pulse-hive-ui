"use client";

import { useState } from "react";
import { Button, Checkbox, Collapse, Drawer } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import type { IFiltersDrawerProps, SelectedFilters } from "./types";
import { EMPTY_SELECTED_FILTERS, FILTER_SECTIONS } from "./utils";
import styles from "./styles/FiltersDrawer.module.scss";

export default function FiltersDrawer({ open, onClose }: IFiltersDrawerProps) {
  const [selected, setSelected] = useState<SelectedFilters>(
    EMPTY_SELECTED_FILTERS,
  );

  const handleOnSectionChange = (
    key: keyof SelectedFilters,
    values: string[],
  ) => setSelected((current) => ({ ...current, [key]: values }));

  const handleOnClear = () => setSelected(EMPTY_SELECTED_FILTERS);

  const handleOnApply = () => onClose();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filters"
      size={350}
      closable={{ placement: "end" }}
      destroyOnHidden
      className={styles.drawer}
      footer={
        <div className={styles.footer}>
          <Button type="primary" block onClick={handleOnApply}>
            Apply Filters
          </Button>
          <Button danger className={styles.clear} onClick={handleOnClear}>
            Clear
          </Button>
        </div>
      }
    >
      <Collapse
        className={styles.collapse}
        bordered={false}
        ghost
        defaultActiveKey={FILTER_SECTIONS.map((section) => section.key)}
        expandIconPlacement="end"
        expandIcon={({ isActive }) =>
          isActive ? <UpOutlined /> : <DownOutlined />
        }
        items={FILTER_SECTIONS.map((section) => ({
          key: section.key,
          label: section.title,
          children: (
            <Checkbox.Group
              className={styles.options}
              options={section.options}
              value={selected[section.key]}
              onChange={(values) =>
                handleOnSectionChange(section.key, values as string[])
              }
            />
          ),
        }))}
      />
    </Drawer>
  );
}
