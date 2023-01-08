import { IContact, IEnterprise } from '@/interface/business';
import { Button, Col, Form, Image, Input, Row, Space, Upload } from 'antd';
import { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';
import type { UploadProps } from 'antd';
import { extractFIleNameFromURL } from '@/utils/misc';
import { DeleteOutlined, DownloadOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { downloadFileFromURL } from '@/utils/inpageDownloadFile';
import PDFViewer from '@/components/core/PDFViewer';

interface IComponentProps {
  enterprise?: IEnterprise;
  data?: IContact;
  isEditable?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (form: IContact) => Promise<void>;
}

const defaultForm = {
  content: '',
  note: '',
};

const allowFileTypes = ['pdf', 'jpg', 'jpeg', 'png'];

export default function ContactForm({ enterprise, data, isEditable, isSubmitting, onSubmit }: IComponentProps) {
  const [form] = Form.useForm<IContact>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [previewFile, setPreviewFile] = useState<
    | {
        url: string;
        type: 'image' | 'pdf';
      }
    | undefined
  >();

  const submitFormHandler = async () => {
    try {
      await form.validateFields();
      const formData = form.getFieldsValue();

      onSubmit?.(formData);
    } catch (error) {
      console.log('Validate error: ', error);
    }
  };

  const previewImage = (url: string) => {
    setPreviewFile({
      type: 'image',
      url,
    });
  };

  const previewPDFFile = (url: string) => {
    setPreviewFile({ type: 'pdf', url });
  };

  const closePreviewHandler = () => {
    setPreviewFile(undefined);
  };

  const fileUploadProps = useMemo<UploadProps>(() => {
    // if (!data?.filesAttached) {
    //   return {};
    // }

    return {
      onRemove: file => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();

        if (fileList[index].originFileObj) {
          window.URL.revokeObjectURL(fileList[index].url as string);
        }

        newFileList.splice(index, 1);
        setFileList(newFileList);
      },
      onDownload(file: UploadFile) {
        if (file.url) {
          downloadFileFromURL({
            downloadURL: file.url,
            fileName: file.name,
          });
        }
      },

      onPreview(file: UploadFile) {
        if (file.name.endsWith('.pdf')) {
          previewPDFFile(file.url || '');
        } else {
          previewImage(file.url || '');
        }
      },

      beforeUpload(file) {
        const fileObj: UploadFile = {
          originFileObj: file,
          url: window.URL.createObjectURL(file),
          name: file.name,
          uid: file.uid,
          lastModified: file.lastModified,
          lastModifiedDate: file.lastModifiedDate,
          size: file.size,
        };

        setFileList(fileList.concat(fileObj));

        return false;
      },

      fileList,

      itemRender(
        _originNode: ReactElement,
        file: UploadFile,
        _fileList: object[],
        actions: { download: any; preview: any; remove: any },
      ): ReactNode {
        const fileType = file.name.split('.').at(-1) || '';
        const isPreviewable = allowFileTypes.findIndex(type => type.toLowerCase() === fileType.toLowerCase()) !== -1;

        return (
          <div className="flex justify-between items-center px-4 py-2">
            <p className="max-w-25 overflow-hidden text-ellipsis whitespace-nowrap m-0">{file.name}</p>
            <Space>
              <EyeOutlined
                className="cursor-pointer"
                style={{
                  display: isPreviewable ? 'inline-block' : 'none',
                }}
                onClick={actions.preview}
              />
              <DownloadOutlined className="cursor-pointer" onClick={actions.download} />
              <DeleteOutlined className="cursor-pointer" onClick={actions.remove} />
            </Space>
          </div>
        );
      },
    };
  }, [data, fileList]);

  /* 
  const handleUploadFile = () => {
    const formData = new FormData();

    fileList.forEach(file => {
      formData.append('files[]', file as RcFile);
    });
    // setIsUploadingFile(true);
    // // You can use any AJAX library you like
    // fetch('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then(res => res.json())
    //   .then(() => {
    //     setFileList([]);
    //     message.success('upload successfully.');
    //   })
    //   .catch(() => {
    //     message.error('upload failed.');
    //   })
    //   .finally(() => {
    //     setIsUploadingFile(false);
    //   });
  }; */

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
      setFileList([
        {
          uid: data.filesAttached || '',
          name: extractFIleNameFromURL(data.filesAttached || ''),
          status: 'done',
          url: data.filesAttached,
        },
      ]);
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
      <Row>
        <Col span={12}>
          {enterprise?.id && (
            <Form.Item name="logID" label="Mã doanh nghiệp" valuePropName="data-value">
              <p>{enterprise.id}</p>
            </Form.Item>
          )}

          <Form.Item label="Tên doanh nghiệp" valuePropName="data-value">
            <p>{enterprise?.name || '--'}</p>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Upload {...fileUploadProps}>
            <Button icon={<UploadOutlined />}>Đính kèm file</Button>
          </Upload>
        </Col>
      </Row>

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

      <Image
        width={200}
        style={{ display: 'none' }}
        src={previewFile?.url}
        preview={{
          visible: previewFile?.type === 'image',
          src: previewFile?.url,
          onVisibleChange: () => {
            closePreviewHandler();
          },
        }}
      />
      <PDFViewer pdfLink={previewFile?.url || ''} visible={previewFile?.type === 'pdf'} onClose={closePreviewHandler} />
    </Form>
  );
}
