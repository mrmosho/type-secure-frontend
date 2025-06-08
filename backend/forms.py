from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, SelectField
from wtforms.validators import DataRequired, Email, EqualTo, Length, ValidationError
from models import User

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')

class RegistrationForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8)])
    password2 = PasswordField('Repeat Password', validators=[DataRequired(), EqualTo('password')])
    is_admin = BooleanField('Register as Admin')
    admin_key = StringField('Admin Registration Key')
    submit = SubmitField('Register')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user is not None:
            raise ValidationError('Please use a different email address.')

class FileUploadForm(FlaskForm):
    file = StringField('File', validators=[DataRequired()])
    encrypt = BooleanField('Encrypt File')
    submit = SubmitField('Upload')

class FileShareForm(FlaskForm):
    user_email = StringField('User Email', validators=[DataRequired(), Email()])
    can_edit = BooleanField('Allow Edit')
    submit = SubmitField('Share')

class AdminUserForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    is_admin = BooleanField('Admin Privileges')
    submit = SubmitField('Update User') 