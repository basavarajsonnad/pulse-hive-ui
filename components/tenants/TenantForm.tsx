"use client";

import { Button, Form, Input, Space } from "antd";
import { useAppDispatch } from "@/store/hooks";
import { addTenant, updateTenant } from "@/store/slices/tenantsSlice";
import type { ITenantFormProps, ITenantFormValues } from "./types";
import { LOGIN_SUFFIX } from "./utils";
import styles from "./styles/TenantForm.module.scss";

export default function TenantForm({ tenant, onClose }: ITenantFormProps) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<ITenantFormValues>();

  const handleOnFinish = (values: ITenantFormValues) => {
    const input = {
      customer: values.customer.trim(),
      login: `${values.tenantName.trim()}${LOGIN_SUFFIX}`,
    };

    if (tenant) dispatch(updateTenant({ id: tenant.id, changes: input }));
    else dispatch(addTenant(input));
    onClose();
  };

  return (
    <>
      {!tenant && (
        <p className={styles.intro}>
          Adds a single customer with your saved defaults. Taking on many at
          once? Use <strong>Bulk Upload</strong> instead.
        </p>
      )}

      <Form<ITenantFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleOnFinish}
        initialValues={
          tenant
            ? {
                customer: tenant.customer,
                tenantName: tenant.login.replace(LOGIN_SUFFIX, ""),
              }
            : undefined
        }
      >
        <Form.Item
          name="customer"
          label="Customer name"
          rules={[{ required: true, whitespace: true, message: "Enter a customer name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Tenant name (no spaces)">
          <Space.Compact block>
            <Form.Item
              name="tenantName"
              noStyle
              rules={[
                { required: true, message: "Enter a tenant name" },
                {
                  pattern: /^[a-z0-9-]+$/i,
                  message: "Use letters, numbers and hyphens only",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Space.Addon>{LOGIN_SUFFIX}</Space.Addon>
          </Space.Compact>
        </Form.Item>

        <div className={styles.actions}>
          <Button type="primary" htmlType="submit">
            {tenant ? "Save changes" : "Create tenant"}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </Form>
    </>
  );
}
