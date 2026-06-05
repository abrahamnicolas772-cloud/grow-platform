import resend
import os
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv('RESEND_API_KEY')

def send_verification_email(email, name, token):
    try:
        link = f"https://grow-platform-pink.vercel.app/verify-email?token={token}"
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": email,
            "subject": "Verify your GROW account",
            "html": f"""
            <h1>Welcome to GROW, {name}!</h1>
            <p>Click the link below to verify your email:</p>
            <a href="{link}">Verify Email</a>
            """
        })
        print(f"✅ Verification email sent to {email}")
        return True
    except Exception as e:
        print(f"❌ Email error: {e}")
        return False

def send_password_reset_email(email, name, token):
    try:
        link = f"https://grow-platform-pink.vercel.app/reset-password?token={token}"
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": email,
            "subject": "Reset your GROW password",
            "html": f"""
            <h1>Reset your password, {name}</h1>
            <p>Click the link below to reset your password:</p>
            <a href="{link}">Reset Password</a>
            """
        })
        print(f"✅ Password reset email sent to {email}")
        return True
    except Exception as e:
        print(f"❌ Email error: {e}")
        return False