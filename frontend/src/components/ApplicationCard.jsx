import { Pencil, Trash2 } from "lucide-react";
import "./ApplicationCard.css";

export const ApplicationCard = ({
  application,
  onStatusChange,
  onDelete,
  onEdit,
  isMobile,
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Applied: "#3498db",
      Shortlisted: "#9b59b6",
      Interview: "#f39c12",
      Offer: "#2ecc71",
      Rejected: "#e74c3c",
    };
    return colors[status] || "#95a5a6";
  };

  const handleDelete = () => {
    if (window.confirm(`Delete application for ${application.companyName}?`)) {
      onDelete(application._id);
    }
  };

  if (isMobile) {
    return (
      <div className="application-card">
        <div className="card-header">
          <h3>{application.companyName}</h3>
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(application.status) }}
          >
            {application.status}
          </span>
        </div>

        <div className="card-body">
          <div className="card-field">
            <label>Role</label>
            <p>{application.jobRole}</p>
          </div>
          <div className="card-field">
            <label>Applied</label>
            <p>{formatDate(application.appliedDate)}</p>
          </div>
          {application.portalUsed && (
            <div className="card-field">
              <label>Portal</label>
              <p>{application.portalUsed}</p>
            </div>
          )}
          {application.resumeId && (
            <div className="card-field">
              <label>Resume</label>
              <p>{application.resumeId.label}</p>
            </div>
          )}
          {application.notes && (
            <div className="card-field">
              <label>Notes</label>
              <p className="notes-preview">{application.notes}</p>
            </div>
          )}
        </div>

        <div className="card-footer">
          <select
            value={application.status}
            onChange={(e) => onStatusChange(application._id, e.target.value)}
            className="status-select"
          >
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button onClick={() => onEdit(application)} className="btn-edit">
            <Pencil size={13} /> Edit
          </button>
          <button onClick={handleDelete} className="btn-delete">
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <tr className="application-row">
      <td className="company-cell">{application.companyName}</td>
      <td className="role-cell">{application.jobRole}</td>
      <td className="date-cell">{formatDate(application.appliedDate)}</td>
      <td className="portal-cell">{application.portalUsed || "—"}</td>
      <td className="resume-cell">{application.resumeId?.label || "—"}</td>
      <td className="status-cell">
        <select
          value={application.status}
          onChange={(e) => onStatusChange(application._id, e.target.value)}
          className="status-select-inline"
          style={{
            borderBottomColor: getStatusColor(application.status),
            color: getStatusColor(application.status),
          }}
        >
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </td>
      <td className="notes-cell">
        {application.notes ? (
          <span title={application.notes}>
            {application.notes.substring(0, 20)}...
          </span>
        ) : (
          "—"
        )}
      </td>
      <td className="actions-cell">
        <button onClick={() => onEdit(application)} className="btn-icon" title="Edit">
          <Pencil size={14} />
        </button>
        <button onClick={handleDelete} className="btn-icon" title="Delete">
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
};
