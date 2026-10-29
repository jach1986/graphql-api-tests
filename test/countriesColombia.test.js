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
    const countriesByLang = {};
    const code_lang = ['es', 'de', 'en'];
    for (const code of code_lang) {
      const result = await sendQuery(`{language(code:"${code}") {countries {capital code name}}}`);
      expect(result.body).to.not.have.property('errors');
      countriesByLang[code] = result.body.data.language.countries.map((country) => country.name);
      expect(countriesByLang[code]).to.be.an('array').that.is.not.empty;
    }

    expect(countriesByLang.es).to.include.members(['Colombia', 'Spain', 'Mexico']);
    expect(countriesByLang.de).to.include.members(['Liechtenstein', 'Germany', 'Belgium', 'Luxembourg']);
    expect(countriesByLang.en).to.include.members(['Uganda', 'Vanuatu', 'Samoa', 'Australia', 'Colombia']);
    console.log(countriesByLang);
  })
});