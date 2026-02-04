import React, { useState } from 'react';
import { emailParsingAPI } from '../services/api';
import { Mail, Play } from 'lucide-react';

function EmailParsingConfig() {
  const [config, setConfig] = useState({
    emailImapHost: 'imap.gmail.com',
    emailImapUsername: '',
    emailImapPassword: '',
    emailParsingEnabled: false
  });

  const handleSave = async () => {
    try {
      await emailParsingAPI.updateConfig(config);
      alert('Email configuration saved');
    } catch (error) {
      alert('Error saving configuration');
    }
  };

  const triggerParsing = async () => {
    try {
      await emailParsingAPI.trigger();
      alert('Email parsing started. Check notifications for results.');
    } catch (error) {
      alert('Error triggering email parsing');
    }
  };

  return (
    <div className="card">
      <h2><Mail size={24} /> Email Auto-Import Settings</h2>
      
      <div className="form-group">
        <label>Email (Gmail/Outlook)</label>
        <input
          type="email"
          value={config.emailImapUsername}
          onChange={(e) => setConfig({...config, emailImapUsername: e.target.value})}
          placeholder="your.email@gmail.com"
        />
      </div>

      <div className="form-group">
        <label>App Password</label>
        <input
          type="password"
          value={config.emailImapPassword}
          onChange={(e) => setConfig({...config, emailImapPassword: e.target.value})}
          placeholder="Generate from Gmail settings"
        />
        <small>Create app password at: myaccount.google.com/apppasswords</small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.emailParsingEnabled}
            onChange={(e) => setConfig({...config, emailParsingEnabled: e.target.checked})}
          />
          Enable automatic email parsing
        </label>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleSave} className="btn btn-primary">
          Save Configuration
        </button>
        <button onClick={triggerParsing} className="btn btn-secondary">
          <Play size={20} /> Parse Now
        </button>
      </div>

      <div className="info-box">
        <h4>Supported Services:</h4>
        <ul>
          <li>✅ Netflix subscriptions</li>
          <li>✅ Amazon orders</li>
          <li>✅ Swiggy/Zomato food orders</li>
          <li>✅ Uber/Ola rides</li>
          <li>✅ Credit card transactions</li>
          <li>✅ Bank debit alerts</li>
        </ul>
      </div>
    </div>
  );
}

export default EmailParsingConfig;
