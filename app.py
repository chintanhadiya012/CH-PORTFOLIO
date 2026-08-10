from flask import Flask, send_from_directory, request, jsonify
import smtplib
from email.mime.text import MIMEText
import os

app = Flask(__name__)

# --- EMAIL CONFIGURATION ---
# IMPORTANT: You must generate a Google "App Password" to use this.
# 1. Go to your Google Account -> Security -> 2-Step Verification
# 2. At the bottom, click "App passwords"
# 3. Create one for "Mail" and paste the 16-character code below:
GMAIL_USER = 'chintanhadiya83@gmail.com'
GMAIL_APP_PASSWORD = 'xgpccwulokaydkdf' # Replace this!

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({'status': 'error', 'message': 'Invalid JSON'}), 400
            
        name = data.get('name', '')
        email = data.get('email', '')
        subject = data.get('subject', '')
        message = data.get('message', '')

        # Create the email content
        msg = MIMEText(f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}")
        msg['Subject'] = f"Portfolio Contact: {subject}"
        msg['From'] = GMAIL_USER
        msg['To'] = GMAIL_USER

        # Connect to Gmail and send
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        server.send_message(msg)
        server.quit()

        return jsonify({'status': 'success'})
    except smtplib.SMTPAuthenticationError:
        return jsonify({'status': 'error', 'message': 'Authentication failed. Check your App Password.'}), 500
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Serve the main index.html on the root route
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

# Serve any other file (like CSS, JS, images, or other HTML pages)
@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, port=5000)
