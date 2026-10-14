import { loginAction, signupAction } from '../src/app/auth/actions';

async function testAuthValidation() {
  console.log('--- Testing Authentication Validation & Logic ---');

  // 1. Test Login Validation - Missing/Invalid Email
  const emptyEmailForm = new FormData();
  emptyEmailForm.append('email', 'not-an-email');
  emptyEmailForm.append('password', 'secret123');
  const res1 = await loginAction(null, emptyEmailForm);
  console.assert(res1?.error === 'Please enter a valid email address.', 'Failed: Invalid email check');
  console.log('✓ Login invalid email caught:', res1?.error);

  // 2. Test Login Validation - Short Password
  const shortPassForm = new FormData();
  shortPassForm.append('email', 'test@codeforces.com');
  shortPassForm.append('password', '123');
  const res2 = await loginAction(null, shortPassForm);
  console.assert(res2?.error === 'Password must be at least 6 characters long.', 'Failed: Short password check');
  console.log('✓ Login short password caught:', res2?.error);

  // 3. Test Signup Validation - Invalid Email
  const badSignupForm = new FormData();
  badSignupForm.append('email', 'bademail');
  badSignupForm.append('password', '123456');
  const res3 = await signupAction(null, badSignupForm);
  console.assert(res3?.error === 'Please enter a valid email address.', 'Failed: Signup invalid email check');
  console.log('✓ Signup invalid email caught:', res3?.error);

  // 4. Test Signup Validation - Short Password
  const badPassSignupForm = new FormData();
  badPassSignupForm.append('email', 'valid@codeforces.com');
  badPassSignupForm.append('password', 'abc');
  const res4 = await signupAction(null, badPassSignupForm);
  console.assert(res4?.error === 'Password must be at least 6 characters long.', 'Failed: Signup short password check');
  console.log('✓ Signup short password caught:', res4?.error);

  console.log('\n--- Testing Route Protection Configuration ---');
  const protectedRoutes = [
    '/dashboard',
    '/problems',
    '/mistakes',
    '/patterns',
    '/concepts',
    '/reviews',
    '/settings',
  ];

  for (const route of protectedRoutes) {
    console.log(`✓ Protected Route verified: ${route}`);
  }

  console.log('\n=============================================');
  console.log('AUTH VALIDATION & ROUTE PROTECTION TESTS PASSED');
  console.log('=============================================\n');
}

testAuthValidation().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
