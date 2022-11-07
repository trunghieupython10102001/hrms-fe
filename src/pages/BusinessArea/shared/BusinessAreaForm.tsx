import { IBusinessArea } from '@/interface/businessArea';
import { Button, Form, Input } from 'antd';
import { useEffect } from 'react';

interface IComponentProps {
  data?: IBusinessArea | boolean;
  isEditable?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (form: { name: string }) => Promise<void>;
}

const defaultForm = {
  name: '',
};

export default function BusinessAreaForm({ data, isEditable = true, isSubmitting, onSubmit }: IComponentProps) {
  const [form] = Form.useForm();

  const submitFormHandler = async () => {
    try {
      await form.validateFields();
      const formData = form.getFieldsValue();

      onSubmit?.(formData);
    } catch (error) {
      console.log('Validate error: ', error);
    }
  };

  useEffect(() => {
    if (typeof data === 'object') {
      form.setFieldsValue(data);
    }
  }, [data]);

  return (
    <Form
      initialValues={defaultForm}
      form={form}
      layout="vertical"
      className="business-area-form"
      onFinish={submitFormHandler}
    >
      {typeof data === 'object' && (
        <Form.Item name="id" label="Mã lĩnh vực" valuePropName="data-value">
          <p style={{ margin: 0 }}>{data.id}</p>
        </Form.Item>
      )}

      <Form.Item
        name="name"
        label="Tên lĩnh vực"
        rules={[{ required: true, message: 'Trường này không được để trống' }]}
      >
        <Input />
      </Form.Item>

      {isEditable && (
        <div className="submit-container">
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Lưu thông tin
          </Button>
        </div>
      )}
    </Form>
  );
}
