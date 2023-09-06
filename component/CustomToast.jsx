import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

function CustomToast({ title, body, onClose }) {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast bg="danger" autohide onClose={() => onClose()}>
        <Toast.Header>
          🔴
          <strong className="me-auto">{title}</strong>
        </Toast.Header>
        <Toast.Body>{body}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default CustomToast;
