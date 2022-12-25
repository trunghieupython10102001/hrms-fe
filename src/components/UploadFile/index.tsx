import { ENTERPRISE_EXCEL_TEMPLATE_URL, ENTERPRISE_LIST_EXCEL_URL } from '@/constants/file';
import { CUSTOM_EVENTS } from '@/constants/keys';
import dispatchCustomEvent from '@/utils/dispatchCustomEvent';
import { Dropdown, Menu, type MenuProps } from 'antd';
import { ChangeEvent, ReactNode, useRef } from 'react';

interface IComponentProps {
  onChooseFile: (file: File) => void;
  children: ReactNode;
  className?: string;
}

export function UploadFileButton({ className = '', children, onChooseFile }: IComponentProps) {
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

  const exportDataToExcelFile = () => {
    const aEl = document.createElement('a');

    aEl.href = ENTERPRISE_LIST_EXCEL_URL;
    aEl.download = 'data.xls';
    aEl.style.display = 'none';
    aEl.target = '_blank';
    document.body.appendChild(aEl);
    aEl.click();
    aEl.remove();
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
