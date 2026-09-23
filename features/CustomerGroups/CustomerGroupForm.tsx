"use client";

import { Button, Form, Input } from "antd";
import { useAddCustomerGroupMutation } from "@/features/CustomerGroups/api";
import translator from "@/i18n/translator";
import type {
  ICreateCustomerGroupRequest,
  ICustomerGroupFormProps,
} from "./types";
import styles from "./styles/CustomerGroupForm.module.scss";

export default function CustomerGroupForm({
  onClose,
  onCreate,
}: ICustomerGroupFormProps) {
  const [addCustomerGroup, { isLoading }] = useAddCustomerGroupMutation();

  const handleOnFinish = async (values: ICreateCustomerGroupRequest) => {
    await addCustomerGroup(values).unwrap();
    onCreate(values.customerGroup);
    onClose();
  };

  return (
    <Form<ICreateCustomerGroupRequest>
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
    >
      <Form.Item
        name="customerGroup"
        label={translator("customerGroups.form.nameLabel")}
        rules={[
          {
            required: true,
            whitespace: true,
            message: translator("customerGroups.form.nameRequiredMessage"),
          },
        ]}
      >
        <Input
          placeholder={translator("customerGroups.form.namePlaceholder")}
        />
      </Form.Item>

      <div className={styles.actions}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {translator("customerGroups.form.submit")}
        </Button>
        <Button onClick={onClose}>{translator("common.cancel")}</Button>
      </div>
    </Form>
  );
}
