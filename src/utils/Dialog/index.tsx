import './index.css';

interface DialogProps {
    title: string
    content: string
    action: Function
}

export default (props:DialogProps) => {
    const {title, content, action} = props
    return (
    <div className="dialogBackDrop">
        <div className="dialog">
            <div className="dialogHeader">
                <div className="dialogTitle">{title}</div>
            </div>
            <div className="dialogContent">
                <div className="dialogContentText">{content}</div>
            </div>
            <div className="dialogFooter">
                <div className="okButton" onClick={()=>{action()}}>OK</div>
            </div>
        </div>
    </div>)
}