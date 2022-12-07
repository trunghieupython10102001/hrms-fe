import { IEnterpriseProduct, IEnterprise } from '@/interface/business';
import { Button, Form, Input } from 'antd';

interface IComponentProps {
  enterprise?: IEnterprise;
  data?: IEnterpriseProduct;
  isEditable?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (form: { content: string; note: string }) => Promise<void>;
}

const defaultForm = {
  detailInfo: '',
  price: '',
};

export default function ProductForm({ enterprise, data, isEditable, isSubmitting, onSubmit }: IComponentProps) {
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
      className="enterprise-product-form"
      onFinish={submitFormHandler}
    >
      {data?.productID && (
        <Form.Item name="productID" label="Mã sản phẩm" valuePropName="data-value">
          <p>{data.productID}</p>
        </Form.Item>
      )}
      <Form.Item name="enterpriseID" label="Mã doanh nghiệp" valuePropName="data-value">
        <p>{enterprise?.id || '--'}</p>
      </Form.Item>

      <Form.Item
        name="detailInfo"
        label="Thông tin chi tiết về sản phẩm"
        rules={[{ required: true, message: 'Yêu cầu nhập thông tin chi tiết của sản phẩm' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="price" label="Thông tin giá">
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
