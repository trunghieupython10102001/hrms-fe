import { IEnterpriseProduct, IEnterprise, EEnterpriseType } from '@/interface/business';
import { Button, Form, Input } from 'antd';
import { useEffect } from 'react';

interface IComponentProps {
  enterprise?: IEnterprise;
  data?: IEnterpriseProduct;
  isEditable?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (form: IEnterpriseProduct) => Promise<void>;
}

const defaultForm = {
  detailInfo: '',
  price: '',
};

export default function ProductForm({ enterprise, data, isEditable, isSubmitting, onSubmit }: IComponentProps) {
  const [form] = Form.useForm<IEnterpriseProduct>();

  const submitFormHandler = async () => {
    try {
      await form.validateFields();
      const formData = form.getFieldsValue();

      formData.productID = data?.productID || 0;
      formData.enterpriseID = enterprise?.id || 0;
      formData.enterpriseType = EEnterpriseType[enterprise?.type || 1];

      onSubmit?.(formData);
    } catch (error) {
      console.log('Validate error: ', error);
    }
  };

  useEffect(() => {
    if (!data) {
      return;
    }

    form.setFieldsValue(data);
  }, [data]);

  return (
    <Form
      initialValues={defaultForm}
      form={form}
      layout="vertical"
      className="enterprise-product-form"
      onFinish={submitFormHandler}
    >
      <div>
        <p>Mã doanh nghiệp</p>
        <p>{enterprise?.id || '--'}</p>
      </div>
      <div>
        <p>Tên doanh nghiệp</p>
        <p>{enterprise?.name || '--'}</p>
      </div>

      {data?.productID && (
        <Form.Item name="productID" label="Mã sản phẩm" valuePropName="data-value">
          <p>{data.productID}</p>
        </Form.Item>
      )}

      <Form.Item
        name="detailInfo"
        label={enterprise?.type === 1 ? 'Sản phẩm xuất khẩu' : 'Sản phẩm nhập khẩu'}
        rules={[{ required: true, message: 'Yêu cầu nhập thông tin chi tiết của sản phẩm' }]}
      >
        <Input.TextArea autoSize={{ maxRows: 5, minRows: 5 }} />
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
