# Quick Fix for Login Issue

## The Problem
You're getting "Email ou mot de passe incorrect" which means either:
1. The user doesn't exist in the database
2. The password is incorrect

## Solution 1: Create User via Sign Up Page (EASIEST)

1. Go to: `http://localhost:3000/signup`
2. Fill in the form:
   - Username: `amine`
   - Email: `amine@sesame.tn`
   - Password: `your_password` (remember this!)
   - Confirm Password: `your_password`
3. Click "S'inscrire"
4. Go back to login page and use the same email and password

## Solution 2: Check Spring Boot Console

After restarting Spring Boot, when you try to login, you should see in the console:

```
=== LOGIN ATTEMPT ===
Email: amine@sesame.tn
✅ User found - ID: X, Email: amine@sesame.tn
Password hash exists: true
Password matches: false/true
```

**If you see "❌ User not found"**: The user doesn't exist - use Solution 1 to create it.

**If you see "Password matches: false"**: The password is wrong - either:
- Use the correct password
- Or reset the password by creating a new user

## Solution 3: Check Database Directly

Run this in MySQL Workbench:

```sql
USE serviceelectro;

-- Check if user exists
SELECT id, username, email, role, 
       CASE 
           WHEN password IS NULL THEN 'NO PASSWORD'
           WHEN LENGTH(password) < 20 THEN 'INVALID PASSWORD'
           ELSE 'PASSWORD OK'
       END as password_status
FROM utilisateur 
WHERE email = 'amine@sesame.tn';
```

If no rows returned → User doesn't exist (use Solution 1)
If password_status = 'NO PASSWORD' → Password not set (use Solution 1 to recreate)

## Solution 4: Create User via Browser Console

Open browser console (F12) and run:

```javascript
fetch('http://localhost:9090/api/utilis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'amine',
    email: 'amine@sesame.tn',
    password: 'your_password_here',
    role: 'USER'
  })
})
.then(r => r.json())
.then(data => {
  console.log('User created:', data);
  alert('User created! Now try logging in.');
})
.catch(err => {
  console.error('Error:', err);
  alert('Error creating user. Check console.');
});
```

Replace `'your_password_here'` with your desired password.

## Most Likely Issue

**The user `amine@sesame.tn` doesn't exist in the database yet.**

**Easiest fix**: Use the Sign Up page at `http://localhost:3000/signup` to create the account, then login.

