import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { IEnterprise, EEnterpriseStatus, EEnterpriseType } from '@/interface/business';
import { bussinessAreaAsyncActions } from '@/stores/businessArea.store';
import { phoneNumberRegex } from '@/utils/phonenumberRegex';
import { readFileAsync } from '@/utils/promisifiedFileReader';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Row, Col, UploadProps, Upload } from 'antd';
import { useEffect, useState } from 'react';
import './EnterpriseForm.less';

interface IComponentProps {
  data?: IEnterprise;
  isEditable?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (form: IEnterprise) => Promise<void>;
}
interface IUploadOptions {
  onProgress?: (event: { percent: number }) => void;
  onError?: (event: Error, body?: object) => void;
  onSuccess?: (body: object) => void;

  data?: object;
  filename?: string;
  file: any | File;
  withCredentials?: boolean;
  action?: string;
  headers?: object;
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

const FILE_SIZE_LIMIT = 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = ['.png', '.jpg'];

export default function EnterpriseForm({ data, isEditable = true, isSubmitting, onSubmit }: IComponentProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const userID = useAppSelector(state => state.user.id);
  const bussinessAreas = useAppSelector(state => state.businessArea.data.bussinessAreas);

  const [, forceUpdate] = useState(0);
  const [uploadAvatar, setUploadAvatar] = useState<File | undefined>();

  const avatar = form.getFieldValue('avatarUrl');

  const resetImageURLHandler = () => {
    form.setFields([{ name: 'avatarUrl', value: '' }]);
    forceUpdate(i => i + 1);
  };

  const uploadImageHandler = async ({ file }: IUploadOptions) => {
    const base64URL = await readFileAsync(file, 'readAsDataURL');

    form.setFields([{ name: 'avatarUrl', value: base64URL }]);
    forceUpdate(i => i + 1);
    setUploadAvatar(file);
  };

  const validateFile: UploadProps['beforeUpload'] = file => {
    for (const extension of ALLOWED_FILE_EXTENSIONS) {
      if (file.name.endsWith(extension)) {
        return true;
      }
    }

    return file.size <= FILE_SIZE_LIMIT ? true : Upload.LIST_IGNORE;
  };

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
        <Form.Item name="id" label="Ma?? s???? doanh nghi????p" valuePropName="data-value">
          <p>{data.id}</p>
        </Form.Item>
      )}
      <Row gutter={40}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="T??n doanh nghi????p"
            rules={[{ required: true, message: 'T??n doanh nghi????p kh??ng ????????c bo?? tr????ng' }]}
          >
            <Input disabled={!isEditable} size="large" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Da??ng doanh nghi????p"
            rules={[{ required: true, message: 'Tr??????ng na??y kh??ng ????????c bo?? tr????ng' }]}
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
          <Form.Item
            name="areaID"
            label="L??nh v???c kinh doanh"
            rules={[{ required: true, message: 'Tr??????ng kh??ng ????????c bo?? tr????ng' }]}
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
        </Col>
        <Col span={12}>
          <Form.Item label="A??nh ??a??i di????n" name="avatarUrl" valuePropName="data-value">
            {avatar ? (
              <div className="inline-block relative avatar-container">
                <img src={avatar} alt="" className="avatar" />
                {isEditable && (
                  <button className="remove-btn" onClick={resetImageURLHandler}>
                    <CloseOutlined />
                  </button>
                )}
              </div>
            ) : (
              <Upload
                listType="picture-card"
                customRequest={uploadImageHandler}
                maxCount={1}
                disabled={!isEditable}
                beforeUpload={validateFile}
                accept=".png,.jpg"
              >
                <span>Ta??i l??n</span>
              </Upload>
            )}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={40}>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Tr??????ng kh??ng ????????c bo?? tr????ng' },
              { type: 'email', message: 'Email kh??ng h????p l????' },
            ]}
          >
            <Input disabled={!isEditable} size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="S???? ??i????n thoa??i"
            rules={[
              { required: true, message: 'Tr??????ng kh??ng ????????c bo?? tr????ng' },
              {
                pattern: phoneNumberRegex,
                message: 'S???? ??i????n thoa??i nh????p va??o kh??ng h????p l????',
              },
            ]}
          >
            <Input disabled={!isEditable} size="large" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="contactDetail"
            label="Chi ti????t th??ng tin li??n la??c"
            rules={[{ required: true, message: 'Tr??????ng kh??ng ????????c bo?? tr????ng' }]}
          >
            <Input disabled={!isEditable} size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="address"
        label="??i??a chi?? doanh nghi????p"
        rules={[{ required: true, message: 'Tr??????ng kh??ng ????????c bo?? tr????ng' }]}
      >
        <Input disabled={!isEditable} size="large" />
      </Form.Item>

      <div className="flex gap-10">
        <Form.Item name="country" label="Qu????c gia" rules={[{ required: true, message: 'Tr??????ng kh??ng ????????c bo?? tr????ng' }]}>
          <Input disabled={!isEditable} size="large" />
        </Form.Item>
        <Form.Item name="status" label="Tra??ng tha??i" rules={[{ required: true, message: 'Tr??????ng kh??ng ????????c bo?? tr????ng' }]}>
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

      <Form.Item name="note" label="Ghi chu??">
        <Input.TextArea autoSize={{ minRows: 5, maxRows: 5 }} disabled={!isEditable} size="large" />
      </Form.Item>

      {isEditable && (
        <div className="submit-container">
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            L??u th??ng tin
          </Button>
        </div>
      )}
    </Form>
  );
}
