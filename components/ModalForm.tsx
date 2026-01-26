"use client";

import * as React from "react";
import { Form, Modal } from "antd";
import type { FormInstance, FormItemProps, FormProps, ModalProps } from "antd";

export type ModalFormItem = Omit<FormItemProps, "children"> & {
  key?: React.Key;
  children: React.ReactNode;
};

export type ModalFormProps = {
  open: boolean;
  title?: React.ReactNode;
  formItems: ModalFormItem[];
  onCancel: () => void;
  onFinish?: FormProps["onFinish"];
  onFinishFailed?: FormProps["onFinishFailed"];
  form?: FormInstance;
  formProps?: Omit<
    FormProps,
    "form" | "onFinish" | "onFinishFailed" | "children"
  >;
  modalProps?: Omit<
    ModalProps,
    "open" | "onOk" | "onCancel" | "title" | "children" | "afterClose"
  > & {
    afterClose?: ModalProps["afterClose"];
  };
  resetOnClose?: boolean;
};

function getItemKey(item: ModalFormItem, index: number) {
  if (item.key !== undefined) {
    return item.key;
  }
  const name = item.name;
  if (Array.isArray(name)) {
    return name.join(".");
  }
  if (name !== undefined) {
    return name.toString();
  }
  return `item-${index}`;
}

export default function ModalForm({
  open,
  title,
  formItems,
  onCancel,
  onFinish,
  onFinishFailed,
  form: formProp,
  formProps,
  modalProps,
  resetOnClose = false,
}: ModalFormProps) {
  const [form] = Form.useForm(formProp);

  const handleOk = () => {
    form.submit();
  };

  const handleAfterClose = () => {
    if (resetOnClose) {
      form.resetFields();
    }
    modalProps?.afterClose?.();
  };

  return (
    <Modal
      {...modalProps}
      open={open}
      title={title}
      onOk={handleOk}
      onCancel={onCancel}
      afterClose={handleAfterClose}
    >
      <Form
        {...formProps}
        form={form}
        layout={formProps?.layout ?? "vertical"}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {formItems.map((item, index) => {
          const { children, key: _key, ...itemProps } = item;
          return (
            <Form.Item key={getItemKey(item, index)} {...itemProps}>
              {children}
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  );
}
