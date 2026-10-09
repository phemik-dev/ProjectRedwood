import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const run = JSON.parse(await fs.readFile(new URL('./fixtures/design-004-corpus-g-run.json', import.meta.url), 'utf8'));
const source = await fs.readFile(new URL('../apps/workbench/public/design-004/design.js', import.meta.url), 'utf8');

async function render(lens) {
  let html = ''; const events = {};
  const context = { URLSearchParams, Intl, console, location:{search:`?run=${run.id}`}, window:{scrollTo(){},alert(){}}, document:{body:{classList:{toggle(){}}},getElementById(){return {set innerHTML(value){html=value},get innerHTML(){return html}}},querySelector(){return {focus(){}}},addEventListener(type, handler){events[type]=handler}}, fetch:async()=>({ok:true,status:200,json:async()=>run}) };
  vm.runInNewContext(source, context); await new Promise(resolve=>setImmediate(resolve));
  events.click({target:{closest(){return {dataset:{action:`lens:${lens}`}}}}});
  return html;
}

test('Design 004 keeps Challenge G cash and A/R residuals independent', async () => {
  const workbench = await render('workbench'); const review = await render('review'); const decision = await render('decision');
  assert.match(workbench, /\-\$321\.45/); assert.match(workbench, /\$5,660\.28/);
  assert.match(review, /\$5,660\.28/); assert.match(decision, /\$5,660\.28/);
  assert.doesNotMatch(review, /What explains the \-\$321\.45 difference/);
  assert.doesNotMatch(decision, /The \-\$321\.45 A\/R difference remains visible/);
});
