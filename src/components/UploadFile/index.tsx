import { getBussinessTemplateFile } from '@/api/business';
import { CUSTOM_EVENTS } from '@/constants/keys';
import { ROOT_URL } from '@/constants/request';
import dispatchCustomEvent from '@/utils/dispatchCustomEvent';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, notification, Space, type MenuProps } from 'antd';
import { ChangeEvent, useRef } from 'react';

interface IComponentProps {
  className?: string;
  onChooseFile: (file: File) => void;
  onExportToExcelFile: () => Promise<{ link: string; errorMgs: string }>;
}

export function UploadFileButton({ className = '', onChooseFile, onExportToExcelFile }: IComponentProps) {
  const rfInput = useRef<HTMLInputElement>(null);

  const chooseFileHandler = () => {
    rfInput.current?.click();
    dispatchCustomEvent(CUSTOM_EVENTS.UPDATE_INTERACTION_TIME);
  };

  const importFileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      onChooseFile(event.target.files[0]);
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
        chooseFileHandler();

        break;
      case 'export':
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
          <Button>
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
