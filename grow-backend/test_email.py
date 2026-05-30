from emails import send_verification_email

# Test avec ton adresse personnelle (celle que tu utilises pour te connecter à Resend)
result = send_verification_email("abrahamnicolas772@gmail.com", "Nicolas", "test-token-123")
print("Résultat:", result)
