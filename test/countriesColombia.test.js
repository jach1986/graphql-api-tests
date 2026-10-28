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

  it('returns Colombia when I ask for code CO', async () => {
    const result = await sendQuery('{ country(code: "CO") { name capital currency } }');

    expect(result.status).to.equal(200);
    expect(result.body.data.country.name).to.equal('Colombia');
    expect(result.body.data.country.capital).to.equal('Bogotá');
    expect(result.body.data.country.currency).to.include('COP');
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

  it('has the fields I expect in the Country type (schema)', async () => {
    const result = await sendQuery('{ __type(name: "Country") { fields { name } } }');
    const fieldNames = result.body.data.__type.fields.map((field) => field.name);

    expect(fieldNames).to.include.members(['code', 'name', 'capital', 'currency']);
    console.log(fieldNames);
  });

  it('shows which countries talks in Spanish', async () => {
    const result = await sendQuery('{language(code: "") {countries {capital code name}}}');
    expect(result.body).to.not.have.property('errors');
    const countries = result.body.data.language.countries;
    const names = countries.map((melapela) => melapela.name);
    ///expect(names).to.include.members(['Colombia', 'Spain', 'Mexico']);
    console.log(names);
  })
});