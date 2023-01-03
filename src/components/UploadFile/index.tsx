import { getBussinessTemplateFile } from '@/api/business';
import { ROOT_URL } from '@/constants/request';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, notification, Space, type MenuProps } from 'antd';
import { ChangeEvent, useRef } from 'react';
import { TEnterpriseType } from '@/interface/business';

enum EEnterpriseType {
  IMPORT = 2,
  EXPORT = 1,
}

interface IComponentProps {
  className?: string;
  onChooseFile: (file: File, type: TEnterpriseType) => void;
  onExportToExcelFile: () => Promise<{ link: string; errorMgs: string }>;
}

export function UploadFileButton({ className = '', onChooseFile, onExportToExcelFile }: IComponentProps) {
  const rfInput = useRef<HTMLInputElement>(null);
  const rfEnterpriseType = useRef<TEnterpriseType>(1);

  const chooseFileHandler = () => {
    rfInput.current?.click();
  };

  const resetInputValue = () => {
    if (rfInput.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      rfInput.current.value = null;
    }
  };

  const importFileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('Imported:');

    if (event.target.files?.[0]) {
      const file = event.target.files[0];

      onChooseFile(file, rfEnterpriseType.current);
      event.target.files = [] as any;
    }
  };

  const downloadTemplateExcel = async () => {
    try {
      const templateFile = await getBussinessTemplateFile();
      const fileName = templateFile.data;

      const aEl = document.createElement('a');

      aEl.href = `${ROOT_URL}/${fileName}`;
      aEl.download = fileName;
      aEl.style.display = 'none';
      aEl.target = '_blank';
      document.body.appendChild(aEl);
      aEl.click();
      aEl.remove();
    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra, không thế lấy file mẫu',
      });
    }
  };

  const exportDataToExcelFile = async () => {
    const result = await onExportToExcelFile();

    if (result.errorMgs) {
      notification.error({ message: result.errorMgs });

      return;
    }

    const fileName = result.link;

    const aEl = document.createElement('a');

    aEl.href = `${ROOT_URL}/${fileName}`;
    aEl.download = fileName;
    aEl.style.display = 'none';
    aEl.target = '_blank';
    document.body.appendChild(aEl);
    aEl.click();
    aEl.remove();
  };

  const selectEnterpriseImportTypeHandler: MenuProps['onClick'] = event => {
    const { key: enterpriseType } = event;

    switch (enterpriseType) {
      case 'import':
        rfEnterpriseType.current = EEnterpriseType.IMPORT;
        chooseFileHandler();

        break;
      case 'export':
        rfEnterpriseType.current = EEnterpriseType.EXPORT;
        chooseFileHandler();

        break;
      default:
        break;
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        hidden
        ref={rfInput}
        onClick={resetInputValue}
        onChange={importFileChangeHandler}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
      <Space>
        <Dropdown
          overlay={
            <Menu onClick={selectEnterpriseImportTypeHandler}>
              <Menu.Item key="import">Nhập công ty nhập khẩu</Menu.Item>
              <Menu.Item key="export">Nhập công ty xuất khẩu</Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button className="enterprise-list__import-excel">
            <span>Nhập file excel</span>
            <DownOutlined />
          </Button>
        </Dropdown>
        <Button onClick={downloadTemplateExcel}>Tải file excel mẫu</Button>
        <Button onClick={exportDataToExcelFile}>Xuất file excel</Button>
      </Space>
    </div>
  );
}
