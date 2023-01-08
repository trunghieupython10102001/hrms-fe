import { Modal } from 'antd';
import './style.less';

interface IComponentProps {
  pdfLink: string;
  visible: boolean;
  onClose: () => void;
}

export default function PDFViewer({ pdfLink, visible, onClose }: IComponentProps) {
  return (
    <Modal visible={visible} onCancel={onClose} footer={null} className="pdf-viewer" width={window.innerWidth * 0.8}>
      <iframe src={pdfLink} frameBorder="0" scrolling="auto" height="100%" width="100%"></iframe>
    </Modal>
  );
}
