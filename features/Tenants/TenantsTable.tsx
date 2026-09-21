"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  ConfigProvider,
  Input,
  Popover,
  Table,
  Tooltip,
  type TableProps,
} from "antd";
import {
  DownloadOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { useListTenantsQuery } from "@/features/Tenants/api";
import type { ColumnFilters, ITenant, ITenantsTableProps } from "./types";
import {
  EMPTY_TENANTS,
  downloadTenantsCsv,
  filterTenants,
  getTenantColumns,
  matchesColumnFilters,
} from "./utils";
import { useDateRangeFilter } from "./useDateRangeFilter";
import styles from "./styles/TenantsTable.module.scss";

export default function TenantsTable({ onRowClick }: ITenantsTableProps) {
  const { dateRange } = useDateRangeFilter();
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useListTenantsQuery();

  const allTenants = data?.jobs ?? EMPTY_TENANTS;

  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({});
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [fullscreen, setFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const tableData = useMemo(
    () =>
      filterTenants(allTenants, search, dateRange).filter((t) =>
        matchesColumnFilters(t, columnFilters),
      ),
    [allTenants, search, dateRange, columnFilters],
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

  const handleOnTableChange: TableProps<ITenant>["onChange"] = (_, filters) =>
    setColumnFilters(filters);

  const handleOnDownload = () => downloadTenantsCsv(tableData, "tenants.csv");

  const handleOnRow: TableProps<ITenant>["onRow"] = (tenant) => ({
    onClick: () => onRowClick(tenant),
  });

  const columns = getTenantColumns(columnFilters);

  const toggleableColumns = columns
    .filter((c) => c.key !== "customer")
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
        <h2 className={styles.title}>Customers — All customer groups</h2>
        <span className={styles.count}>
          {tableData.length} of {allTenants.length}
        </span>
        <Input
          size="small"
          allowClear
          className={styles.search}
          placeholder="Search..."
          aria-label="Search customers"
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

      {isError && (
        <Alert
          type="error"
          showIcon
          title="Couldn't load tenants"
          action={
            <Button size="small" onClick={refetch}>
              Retry
            </Button>
          }
        />
      )}

      {/* Popups must render inside the card or they vanish in full screen. */}
      <ConfigProvider getPopupContainer={getPopupContainer}>
        <Table<ITenant>
          size="small"
          rowKey="jobId"
          columns={visibleColumns}
          dataSource={tableData}
          loading={isLoading}
          onChange={handleOnTableChange}
          onRow={handleOnRow}
          scroll={{ x: "max-content" }}
          pagination={{
            placement: ["bottomStart"],
            defaultPageSize: 10,
            pageSizeOptions: [10, 20, 50, 100],
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
