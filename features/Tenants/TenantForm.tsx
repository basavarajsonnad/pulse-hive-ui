"use client";

import { Button, Form, Input, Select } from "antd";
import { useAddTenantMutation } from "@/features/Tenants/api";
import { TENANT_FORM_INITIAL_VALUES } from "@/utils/constants/appConstants";
import {
  TENANT_TIERS,
  type ICreateTenantRequest,
  type ITenantFormProps,
} from "./types";
import styles from "./styles/TenantForm.module.scss";

const CUSTOMER_NAME_PATTERN = /^[a-zA-Z0-9-]{3,25}$/;

const TIER_OPTIONS = TENANT_TIERS.map((tier) => ({
  value: tier.toLowerCase(),
  label: tier,
}));

export default function TenantForm({ onClose }: ITenantFormProps) {
  const [addTenant, { isLoading }] = useAddTenantMutation();
  const handleOnFinish = async (values: ICreateTenantRequest) => {
    await addTenant(values).unwrap();
    onClose();
  };

  return (
    <>
      <p className={styles.intro}>
        Adds a single customer with your saved defaults. Taking on many at once?
        Use <strong>Bulk Upload</strong> instead.
      </p>

      <Form<ICreateTenantRequest>
        layout="vertical"
        requiredMark={false}
        onFinish={handleOnFinish}
        initialValues={TENANT_FORM_INITIAL_VALUES}
      >
        <Form.Item
          name="customerName"
          label="Customer name"
          rules={[
            { required: true, message: "Enter a customer name" },
            {
              pattern: CUSTOMER_NAME_PATTERN,
              message: "Use 3–25 characters: letters, numbers and hyphens only",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="liscencePackage"
          label="License package"
          extra="Basic: Discovery, Visibility & Risk · Intermediate: + Preventive Controls · Advanced: all capabilities"
        >
          <Select options={TIER_OPTIONS} />
        </Form.Item>

        <Form.Item
          name={["sso", "providerName"]}
          label="Provider name"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Enter a provider name",
            },
          ]}
        >
          <Input placeholder="Acme-Okta" />
        </Form.Item>

        <Form.Item
          name={["sso", "metadataUrl"]}
          label="IdP metadata URL"
          rules={[{ required: true, whitespace: true, message: "Enter a URL" }]}
        >
          <Input placeholder="https://your-idp.com/app/.../sso/saml/metadata" />
        </Form.Item>

        <Form.Item
          name={["sso", "emailAttribute"]}
          label="Email attribute"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Enter an email attribute",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["sso", "groupsAttribute"]}
          label="Groups attribute"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Enter a groups attribute",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <div className={styles.actions}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create tenant
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </Form>
    </>
  );
}
