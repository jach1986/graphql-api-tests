import { expect } from 'chai';

const API_URL = 'https://countries.trevorblades.com/';

async function sendQuery(query) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const body = await response.json();
  return { status: response.status, body };
}

describe('Countries GraphQL API', () => {

  it('returns Peru when I ask for code PE', async () => {
    const result = await sendQuery('{ country(code: "PE") { name capital currency } }');

    expect(result.status).to.equal(200);
    expect(result.body.data.country.name).to.equal('Peru');
    expect(result.body.data.country.capital).to.equal('Lima');
    expect(result.body.data.country.currency).to.include('PEN');
  });

  it('returns null when the country code does not exist', async () => {
    const result = await sendQuery('{ country(code: "XX") { name } }');

    expect(result.status).to.equal(200);
    expect(result.body.data.country).to.equal(null);
  });

  it('returns an error when I ask for a field that does not exist', async () => {
    const result = await sendQuery('{ country(code: "CO") { president } }');

    expect(result.body).to.have.property('errors');
    expect(result.body.errors[0].message).to.include('president');
  });

});