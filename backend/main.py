from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_file
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import os
import pandas as pd
from cryptography.fernet import Fernet
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from config import Config
from models import User, File, FileShare, AccessLog
from forms import LoginForm, RegistrationForm, FileUploadForm, FileShareForm, AdminUserForm
from extensions import db, login_manager
from flask_login import login_user, logout_user, login_required, current_user
import re
from flask_wtf import FlaskForm
from wtforms import SubmitField
from wtforms.validators import DataRequired

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
login_manager.init_app(app)
login_manager.login_view = 'login'

# Create upload folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

# Encryption setup
def get_encryption_key():
    password = app.config['ENCRYPTION_KEY'].encode()
    salt = b'secure_vision_salt'
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(password))
    return Fernet(key)

# Sensitive data patterns
SENSITIVE_PATTERNS = {
    'email': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
    'phone': r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
    'credit_card': r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b',
    'ssn': r'\b\d{3}[-]?\d{2}[-]?\d{4}\b'
}

def is_sensitive(text):
    text = str(text).lower()
    for pattern in SENSITIVE_PATTERNS.values():
        if re.search(pattern, text):
            return True
    return False

def detect_entities(text):
    entities = []
    for entity_type, pattern in SENSITIVE_PATTERNS.items():
        matches = re.finditer(pattern, text)
        for match in matches:
            entities.append({
                'type': entity_type,
                'value': match.group(),
                'start': match.start(),
                'end': match.end()
            })
    return entities

def encrypt_file(file_path):
    fernet = get_encryption_key()
    with open(file_path, 'rb') as file:
        data = file.read()
    encrypted_data = fernet.encrypt(data)
    encrypted_path = file_path + '.encrypted'
    with open(encrypted_path, 'wb') as file:
        file.write(encrypted_data)
    return encrypted_path

def decrypt_file(file_path):
    fernet = get_encryption_key()
    with open(file_path, 'rb') as file:
        encrypted_data = file.read()
    decrypted_data = fernet.decrypt(encrypted_data)
    decrypted_path = file_path.replace('.encrypted', '')
    with open(decrypted_path, 'wb') as file:
        file.write(decrypted_data)
    return decrypted_path

def log_access(user_id, file_id, action, request):
    log = AccessLog(
        user_id=user_id,
        file_id=file_id,
        action=action,
        ip_address=request.remote_addr,
        user_agent=request.user_agent.string
    )
    db.session.add(log)
    db.session.commit()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid email or password', 'danger')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        return redirect(url_for('dashboard'))
    return render_template('auth/login.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = RegistrationForm()
    if form.validate_on_submit():
        is_admin = form.is_admin.data
        if is_admin:
            if form.admin_key.data != 'Shiko989009':
                flash('Invalid admin registration key.', 'danger')
                return render_template('auth/register.html', form=form)
        user = User(email=form.email.data, is_admin=is_admin)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Registration successful!', 'success')
        return redirect(url_for('login'))
    return render_template('auth/register.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    if current_user.is_admin:
        return redirect(url_for('admin'))
    
    files = File.query.filter_by(user_id=current_user.id).all()
    return render_template('dashboard.html', files=files, is_subscribed=current_user.is_subscribed)

@app.route('/upload', methods=['GET', 'POST'])
@login_required
def upload():
    form = FileUploadForm()
    if form.validate_on_submit():
        if 'file' not in request.files:
            flash('No file selected', 'danger')
            return redirect(request.url)
        
        file = request.files['file']
        if file.filename == '':
            flash('No file selected', 'danger')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Check for sensitive data
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    has_sensitive = is_sensitive(content)
                    entities = detect_entities(content)
            except UnicodeDecodeError:
                # If file is binary, we'll just check the filename
                has_sensitive = False
                entities = []
            
            # Create file record
            new_file = File(
                filename=filename,
                original_filename=filename,
                file_path=file_path,
                has_sensitive_data=has_sensitive,
                sensitive_data_types=','.join(set(e['type'] for e in entities)),
                user_id=current_user.id
            )
            db.session.add(new_file)
            
            # Encrypt if requested
            if form.encrypt.data:
                encrypted_path = encrypt_file(file_path)
                new_file.is_encrypted = True
                new_file.file_path = encrypted_path
                os.remove(file_path)  # Remove original file
            
            db.session.commit()
            log_access(current_user.id, new_file.id, 'upload', request)
            flash('File uploaded successfully!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid file type', 'danger')
            return redirect(request.url)
    return render_template('upload.html', form=form)

@app.route('/view_file/<int:file_id>')
@login_required
def view_file(file_id):
    file = File.query.get_or_404(file_id)
    
    # Admins have full access to all files
    if not current_user.is_admin and file.user_id != current_user.id:
        flash('Access denied', 'danger')
        return redirect(url_for('dashboard'))
    
    # Read file content
    try:
        with open(file.file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # If user is subscribed and file has sensitive data, mask only sensitive parts
        if current_user.is_subscribed and file.has_sensitive_data:
            # Get sensitive data types
            sensitive_types = file.sensitive_data_types.split(',') if file.sensitive_data_types else []
            
            # Track sensitive data locations for highlighting
            sensitive_locations = []
            
            # Mask sensitive data based on type
            for data_type in sensitive_types:
                if data_type == 'email':
                    # Find and mask email addresses
                    content = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', lambda m: mask_email(m.group()), content)
                    # Track locations for highlighting
                    for match in re.finditer(r'[\w\.-]+@[\w\.-]+\.\w+', content):
                        sensitive_locations.append((match.start(), match.end(), 'email'))
                elif data_type == 'phone':
                    # Find and mask phone numbers
                    content = re.sub(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', lambda m: mask_phone(m.group()), content)
                    for match in re.finditer(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', content):
                        sensitive_locations.append((match.start(), match.end(), 'phone'))
                elif data_type == 'credit_card':
                    # Find and mask credit card numbers
                    content = re.sub(r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b', lambda m: mask_credit_card(m.group()), content)
                    for match in re.finditer(r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b', content):
                        sensitive_locations.append((match.start(), match.end(), 'credit_card'))
                elif data_type == 'ssn':
                    # Find and mask social security numbers
                    content = re.sub(r'\b\d{3}[-]?\d{2}[-]?\d{4}\b', lambda m: mask_ssn(m.group()), content)
                    for match in re.finditer(r'\b\d{3}[-]?\d{2}[-]?\d{4}\b', content):
                        sensitive_locations.append((match.start(), match.end(), 'ssn'))
            
            # Log the view for subscribed users
            log_access(current_user.id, file.id, 'view', request)
            
            return render_template('view_file.html', 
                                file=file, 
                                content=content, 
                                is_subscribed=True,
                                sensitive_locations=sensitive_locations)
        else:
            return render_template('view_file.html', 
                                file=file, 
                                content=content, 
                                is_subscribed=False)
    except (UnicodeDecodeError, FileNotFoundError):
        content = "[Binary file content]"
        return render_template('view_file.html', 
                            file=file, 
                            content=content, 
                            is_subscribed=current_user.is_subscribed)

def mask_email(email):
    """Mask email address: j***@example.com"""
    username, domain = email.split('@')
    return f"{username[0]}***@{domain}"

def mask_phone(phone):
    """Mask phone number: (123)***-4567"""
    # Remove any non-digit characters
    digits = re.sub(r'\D', '', phone)
    if len(digits) == 10:
        return f"({digits[:3]})***-{digits[-4:]}"
    return phone

def mask_credit_card(cc):
    """Mask credit card: 1234****5678"""
    # Remove any non-digit characters
    digits = re.sub(r'\D', '', cc)
    if len(digits) == 16:
        return f"{digits[:4]}****{digits[-4:]}"
    return cc

def mask_ssn(ssn):
    """Mask SSN: 123-**-4567"""
    # Remove any non-digit characters
    digits = re.sub(r'\D', '', ssn)
    if len(digits) == 9:
        return f"{digits[:3]}-**-{digits[-4:]}"
    return ssn

@app.route('/download_file/<int:file_id>')
@login_required
def download_file(file_id):
    file = File.query.get_or_404(file_id)
    
    # Admins have full access to all files
    if not current_user.is_admin and file.user_id != current_user.id:
        flash('Access denied', 'danger')
        return redirect(url_for('dashboard'))
    
    # If user is subscribed and file has sensitive data, ensure it's encrypted
    if current_user.is_subscribed and file.has_sensitive_data and not file.is_encrypted:
        encrypted_path = encrypt_file(file.file_path)
        file.is_encrypted = True
        file.file_path = encrypted_path
        db.session.commit()
    
    return send_file(file.file_path, as_attachment=True, download_name=file.original_filename)

@app.route('/share/<int:file_id>', methods=['GET', 'POST'])
@login_required
def share_file(file_id):
    file = File.query.get_or_404(file_id)
    if file.user_id != current_user.id:
        flash('Access denied', 'danger')
        return redirect(url_for('dashboard'))
    
    form = FileShareForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.user_email.data).first()
        if not user:
            flash('User not found', 'danger')
            return redirect(url_for('share_file', file_id=file_id))
        
        share = FileShare(
            file_id=file_id,
            shared_with_id=user.id,
            can_edit=form.can_edit.data
        )
        db.session.add(share)
        db.session.commit()
        flash('File shared successfully!', 'success')
        return redirect(url_for('view_file', file_id=file_id))
    
    return render_template('share.html', form=form, file=file)

@app.route('/admin')
@login_required
def admin():
    if not current_user.is_admin:
        flash('Access denied', 'danger')
        return redirect(url_for('dashboard'))
    
    users = User.query.all()
    files = File.query.all()
    logs = AccessLog.query.order_by(AccessLog.timestamp.desc()).limit(100).all()
    return render_template('admin/dashboard.html', users=users, files=files, logs=logs)

class SubscriptionForm(FlaskForm):
    submit = SubmitField('Subscribe Now')

@app.route('/subscription', methods=['GET', 'POST'])
@login_required
def subscription():
    form = SubscriptionForm()
    if form.validate_on_submit():
        # In a real application, you would integrate with a payment processor here
        # For now, we'll simulate a successful payment
        current_user.is_subscribed = True
        current_user.subscription_count += 30
        current_user.subscription_expires_at = datetime.utcnow() + timedelta(days=30)  # 30 days subscription
        db.session.commit()
        flash('Subscription successful! You now have 30 days of access with 30 files available.', 'success')
        return redirect(url_for('dashboard'))
    return render_template('subscription.html', form=form)

@app.route('/return_file/<int:file_id>')
@login_required
def return_file(file_id):
    file = File.query.get_or_404(file_id)
    if not current_user.is_admin:
        flash('Access denied', 'danger')
        return redirect(url_for('dashboard'))
    
    file_path = file.file_path
    if not os.path.exists(file_path):
        flash('File not found.', 'danger')
        return redirect(url_for('admin'))
    
    # Encrypt sensitive data if needed
    if file.has_sensitive_data and not file.is_encrypted:
        encrypted_path = encrypt_file(file_path)
        file.is_encrypted = True
        file.file_path = encrypted_path
        db.session.commit()
        flash('File returned with sensitive data encrypted.', 'success')
        return send_file(encrypted_path, as_attachment=True, download_name=file.original_filename + '.encrypted')
    else:
        flash('File returned.', 'success')
        return send_file(file_path, as_attachment=True, download_name=file.original_filename)

@app.route('/return_file_auto/<int:file_id>')
@login_required
def return_file_auto(file_id):
    file = File.query.get_or_404(file_id)
    if current_user.is_admin:
        flash('Admins cannot use this feature.', 'danger')
        return redirect(url_for('admin'))
    
    # Check subscription
    if not hasattr(current_user, 'subscription_count') or current_user.subscription_count <= 0:
        flash('Please subscribe to use this feature.', 'warning')
        return redirect(url_for('subscription'))
    
    file_path = file.file_path
    if not os.path.exists(file_path):
        flash('File not found.', 'danger')
        return redirect(url_for('dashboard'))
    
    # Encrypt sensitive data if needed
    if file.has_sensitive_data and not file.is_encrypted:
        encrypted_path = encrypt_file(file_path)
        file.is_encrypted = True
        file.file_path = encrypted_path
        db.session.commit()
        current_user.subscription_count -= 1
        db.session.commit()
        flash('File returned with sensitive data encrypted.', 'success')
        return send_file(encrypted_path, as_attachment=True, download_name=file.original_filename + '.encrypted')
    else:
        flash('File returned.', 'success')
        return send_file(file_path, as_attachment=True, download_name=file.original_filename)

@app.route('/file_history/<int:file_id>')
@login_required
def file_history(file_id):
    if not current_user.is_subscribed:
        flash('This feature is only available for subscribed users', 'warning')
        return redirect(url_for('dashboard'))
    
    file = File.query.get_or_404(file_id)
    if file.user_id != current_user.id and not current_user.is_admin:
        flash('Access denied', 'danger')
        return redirect(url_for('dashboard'))
    
    # Get access history for this file
    history = AccessLog.query.filter_by(file_id=file_id).order_by(AccessLog.timestamp.desc()).all()
    
    return render_template('file_history.html', file=file, history=history)

@app.route('/file_preview/<int:file_id>')
@login_required
def file_preview(file_id):
    if not current_user.is_subscribed:
        flash('This feature is only available for subscribed users', 'warning')
        return redirect(url_for('dashboard'))
    
    file = File.query.get_or_404(file_id)
    if file.user_id != current_user.id and not current_user.is_admin:
        flash('Access denied', 'danger')
        return redirect(url_for('dashboard'))
    
    try:
        with open(file.file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Get first 500 characters for preview
        preview = content[:500] + '...' if len(content) > 500 else content
        
        return jsonify({
            'preview': preview,
            'total_length': len(content),
            'has_sensitive_data': file.has_sensitive_data,
            'sensitive_types': file.sensitive_data_types.split(',') if file.sensitive_data_types else []
        })
    except:
        return jsonify({'error': 'Could not read file'}), 400

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True) 