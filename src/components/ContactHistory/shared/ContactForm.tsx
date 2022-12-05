import { IContact, IEnterprise } from '@/interface/business';
import { Button, Form, Input } from 'antd';

interface IComponentProps {
  enterprise?: IEnterprise;
  data?: IContact;
  isEditable?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (form: { content: string; note: string }) => Promise<void>;
}

const defaultForm = {
  content: '',
  note: '',
};

export default function ContactForm({ enterprise, data, isEditable, isSubmitting, onSubmit }: IComponentProps) {
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

  return (
    <Form
      initialValues={defaultForm}
      form={form}
      layout="vertical"
      className="enterprise-form"
      onFinish={submitFormHandler}
    >
      {data?.logID && (
        <Form.Item name="logID" label="Mã số doanh nghiệp" valuePropName="data-value">
          <p>{data.logID}</p>
        </Form.Item>
      )}

      <Form.Item label="Tên doanh nghiệp" valuePropName="data-value">
        <p>{enterprise?.name || '--'}</p>
      </Form.Item>

      <Form.Item
        name="content"
        label="Nội dung tiếp cận"
        rules={[{ required: true, message: 'Yêu cầu nhập nội dung tiếp cận doanh nghiệp' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="note" label="Ghi chú">
        <Input.TextArea autoSize={{ maxRows: 5, minRows: 5 }} />
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
