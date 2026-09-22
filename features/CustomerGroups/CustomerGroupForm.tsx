"use client";

import { Button, Form, Input } from "antd";
import { useAddCustomerGroupMutation } from "@/features/CustomerGroups/api";
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
        label="Customer group name"
        rules={[{ required: true, whitespace: true, message: "Enter a name" }]}
      >
        <Input placeholder="e.g. Texas – DFW" />
      </Form.Item>

      <div className={styles.actions}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Create group
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </Form>
  );
}
