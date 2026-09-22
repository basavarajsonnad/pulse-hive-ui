"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  ConfigProvider,
  Input,
  Popover,
  Table,
  Tooltip,
} from "antd";
import {
  DownloadOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  TableOutlined,
} from "@ant-design/icons";
import type { ICustomerGroupsTableProps } from "./types";
import {
  downloadCustomerGroupsCsv,
  filterCustomerGroups,
  getCustomerGroupColumns,
} from "./utils";
import { DEFAULT_PAGE_SIZE } from "@/utils/constants/appConstants";
import styles from "./styles/CustomerGroupsTable.module.scss";

export default function CustomerGroupsTable({
  customerGroups,
  isLoading,
}: ICustomerGroupsTableProps) {
  const [search, setSearch] = useState("");
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [fullscreen, setFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const tableData = useMemo(
    () => filterCustomerGroups(customerGroups, search),
    [customerGroups, search],
  );

  useEffect(() => {
    const handleOnFullscreenChange = () =>
      setFullscreen(document.fullscreenElement === cardRef.current);
    document.addEventListener("fullscreenchange", handleOnFullscreenChange);
    return () =>
      document.removeEventListener(
        "fullscreenchange",
        handleOnFullscreenChange,
      );
  }, []);

  const handleOnToggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else cardRef.current?.requestFullscreen();
  };

  const handleOnDownload = () =>
    downloadCustomerGroupsCsv(tableData, "customer-groups.csv");

  const columns = getCustomerGroupColumns();

  const toggleableColumns = columns
    .filter((c) => c.key !== "customerGroup")
    .map((c) => ({ value: String(c.key), label: String(c.title) }));
  const visibleColumns = columns.filter(
    (c) => !hiddenColumns.includes(String(c.key)),
  );

  const handleOnColumnsChange = (shown: string[]) =>
    setHiddenColumns(
      toggleableColumns
        .map((c) => c.value)
        .filter((key) => !shown.includes(key)),
    );

  const getPopupContainer = () => cardRef.current ?? document.body;

  return (
    <div ref={cardRef} className={styles.card}>
      <div className={styles.toolbar}>
        <h2 className={styles.title}>Customer groups</h2>
        <span className={styles.count}>{tableData.length} of 15</span>
        <Input
          size="small"
          allowClear
          className={styles.search}
          placeholder="Search..."
          aria-label="Search customer groups"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Popover
          trigger="click"
          placement="bottomRight"
          title="Columns"
          getPopupContainer={getPopupContainer}
          content={
            <Checkbox.Group
              className={styles.columnPicker}
              options={toggleableColumns}
              value={toggleableColumns
                .map((c) => c.value)
                .filter((key) => !hiddenColumns.includes(key))}
              onChange={handleOnColumnsChange}
            />
          }
        >
          <Button
            size="small"
            icon={<TableOutlined />}
            aria-label="Choose columns"
          />
        </Popover>
        <Tooltip title="Download CSV">
          <Button
            size="small"
            icon={<DownloadOutlined />}
            aria-label="Download CSV"
            onClick={handleOnDownload}
          />
        </Tooltip>
        <Tooltip title={fullscreen ? "Exit full screen" : "Full screen"}>
          <Button
            size="small"
            icon={
              fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
            }
            aria-label="Toggle full screen"
            onClick={handleOnToggleFullscreen}
          />
        </Tooltip>
      </div>

      <ConfigProvider getPopupContainer={getPopupContainer}>
        <Table
          size="small"
          rowKey="customerGroup"
          columns={visibleColumns}
          dataSource={tableData}
          loading={isLoading}
          scroll={{ x: "max-content" }}
          pagination={{
            placement: ["bottomStart"],
            defaultPageSize: DEFAULT_PAGE_SIZE,
            pageSizeOptions: [10, 25, 50, 100],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, [from, to]) => `${from}–${to} of ${total}`,
            size: "small",
          }}
        />
      </ConfigProvider>
    </div>
  );
}
