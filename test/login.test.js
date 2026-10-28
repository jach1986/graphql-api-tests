import { expect } from 'chai';

const API_URL = 'https://dummyjson.com';

describe('Login API (authentication)', () => {

  let token;

  it('logs in with a valid user and returns a token', async () => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'emilys', password: 'emilyspass' }),
    });
    const body = await response.json();

    expect(response.status).to.equal(200);
    expect(body.accessToken).to.be.a('string');
    token = body.accessToken;
  });

  it('returns my user data when I send the token', async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();

    expect(response.status).to.equal(200);
    expect(body.username).to.equal('emilys');
  });

  it('rejects the login when the password is wrong', async () => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'emilys', password: 'wrong-password' }),
    });

    expect(response.status).to.equal(400);
  });

  it('rejects my request when I do not send a token', async () => {
    const response = await fetch(`${API_URL}/auth/me`);

    expect(response.status).to.equal(401);
  });

});