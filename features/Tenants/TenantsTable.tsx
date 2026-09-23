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
import type { ColumnFilters, ITenant, ITenantsTableProps } from "./types";
import {
  downloadTenantsCsv,
  filterTenants,
  getTenantColumns,
  matchesColumnFilters,
} from "./utils";
import { useDateRangeFilter } from "@/shared/hooks/useDateRangeFilter";
import translator from "@/i18n/translator";
import styles from "./styles/TenantsTable.module.scss";

export default function TenantsTable({
  tenants,
  isLoading,
  isError,
  onRetry,
  page,
  pageSize,
  totalElements,
  onPageChange,
  onRowClick,
}: ITenantsTableProps) {
  const { dateRange } = useDateRangeFilter();
  const [search, setSearch] = useState("");

  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({});
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [fullscreen, setFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const tableData = useMemo(
    () =>
      filterTenants(tenants, search, dateRange).filter((t) =>
        matchesColumnFilters(t, columnFilters),
      ),
    [tenants, search, dateRange, columnFilters],
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

  const handleOnTableChange: TableProps<ITenant>["onChange"] = (
    pagination,
    filters,
  ) => {
    setColumnFilters(filters);
    if (pagination.current && pagination.pageSize) {
      onPageChange(pagination.current, pagination.pageSize);
    }
  };

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
        <h2 className={styles.title}>{translator("tenants.table.title")}</h2>
        <span className={styles.count}>
          {translator("common.countOf", {
            count: tableData.length,
            total: totalElements,
          })}
        </span>
        <Input
          size="small"
          allowClear
          className={styles.search}
          placeholder={translator("common.search")}
          aria-label={translator("tenants.table.searchAriaLabel")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Popover
          trigger="click"
          placement="bottomRight"
          title={translator("common.columns")}
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
            aria-label={translator("common.chooseColumns")}
          />
        </Popover>
        <Tooltip title={translator("common.downloadCsv")}>
          <Button
            size="small"
            icon={<DownloadOutlined />}
            aria-label={translator("common.downloadCsv")}
            onClick={handleOnDownload}
          />
        </Tooltip>
        <Tooltip
          title={
            fullscreen
              ? translator("common.exitFullScreen")
              : translator("common.fullScreen")
          }
        >
          <Button
            size="small"
            icon={
              fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
            }
            aria-label={translator("common.toggleFullScreen")}
            onClick={handleOnToggleFullscreen}
          />
        </Tooltip>
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          title={translator("tenants.table.loadError")}
          action={
            <Button size="small" onClick={onRetry}>
              {translator("common.retry")}
            </Button>
          }
        />
      )}

      {/* Popups must render inside the card or they vanish in full screen. */}
      <ConfigProvider getPopupContainer={getPopupContainer}>
        <Table<ITenant>
          size="small"
          rowKey="customerName"
          columns={visibleColumns}
          dataSource={tableData}
          loading={isLoading}
          onChange={handleOnTableChange}
          onRow={handleOnRow}
          scroll={{ x: "max-content" }}
          pagination={{
            placement: ["bottomStart"],
            current: page,
            pageSize,
            total: totalElements,
            pageSizeOptions: [10, 20, 50, 100],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, [from, to]) =>
              translator("common.pageRange", { from, to, total }),
            size: "small",
          }}
        />
      </ConfigProvider>
    </div>
  );
}
