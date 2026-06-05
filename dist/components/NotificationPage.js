"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationPage = void 0;
const react_1 = __importStar(require("react"));
const logger_1 = require("../logging_middleware/logger");
require("./NotificationPage.css");
const NotificationPage = () => {
    const [notifications, setNotifications] = (0, react_1.useState)([]);
    const [formData, setFormData] = (0, react_1.useState)({
        title: '',
        message: '',
        type: 'info',
    });
    const [loading, setLoading] = (0, react_1.useState)(false);
    // Log page initialization
    (0, react_1.useEffect)(() => {
        (0, logger_1.Log)('frontend', 'info', 'notification-page', 'Notification page initialized');
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        (0, logger_1.Log)('frontend', 'debug', 'notification-form', `Input changed: ${name} = ${value}`);
    };
    const handleAddNotification = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.message.trim()) {
            await (0, logger_1.Log)('frontend', 'warn', 'notification-form', 'Form submission attempted with empty fields');
            alert('Please fill in all fields');
            return;
        }
        setLoading(true);
        await (0, logger_1.Log)('frontend', 'info', 'notification-form', `Submitting notification: ${formData.title}`);
        const newNotification = {
            id: Date.now().toString(),
            title: formData.title,
            message: formData.message,
            type: formData.type,
            timestamp: new Date().toLocaleString(),
        };
        setNotifications(prev => [newNotification, ...prev]);
        await (0, logger_1.Log)('frontend', 'info', 'notification-service', `Notification created: ${formData.title} - ${formData.message}`);
        setFormData({ title: '', message: '', type: 'info' });
        setLoading(false);
    };
    const handleDeleteNotification = async (id) => {
        const notification = notifications.find(n => n.id === id);
        setNotifications(prev => prev.filter(n => n.id !== id));
        await (0, logger_1.Log)('frontend', 'info', 'notification-service', `Notification deleted: ${notification?.title}`);
    };
    const handleClearAll = async () => {
        await (0, logger_1.Log)('frontend', 'info', 'notification-service', 'All notifications cleared');
        setNotifications([]);
    };
    return (<div className="notification-container">
      <header className="notification-header">
        <h1>📬 Notification System</h1>
        <p>Create and manage notifications with integrated logging</p>
      </header>

      <main className="notification-main">
        {/* Form Section */}
        <section className="form-section">
          <h2>Create New Notification</h2>
          <form onSubmit={handleAddNotification} className="notification-form">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter notification title" disabled={loading}/>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Enter notification message" rows={4} disabled={loading}/>
            </div>

            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select id="type" name="type" value={formData.type} onChange={handleInputChange} disabled={loading}>
                <option value="info">ℹ️ Info</option>
                <option value="success">✅ Success</option>
                <option value="warning">⚠️ Warning</option>
                <option value="error">❌ Error</option>
              </select>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : '📤 Send Notification'}
            </button>
          </form>
        </section>

        {/* Notifications List Section */}
        <section className="list-section">
          <div className="list-header">
            <h2>Notifications ({notifications.length})</h2>
            {notifications.length > 0 && (<button onClick={handleClearAll} className="clear-btn">
                Clear All
              </button>)}
          </div>

          {notifications.length === 0 ? (<div className="empty-state">
              <p>No notifications yet. Create one to get started!</p>
            </div>) : (<div className="notifications-list">
              {notifications.map(notification => (<div key={notification.id} className={`notification-item notification-${notification.type}`}>
                  <div className="notification-content">
                    <h3>{notification.title}</h3>
                    <p>{notification.message}</p>
                    <small className="notification-timestamp">
                      {notification.timestamp}
                    </small>
                  </div>
                  <button onClick={() => handleDeleteNotification(notification.id)} className="delete-btn" title="Delete notification">
                    ✕
                  </button>
                </div>))}
            </div>)}
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <h3>Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{notifications.length}</span>
              <span className="stat-label">Total Notifications</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">
                {notifications.filter(n => n.type === 'info').length}
              </span>
              <span className="stat-label">Info</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">
                {notifications.filter(n => n.type === 'success').length}
              </span>
              <span className="stat-label">Success</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">
                {notifications.filter(n => n.type === 'warning').length}
              </span>
              <span className="stat-label">Warning</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">
                {notifications.filter(n => n.type === 'error').length}
              </span>
              <span className="stat-label">Error</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="notification-footer">
        <p>All notifications are logged for monitoring and debugging purposes</p>
      </footer>
    </div>);
};
exports.NotificationPage = NotificationPage;
//# sourceMappingURL=NotificationPage.js.map