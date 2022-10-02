import { DatePicker, Form, Input, message, Modal, Select } from 'antd';
import { useEffect } from 'react';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

interface UserFormModalType {
  visible: boolean;
  setVisible: (param: boolean) => void;
  record?: {
    key: number;
    username: string;
    password: string;
    email: string;
    fullname: string;
    phoneNumber: string;
    dateOfBirth: string;
    avatarUrl?: string;
  };
}

const QuestionFormModal = ({ visible, setVisible, record }: UserFormModalType) => {
  const [form] = Form.useForm();

  console.log('record: ', record);

  useEffect(() => {
    form.resetFields();
  }, [record]);

  const handleOk = () => {
    setVisible(false);
    form.submit();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  // if (isSuccess) {
  //   message.success('Everything done');
  // }

  // if (isError) {
  //   message.error('Something went wrong');
  // }

  const onFinish = (values: any) => {
    console.log(values);
    // if (!record) {
    //   addQuestion(values, {
    //     onSuccess() {
    //       message.success('Question created successfully');
    //       queryClient.invalidateQueries('get-questions');
    //     },
    //   });
    // } else {
    //   updateQuestion(
    //     { id: record.key, data: values },
    //     {
    //       onSuccess() {
    //         message.success('Question updated successfully');
    //       },
    //     },
    //   );
    // }
    // form.resetFields();
  };

  return (
    <Modal title="Question" visible={visible} onOk={handleOk} onCancel={handleCancel}>
      <Form
        form={form}
        {...layout}
        initialValues={record}
        name="nest-messages"
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item labelAlign="left" name={['content']} label="Username">
          <Input placeholder="Username" name="username" />
        </Form.Item>
        <Form.Item labelAlign="left" name={['content']} label="Eamil">
          <Input placeholder="Email" name="email" />
        </Form.Item>
        <Form.Item labelAlign="left" name={['content']} label="Fullname">
          <Input placeholder="Fullname" name="fullname" />
        </Form.Item>
        <Form.Item labelAlign="left" name={['content']} label="Phone number">
          <Input placeholder="Phone number" name="phoneNumber" />
        </Form.Item>
        <Form.Item labelAlign="left" name={['content']} label="Date of birth">
          <DatePicker />
        </Form.Item>
        {/* <Form.Item label="Level" name={['levelId']} labelAlign="left">
          <Select>
            {levels?.map(item => (
              <Select.Option value={item.id} key={item.id}>
                {item.code}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Language" name={['programmingLanguageId']} labelAlign="left">
          <Select>
            {programmingLanguages?.map((item: any) => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Framework" name={['frameworkId']} labelAlign="left">
          <Select>
            {frameworks?.map(item => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item> */}
        {/* <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 10 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default QuestionFormModal;
