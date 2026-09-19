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
  type TableProps,
} from "antd";
import {
  DownloadOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteTenant,
  selectAllTenants,
  selectCustomerGroups,
  selectSearch,
  selectVisibleTenants,
  setSearch,
  toggleStatus,
  updateTenant,
} from "@/store/slices/tenantsSlice";
import type {
  ColumnFilters,
  ITenant,
  ITenantsTableProps,
  TenantChanges,
} from "./types";
import {
  downloadTenantsCsv,
  getTenantColumns,
  matchesColumnFilters,
} from "./utils";
import styles from "./styles/TenantsTable.module.scss";

export default function TenantsTable({ onEdit }: ITenantsTableProps) {
  const dispatch = useAppDispatch();
  const allTenants = useAppSelector(selectAllTenants);
  const searchedTenants = useAppSelector(selectVisibleTenants);
  const search = useAppSelector(selectSearch);
  const customerGroups = useAppSelector(selectCustomerGroups);

  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({});
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [fullscreen, setFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const data = useMemo(
    () => searchedTenants.filter((t) => matchesColumnFilters(t, columnFilters)),
    [searchedTenants, columnFilters],
  );

  useEffect(() => {
    const handleOnFullscreenChange = () =>
      setFullscreen(document.fullscreenElement === cardRef.current);
    document.addEventListener("fullscreenchange", handleOnFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleOnFullscreenChange);
  }, []);

  const handleOnToggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else cardRef.current?.requestFullscreen();
  };

  const handleOnUpdate = (id: string, changes: TenantChanges) =>
    dispatch(updateTenant({ id, changes }));

  const handleOnDelete = (id: string) => dispatch(deleteTenant(id));

  const handleOnToggleStatus = (id: string) => dispatch(toggleStatus(id));

  const handleOnSearchChange = (value: string) => dispatch(setSearch(value));

  const handleOnTableChange: TableProps<ITenant>["onChange"] = (_, filters) =>
    setColumnFilters(filters);

  const handleOnDownload = () => downloadTenantsCsv(data, "tenants.csv");

  const columns = getTenantColumns({
    columnFilters,
    customerGroups,
    onEdit,
    onUpdate: handleOnUpdate,
    onDelete: handleOnDelete,
    onToggleStatus: handleOnToggleStatus,
  });

  const toggleableColumns = columns
    .filter((c) => c.key !== "customer")
    .map((c) => ({ value: String(c.key), label: String(c.title) }));
  const visibleColumns = columns.filter(
    (c) => !hiddenColumns.includes(String(c.key)),
  );

  const handleOnColumnsChange = (shown: string[]) =>
    setHiddenColumns(
      toggleableColumns.map((c) => c.value).filter((key) => !shown.includes(key)),
    );

  const getPopupContainer = () => cardRef.current ?? document.body;

  return (
    <div ref={cardRef} className={styles.card}>
      <div className={styles.toolbar}>
        <h2 className={styles.title}>Customers — All customer groups</h2>
        <span className={styles.count}>
          {data.length} of {allTenants.length}
        </span>
        <Input
          size="small"
          allowClear
          className={styles.search}
          placeholder="Search..."
          aria-label="Search customers"
          value={search}
          onChange={(e) => handleOnSearchChange(e.target.value)}
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
          <Button size="small" icon={<TableOutlined />} aria-label="Choose columns" />
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
            icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            aria-label="Toggle full screen"
            onClick={handleOnToggleFullscreen}
          />
        </Tooltip>
      </div>

      {/* Popups must render inside the card or they vanish in full screen. */}
      <ConfigProvider getPopupContainer={getPopupContainer}>
        <Table<ITenant>
          size="small"
          rowKey="id"
          columns={visibleColumns}
          dataSource={data}
          onChange={handleOnTableChange}
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
