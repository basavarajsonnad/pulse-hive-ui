"use client";

import { Button, Form, Input, Select } from "antd";
import { Trans } from "react-i18next";
import translator from "@/i18n/translator";
import { useAddTenantMutation } from "@/features/Tenants/api";
import { TENANT_FORM_INITIAL_VALUES } from "@/utils/constants/appConstants";
import {
  TENANT_TIER_OPTIONS,
  type ICreateTenantRequest,
  type ITenantFormProps,
} from "./types";
import styles from "./styles/TenantForm.module.scss";

const CUSTOMER_NAME_PATTERN = /^[a-zA-Z0-9-]{3,25}$/;

export default function TenantForm({ onClose }: ITenantFormProps) {
  const [addTenant, { isLoading }] = useAddTenantMutation();
  const handleOnFinish = async (values: ICreateTenantRequest) => {
    await addTenant(values).unwrap();
    onClose();
  };

  return (
    <>
      <p className={styles.intro}>
        <Trans
          i18nKey="tenantForm.intro"
          components={{ bulkUpload: <strong /> }}
        />
      </p>

      <Form<ICreateTenantRequest>
        layout="vertical"
        requiredMark={(label, { required }) =>
          required ? (
            <>
              {label} <span className={styles.required}>*</span>
            </>
          ) : (
            label
          )
        }
        onFinish={handleOnFinish}
        initialValues={TENANT_FORM_INITIAL_VALUES}
      >
        <Form.Item
          name="customerName"
          label={translator("tenantForm.fields.customerName.label")}
          rules={[
            {
              required: true,
              message: translator(
                "tenantForm.fields.customerName.requiredMessage",
              ),
            },
            {
              pattern: CUSTOMER_NAME_PATTERN,
              message: translator(
                "tenantForm.fields.customerName.patternMessage",
              ),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="liscencePackage"
          label={translator("tenantForm.fields.licensePackage.label")}
          extra={translator("tenantForm.fields.licensePackage.extra")}
        >
          <Select options={TENANT_TIER_OPTIONS} />
        </Form.Item>

        <Form.Item
          name={["sso", "providerName"]}
          label={translator("tenantForm.fields.providerName.label")}
          rules={[
            {
              required: true,
              whitespace: true,
              message: translator(
                "tenantForm.fields.providerName.requiredMessage",
              ),
            },
          ]}
        >
          <Input
            placeholder={translator(
              "tenantForm.fields.providerName.placeholder",
            )}
          />
        </Form.Item>

        <Form.Item
          name={["sso", "metadataUrl"]}
          label={translator("tenantForm.fields.metadataUrl.label")}
          rules={[
            {
              required: true,
              whitespace: true,
              message: translator(
                "tenantForm.fields.metadataUrl.requiredMessage",
              ),
            },
          ]}
        >
          <Input
            placeholder={translator(
              "tenantForm.fields.metadataUrl.placeholder",
            )}
          />
        </Form.Item>

        <Form.Item
          name={["sso", "emailAttribute"]}
          label={translator("tenantForm.fields.emailAttribute.label")}
          rules={[
            {
              required: true,
              whitespace: true,
              message: translator(
                "tenantForm.fields.emailAttribute.requiredMessage",
              ),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["sso", "groupsAttribute"]}
          label={translator("tenantForm.fields.groupsAttribute.label")}
          rules={[
            {
              required: true,
              whitespace: true,
              message: translator(
                "tenantForm.fields.groupsAttribute.requiredMessage",
              ),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <div className={styles.actions}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {translator("tenantForm.actions.submit")}
          </Button>
          <Button onClick={onClose}>
            {translator("tenantForm.actions.cancel")}
          </Button>
        </div>
      </Form>
    </>
  );
}
