import { ENTERPRISE_EXCEL_TEMPLATE_URL, ENTERPRISE_LIST_EXCEL_URL } from '@/constants/file';
import { CUSTOM_EVENTS } from '@/constants/keys';
import dispatchCustomEvent from '@/utils/dispatchCustomEvent';
import { Dropdown, Menu, notification, type MenuProps } from 'antd';
import { ChangeEvent, ReactNode, useRef } from 'react';

interface IComponentProps {
  children: ReactNode;
  className?: string;
  onChooseFile: (file: File) => void;
  onExportToExcelFile: () => Promise<{ link: string; errorMgs: string }>;
}

export function UploadFileButton({ className = '', children, onChooseFile, onExportToExcelFile }: IComponentProps) {
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

  const downloadTemplateExcel = () => {
    const aEl = document.createElement('a');

    aEl.href = ENTERPRISE_EXCEL_TEMPLATE_URL;
    aEl.download = 'template.xls';
    aEl.style.display = 'none';
    aEl.target = '_blank';
    document.body.appendChild(aEl);
    aEl.click();
    aEl.remove();
  };

  const exportDataToExcelFile = async () => {
    const result = await onExportToExcelFile();

    if (!result.errorMgs) {
      console.log('link: ', result);

      const aEl = document.createElement('a');

      aEl.href = ENTERPRISE_LIST_EXCEL_URL;
      aEl.download = 'data.xls';
      aEl.style.display = 'none';
      aEl.target = '_blank';
      document.body.appendChild(aEl);
      aEl.click();
      aEl.remove();
    } else {
      notification.error({ message: result.errorMgs });
    }
  };

  const dropdownItemClickHandler: MenuProps['onClick'] = event => {
    const { key: selectedOption } = event;

    switch (selectedOption) {
      case 'export-excel':
        exportDataToExcelFile();

        break;
      case 'download-template':
        downloadTemplateExcel();

        break;

      default:
        break;
    }
  };

  return (
    <Dropdown.Button
      onClick={chooseFileHandler}
      className={className}
      trigger={['click']}
      overlay={
        <Menu onClick={dropdownItemClickHandler}>
          <Menu.Item key={'export-excel'}>
            <div className="menu-item">Xuất file excel</div>
          </Menu.Item>
          <Menu.Item key={'download-template'}>
            <div className="menu-item">Tải file excel mẫu</div>
          </Menu.Item>
        </Menu>
      }
    >
      {children}
      <input
        type="file"
        hidden
        ref={rfInput}
        onChange={importFileChangeHandler}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
    </Dropdown.Button>
  );
}
