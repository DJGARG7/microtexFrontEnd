const MODAL_STYLES = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    backgroundColor: "#edf2f4",
    padding: "40px",
    zIndex: 1000,
    borderRadius: "15px",
};
const OVERLAY_STYLES = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0, .7)",
    zIndex: 1000,
};

const Modal = ({ open, children, onClose, onWin }) => {
    if (!open) return null;
    return (
        <div style={OVERLAY_STYLES}>
            <div style={MODAL_STYLES}>
                <div className="container">
                    <div>{children}</div>
                    <button className="btn del-btn" onClick={onClose}>
                        Exit
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Modal;
