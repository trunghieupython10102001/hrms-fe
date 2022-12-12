import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { IEnterprise, EEnterpriseStatus, EEnterpriseType } from '@/interface/business';
import { bussinessAreaAsyncActions } from '@/stores/businessArea.store';
import { phoneNumberRegex } from '@/utils/phonenumberRegex';
import { Button, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import './EnterpriseForm.less';

interface IComponentProps {
  data?: IEnterprise;
  isEditable?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (form: IEnterprise) => Promise<void>;
}

const defaultForm = {
  name: '',
  address: '',
  areaID: 1,
  contactDetail: '',
  contactedTimes: 1,
  country: '',
  email: '',
  note: '',
  phone: '',
  status: 1,
  type: 1,
};

export default function EnterpriseForm({ data, isEditable = true, isSubmitting, onSubmit }: IComponentProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const userID = useAppSelector(state => state.user.id);
  const bussinessAreas = useAppSelector(state => state.businessArea.data.bussinessAreas);

  const submitFormHandler = async () => {
    try {
      await form.validateFields();

      const formData = form.getFieldsValue() as IEnterprise;

      formData.createUser = String(userID);

      onSubmit?.(formData);
    } catch (error) {
      console.log('Validate error: ', error);
    }
  };

  useEffect(() => {
    if (bussinessAreas.length === 0) {
      dispatch(bussinessAreaAsyncActions.getBusinessAreaList());
    }
  }, []);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  return (
    <Form
      initialValues={defaultForm}
      form={form}
      layout="vertical"
      className="enterprise-form"
      onFinish={submitFormHandler}
    >
      {data?.id && (
        <Form.Item name="id" label="Mã số doanh nghiệp" valuePropName="data-value">
          <p>{data.id}</p>
        </Form.Item>
      )}
      <div className="flex gap-10">
        <Form.Item
          name="name"
          label="Tên doanh nghiệp"
          rules={[{ required: true, message: 'Tên doanh nghiệp không được bỏ trống' }]}
        >
          <Input disabled={!isEditable} size="large" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Dạng doanh nghiệp"
          rules={[{ required: true, message: 'Trường này không được bỏ trống' }]}
        >
          <Select className="capitalized" disabled={!isEditable} size="large">
            {EEnterpriseType.map((type, i) => {
              if (i > 0) {
                return (
                  <Select.Option className="capitalized" value={i} key={i}>
                    {type}
                  </Select.Option>
                );
              }
            })}
          </Select>
        </Form.Item>
      </div>

      <div className="flex gap-10">
        <Form.Item
          name="areaID"
          label="Lĩnh vực kinh doanh"
          rules={[{ required: true, message: 'Trường không được bỏ trống' }]}
        >
          {/* <Input disabled={!isEditable} size="large" /> */}
          <Select className="capitalized" disabled={!isEditable} size="large">
            {bussinessAreas.map((area, i) => {
              return (
                <Select.Option className="capitalized" value={area.id} key={i}>
                  {area.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Trường không được bỏ trống' }]}>
          <Select className="capitalized" disabled={!isEditable} size="large">
            {EEnterpriseStatus.map((status, i) => {
              return (
                <Select.Option className="capitalized" value={i} key={i}>
                  {status}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </div>

      <div className="flex gap-10">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Trường không được bỏ trống' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input disabled={!isEditable} size="large" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Trường không được bỏ trống' },
            {
              pattern: phoneNumberRegex,
              message: 'Số điện thoại nhập vào không hợp lệ',
            },
          ]}
        >
          <Input disabled={!isEditable} size="large" />
        </Form.Item>
      </div>

      <Form.Item
        name="address"
        label="Địa chỉ doanh nghiệp"
        rules={[{ required: true, message: 'Trường không được bỏ trống' }]}
      >
        <Input disabled={!isEditable} size="large" />
      </Form.Item>

      <div className="flex gap-10">
        <Form.Item name="country" label="Quốc gia" rules={[{ required: true, message: 'Trường không được bỏ trống' }]}>
          <Input disabled={!isEditable} size="large" />
        </Form.Item>
        {/* <Form.Item
          name="contactedTimes"
          label="Số lần tiếp cận"
          rules={[{ required: true, message: 'Trường không được bỏ trống' }]}
          normalize={removeAllNonDigits}
        >
          <Input disabled={!isEditable} size="large" />
        </Form.Item> */}
      </div>

      <Form.Item
        name="contactDetail"
        label="Chi tiết thông tin liên lạc"
        rules={[{ required: true, message: 'Trường không được bỏ trống' }]}
      >
        <Input disabled={!isEditable} size="large" />
      </Form.Item>

      <Form.Item name="note" label="Ghi chú">
        <Input.TextArea autoSize={{ minRows: 5, maxRows: 5 }} disabled={!isEditable} size="large" />
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
